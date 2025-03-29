"use client"

import { useContext } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Switch,
  Dimensions,
  StatusBar,
  Alert,
} from "react-native"
import { Ionicons, Feather } from "@expo/vector-icons"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { LinearGradient } from "expo-linear-gradient"
import { AppContext } from "../../../context/AppContext"
import { signOut } from "firebase/auth"
import { auth } from "../../../firebaseConfig"

const { width } = Dimensions.get("window")

const ProfileScreen = ({ navigation }) => {
  const { isDarkMode, setIsDarkMode, clearCurrentData,user } = useContext(AppContext)
  const insets = useSafeAreaInsets()
  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  // Handle sign out
  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Sign Out",
        onPress: async() => {
          clearCurrentData();
          await signOut(auth);
          // Sign out logic here
          navigation.navigate('DrawerNavigator', { screen: 'Home' })
          console.log("User signed out")
        },
        style: "destructive",
      },
    ])
  }

  return (
    <SafeAreaView style={{flex:1}}>
    <View style={[styles.container, { backgroundColor: isDarkMode ? "#121212" : "#F8F9FA" }]}>
    <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={isDarkMode ? "#121212" : "#E8F5E9"} />

      {/* Header */}
      <View style={{backgroundColor:isDarkMode ? '#121212' : '#ffffff',width:'100%',paddingHorizontal:20,paddingVertical:5}}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={isDarkMode ? "#FFFFFF" : "#212121"}/>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: isDarkMode ? "#1E1E1E" : "#FFFFFF" }]}>
          <View style={styles.profileHeader}>
            <View style={styles.profileInfo}>
              <View style={{width:'100%',alignItems:'center'}}>
             {user &&  <Text style={[styles.profileName, { color: isDarkMode ? "#FFFFFF" : "#212121" }]}>{user.displayName}</Text>}
              {user && <Text style={[styles.profileEmail, { color: isDarkMode ? "#B0BEC5" : "#757575" }]}>{user.email}</Text>}
              </View>
           
              <View style={styles.profileStats}>
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: isDarkMode ? "#FFFFFF" : "#212121" }]}>12</Text>
                  <Text style={[styles.statLabel, { color: isDarkMode ? "#B0BEC5" : "#757575" }]}>Orders</Text>
                </View>

                <View style={[styles.statDivider, { backgroundColor: isDarkMode ? "#333333" : "#E0E0E0" }]} />

                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: isDarkMode ? "#FFFFFF" : "#212121" }]}>3</Text>
                  <Text style={[styles.statLabel, { color: isDarkMode ? "#B0BEC5" : "#757575" }]}>Favorites</Text>
                </View>

                <View style={[styles.statDivider, { backgroundColor: isDarkMode ? "#333333" : "#E0E0E0" }]} />

                <View style={styles.statItem}>
                  <View style={styles.ratingContainer}>
                    <Text style={[styles.statValue, { color: isDarkMode ? "#FFFFFF" : "#212121" }]}>4.8</Text>
                    <Ionicons name="star" size={14} color="#FFD700" />
                  </View>
                  <Text style={[styles.statLabel, { color: isDarkMode ? "#B0BEC5" : "#757575" }]}>Rating</Text>
                </View>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.editProfileButton}>
            <Feather name="edit-2" size={16} color="#FFFFFF" style={styles.editIcon} />
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Personal Information Section */}
        <View style={[styles.section, { backgroundColor: isDarkMode ? "#1E1E1E" : "#FFFFFF" }]}>
          <Text style={[styles.sectionTitle, { color: isDarkMode ? "#FFFFFF" : "#212121" }]}>Personal Information</Text>

          <View style={[styles.infoItem, { borderBottomColor: isDarkMode ? "#333333" : "#F0F0F0" }]}>
            <View style={[styles.iconContainer, { backgroundColor: isDarkMode ? "#333333" : "#E8F5E9" }]}>
              <Ionicons name="call-outline" size={20} color="#4CAF50" />
            </View>
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: isDarkMode ? "#B0BEC5" : "#757575" }]}>Phone Number</Text>
              <Text style={[styles.infoValue, { color: isDarkMode ? "#FFFFFF" : "#212121" }]}>+977 9800000000</Text>
            </View>
           
          </View>

          <View style={[styles.infoItem, { borderBottomColor: isDarkMode ? "#333333" : "#F0F0F0" }]}>
            <View style={[styles.iconContainer, { backgroundColor: isDarkMode ? "#333333" : "#E8F5E9" }]}>
              <Ionicons name="location-outline" size={20} color="#4CAF50" />
            </View>
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: isDarkMode ? "#B0BEC5" : "#757575" }]}>Address</Text>
              <Text style={[styles.infoValue, { color: isDarkMode ? "#FFFFFF" : "#212121" }]}>Biratnagar, Nepal</Text>
            </View>
           
          </View>

          <View style={styles.infoItem}>
            <View style={[styles.iconContainer, { backgroundColor: isDarkMode ? "#333333" : "#E8F5E9" }]}>
              <Ionicons name="mail-outline" size={20} color="#4CAF50" />
            </View>
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: isDarkMode ? "#B0BEC5" : "#757575" }]}>Email</Text>
              <Text style={[styles.infoValue, { color: isDarkMode ? "#FFFFFF" : "#212121" }]}>user@example.com</Text>
            </View>
          
          </View>
        </View>

        {/* App Settings Section */}
        <View style={[styles.section, { backgroundColor: isDarkMode ? "#1E1E1E" : "#FFFFFF" }]}>
          <Text style={[styles.sectionTitle, { color: isDarkMode ? "#FFFFFF" : "#212121" }]}>App Settings</Text>

          {/* Dark Mode Toggle */}
          <View style={[styles.settingItem, { borderBottomColor: isDarkMode ? "#333333" : "#F0F0F0" }]}>
            <View style={[styles.iconContainer, { backgroundColor: isDarkMode ? "#333333" : "#E8F5E9" }]}>
              <Ionicons name={isDarkMode ? "moon" : "sunny"} size={20} color="#4CAF50" />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingText, { color: isDarkMode ? "#FFFFFF" : "#212121" }]}>Dark Mode</Text>
            </View>
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={isDarkMode ? "#4CAF50" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleDarkMode}
              value={isDarkMode}
            />
          </View>

          {/* Notifications */}
          <View style={[styles.settingItem, { borderBottomColor: isDarkMode ? "#333333" : "#F0F0F0" }]}>
            <View style={[styles.iconContainer, { backgroundColor: isDarkMode ? "#333333" : "#E8F5E9" }]}>
              <Ionicons name="notifications-outline" size={20} color="#4CAF50" />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingText, { color: isDarkMode ? "#FFFFFF" : "#212121" }]}>Notifications</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={isDarkMode ? "#B0BEC5" : "#757575"} />
          </View>

          {/* Language */}
          <View style={[styles.settingItem, { borderBottomColor: isDarkMode ? "#333333" : "#F0F0F0" }]}>
            <View style={[styles.iconContainer, { backgroundColor: isDarkMode ? "#333333" : "#E8F5E9" }]}>
              <Ionicons name="language-outline" size={20} color="#4CAF50" />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingText, { color: isDarkMode ? "#FFFFFF" : "#212121" }]}>Language</Text>
              <Text style={[styles.settingSubtext, { color: isDarkMode ? "#B0BEC5" : "#757575" }]}>English</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={isDarkMode ? "#B0BEC5" : "#757575"} />
          </View>

          {/* Help & Support */}
          <View style={[styles.settingItem, { borderBottomColor: isDarkMode ? "#333333" : "#F0F0F0" }]}>
            <View style={[styles.iconContainer, { backgroundColor: isDarkMode ? "#333333" : "#E8F5E9" }]}>
              <Ionicons name="help-circle-outline" size={20} color="#4CAF50" />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingText, { color: isDarkMode ? "#FFFFFF" : "#212121" }]}>Help & Support</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={isDarkMode ? "#B0BEC5" : "#757575"} />
          </View>

          {/* About */}
          <View style={[styles.settingItem, { borderBottomColor: isDarkMode ? "#333333" : "#F0F0F0" }]}>
            <View style={[styles.iconContainer, { backgroundColor: isDarkMode ? "#333333" : "#E8F5E9" }]}>
              <Ionicons name="information-circle-outline" size={20} color="#4CAF50" />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingText, { color: isDarkMode ? "#FFFFFF" : "#212121" }]}>About</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={isDarkMode ? "#B0BEC5" : "#757575"} />
          </View>
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity
          style={[styles.signOutButton, { backgroundColor: isDarkMode ? "#333333" : "#FFEBEE" }]}
          onPress={handleSignOut}
        >
          <Ionicons name="log-out-outline" size={20} color="#F44336" style={styles.signOutIcon} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        {/* App Version */}
        <Text style={[styles.versionText, { color: isDarkMode ? "#757575" : "#9E9E9E" }]}>Version 1.0.0</Text>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 16,
    height: 100,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  headerAction: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  profileCard: {
    borderRadius: 16,
    marginTop: 10,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
  },
  profileHeader: {
    flexDirection: "row",
    marginBottom: 16,
  },
  profileImageContainer: {
    position: "relative",
    marginRight: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "#4CAF50",
  },
  editImageButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#4CAF50",
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  profileInfo: {
    flex: 1,
    justifyContent: "center",
  },
  profileName: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    marginBottom: 12,
  },
  profileStats: {
    flexDirection: "row",
    alignItems: "center",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    marginHorizontal: 8,
  },
  editProfileButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4CAF50",
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 8,
  },
  editIcon: {
    marginRight: 8,
  },
  editProfileText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
  section: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "500",
  },
  editInfoButton: {
    padding: 8,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  settingContent: {
    flex: 1,
  },
  settingText: {
    fontSize: 16,
  },
  settingSubtext: {
    fontSize: 12,
    marginTop: 2,
  },
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    paddingVertical: 16,
    marginBottom: 16,
  },
  signOutIcon: {
    marginRight: 8,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#F44336",
  },
  versionText: {
    textAlign: "center",
    fontSize: 12,
    marginBottom: 8,
  },
  bottomSpacing: {
    height: 30,
  },
})

export default ProfileScreen

