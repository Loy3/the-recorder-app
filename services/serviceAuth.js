//Password Generater
export const genPassword = async () => {
    const url = "https://www.psswrd.net/api/v1/password/?length=8&lower=1&upper=1&int=1&special=1";
    const response = await fetch(url);
    return response;
}