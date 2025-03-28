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

SplashScreen.preventAutoHideAsync();
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function DrawerNavigator() {
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
    </Drawer.Navigator>
  );
}

export default function App() {
  const [loaded, error] = useFonts({
    jakarta_bold: require("../MeatMart/assets/fonts/PlusJakartaSans-ExtraBold.ttf"),
    jakarta_regular: require("../MeatMart/assets/fonts/PlusJakartaSans-Regular.ttf"),
    inter_semibold: require("../MeatMart/assets/fonts/Inter_28pt-SemiBold.ttf"),
    noto_regular: require("../MeatMart/assets/fonts/NotoSans_Condensed-Regular.ttf"),
    montserrat_bold: require("../MeatMart/assets/fonts/Montserrat-ExtraBold.ttf"),
    montserrat_regular: require("../MeatMart/assets/fonts/Montserrat-Regular.ttf"),
    montserrat_semibold: require("../MeatMart/assets/fonts/Montserrat-SemiBold.ttf"),
    pacifico: require("../MeatMart/assets/fonts/Pacifico-Regular.ttf"),
    poppins_regular: require("../MeatMart/assets/fonts/Poppins-Regular.ttf"),
    poppins_bold: require("../MeatMart/assets/fonts/Poppins-Bold.ttf"),
    poppins_semibold: require("../MeatMart/assets/fonts/Poppins-SemiBold.ttf"),
    LeckerliOne_regular: require("../MeatMart/assets/fonts/LeckerliOne-Regular.ttf"),
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
            <Stack.Screen name="MainDrawer" component={DrawerNavigator} />
            {/* Hidden Screens (Accessible via navigation but not in drawer) */}
            <Stack.Screen name="SignIn" component={SignIn} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </AppProvider>
  );
}
