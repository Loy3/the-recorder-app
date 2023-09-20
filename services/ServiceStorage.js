const storageBucket = "nft-collections-7f143.appspot.com";

//Store Audio
export const storeAnAudio = async (audioTitle, audio) => {
    // console.log("Data res", data);

    const path = `audio/${audioTitle}`.replace('/', '%2F');
    // const storagePath = 'cloud/path/to/your/pic.png'.replace('/', '%2F');

    const url = `https://firebasestorage.googleapis.com/v0/b/${storageBucket}/o/${path}`;

    const formData = new FormData();
    try {
        await fetch(url, {
            method: "POST",
            headers: { 'ContentType': 'application/json',
            'X-Goog-Upload-Protocol': 'multipart' },
            body: JSON.stringify(dataToUpdate),
        }).then(() => {
            console.log("Done");
        }).catch((error) => {
            console.log(error);
        })
        // const data = await response.json();

        // return data;
    } catch (error) {
        console.log(error);
    }
}