import { StyleSheet, Text, View, Button, TouchableOpacity, TextInput, Image, ScrollView } from 'react-native';
import { Audio } from "expo-av";
import React, { useState, useRef } from 'react';


import recordOn from "../assets/recorder.png";
import recordOff from "../assets/recorderOff.png";

import stopAud from "../assets/stop.png";
import playAud from "../assets/play.png";


import recordFiles from "../assets/folder.png";
import audioPlay from "../assets/recording2.png";
import signOut from "../assets/door.png";

import { storage, db, auth } from './fbConfig';
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';


const recordingSettings = {
    android: {
        extension: ".m4a",
        outputFormat: Audio.AndroidOutputFormat.MPEG_4,
        audioEncoder: Audio.AndroidAudioEncoder.AAC,
        sampleRate: 44100,
        numberOfChannels: 2,
        bitRate: 128000,
    },
    ios: {
        extension: ".m4a",
        outputFormat: Audio.IOSOutputFormat.MPEG4AAC,
        audioQuality: Audio.IOSAudioQuality.HIGH,
        sampleRate: 44100,
        numberOfChannels: 2,
        bitRate: 128000,
        linearPCMBitDepth: 16,
        linearPCMIsBigEndian: false,
        linearPCMIsFloat: false,
    },
}

export default function HomeScreen({ navigation, route }) {
    const email = route.params.userMail;

    // useEffect(() => {
    //     console.log(email);
    // }, [])
    const [recording, setRecording] = useState();
    const [recordings, setRecordings] = useState([]);
    const [message, setMessage] = useState("");
    const [recordingTitle, setRecordingTitle] = useState("");
    const [count, setCount] = useState(0);
    const [isCounting, setIsCounting] = useState(false);
    const [countMin, setCountMin] = useState(0);
    const intervalRef = useRef(null);
    const [light, setLight] = useState("#808080");
    const [lighter, setLighter] = useState("#B6B6B4");
    const [lightCont, setLightCont] = useState("#DCDCDC");
    // backgroundColor: "#DCDCDC",
    // backgroundColor: "#B6B6B4", lighter
    // const [bgColor, setbgColor] = useState("whitesmoke");
    const [isLoading, setIsLoading] = useState(false);
    const [recordStatus, setRecordStatus] = useState(recordOff);

    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const monthsOfYear = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const today = new Date();
    const dayOfWeek = daysOfWeek[today.getDay()];
    const dayOfMonth = today.getDate();
    const monthOfYear = monthsOfYear[today.getMonth()];
    const formattedDate = `${dayOfWeek}, ${dayOfMonth} ${monthOfYear}`;

    async function startRecording() {
        const permission = await Audio.requestPermissionsAsync();
        // console.log(permission);
        try {
            if (permission.status === "granted") {
                await Audio.setAudioModeAsync({
                    allowRecordingIOS: true,
                    playInSilentModeIOS: true
                });

                setLight("#2d4a60");
                setLighter("#7fcac9");
                setLightCont("#cfdfe8");


                const recording = new Audio.Recording();
                await recording.prepareToRecordAsync(recordingSettings)
                await recording.startAsync();
                setRecording(recording);

                let minCount = 0;
                setIsCounting(true);
                intervalRef.current = setInterval(() => {
                    setCount((prevCount) => prevCount + 1);
                    minCount = (prevCount) => prevCount + 1;
                    if (minCount >= 60) {
                        setCountMin((prevCountMin) => prevCountMin + 1);
                    }

                }, 1000);

                setRecordStatus(recordOn);
            } else {
                setMessage("Please grant permission to app to access microphone.")
            }
        } catch (error) {
            console.error("Failed to start recording", error);
        }
    }

    async function stopRecording() {
        setLight("#808080");
        setLighter("#B6B6B4");
        setLightCont("#DCDCDC");
        setRecording(undefined);
        await recording.stopAndUnloadAsync();

        let updatedRecordings = [...recordings];
        const { sound, status } = await recording.createNewLoadedSoundAsync();
        updatedRecordings.push({
            sound: sound,
            duration: getDurationFormatted(status.durationMillis),
            file: recording.getURI(),
            title: recordingTitle,
        });
        setRecordings(updatedRecordings);

        setIsCounting(false);
        clearInterval(intervalRef.current);
        setCount(0)
        setRecordStatus(recordOff);
    }

    function getDurationFormatted(millis) {
        const minutes = millis / 1000 / 60;
        const minutesDisplay = Math.floor(minutes);
        const seconds = Math.round((minutes - minutesDisplay) * 60);
        const secondsDisplay = seconds < 10 ? `0${seconds}` : seconds;
        const minutesDisplay2 = minutesDisplay < 10 ? `0${minutesDisplay}` : minutesDisplay
        return `${minutesDisplay2}:${secondsDisplay}`
    }


    async function storeJournal() {

        try {
            setIsLoading(true);
            const recordUri = recordings[0].file;

            //Store
            const blob = await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.onload = () => {
                    try {
                        resolve(xhr.response);
                    } catch (error) {
                        console.log("Line 205 error:", error);
                    }
                };
                xhr.onerror = (e) => {
                    console.log(e);
                    reject(new TypeError("Network request failed"));
                };
                xhr.responseType = "blob";
                xhr.open("GET", recordUri, true);
                xhr.send(null);
            });
            if (blob != null) {
                const uriParts = recordUri.split(".");
                const fileType = uriParts[uriParts.length - 1];

                const audioTitle = recordingTitle;
                const journal = `${recordings[0].title}${new Date().getTime()}.${fileType}`;
                const path = `audio/${journal}`;

                const storageRef = ref(storage, path);
                uploadBytes(storageRef, blob).then(() => {
                    // Get download URL
                    getDownloadURL(storageRef)
                        .then(async (url) => {
                            // Save data to Firestore           
                            await addDoc(collection(db, "journals"), {
                                title: audioTitle,
                                audioName: journal,
                                audioUrl: url,
                                date: formattedDate,
                                email: email
                            });
                        })
                        .catch((error) => {
                            console.error(error);
                        }).then(async () => {
                            setRecordings([]);
                            setIsLoading(false);
                            navigation.navigate("Journals")
                        })
                });
            } else {
                console.log("erroor with blob");
            }
            //End

        } catch (error) {
            console.log("line 287", error)
        }
        setRecordings([])
        console.log(isCounting);
    }

    //Sign out
    function signOutF() {
        auth.signOut().then(() => {
            navigation.navigate("SignOut");
        }).catch((error) => {
            console.log(error.message);
        });

    }

    function getRecordingLines() {
        return recordings.map((recordingLine, index) => {
            return (
                <View key={index} style={styles.recordingL}>
                    <View style={styles.row}>
                        <Text style={styles.fill}>{recordingLine.title}</Text>
                        <Text style={styles.fillD}>{recordingLine.duration}</Text>
                        <TouchableOpacity style={styles.btn1} onPress={() => recordingLine.sound.replayAsync()}>
                            <Image source={playAud} style={styles.playAud} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btn2} onPress={() => recordingLine.sound.stopAsync()}>
                            <Image source={stopAud} style={styles.stopAud} />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity onPress={storeJournal} style={styles.saveBTN}>
                        <Text style={styles.saveBTNTxt}>Save</Text>
                    </TouchableOpacity>
                </View>
            );
        })
    }

    return (
        <View style={styles.container}>
            {
                isLoading ?
                    <View style={styles.loader}>
                        <ScrollView scrollEnabled={true} >
                            <Text>Loading...</Text>
                        </ScrollView>
                    </View>
                    : null
            }


            <ScrollView scrollEnabled={true} >

                <View style={styles.titleInput}>
                    <TextInput style={styles.formInput}
                        onChangeText={text => setRecordingTitle(text)}
                        value={recordingTitle} placeholder="Enter Journal Title:" />
                </View>

                <Text>{message}</Text>


                <View style={[styles.recordCont, { backgroundColor: lightCont }]}>
                    <View style={[styles.recordContLighter, { backgroundColor: lighter }]}>
                        <View style={[styles.recordContLight, { backgroundColor: light }]}>
                            <TouchableOpacity onPress={recording ? stopRecording : startRecording}>
                                <Image source={recordStatus} style={styles.recorder} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <View style={styles.counterCont}>
                    <Text style={styles.counter}>{countMin < 10 ? `0${countMin}` : countMin}:{count < 10 ? `0${count}` : count}</Text>
                </View>



                {getRecordingLines()}


            </ScrollView>
            <View style={styles.btmNavBar}>
                <View style={styles.fileCont}>
                    <TouchableOpacity onPress={() => navigation.navigate("Journals")}>
                        <Image source={recordFiles} style={styles.navSImg} />
                    </TouchableOpacity>
                </View>
                <View style={styles.addCont}>
                    <View style={styles.secondCont}>
                        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
                            <Image source={audioPlay} style={styles.navLImg} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.soCont}>
                    <TouchableOpacity onPress={signOutF}>
                        <Image source={signOut} style={styles.navSImg} />
                    </TouchableOpacity>
                </View>
            </View>

        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        backgroundColor: "whitesmoke",
        paddingTop: 30,
        alignItems: "center",
    },
    titleInput: {
        width: 350,
        flex: 1,
        justifyContent: "center",
        marginTop: 50
    },
    formInput: {
        padding: 10,
        borderBottomColor: "black",
        width: "100%",
        textAlign: "center",
        fontSize: 20,
        backgroundColor: "#FAFAFA"
    },
    counterCont: {
        marginTop: 30,
        width: "100%",
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    counter: {
        fontSize: 50,
        fontWeight: "bold",
        color: "#636363"
    },

    recordCont: {
        marginTop: 50,
        width: "100%",
        height: 350,
        // backgroundColor: "#DCDCDC",
        borderRadius: 350
    },

    recordContLighter: {
        // backgroundColor: "#B6B6B4",
        height: "92%",
        width: "92%",
        marginVertical: "4%",
        marginHorizontal: "4%",
        borderRadius: 350
    },
    recordContLight: {
        // backgroundColor: "#808080",
        height: "92%",
        width: "92%",
        marginVertical: "4%",
        marginHorizontal: "4%",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 350
    },

    recorder: {
        width: 200,
        height: 200,
        objectFit: "cover",
        // marginVertical: 30
    },
    recordingL: {
        marginBottom: 50
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 20
    },
    fill: {
        flex: 1,
        margin: 5,
        fontSize: 16,
        textAlign: "center"
    },
    fillD: {
        flex: 1,
        margin: 5,
        fontSize: 16,
        textAlign: "left",
        paddingLeft: 30
    },
    btn1: {
        margin: 5
    },
    btn2: {
        margin: 5
    },
    stopAud: {
        width: 40,
        height: 40
    },
    playAud: {
        width: 33,
        height: 33
    },
    saveBTN: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 15,
        backgroundColor: "#B6B6B4",
        borderRadius: 100,
        marginVertical: 10
    },
    saveBTNTxt: {
        fontSize: 18,
        color: "white",
        fontWeight: "bold"
    },


    displayJournals: {
        marginTop: 100,
        backgroundColor: "white"
    },
    card: {
        margin: "3%",
        width: "94%",
        flexDirection: "row",
        backgroundColor: "whitesmoke"
    },
    cardBtn: {
        margin: 5
    },
    cardTitle: {
        position: "absolute",
        left: 80,
        top: 15,
        fontSize: 18
    },
    cardOpt: {
        position: "absolute",
        right: 10,
        flexDirection: "row"
    },
    audMenuOpt: {
        width: 30,
        height: 30,
        marginTop: 15
    },
    audOpt: {
        width: 35,
        height: 35,
        marginTop: 15,
        marginRight: 5
    },

    player: {
        height: 50,
        width: 50
    },




    btmNavBar: {
        width: "100%",
        height: 60,
        backgroundColor: "white",
        position: "fixed",
        bottom: 0,
        left: 0,
        zIndex: 10,
        flexDirection: "row"
    },
    fileCont: {
        width: "30%",
        alignItems: "center",
        justifyContent: "center"
    },
    navSImg: {
        width: 30,
        height: 30
    },
    addCont: {
        width: "40%",
        position: "relative"
    },
    secondCont: {
        width: "60%",
        marginHorizontal: "20%",
        height: 80,
        position: "absolute",
        top: -30,
        backgroundColor: "white",
        borderTopRightRadius: 110,
        borderTopLeftRadius: 110,
        justifyContent: "center",
        alignItems: "center"
    },
    navLImg: {
        width: 60,
        height: 60,
        marginTop: 10
    },
    soCont: {
        width: "30%",
        alignItems: "center",
        justifyContent: "center"
    },

    loader: {
        position: "fixed",
        width: 410,
        height: 1000,
        backgroundColor: 'whitesmoke',
        zIndex: 10,
        alignItems: 'center',
        justifyContent: 'center',
    }
});