import 'react-native-gesture-handler';
import React, { useState, useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LandingScreen from './components/LandingScreen';
import HomeScreen from "./components/HomeScreen";
import JournalsScreen from "./components/JournalsScreen";
import SignInScreen from "./components/SignInScreen";
import SignUpScreen from "./components/SignUpScreen";
import SignOutScreen from "./components/SignOutScreen";
// import DefaultScreen from "./DefaultScreen";

// DefaultScreen

import { auth } from './components/fbConfig';



export default function App({ navigation }) {
  const Stack = createStackNavigator();
  const [isSignedIn, setSignIn] = useState(false);
  const [userMail, setUserMail] = useState("");
  const [status, setstatus] = useState("");
  // let status = null;
  useEffect(() => {
    // const checkAuth = (auth);
    // console.log(auth);
    // const unsubscribe = checkAuth.onAuthStateChanged((user) => {
    //   if (user !== null) {
    //     // console.log(user)
    //     setUserMail(user.email)
    //     setstatus("Signed In");
    //     if (user.email) {
    //       setSignIn(true);
    //       // console.log("Hello");

    //     }
    //   } else {
    //     setstatus("Not Signed In");
    //     // console.log("Not Signed In");
    //     setSignIn(false);
    //   }
    // });
    // return () => unsubscribe();

    //  const unsubscribe = getUser((user) => {
    //   if (user !== null) {
    //     console.log("user",user)
    //     // setUserMail(user.email)
    //     // setstatus("Signed In");
    //     // if (user.email) {
    //     //   setSignIn(true);
    //     //   // console.log("Hello");

    //     // }
    //   } else {
    //     setstatus("Not Signed In");
    //     // console.log("Not Signed In");
    //     setSignIn(false);
    //   }
    // });
    // return () => unsubscribe();

    (async () => {
      const user = await getUser();
      // console.log("done");
      if (user !== null) {
        // console.log("user",user.email)
        setUserMail(user.email)
        setstatus("Signed In");
        if (user.email) {
          setSignIn(true);
          // console.log("Hello");

        }
      } else {
        setstatus("Not Signed In");
        // console.log("Not Signed In");
        setSignIn(false);
      }

    })();
  }, [getUser]);

  async function getUser() {
    try {
      const jsonValue = await AsyncStorage.getItem('user');
      // const jsonValue = await AsyncStorage.removeItem('user');

      const user = JSON.parse(jsonValue);
      // console.log("RTN User", JSON.parse(jsonValue));
      const token = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjE5MGFkMTE4YTk0MGFkYzlmMmY1Mzc2YjM1MjkyZmVkZThjMmQwZWUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vbmZ0LWNvbGxlY3Rpb25zLTdmMTQzIiwiYXVkIjoibmZ0LWNvbGxlY3Rpb25zLTdmMTQzIiwiYXV0aF90aW1lIjoxNjk0NjA5NzU2LCJ1c2VyX2lkIjoiWU5QVmNGZEcyY1R5WnhIa0tmem9CUnk2QjBTMiIsInN1YiI6IllOUFZjRmRHMmNUeVp4SGtLZnpvQlJ5NkIwUzIiLCJpYXQiOjE2OTQ2MDk3NTYsImV4cCI6MTY5NDYxMzM1NiwiZW1haWwiOiJuZXRzaGlvendpQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJuZXRzaGlvendpQGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.dpja64ESTSDGTyL-WYGz7ZufTVHKtyu5t4kqtlyt38GYbCecTvfrIOXd8DkR7m8V2wS-fJIEThjESpXID9cL3rRu4jHl-XAM2MzfkpBAoxfMwxRQTJ6c7vRZr7zyTYkUv3VYyufa76cXaOE19jxq7xVcL-bi7Zh7_3_oOm3RpPadXdcLNw5mT7UgEk0fmTtjkgpLOzZgZaP1KWsw1el8Qb7wBiApfXw7X5WulYpSwrmsHt-xkbrYfwsWEg6PtH7ygClAqgR7hzo7xM5VRzJ6guuAYiL9pA2LfmDeMC6ppVVbIzBCww4I7v-AC0bRZVdHPhTvoBsD2RU-Z2S1JY5wGw"
      // console.log(user.expiresIn);
      checkTokenExp(token,user.expiresIn).then((isValid) => {
        if (isValid) {
          console.log("My brother we are moving");
        } else {
          console.log("Token invalid");
        }
      }).catch((error) => {
        console.log("Error", error);
      })

      return jsonValue != null ? JSON.parse(jsonValue) : null;
      // return null;
    } catch (e) {
      console.log(e.message);
    }
  }

  async function checkTokenExp(token,expiresIn) {
    const api_key = "";
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyBZP4kNQQ3P64kJDMZit_blizapfoBzLas`;
const idToken = token;
    const response = await fetch(url, {
      method: "POST",
      headers: { 'ContentType': 'application/json' },
      body: JSON.stringify({ idToken }),
    });
    if (response.ok) {
      const data = await response.json();
      const user = data.users[0];
      console.log("===", user, data);
      if (user) {
        // console.log("the user", user);
        const expTime = user.validSince + expiresIn;
        const now = Math.floor(Date.now() / 1000);
        console.log("exp", expTime, "now", now );
        if (expTime > now) {
          console.log("Still Valid");
          return true
        }
      }
    }
    return false;
  }

  return (
    <NavigationContainer>
      {/* <AppStack.Navigator screenOptions={{ headerShown: true }} > */}
      <Stack.Navigator screenOptions={{ headerShown: false }}>

        {isSignedIn ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} initialParams={{ userMail }} />
            <Stack.Screen name="Journals" component={JournalsScreen} initialParams={{ userMail }} />
            <Stack.Screen name="SignOut" >
              {() => <SignOutScreen setSignIn={setSignIn} />}
            </Stack.Screen>
          </>

        )
          :
          (
            <>
              <Stack.Screen name="Landing" component={LandingScreen} />
              <Stack.Screen name="SignIn">
                {() => <SignInScreen setSignIn={setSignIn} />}
              </Stack.Screen>
              <Stack.Screen name="SignUp">
                {() => <SignUpScreen setSignIn={setSignIn} />}
              </Stack.Screen>
            </>
          )

        }
        {/* <AppStack.Screen name="DefaultScreen" component={DefaultScreen} options={{ headerShown: false }} /> */}


      </Stack.Navigator>
    </NavigationContainer>
  );
}

