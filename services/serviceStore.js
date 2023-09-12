const projectId = "nft-collections-7f143";

//Get Recordings
export const getJournals = async (email) => {
    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/journals`;
    try {
        const response = await fetch(url, {
            method: "GET",
        });
        const data = await response.json();
        // console.log("Done: ", data.documents[0].fields.title);
        let journals = [];

        data.documents.forEach(dat => {
            // console.log("Done: ", dat.fields.email.stringValue);
            if (dat.fields.email.stringValue === email) {
                journals.push(dat.fields)
                console.log("Done: ", dat.fields.title);
            }
            
        });
        // console.log("Journals", journals);
        return journals;
    } catch (error) {
        console.log(error);
    }
}