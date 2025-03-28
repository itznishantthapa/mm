"use client"

import { useEffect, useRef, useState, useContext } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing, Dimensions, Keyboard, Image, Alert } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { AntDesign } from "@expo/vector-icons"
import { SafeAreaView } from "react-native-safe-area-context"
import { AppContext } from "../../../context/AppContext"
import { GoogleSignin, statusCodes  } from "@react-native-google-signin/google-signin"


const { width, height } = Dimensions.get("window")

const SignIn = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(50)).current
  const [isLoginScreen, setIsLoginScreen] = useState(false)

  useEffect(() => {
    GoogleSignin.configure({
      scopes: ['email'],
      webClientId: '1076703935364-a86102jsfog4vqtpusfnep6r8qi3rfiu.apps.googleusercontent.com',
    })
  }, [])

  const signIn = async()=>{
    try {
      await GoogleSignin.hasPlayServices()
      const userInfo = await GoogleSignin.signIn()
      console.log(userInfo)
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_REQUIRED) {
        // Add scopes to request
        await GoogleSignin.configure({
          scopes: ['email'],
          webClientId: '1076703935364-a86102jsfog4vqtpusfnep6r8qi3rfiu.apps.googleusercontent.com',
        })
      }else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log("Play Services Not Available")
      }else{
        console.log(error)
      }
      
    }

  }

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.out(Easing.exp),
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.out(Easing.exp),
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);



  const handleGoogleSignIn = async () => {
    console.log("Google Sign In")
    signIn();
  };

  const handleBackButton = () => {
    Keyboard.dismiss();
    navigation.goBack();
  }

  const toggleScreen = () => {
    setIsLoginScreen(!isLoginScreen);
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient colors={["#FFFFFF", "#F0F4F8"]} style={styles.container}>
        <TouchableOpacity
          onPress={handleBackButton}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <AntDesign
            name='arrowleft'
            size={30}
            style={{ color: '#333333' }}
          />
        </TouchableOpacity>

        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.heading}>MeatMart</Text>
          <Text style={styles.subtitle}>
            {isLoginScreen
              ? "Welcome back! Just log in to get started."
              : "Let's get started! Create your account."}
          </Text>

          {/* Google Sign In Button */}
          <TouchableOpacity
            style={styles.googleButton}
            onPress={handleGoogleSignIn}
            activeOpacity={0.9}
          >
            <View style={styles.googleButtonContent}>
              <Image
                source={require('../../../assets/images/googlelogo.png')}
                style={styles.googleIcon}
              />
              <Text style={styles.googleButtonText}>
                {isLoginScreen ? "Continue with Google" : "Sign up with Google"}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginPrompt}
            onPress={toggleScreen}
            activeOpacity={0.7}
          >
            <Text style={styles.loginPromptText}>
              {isLoginScreen
                ? "Don't have an account? Register"
                : "Already registered? Log in"}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </LinearGradient>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 999,
    padding: 10,
  },
  content: {
    width: width * 0.9,
    alignItems: "center",
  },
  heading: {
    fontFamily: 'montserrat_bold',
    fontSize: 32,
    color: "#4CAF50",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: 'poppins_regular',
    fontSize: 16,
    color: "#666666",
    marginBottom: 40,
    textAlign: "center",
    lineHeight: 24,
  },
  googleButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 24,
    width: '80%',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  googleButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  googleButtonText: {
    fontFamily: "poppins_semibold",
    fontSize: 16,
    color: "#333333",
    textAlign: "center",
  },
  loginPrompt: {
    marginTop: 20,
  },
  loginPromptText: {
    fontFamily: "poppins_regular",
    fontSize: 14,
    color: "#888888",
    textAlign: "center",
  },
})

export default SignIn