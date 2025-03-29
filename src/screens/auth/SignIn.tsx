"use client"

import { useEffect, useRef, useState, useContext } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing, Dimensions, Keyboard, Image, Alert, StatusBar, ActivityIndicator } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { AntDesign } from "@expo/vector-icons"
import { SafeAreaView } from "react-native-safe-area-context"
import { AppContext } from "../../../context/AppContext"
import { GoogleSignin, statusCodes  } from "@react-native-google-signin/google-signin"
import { registerUserWithFirebase } from "../../../apis/auth/RegisterUser"


const { width, height } = Dimensions.get("window")

const SignIn = ({ navigation }) => {
  const { setUser, isDarkMode } = useContext(AppContext)
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(50)).current
  const [isLoginScreen, setIsLoginScreen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    GoogleSignin.configure({
      scopes: ['email'],
      webClientId: '1076703935364-a86102jsfog4vqtpusfnep6r8qi3rfiu.apps.googleusercontent.com',
    })
  }, [])

  const signIn = async()=>{
    try {
      setIsLoading(true)
      await GoogleSignin.hasPlayServices()
      // Sign out first to clear any existing sessions
      await GoogleSignin.signOut()
      const userInfo = await GoogleSignin.signIn()
      if (!userInfo || !userInfo.data || !userInfo.data.scopes) {
        setIsLoading(false)
        return
      }

      const response = await registerUserWithFirebase(userInfo)
      console.log(response,'given by the registerUserWithFirebase----------------------------------------------')
      response && setUser(response.user)
      // navigation.navigate('DrawerNavigator', { screen: 'Home' })
      navigation.goBack()
    } catch (error) {
      setIsLoading(false)
      if (error.code === statusCodes.SIGN_IN_REQUIRED) {
        // Add scopes to request
        await GoogleSignin.configure({
          scopes: ['email'],
          webClientId: '1076703935364-a86102jsfog4vqtpusfnep6r8qi3rfiu.apps.googleusercontent.com',
        })
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log("Play Services Not Available")
        Alert.alert("Error", "Google Play Services are not available on this device")
      } else {
        console.log(error)
        Alert.alert("Sign In Failed", "An error occurred during sign in. Please try again.")
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
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor="#ffffff" />
      <LinearGradient colors={["#FFFFFF", "#F0F4F8"]} style={styles.container}>
        <TouchableOpacity
          onPress={handleBackButton}
          style={styles.backButton}
          activeOpacity={0.7}
          disabled={isLoading}
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
            style={[styles.googleButton, isLoading && styles.disabledButton]}
            onPress={handleGoogleSignIn}
            activeOpacity={0.9}
            disabled={isLoading}
          >
            <View style={styles.googleButtonContent}>
              {isLoading ? (
                <ActivityIndicator size="small" color="#4CAF50" style={styles.loadingIndicator} />
              ) : (
                <Image
                  source={require('../../../assets/images/googlelogo.png')}
                  style={styles.googleIcon}
                />
              )}
              <Text style={styles.googleButtonText}>
                {isLoading 
                  ? "Signing in..." 
                  : isLoginScreen ? "Continue with Google" : "Sign up with Google"}
              </Text>
            </View>
          </TouchableOpacity>

          {isLoading && (
            <Text style={styles.loadingText}>Please wait while we sign you in...</Text>
          )}

          <TouchableOpacity
            style={styles.loginPrompt}
            onPress={toggleScreen}
            activeOpacity={0.7}
            disabled={isLoading}
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
  disabledButton: {
    opacity: 0.8,
  },
  loadingIndicator: {
    marginRight: 12,
  },
  loadingText: {
    fontFamily: "poppins_regular",
    fontSize: 14,
    color: "#666666",
    marginTop: 15,
    textAlign: "center",
  },
})

export default SignIn