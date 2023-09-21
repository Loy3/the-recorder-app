const projectId = "nft-collections-7f143";

//Save Document
export const storeMyDoc = async (data) => {
    console.log("Data res", data);

    const dataToUpdate = {
        fields: {
            title: { stringValue: data.title },
            audioName: { stringValue: data.audioName },
            audioUrl: { stringValue: data.audioUrl },
            date: { stringValue: data.date },
            email: { stringValue: data.email },
        }
    }

    // console.log("Json", JSON.stringify(dataToUpdate));
    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/journals`;
    try {
        await fetch(url, {
            method: "POST",
            headers: { 'ContentType': 'application/json' },
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

//Get Recordings
export const getJournals = async (email) => {
    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/journals`;
    try {
        const response = await fetch(url, {
            method: "GET",
        });
        const data = await response.json();
        // console.log("Done: ", data.documents[0].name);
        let journals = [];

        data.documents.forEach(dat => {
            // console.log("Done: ", dat.fields.email.stringValue);
            if (dat.fields.email.stringValue === email) {
                const array = dat.name.split("/");
                journals.push({ id: array[array.length - 1], ...dat.fields })
                // console.log("Id: ", array[array.length - 1]);
            }

        });
        // console.log("Journals", journals);
        return journals;
    } catch (error) {
        console.log(error);
    }
}


//Delete Journal
export const deleteMyJournal = async (id) => {
    // console.log("Hello here is my id: ", id);
    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/journals/${id}`;
    fetch(url, {
        method: "DELETE",
    }).then(() => {
        console.log("Deleted.");
        // window.location.reload();
    }).catch((error) => {
        console.log(error);
    })
}


//Update Journal
export const updateMyJournal = async (id, title) => {
    // console.log("Hello here is my id: ", id);
    // console.log("My title is: ", title);

    const titleToUpdate = {
        fields: {
            title: { stringValue: title }
        }
    }
    // console.log("Json", JSON.stringify(titleToUpdate));
    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/journals/${id}?currentDocument.exists=true&updateMask.fieldPaths=title&alt=json`;
    try {
        await fetch(url, {
            method: "PATCH",
            headers: { 'ContentType': 'application/json' },
            body: JSON.stringify(titleToUpdate),
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

