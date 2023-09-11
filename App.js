import 'react-native-gesture-handler';
import React, { useState, useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

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
    const checkAuth = (auth);
    // console.log(auth);
    const unsubscribe = checkAuth.onAuthStateChanged((user) => {
      if (user !== null) {
        // console.log(user)
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
    });
    return () => unsubscribe();
  }, []);

  return (
    <NavigationContainer>
      {/* <AppStack.Navigator screenOptions={{ headerShown: true }} > */}
      <Stack.Navigator screenOptions={{ headerShown: false }}>

        {isSignedIn ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} initialParams={{ userMail }} />
            <Stack.Screen name="Journals" component={JournalsScreen} initialParams={{ userMail }} />

          </>
        )
          :
          (
            <>
              <Stack.Screen name="Landing" component={LandingScreen} />
              <Stack.Screen name="SignIn" component={SignInScreen} />
              <Stack.Screen name="SignUp" component={SignUpScreen} />
            </>
          )

        }
        {/* <AppStack.Screen name="DefaultScreen" component={DefaultScreen} options={{ headerShown: false }} /> */}
        <Stack.Screen name="SignOut" component={SignOutScreen} initialParams={{ status }} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

