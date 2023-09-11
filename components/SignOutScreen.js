// import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function SignOutScreen({ navigation }) {

    return (
        <View style={styles.container}>
            <View style={styles.boxCon}>
                <View style={styles.box}>
                    <View style={styles.wrap}>
                        <Text style={styles.title}>
                            Sign Out.
                        </Text>
                        <Text style={styles.subTitle}>
                            Successfully signed out, bye for now.
                        </Text>
                        <View style={styles.proceed}>
                            <TouchableOpacity style={styles.proceedBTN}
                                onPress={() => navigation.navigate("Landing")}>
                                <Text style={styles.proceedBtnTxt}>PROCEED</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'whitesmoke',
        alignItems: 'center',
        justifyContent: 'center',
    },
    boxCon: {
        width: 385,
        height: 385,
        backgroundColor: "#DCDCDC",
        alignItems: 'center',
        justifyContent: 'center',
    },
    box: {
        width: 380,
        height: 380,
        backgroundColor: "whitesmoke"
    },
    wrap: {
        width: "96%",
        height: "96%",
        margin: "2%",
        // backgroundColor: "green",
        position: "relative",
        alignItems: 'center',
        justifyContent: 'center',
    },

    title: {
        margin: 10,
        fontSize: 40,
        fontWeight: "bold"
    },
    subTitle: {},

    proceed: {
        // position: "absolute",
        // bottom: 0,
        width: "100%",
        // height: 150,
        // backgroundColor: "whitesmoke",
        marginTop: 30
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