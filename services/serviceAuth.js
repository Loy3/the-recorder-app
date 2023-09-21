const api_key = "AIzaSyBZP4kNQQ3P64kJDMZit_blizapfoBzLas";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const authUrl = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${api_key}`

//Password Generater
export const genPassword = async () => {
    const url = "https://www.psswrd.net/api/v1/password/?length=8&lower=1&upper=1&int=1&special=1";
    const response = await fetch(url);
    return response;
}

export const signUp = async (email, password) => {
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${api_key}`

    const user = {
        email: email,
        password: password
    }
    // var data = null;
    // fetch(url, {
    //     method: "POST",
    //     headers: { 'ContentType': 'application/json' },
    //     body: JSON.stringify(user),
    // }).then(response => response.json()).then((dat) => {
    //     data = dat;
    //     console.log("Data", data);
    //     console.log("Done: ", dat);
    //     // return ;
    // }).catch((error) => {
    //     console.log(error);
    //     // return error;
    // })
    // console.log("the return data", data);

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { 'ContentType': 'application/json' },
            body: JSON.stringify(user),
        });
        const data = await response.json();
        // console.log("Done: ", data);

        return data;
    } catch (error) {
        console.log(error);
    }
}

export const signIn = async (email, password) => {
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${api_key}`

    const user = {
        email: email,
        password: password,
        returnSecureToken: true
    }
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { 'ContentType': 'application/json' },
            body: JSON.stringify(user),
        });
        const data = await response.json();
        // console.log("Done: ", data);
        return data;
    } catch (error) {
        console.log(error);
    }
}


//Refresh token
export const refreshTkn = async (rTkn) => {
    const url = `https://securetoken.googleapis.com/v1/token?key=${api_key}`;

    const refTok = {
        grant_type: "refresh_token",
        refresh_token: rTkn
    }

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { 'ContentType': 'application/json' },
            body: JSON.stringify(refTok),
        });
        const data = await response.json();
        // console.log("Done: ", data);
        const jsonValue = await AsyncStorage.getItem('user');
        // const jsonValue = await AsyncStorage.removeItem('user');

        const user = JSON.parse(jsonValue);
        var newUser = user;
        newUser.idToken = data.id_token;

        const newUserJsonValue = JSON.stringify(newUser);
        await AsyncStorage.setItem('user', newUserJsonValue).then(() => {
            console.log("Success");
        })
        return data;
    } catch (error) {
        console.log(error);
    }
}