const api_key = "AIzaSyBZP4kNQQ3P64kJDMZit_blizapfoBzLas";

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
    fetch(url, {
        method: "POST",
        headers: { 'ContentType': 'application/json' },
        body: JSON.stringify(user),
    }).then(response => response.json()).then((dat) => {
        console.log("Done: ", dat);
        return dat
    }).catch((error) => {
        console.log(error);
    })
}