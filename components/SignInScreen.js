import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, TextInput, ScrollView } from 'react-native';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from './fbConfig';
import topImgBG from "../assets/listen.png";
// import  from "../assets/bg.png";
import email from "../assets/email.png";
import pswd from "../assets/padlock.png";
import pswdhide from "../assets/hide.png";
import pswdshow from "../assets/view.png";

export default function SignInScreen({ navigation }) {
    const [emailAddress, setEmailAddress] = useState("");
    const [password, setPassword] = useState("");

    const [passwordVis, setPasswordVis] = useState(true);
    const [warningMsg, setWarningMsg] = useState("")
    const [warningStatus, setWarningStatus] = useState(false)

    function onSignin() {
        // console.log(emailAddress, password);

        if (emailAddress !== "" && password !== "") {

            signInWithEmailAndPassword(auth, emailAddress, password).then(() => {
                // navigation.navigate("Journals");
                // console.log("signed");
            }).catch((error) => {
                console.log(error.message);
                setWarningStatus(true);
                setWarningMsg("Incorrect Email or Password");
            })
        } else {
            // alert
            setWarningStatus(true);
            setWarningMsg("Require both email address and password.");
        }
    }

    function handlePassword() {
        if (passwordVis === true) {
            setPasswordVis(false);
        } else if (passwordVis === false) {
            setPasswordVis(true);
        }
    }

    return (
        <View style={styles.container}>

            <View style={styles.topImg} >
                <Image source={topImgBG} style={styles.signInImg} />
            </View>


            <View style={styles.formContainer}>
                <ScrollView scrollEnabled={true} >
                    <View style={styles.wrapper}>
                        <Text style={styles.signInTitle}>Sign In.</Text>
                        <Text style={styles.signInSubTitle}>Sign in to start recording.</Text>
                        <View style={styles.form_wrapper}>

                            {warningStatus ?
                                <Text style={{ color: "red", marginBottom: 10, marginLeft: 10 }}>{warningMsg}</Text>
                                : null}

                            <View style={styles.formCont}>
                                <View style={styles.avater}>
                                    <Image source={email} style={styles.avaterImg} />
                                </View>
                                <View style={styles.email}>
                                    <TextInput style={styles.formInput}
                                        autoComplete="off"
                                        keyboardType="email-address"
                                        autoCapitalize="none" 
                                        onChangeText={text => setEmailAddress(text)}
                                        value={emailAddress} placeholder={"Email Address"} />
                                </View>
                            </View>
                            <View style={styles.formCont}>
                                <View style={styles.avater}>
                                    <Image source={pswd} style={styles.avaterImg} />
                                </View>
                                <View style={styles.email}>
                                    <TextInput style={styles.formInput}
                                        secureTextEntry={passwordVis}
                                        autoComplete="off"
                                        autoCapitalize="none" 
                                        onChangeText={text => setPassword(text)}
                                        value={password} placeholder={"Password"} />
                                </View>
                                <TouchableOpacity style={styles.pswEye} onPress={handlePassword}>
                                    {passwordVis === true ? <Image source={pswdhide} style={styles.avaterImg} />
                                        : <Image source={pswdshow} style={styles.avaterImg} />}
                                </TouchableOpacity>
                            </View>

                            <View style={styles.btnCon}>
                                <TouchableOpacity style={styles.siBtn} onPress={onSignin}>
                                    {/* <TouchableOpacity style={styles.siBtn}  onPress={() => navigation.navigate("Journals")}> */}
                                    <Text style={styles.siBtnTxt}>Sign In</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.accountCont}>
                                <Text style={styles.accountTxt}>
                                    Don't have an account?
                                </Text>
                                <TouchableOpacity style={styles.signUpCont}
                                    onPress={() => navigation.navigate("SignUp")}>
                                    <Text style={styles.signUpTxt}>Sign Up</Text>
                                </TouchableOpacity>
                            </View>
                            
                        </View>
                    </View>
                </ScrollView>
            </View>


        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'whitesmoke',
        // alignItems: 'center',
        // justifyContent: 'center',
    },

    topImg: {
        width: "100%",
        height: "40%",
        // backgroundColor: "black",
        // position: "absolute",
        // top: 0,
        // flex: 1,
        // justifyContent: "center",
        alignItems: "center",
        backgroundColor: "whitesmoke",
        marginTop: 10
        // top: 0,
        // left: 0
    },
    signInImg: {
        width: "95%",
        height: "94%",
        // marginHorizontal: "3%",
        // marginTop: 10
    },
    formContainer: {
        position: "absolute",
        top: "40%",
        backgroundColor: "white",
        width: "100%",
        height: "61%",
        borderTopLeftRadius: 70,
        borderTopRightRadius: 70,

    },
    signInTitle: {
        fontSize: 30,
        fontWeight: "bold",

    },
    signInSubTitle: {
        marginTop: 5,
        fontSize: 16
    },
    wrapper: {
        marginTop: 80,
        marginHorizontal: 30

    },
    form_wrapper: {
        marginTop: 50
    },

    formCont: {
        flexDirection: 'row',
        width: "100%",
        backgroundColor: "whitesmoke",
        marginBottom: 20
    },
    email: {
        height: 50,
        width: "80%",
        margin: 5
    },

    avater: {
        width: 60,
        height: 60,
        backgroundColor: "whitesmoke",

    },
    avaterImg: {
        width: 30,
        height: 30,
        marginHorizontal: 15,
        marginVertical: 15
    },
    formInput: {
        width: "100%",
        height: "100%",
        // paddingVertical: 10,
        // backgroundColor: "black"
    },
    pswEye: {
        position: "absolute",
        right: 0
    },
    btnCon: {
        width: "100%",
        marginTop: 10
    },
    siBtn: {
        width: "100%",
        height: 60,
        borderRadius: 100,
        // marginVertical: 30,
        // marginHorizontal: "5%",
        backgroundColor: "black",
    },
    siBtnTxt: {
        textAlign: "center",
        color: "white",
        paddingVertical: 15,
        fontSize: 17,
        fontWeight: "bold"
    },
    accountCont: {
        marginTop: 30,
        // marginHorizontal: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    // accountTxt: {
    //     marginLeft: 20
    // },
    signUpCont: {
        marginLeft: 5,
        color: "gray"
    },
});