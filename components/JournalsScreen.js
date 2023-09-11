import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image, ScrollView } from 'react-native';
import { Audio } from "expo-av";
// import { AudioRecorderPlayer, AudioPlayer } from 'react-native-audio-recorder-player';
import React, { useState, useEffect, useRef } from 'react';

import stopAud from "../assets/stop2.png";
import playAud from "../assets/play2.png";


import recordFiles from "../assets/folder.png";
import audioPlay from "../assets/recording2.png";
import signOut from "../assets/door.png";

import recordOff from "../assets/recorderOff.png";

import audMenu from "../assets/dots.png";
import audEdit from "../assets/edit.png";
import audDelete from "../assets/delete.png";

import closePopup from "../assets/close.png";

import { storage, db, auth } from './fbConfig';
import { collection, deleteDoc, doc, updateDoc, onSnapshot, query, where } from "firebase/firestore";
import { ref, deleteObject } from 'firebase/storage';

export default function JournalsScreen({ navigation, route }) {
    const email = route.params.userMail;
    // const { setSignIn } = route.params.setSignIn;


    const [journals, setJournals] = useState([]);
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const monthsOfYear = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const today = new Date();
    const dayOfWeek = daysOfWeek[today.getDay()];
    const dayOfMonth = today.getDate();
    const monthOfYear = monthsOfYear[today.getMonth()];
    const formattedDate = `${dayOfWeek}, ${dayOfMonth} ${monthOfYear}`;

    //Get data 

    const fetchData = (async () => {

        const collectionRef = collection(db, 'journals');
        const queryRef = query(collectionRef, where("email", '==', email));
        onSnapshot(queryRef, (snapshot) => {
            const fetchedDocuments = [];
            snapshot.forEach((doc) => {
                fetchedDocuments.push({ id: doc.id, ...doc.data() });
            });
            setJournals(fetchedDocuments);

        });

    })

    useEffect(() => {
        fetchData();
    }, [])

    useEffect(() => {
        // console.log(journals);
    }, [journals])


    const [menuTitle, setMenuTitle] = useState("Title");
    const [menuStatus, setMenuStatus] = useState(false);
    function handleMenu(event, title, type) {
        switch (type) {
            case "show":
                setMenuStatus(true);
                setMenuTitle(title);
                break;
            case "hide":
                setMenuStatus(false);
                setMenuTitle("Title");
                break;
            default:
        }
    }


    //Delete
    async function deleteRoom(event, data) {
        // console.log(data.audioName);
        try {

            deleteAudio(data.audioName).then(async () => {
                await deleteDoc(doc(db, "journals", data.id));
                // console.log("Document successfully deleted!");
                setMenuStatus(false);
                setMenuTitle("Title");
            }).catch((error) => {
                console.log(error);
            });


        } catch (error) {
            console.error("Error deleting document: ", error);
        }
    }

    async function deleteAudio(audio) {
        const path = `audio/${audio}`;
        const fileRef = ref(storage, path);
        // Delete the file
        deleteObject(fileRef).then(() => {
        }).catch((error) => {
            console.log(error);
        });
    }

    //update
    const [updateJournal, setUpdateJournal] = useState([]);
    const [newJournalName, setNewJournalName] = useState("");
    const [updateStatus, setupdateStatus] = useState(false);

    function setToUpdate(event, data) {
        setUpdateJournal(data);
        setupdateStatus(true);
    }

    async function journalToUpdate() {
        const docId = updateJournal.id
        const updateData = {
            title: newJournalName,
            audioName: updateJournal.audioName,
            audioUrl: updateJournal.audioUrl,
            date: updateJournal.date
        }

        const storageRef = doc(db, "journals", docId);

        try {
            await updateDoc(storageRef, updateData);
            // console.log('Updated');
            setMenuStatus(false);
            setMenuTitle("Title");
            setupdateStatus(false);
        } catch (error) {
            console.log('Failed to Update');
        }
    }

    //Play sound
    const [soundObject, setsoundObject] = useState(null);
    const [audioPlayOrStop, setAudioPlayOrStop] = useState("");
    async function playAudio(event, audUri, title) {
        // console.log(title);

        try {
            const { sound } = await Audio.Sound.createAsync({ uri: audUri });
            setsoundObject(sound);
            await sound.playAsync();
            setAudioPlayOrStop(title)
        } catch (error) {
            console.log("error:", error);
        }

    }

    async function stopAudio(event) {


        try {
            if (soundObject) {
                await soundObject.stopAsync();
                setAudioPlayOrStop("")
            }
        } catch (error) {
            console.log("error:", error);
        }

    }


    //Close popup
    function popupClose() {
        setupdateStatus(false);
    }

    //Sign out
    function signOutF() {
        auth.signOut().then(() => {
            navigation.navigate("SignOut");
        }).catch((error) => {
            console.log(error.message);
        });

    }

    return (
        <View style={styles.container}>
            <ScrollView scrollEnabled={true} >


                <View style={styles.displayJournals}>
                    <View style={styles.nvHeadCont}>
                        <Text style={styles.nvHead}>Recordings</Text>
                    </View>
                    <View style={styles.dateF}>
                        <Text style={styles.dateTxt}>{formattedDate}</Text>
                    </View>
                    <View style={styles.audioCont}>

                        {journals.map((jrn, index) => (
                            <View key={index} style={styles.card}>
                                {audioPlayOrStop === jrn.title ?
                                    <TouchableOpacity style={styles.cardBtn} onPress={(ev) => stopAudio(ev)}>
                                        <Image source={stopAud} style={styles.player} />
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity style={styles.cardBtn} onPress={(ev) => playAudio(ev, jrn.audioUrl, jrn.title)}>
                                        <Image source={playAud} style={styles.player} />
                                    </TouchableOpacity>
                                }
                                <View style={{ width: "100%" }}>
                                    <Text style={styles.cardTitle}>Title: {jrn.title}</Text>
                                    <Text style={styles.cardSubTitle}>{jrn.date}</Text>
                                </View>

                                <View style={styles.cardOpt}>
                                    {menuTitle !== jrn.title
                                        ? <TouchableOpacity onPress={(ev) => handleMenu(ev, jrn.title, "show")}>
                                            <Image source={audMenu} style={styles.audMenuOpt} />
                                        </TouchableOpacity>
                                        : null}

                                    {menuStatus === true && menuTitle === jrn.title
                                        ? <View style={{ flexDirection: "row" }}>
                                            <TouchableOpacity onPress={(ev) => setToUpdate(ev, jrn)}>
                                                <Image source={audEdit} style={styles.audOpt} />
                                            </TouchableOpacity>

                                            <TouchableOpacity onPress={(ev) => deleteRoom(ev, jrn)}>
                                                <Image source={audDelete} style={styles.audOpt} />
                                            </TouchableOpacity></View>
                                        : null}

                                </View>

                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>

            {updateStatus === true ?
                <View style={styles.popup}>
                    <View style={styles.box}>
                        <View>
                            <TouchableOpacity onPress={popupClose} style={styles.closepop}>
                                <Image source={closePopup} style={styles.closeBtn} />
                            </TouchableOpacity>

                            <Text style={styles.upTitle}>Update Journal</Text>
                            <Text style={styles.upSubTitle}>Journal to be updated: {updateJournal.title}</Text>

                            <TextInput style={styles.updateInput}
                                onChangeText={text => setNewJournalName(text)}
                                value={newJournalName} placeholder={`Current Title: ${updateJournal.title}`} />

                            <TouchableOpacity onPress={journalToUpdate} style={styles.saveBTN}>
                                <Text style={styles.saveBTNTxt}>Save Update</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                : null}

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
        alignItems: "center"
    },
    nvHeadCont: {
        marginTop: -50
    },
    nvHead: {
        // position: "absolute",
        // // top: 130,
        // right: 0,
        // textAlign: "right",
        fontSize: 18
    },
    // dateF: {
    //     marginTop: -30,
    // },
    dateTxt: {
        // textAlign: "right"
        color: "#749aa1",
    },
    // logo: {
    //     width: 50,
    //     height: 50
    // },
    audioCont: {
        marginTop: 30
    },
    formInput: {
        padding: 10,
        borderBottomColor: "black",
        width: "100%",
        textAlign: "center",
        fontSize: 20,
        backgroundColor: "#FAFAFA",
        marginTop: 50
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



    displayJournals: {
        width: 350,
        marginTop: 100,
        // backgroundColor: "white"
    },
    card: {
        // margin: "3%",
        marginVertical: 10,
        width: "100%",
        height: 80,
        flexDirection: "row",
        backgroundColor: "white",
        borderRadius: 20
    },
    cardBtn: {
        marginHorizontal: 5,
        marginVertical: 10
    },
    cardTitle: {
        position: "absolute",
        left: 20,
        top: 15,
        fontSize: 18
    },
    cardSubTitle: {
        position: "absolute",
        left: 20,
        top: 40,
        fontSize: 14,
        color: "#749aa1",
        // fontWeight: "bold"
    },
    cardOpt: {
        position: "absolute",
        right: 10,
        flexDirection: "row"
    },
    audMenuOpt: {
        width: 40,
        height: 40,
        marginTop: 20
    },
    audOpt: {
        width: 30,
        height: 30,
        marginTop: 25,
        marginRight: 5
    },

    player: {
        height: 60,
        width: 60
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
    popup: {
        height: "100%",
        width: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        zIndex: 50,
        alignItems: "center",
        justifyContent: "center",

    },
    box: {
        width: 380,
        height: 400,
        backgroundColor: "whitesmoke",
        // padding: ,
        alignItems: "center",
        justifyContent: "center",
        // borderRadius: 30, 
        paddingTop: 70
    },
    closeBtn: {
        width: 15,
        height: 15,

    },
    closepop: {
        width: 30,
        height: 30,
        // backgroundColor: "green",
        position: "absolute",
        right: -15,
        top: -35
    },
    upTitle: {
        fontSize: 30,
        fontWeight: "bold",
        marginBottom: 3
    },
    upSubTitle: {
        marginTop: 5,
        fontSize: 16,
        //   color: "#749aa1",
    },
    updateInput: {
        width: 300,
        paddingVertical: 15,
        paddingHorizontal: 15,
        backgroundColor: "white",
        marginTop: 30
    },
    saveBTN: {
        // flex: 1,
        // justifyContent: "center",
        // alignItems: "center",
        paddingVertical: 15,
        backgroundColor: "black",
        borderRadius: 100,
        marginVertical: 30,
        width: 300
    },
    saveBTNTxt: {
        fontSize: 18,
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
});