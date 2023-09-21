import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
const storageBucket = "nft-collections-7f143.appspot.com";


async function getUser() {
    // var token = null;
    const jsonValue = await AsyncStorage.getItem('user');

    const user = await JSON.parse(jsonValue);
    const token = user.idToken;
    // console.log("user", token);

    return token;
}

//Store Audio
export const storeAnAudio = async (audioTitle, audio) => {
    const token = await getUser()
    const fileType = audio.type;

    const path = `audio/${audioTitle}`.replace('/', '%2F');

    const url = `https://firebasestorage.googleapis.com/v0/b/${storageBucket}/o/${path}`;
  
       try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                "Authorization": `Firebase ${token}`,
                "Content-Type": `${fileType}`
            },
            body: audio
        });
        const responseData = await response.json();
        const downloadTokens = responseData.downloadTokens;
        const fileName = `${url}`.replace(' ', '%20');
        const dwnlUrl = `${fileName}?alt=media&token=${downloadTokens}`;
        return dwnlUrl
    } catch (error) {
        console.log("err", error);
    }

}


//Delete Audio
export const deleteMyAudio = async (path) => {
    // console.log("Hello here is my id: ", id);
    const url = path;
    fetch(url, {
        method: "DELETE",
    }).then(() => {
        console.log("Deleted.");
        // window.location.reload();
    }).catch((error) => {
        console.log(error);
    })
}