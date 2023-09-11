// import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
// import { Button, TextInput } from "react-native-web";

import cover from "../assets/cover.png";
export default function LandingScreen({ navigation }) {

    return (
        <View style={styles.container}>
            <View style={styles.topImg} >
                <Image source={cover} style={styles.landingImg} />
            </View>
            <View style={styles.wrapper}>
                <View style={styles.titleCont}>
                    <Text style={styles.title}>Journal Recorder</Text>
                    <Text style={styles.subTitle}>Welcome to the Journal Recorder App, a place where you can record your own journal.</Text>
                </View>

                <View style={styles.proceed}>
                    <TouchableOpacity style={styles.proceedBTN}
                        onPress={() => navigation.navigate("SignIn")}>
                        <Text style={styles.proceedBtnTxt}>PROCEED</Text>
                    </TouchableOpacity>
                </View>
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
        // position:"relative"
    },
    topImg: {
        width: "100%",
        height: "50%",
        // backgroundColor: "black",
        // position: "absolute",
        // top: 0,
        // flex: 1,
        // justifyContent: "center",
        alignItems: "center"
    },
    landingImg: {
        width: "100%",
        height: "99%",
        // marginHorizontal: "3%",
        marginTop: 60
    },
    wrapper: {
        width: "100%",
        height: "50%",
        // backgroundColor: "blue",
        // position: "absolute",
        // top: "55vh",
        // flex: 1,
        // justifyContent: "center",
        // alignItems: "center"
    },
    titleCont: {
        marginHorizontal: 25,
        marginTop: "30%"
    },
    title: {
        fontSize: 29,
        fontWeight: "bold",
        marginBottom: 5,
        textAlign: "center"
    },
    subTitle: {
        // width: "90%",
        textAlign: "center",
        fontSize: 15
    },
    proceed: {
        position: "absolute",
        bottom: 30,
        width: "100%",
        // height: 150,
        backgroundColor: "whitesmoke",
    },
    proceedBTN: {
        width: "90%",
        height: 60,
        borderRadius: 100,
        // marginVertical: 30,
        marginHorizontal: "5%",
        backgroundColor: "black",

    },
    proceedBtnTxt: {
        textAlign: "center",
        color: "white",
        paddingVertical: 15,
        fontSize: 17,
        fontWeight: "bold"
    },

    
});
