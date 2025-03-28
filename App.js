import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Home from "./src/screens/Home";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { AppProvider } from "./context/AppContext";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import ProfileScreen from "./src/screens/Profile/ProfileScreen";
import SignIn from "./src/screens/auth/SignIn";
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { Alert } from "react-native";
import { useContext } from "react";
import { AppContext } from "./context/AppContext";

SplashScreen.preventAutoHideAsync();
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function DrawerNavigator() {
  const { isDarkMode } = useContext(AppContext);
  return (
    <Drawer.Navigator 
      initialRouteName="Home"
      screenOptions={({navigation}) => ({
        drawerLabelStyle: {
          fontFamily: 'poppins_regular',
        },
        drawerStyle:{
          backgroundColor: isDarkMode ? '#121212' : '#fafafa',
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
        },
        drawerActiveBackgroundColor: isDarkMode ? '#333333' : '#f0f0f0',
        drawerActiveTintColor: isDarkMode ? '#9C27B0' : '#5F07A4',
        drawerInactiveTintColor: isDarkMode ? '#FFFFFF' : '#333333',
      })}
    >
      <Drawer.Screen
        name="Home"
        component={Home}
        options={{ 
          headerShown: false,
          drawerIcon: ({color}) => (
            <AntDesign name="home" size={22} color={color} />
          )
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ 
          headerShown: false,
          drawerIcon: ({color}) => (
            <MaterialIcons name="person" size={24} color={color} />
          )
        }}
      />
    
    </Drawer.Navigator>
  );
}

export default function App() {
  const [loaded, error] = useFonts({
    jakarta_bold: require("./assets/fonts/PlusJakartaSans-ExtraBold.ttf"),
    jakarta_regular: require("./assets/fonts/PlusJakartaSans-Regular.ttf"),
    inter_semibold: require("./assets/fonts/Inter_28pt-SemiBold.ttf"),
    noto_regular: require("./assets/fonts/NotoSans_Condensed-Regular.ttf"),
    montserrat_bold: require("./assets/fonts/Montserrat-ExtraBold.ttf"),
    montserrat_regular: require("./assets/fonts/Montserrat-Regular.ttf"),
    montserrat_semibold: require("./assets/fonts/Montserrat-SemiBold.ttf"),
    pacifico: require("./assets/fonts/Pacifico-Regular.ttf"),
    poppins_regular: require("./assets/fonts/Poppins-Regular.ttf"),
    poppins_bold: require("./assets/fonts/Poppins-Bold.ttf"),
    poppins_semibold: require("./assets/fonts/Poppins-SemiBold.ttf"),
    LeckerliOne_regular: require("./assets/fonts/LeckerliOne-Regular.ttf"),
  });
  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }
  return (
    <AppProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {/* Drawer Navigator (Only Home & Profile will be in Drawer) */}
            <Stack.Screen name="DrawerNavigator" component={DrawerNavigator} />
            
            {/* Hidden Screens (Accessible via navigation but not in drawer) */}
            <Stack.Screen name="SignIn" component={SignIn} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </AppProvider>
  );
}
