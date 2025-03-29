"use client"

import { useState } from "react"
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Linking,
  Platform,
  Dimensions,
} from "react-native"
import { Ionicons, AntDesign, Feather } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { SafeAreaView } from "react-native-safe-area-context"
import { StatusBar } from "expo-status-bar"
import { FlatList } from "react-native-gesture-handler"
import React from "react"
import { scaleHeight, scaleWidth } from "../../../Scaling"

const { width } = Dimensions.get("window")

const ShopProfile = ({ route, navigation }) => {
    const { shop } = route.params
  const [activeCategory, setActiveCategory] = useState("All")
  const [cartItems, setCartItems] = useState([])

  console.log("shop:::::-->", shop)




  return (
    <SafeAreaView style={styles.container}>
      {/* <StatusBar style="light" /> */}

      {/* Header with back button and cart */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333333" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={shop}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <>
            <LinearGradient colors={["rgba(0,0,0,0.7)", "transparent"]} style={styles.heroGradient}>
              <Image
                source={{
                  uri:
                  
                    // `${baseURL}${shop.logo}` ||
                    // "https://images.unsplash.com/photo-1556742205-e10c9486e506?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxzZWFyY2h8MXx8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D",
                    "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aG90ZWwlMjByZXN0YXVyYW50fGVufDB8fDB8fHww"
                }}
                style={styles.heroCover}
                resizeMode="cover"
              />
            </LinearGradient>

            {/* shop Info Card */}
            <View style={styles.shopCard}>
              <View style={styles.logoContainer}>
                <Image source={{ uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1PCCjR8Kk6TSopnWF7IP8xvlrnG9KNS-5uw&s" }} style={styles.logo} />
              </View>

              <View style={styles.shopInfo}>
                <Text style={styles.shopName}>{shop.name}</Text>
                <Text style={styles.shopType}>{shop.business_type || "shop"}</Text>

                <View style={styles.ratingRow}>
                  <View style={styles.ratingContainer}>
                    <AntDesign name="star" size={16} color="#FFD700" />
                    <Text style={styles.ratingText}>{shop.rating || "4.5"}</Text>
                  </View>
                  <Text style={styles.ratingCount}>({shop.ratingCount || "200+"})</Text>

                  {shop.is_active ? (
                    <View style={styles.statusBadge}>
                      <Text style={styles.statusText}>Open</Text>
                    </View>
                  ) : (
                    <View style={[styles.statusBadge, styles.closedBadge]}>
                      <Text style={[styles.statusText, styles.closedText]}>Closed</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>

            {/* shop Details */}
            <View style={styles.detailsCard}>
              <View style={styles.detailRow}>
                <Ionicons name="time-outline" size={20} color="#4CAF50" style={styles.detailIcon} />
                <Text style={styles.detailText}>{shop.opening_hour || "10:00 AM - 10:00 PM"}</Text>
              </View>

              <View style={styles.detailRow}>
                <Ionicons name="location-outline" size={20} color="#4CAF50" style={styles.detailIcon} />
                <Text style={styles.detailText}>
                  {shop.street_address
                    ? `${shop.street_address}, ${shop.city}`
                    : "123 Main Street, City Center"}
                </Text>
                <TouchableOpacity style={styles.mapButton} onPress={undefined}>
                  <Text style={styles.mapButtonText}>Map</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.detailRow}>
                <Ionicons name="call-outline" size={20} color="#4CAF50" style={styles.detailIcon} />
                <Text style={styles.detailText}>{shop.phone || "+91 98765 43210"}</Text>
                <TouchableOpacity style={styles.callButton} onPress={undefined}>
                  <Text style={styles.callButtonText}>Call</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Map Preview */}
            <TouchableOpacity style={styles.mapPreview} onPress={undefined}>
              <Image
                // source={{
                //   uri: `https://maps.gomaps.pro/maps/api/staticmap?center=${ "26.8217"},${"87.2863"}&zoom=15&size=600x300&maptype=roadmap&markers=color:red%7C${ "26.8217"},${ "87.2863"}&key=AlzaSyEVS1Xym6dfUAcdxBZQaKis7oO_zf_D7GZ`,
                // }}
                source={{
                  uri: `https://maps.gomaps.pro/maps/api/staticmap?center=${shop.latitude},${shop.longitude}&zoom=15&size=600x300&maptype=roadmap&markers=color:red%7C${shop.latitude},${shop.longitude}&key=AlzaSyEVS1Xym6dfUAcdxBZQaKis7oO_zf_D7GZ`,

                }}
                style={styles.mapImage}
                resizeMode="cover"
              />

              <View style={styles.mapOverlay}>
                <Text style={styles.mapOverlayText}>Tap to view in Maps</Text>
              </View>
            </TouchableOpacity>

            {/* Menu Categories */}
            <Text style={styles.menuTitle}>Menu</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoriesContainer}
              contentContainerStyle={styles.categoriesContent}
            >
              {shop.category.map((category: string, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.categoryButton, activeCategory === category && styles.activeCategoryButton]}
                  onPress={() => setActiveCategory(category)}
                >
                  <Text style={[styles.categoryText, activeCategory === category && styles.activeCategoryText]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            {shop.length === 0 && (
              <View style={styles.emptyContainer}>
                <Feather name="coffee" size={48} color="#E0E0E0" />
                <Text style={styles.emptyText}>No items in this category</Text>
              </View>
            )}
          </>
        )}
        renderItem={({ item }) => (<></>)}
        // contentContainerStyle={styles.listContent}
        ListFooterComponent={() => <View style={styles.bottomSpacing} />}
      />



    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F4F8",
  },
  header: {
    position: "absolute",
    top: 35,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: scaleWidth(16),
    zIndex: 10,
  },
  backButton: {
    width: scaleWidth(40),
    height: scaleWidth(40),
    borderRadius: scaleWidth(20),
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  cartButton: {
    width: scaleWidth(40),
    height: scaleWidth(40),
    borderRadius: scaleWidth(20),
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  cartBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#FF6B6B",
    borderRadius: scaleWidth(10),
    width: scaleWidth(18),
    height: scaleWidth(18),
    justifyContent: "center",
    alignItems: "center",
  },
  cartBadgeText: {
    color: "#FFFFFF",
    fontSize: scaleWidth(10),
    fontFamily: "poppins_semibold",
  },
  scrollView: {
    flex: 1,
  },

  heroGradient: {
    height: scaleHeight(200),
    width: "100%",
  },
  heroCover: {
    height: scaleHeight(200),
    width: "100%",
  },
  shopCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: scaleWidth(10),
    marginHorizontal: scaleWidth(16),
    marginTop: scaleHeight(-30),
    padding: scaleWidth(16),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoContainer: {
    marginRight: scaleWidth(16),
  },
  logo: {
    width: scaleWidth(70),
    height: scaleWidth(70),
    borderRadius: scaleWidth(35),
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  shopInfo: {
    flex: 1,
  },
  shopName: {
    fontFamily: "poppins_semibold",
    fontSize: scaleWidth(18),
    color: "#333333",
    marginBottom: scaleHeight(2),
  },
  shopType: {
    fontFamily: "poppins_regular",
    fontSize: scaleWidth(14),
    color: "#757575",
    marginBottom: scaleHeight(8),
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF9C4",
    paddingHorizontal: scaleWidth(6),
    paddingVertical: scaleHeight(2),
    borderRadius: scaleWidth(4),
  },
  ratingText: {
    fontFamily: "poppins_semibold",
    fontSize: scaleWidth(12),
    color: "#333333",
    marginLeft: scaleWidth(4),
  },
  ratingCount: {
    fontFamily: "poppins_regular",
    fontSize: scaleWidth(12),
    color: "#757575",
    marginLeft: scaleWidth(6),
  },
  statusBadge: {
    marginLeft: "auto",
    backgroundColor: "#E8F5E9",
    paddingHorizontal: scaleWidth(8),
    paddingVertical: scaleHeight(2),
    borderRadius: scaleWidth(4),
  },
  statusText: {
    fontFamily: "poppins_regular",
    fontSize: scaleWidth(12),
    color: "#4CAF50",
  },
  closedBadge: {
    backgroundColor: "#FFEBEE",
  },
  closedText: {
    color: "#F44336",
  },
  detailsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: scaleWidth(10),
    marginHorizontal: scaleWidth(16),
    marginTop: scaleHeight(16),
    padding: scaleWidth(16),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: scaleHeight(12),
  },
  detailIcon: {
    marginRight: scaleWidth(10),
  },
  detailText: {
    fontFamily: "poppins_regular",
    fontSize: scaleWidth(14),
    color: "#333333",
    flex: 1,
  },
  mapButton: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: scaleWidth(12),
    paddingVertical: scaleHeight(4),
    borderRadius: scaleWidth(4),
  },
  mapButtonText: {
    fontFamily: "poppins_semibold",
    fontSize: scaleWidth(12),
    color: "#4CAF50",
  },
  callButton: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: scaleWidth(12),
    paddingVertical: scaleHeight(4),
    borderRadius: scaleWidth(4),
  },
  callButtonText: {
    fontFamily: "poppins_semibold",
    fontSize: scaleWidth(12),
    color: "#4CAF50",
  },
  mapPreview: {
    height: scaleHeight(150),
    marginHorizontal: scaleWidth(16),
    marginTop: scaleHeight(16),
    borderRadius: scaleWidth(10),
    overflow: "hidden",
    position: "relative",
  },
  mapImage: {
    width: "100%",
    height: "100%",
  },
  mapOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: scaleWidth(8),
    alignItems: "center",
  },
  mapOverlayText: {
    fontFamily: "poppins_regular",
    fontSize: scaleWidth(12),
    color: "#FFFFFF",
  },
  menuTitle: {
    fontFamily: "poppins_semibold",
    fontSize: scaleWidth(20),
    color: "#333333",
    marginHorizontal: scaleWidth(16),
    marginTop: scaleHeight(24),
    marginBottom: scaleHeight(12),
  },
  categoriesContainer: {
    marginBottom: scaleHeight(16),
  },
  categoriesContent: {
    paddingHorizontal: scaleWidth(16),
  },
  categoryButton: {
    paddingHorizontal: scaleWidth(16),
    paddingVertical: scaleHeight(8),
    backgroundColor: "#FFFFFF",
    borderRadius: scaleWidth(20),
    marginRight: scaleWidth(8),
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  activeCategoryButton: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  categoryText: {
    fontFamily: "poppins_regular",
    fontSize: scaleWidth(14),
    color: "#333333",
  },
  activeCategoryText: {
    color: "#FFFFFF",
    fontFamily: "poppins_semibold",
  },
  foodItemsContainer: {
    paddingHorizontal: scaleWidth(16),
  },
  foodItem: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: scaleWidth(10),
    marginBottom: scaleHeight(16),
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  foodImage: {
    width: scaleWidth(100),
    height: scaleWidth(100),
  },
  foodInfo: {
    flex: 1,
    padding: scaleWidth(12),
  },
  foodNameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: scaleHeight(4),
  },
  foodName: {
    fontFamily: "poppins_semibold",
    fontSize: scaleWidth(16),
    color: "#333333",
    flex: 1,
  },
  vegIndicator: {
    marginLeft: scaleWidth(8),
    padding: scaleWidth(2),
    borderRadius: scaleWidth(4),
    backgroundColor: "#E8F5E9",
  },
  foodDescription: {
    fontFamily: "poppins_regular",
    fontSize: scaleWidth(12),
    color: "#757575",
    marginBottom: scaleHeight(8),
  },
  foodPriceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  foodPrice: {
    fontFamily: "poppins_semibold",
    fontSize: scaleWidth(16),
    color: "#4CAF50",
  },
  addButton: {
    backgroundColor: "#4CAF50",
    width: scaleWidth(30),
    height: scaleWidth(30),
    borderRadius: scaleWidth(15),
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: scaleHeight(30),
  },
  emptyText: {
    fontFamily: "poppins_regular",
    fontSize: scaleWidth(14),
    color: "#9E9E9E",
    marginTop: scaleHeight(10),
  },
  reviewsContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: scaleWidth(10),
    marginHorizontal: scaleWidth(16),
    marginTop: scaleHeight(16),
    padding: scaleWidth(16),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: scaleHeight(12),
  },
  sectionTitle: {
    fontFamily: "poppins_semibold",
    fontSize: scaleWidth(16),
    color: "#333333",
  },
  viewAllText: {
    fontFamily: "poppins_regular",
    fontSize: scaleWidth(14),
    color: "#4CAF50",
  },
  reviewCard: {
    backgroundColor: "#F9F9F9",
    borderRadius: scaleWidth(8),
    padding: scaleWidth(12),
    marginBottom: scaleHeight(8),
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: scaleHeight(8),
  },
  reviewerName: {
    fontFamily: "poppins_semibold",
    fontSize: scaleWidth(14),
    color: "#333333",
  },
  reviewRating: {
    flexDirection: "row",
  },
  reviewText: {
    fontFamily: "poppins_regular",
    fontSize: scaleWidth(14),
    color: "#333333",
    marginBottom: scaleHeight(8),
  },
  reviewDate: {
    fontFamily: "poppins_regular",
    fontSize: scaleWidth(12),
    color: "#9E9E9E",
    textAlign: "right",
  },
  bottomSpacing: {
    height: scaleHeight(30),
  },
})

export default ShopProfile

