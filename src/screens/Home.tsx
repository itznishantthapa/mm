import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Animated,
  Platform,
  PanResponder,
  ScrollView,
  Image,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { MaterialIcons, Ionicons, FontAwesome5, AntDesign, Fontisto } from '@expo/vector-icons';
import MCIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as Location from 'expo-location';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import customMapStyle from '../../Data/mapStyle';
import meatShops from '../../Data/shopData';
import LottieView from 'lottie-react-native';
import FirebaseTest from '../components/FirebaseTest';

const { width, height } = Dimensions.get('window');
// Category icons mapping
const categoryIcons = {
  'Chicken': 'drumstick-bite',

  'Buff': 'cow',
  'Pork': 'pig',
  'Mutton': 'sheep',
  'Fish': 'fish',
};

const Home = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [region, setRegion] = useState({
    latitude: 26.8235,
    longitude: 87.2880,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });
  const [selectedShop, setSelectedShop] = useState(null);
  const [locationName, setLocationName] = useState('Loading...');
  const [isMapDragging, setIsMapDragging] = useState(false);
  const [nearbyShops, setNearbyShops] = useState(meatShops);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filteredShops, setFilteredShops] = useState([]);
  const [showCategoryResults, setShowCategoryResults] = useState(false);
  const mapRef = useRef(null);
  const insets = useSafeAreaInsets();
  const bottomSheetHeight = useRef(new Animated.Value(1)).current; // Start expanded
  const markerScale = useRef(new Animated.Value(1)).current;
  const [greeting, setGreeting] = useState('');

  // New state and animations for text alternation
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const welcomeMessages = [
    // "What would you like to have today?",
    "आज हजुरको लागि कस्तो मासु तयार पारौं?",
    // "Order with MeatMart and Get a MM-Coupon!"
    "मीटमार्ट बाट अर्डर गर्नुहोस् र mm-कुपन पाउनुहोस्!"
  ];
  const textOpacity = useRef(new Animated.Value(1)).current;

  // Set greeting based on time of day
  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) {
      setGreeting('Good Morning');
    } else if (hours < 18) {
      setGreeting('Good Afternoon');
    } else {
      setGreeting('Good Evening');
    }
  }, []);

  // Create pulsating animation for markers
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(markerScale, {
          toValue: 1.2,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(markerScale, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Add text animation effect
  useEffect(() => {
    const animateText = () => {
      // Fade out current text
      Animated.timing(textOpacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        // Change text and fade in
        setCurrentTextIndex(prevIndex => (prevIndex === 0 ? 1 : 0));
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      });
    };

    // Set up interval to change text every 3 seconds
    const interval = setInterval(animateText, 3000);
    
    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, []);

  // Modified to only collapse on map drag, not just touch
  const onRegionChangeComplete = () => {
    setIsMapDragging(false);
    expandBottomSheet();
  };

  const onRegionChange = () => {
    if (!isMapDragging) {
      setIsMapDragging(true);
      collapseBottomSheet();
    }
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      // Update region with user's current location
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.00082,
        longitudeDelta: 0.0021,
      });

      // Get location name
      try {
        const reverseGeocode = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        if (reverseGeocode.length > 0) {
          const address = reverseGeocode[0];
          setLocationName(address.city || address.district || address.subregion || 'Your Location');
        }
      } catch (error) {
        console.error("Error getting location name:", error);
      }
    })();
  }, []);



  const handleMarkerPress = (shop) => {
    setSelectedShop(shop);

    // Animate to the selected shop
    mapRef.current?.animateToRegion({
      latitude: shop.coordinate.latitude,
      longitude: shop.coordinate.longitude,
      latitudeDelta: 0.0082,
      longitudeDelta: 0.0041,
    }, 500);

    // Expand bottom sheet
    expandBottomSheet();
  };

  const expandBottomSheet = () => {
    Animated.timing(bottomSheetHeight, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const expandFullBottomSheet = () => {
    Animated.timing(bottomSheetHeight, {
      toValue: 2, // Full expansion
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const collapseBottomSheet = () => {
    Animated.timing(bottomSheetHeight, {
      toValue: 0, // Completely collapse when map is dragged
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const navigateToShopDetails = (shop) => {
    // Navigate to shop details screen
    console.log('Navigate to shop details:', shop.name);
  };

  const centerOnUserLocation = () => {
    if (location) {
      mapRef.current?.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0082,
        longitudeDelta: 0.0041,
      }, 500);

      // Reset UI to initial state
      setSelectedShop(null);
      setShowCategoryResults(false);
      setSelectedCategory(null);
      expandBottomSheet();
    }
  };

  // Calculate bottom sheet height based on animation value
  const bottomSheetAnimatedHeight = bottomSheetHeight.interpolate({
    inputRange: [0, 0.3, 1, 2],
    outputRange: [0, height * 0.2, height * 0.32, height - insets.top - 60],
  });

  // Get icon for category
  const getCategoryIcon = (category) => {
    return categoryIcons[category] || 'food-steak';
  };

  // Handle category selection
  const handleCategoryPress = (category) => {
    setSelectedCategory(category);
    const shops = meatShops.filter(shop => shop.category.includes(category));
    setFilteredShops(shops);
    setShowCategoryResults(true);
    expandFullBottomSheet();
  };

  // Handle shop selection from category results
  const handleCategoryShopPress = (shop) => {
    setSelectedShop(shop);
    setShowCategoryResults(false);

    // Animate to the selected shop
    mapRef.current?.animateToRegion({
      latitude: shop.coordinate.latitude,
      longitude: shop.coordinate.longitude,
      latitudeDelta: 0.0082,
      longitudeDelta: 0.0041,
    }, 500);

    // Return to normal bottom sheet
    expandBottomSheet();
  };

  // Go back from category results to main screen
  const handleBackFromCategory = () => {
    setShowCategoryResults(false);
    setSelectedCategory(null);
    expandBottomSheet();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fafafa" />

      {/* Map View */}
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={region}
        customMapStyle={customMapStyle}
        showsUserLocation={true}
        showsMyLocationButton={false}
        showsCompass={false}
        showsScale={false}
        showsBuildings={true}
        showsTraffic={false}
        showsIndoors={false}
        mapType="standard"
        toolbarEnabled={false}
        zoomControlEnabled={false}
        rotateEnabled={true}
        scrollEnabled={!showCategoryResults}
        pitchEnabled={true}
        initialRegion={region}
        onRegionChangeComplete={onRegionChangeComplete}
        onRegionChange={onRegionChange}
        onMapReady={() => {
          console.log('Map is ready');
        }}
      >
        {/* Render meat shop markers */}
        {meatShops.map((shop) => (
          <Marker
            key={shop.id}
            coordinate={shop.coordinate}
            onPress={() => handleMarkerPress(shop)}
            tracksViewChanges={false}
          >
            <Animated.View
              style={[
                styles.markerContainer,
                { transform: [{ scale: markerScale }] }
              ]}
            >
              <LinearGradient
                colors={['#FF9800', '#FF6D00']}
                style={styles.marker}
              >
                <MCIcons name="food-steak" size={30} color="#fff" />
              </LinearGradient>
              <View style={styles.markerPointer} />
              <View >
                <Text style={styles.markerText}>{shop.name}</Text>
              </View>
            </Animated.View>
          </Marker>
        ))}
      </MapView>

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={()=>navigation.openDrawer()}
        >
          <MaterialIcons name="menu" size={24} color="#212121" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications" size={24} color="#212121" />
        </TouchableOpacity>
      </View>

      {/* Current Location Button */}
      <TouchableOpacity
        style={styles.currentLocationButton}
        onPress={centerOnUserLocation}
      >
        <LinearGradient
          colors={['#4CAF50', '#4CAF50']}
          style={styles.gradientButton}
        >
          <AntDesign name="home" size={22} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>

      {/* Redesigned Bottom Sheet */}
      <Animated.View
        style={[
          styles.persistentBottomSheet,
          {
            height: bottomSheetAnimatedHeight,
            opacity: isMapDragging && !showCategoryResults ? 0.8 : 1
          }
        ]}
      >
        <LinearGradient
          colors={['#FFFFFF', '#FAFAFA']}
          style={styles.bottomSheetContent}
        >
          {/* Location Display at Top Right */}
          <View style={styles.locationHeader}>
            <Text style={styles.locationText}>{locationName}</Text>
          </View>

          {showCategoryResults ? (
            // Category results view
            <View style={styles.categoryResultsContainer}>
              <View style={styles.categoryResultsHeader}>
                <TouchableOpacity onPress={handleBackFromCategory} style={styles.backButton}>
                  <Ionicons name="arrow-back" size={24} color="#212121" />
                </TouchableOpacity>
                <Text style={styles.categoryResultsTitle}>
                  {selectedCategory} Shops
                </Text>
              </View>

              <ScrollView style={styles.categoryResultsList}>
                {filteredShops.length > 0 ? (
                  filteredShops.map((shop) => (
                    <TouchableOpacity
                      key={shop.id}
                      style={styles.categoryShopItem}
                      onPress={() => handleCategoryShopPress(shop)}
                    >
                      <View style={styles.categoryShopInfo}>
                        <Text style={styles.categoryShopName}>{shop.name}</Text>
                        <Text style={styles.categoryShopStreet}>{shop.street}</Text>
                        <View style={styles.categoryShopDetails}>
                          <View style={styles.shopDetailItem}>
                            <Ionicons name="time-outline" size={14} color="#757575" />
                            <Text style={styles.shopDetailText}>{shop.time}</Text>
                          </View>
                          <View style={styles.shopDetailItem}>
                            <Ionicons name="location-outline" size={14} color="#757575" />
                            <Text style={styles.shopDetailText}>{shop.distance}</Text>
                          </View>
                          <View style={styles.shopDetailItem}>
                            <Ionicons name="star" size={14} color="#FF9800" />
                            <Text style={styles.shopDetailText}>{shop.rating}</Text>
                          </View>
                        </View>
                      </View>
                      <LinearGradient
                        colors={['#4CAF50', '#388E3C']}
                        style={styles.viewDetailsButton}
                      >
                        <Text style={styles.viewDetailsText}>View</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  ))
                ) : (
                  <View style={styles.noResultsContainer}>
                    <Text style={styles.noResultsText}>No shops found for this category</Text>
                  </View>
                )}
              </ScrollView>
            </View>
          ) : selectedShop ? (
            // Selected shop details with improved UI
            <View style={styles.bottomSheetBody}>
              <Text style={styles.appTitle}>MeatMart</Text>
              <View style={styles.shopInfoContainer}>
                <View style={styles.shopNameContainer}>
                  <Text style={styles.shopName}>{selectedShop.name}</Text>
                  <View style={styles.shopInfoRow}>
                    <Ionicons name="time-outline" size={14} color="#757575" style={styles.infoIcon} />
                    <Text style={styles.shopInfo}>{selectedShop.time}</Text>
                    <View style={styles.infoDot} />
                    <Ionicons name="location-outline" size={14} color="#757575" style={styles.infoIcon} />
                    <Text style={styles.shopInfo}>{selectedShop.distance}</Text>
                  </View>
                </View>

                <View style={styles.ratingContainer}>
                  <Text style={styles.ratingText}>{selectedShop.rating}</Text>
                  <Ionicons name="star" size={12} color="#FF9800" />
                </View>
              </View>

              <View style={styles.categoryContainer}>
                {selectedShop.category.map((cat, index) => (
                  <View key={index} style={styles.categoryCard}>
                    <Text style={styles.categoryCardText}>{cat}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.actionButtonsContainer}>
                <TouchableOpacity
                  style={styles.viewShopButton}
                  onPress={() => navigateToShopDetails(selectedShop)}
                >
                  <Text style={styles.viewShopText}>Visit Shop</Text>
                  <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                </TouchableOpacity>
            
                <TouchableOpacity style={styles.navigateButton}>
                  <Ionicons name="navigate" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            // Welcome screen
            <View style={styles.welcomeContainer}>
              <Text style={styles.appTitle}>MeatMart</Text>
              <View style={styles.greetingContainer}>
                <Text style={styles.greetingText}>{greeting}, {"Nishant"}</Text>
                <Animated.Text style={[styles.welcomeText, { opacity: textOpacity }]}>
                  {welcomeMessages[currentTextIndex]}
                </Animated.Text>
              </View>
              
         
              
              <View style={styles.couponFavouriteBtnContainer}>

              <TouchableOpacity
                style={styles.couponButton}
                onPress={()=>navigation.navigate("SignIn")}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={["#FF9800", "#FF6D00"]}
                  style={styles.couponGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.couponButtonText}>MM-Coupon</Text>
                  {/* <Ionicons name="gift" size={20} color="#FFFFFF" /> */}
                  <LottieView
                    source={require('../../assets/animations/Vcz85GgKLp.json')}
                    autoPlay
                    loop
                    style={{ width: 100, height: 100, position: 'absolute', right: 0, bottom: -15 }}
                  />
                </LinearGradient>
              </TouchableOpacity>


            {/* favourite button */}
              <TouchableOpacity style={styles.favouriteButton}>
                <Fontisto name="favorite" size={24} color="#4CAF50" />
              </TouchableOpacity>
              </View>


              <View style={styles.categoriesScrollContainer}>
                <Text style={styles.categoriesTitle}>Select categories</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.categoriesScroll}
                >
                  {Object.entries(categoryIcons).map(([category], index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.categoryCard}
                      onPress={() => handleCategoryPress(category)}
                    >
                      <Text style={styles.categoryCardText}>{category}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          )}
        </LinearGradient>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    zIndex: 10,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
  appTitle: {
    fontSize: 22,
    fontFamily: 'montserrat_bold',
    color: '#4CAF50',
    marginBottom: 10,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
  currentLocationButton: {
    position: 'absolute',
    bottom: Dimensions.get('window').height * 0.4 + 20,
    right: 20,
    zIndex: 10,
  },
  gradientButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  marker: {
    width: 50,
    height: 50,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    elevation: 8,
  },
  markerPointer: {
    width: 14,
    height: 14,
    backgroundColor: '#FF6D00',
    transform: [{ rotate: '45deg' }],
    marginTop: -7,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#fff',
  },
  markerText: {
    paddingHorizontal: 10,
    paddingBottom: 4,
    color: '#212121',
    fontWeight: 'bold',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 5,
    marginTop: 4,
  },
  persistentBottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4.65,
    elevation: 8,
  },
  bottomSheetContent: {
    flex: 1,
    padding: 20,
  },
  locationHeader: {
    position: 'absolute',
    top: 10,
    right: 20,
    zIndex: 2,
  },
  locationText: {
    fontFamily: 'poppins_semibold',
    fontSize: 14,
    color: '#4CAF50',
    textAlign: 'right',
  },
  bottomSheetBody: {
    flex: 1,
  },
  shopInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  shopNameContainer: {
    flex: 1,
    marginRight: 12,
  },
  shopName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 6,
  },
  shopInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    marginRight: 4,
  },
  infoDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#757575',
    marginHorizontal: 6,
  },
  shopInfo: {
    fontSize: 14,
    color: '#757575',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF59D',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#212121',
    marginRight: 4,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 16,
    gap: 10,
  },
  categoryTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#C8E6C9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  categoryText: {
    color: '#4CAF50',
    //  -------------------------------------------------------------------------------------------
    fontSize: 13,
    fontWeight: '500',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  viewShopButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 16,
    flex: 1,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  viewShopText: {
    fontSize: 16,
    fontFamily: 'poppins_semibold',
    color: '#FFFFFF',
    marginRight: 8,
  },
  navigateButton: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: '#FF6D00',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },


  welcomeContainer: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  greetingContainer: {
    marginBottom: 12,
  },
  greetingText: {
    fontSize: 18,
    fontFamily: 'poppins_bold',
    color: '#212121',
  },
  welcomeText: {
    fontSize: 16,
    fontFamily: 'pacifico',
    color: '#757575',
  },
  categoriesScrollContainer: {
    marginTop: 20,
  },
  categoriesTitle: {
    fontSize: 18,
    fontFamily: 'poppins_semibold',
    color: '#212121',
    marginBottom: 12,
  },
  categoriesScroll: {
    paddingRight: 20,
  },
  categoryCard: {
    alignItems: 'center',
    marginRight: 16,
    width: 80,
  },
  categoryCardText: {
    fontSize: 14,
    fontFamily: 'pacifico',
    color: '#212121',
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    // backgroundColor: '#C8E6C9',
  },

  // Category results styles
  categoryResultsContainer: {
    flex: 1,
  },
  categoryResultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    marginRight: 16,
  },
  categoryResultsTitle: {
    fontSize: 20,
    fontFamily: 'montserrat_semibold',
    color: '#4CAF50',
  },
  categoryResultsList: {
    flex: 1,
  },
  categoryShopItem: {
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryShopInfo: {
    flex: 1,
  },
  categoryShopName: {
    fontSize: 18,
    fontFamily: 'poppins_semibold',
    color: '#212121',
    marginBottom: 4,
  },
  categoryShopStreet: {
    fontSize: 14,
    fontFamily: 'poppins_regular',
    color: '#757575',
    marginBottom: 8,
  },
  categoryShopDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  shopDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
  },
  shopDetailText: {
    fontSize: 14,
    color: '#757575',
    marginLeft: 4,
  },
  viewDetailsButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  viewDetailsText: {
    color: '#FFFFFF',
    fontFamily: 'poppins_semibold',
  },
  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  noResultsText: {
    fontSize: 16,
    fontFamily: 'poppins_regular',
    color: '#757575',
    textAlign: 'center',
  },
  couponButton: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
    width: '80%',
  },
  couponGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  couponButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginRight: 8,
  },
  couponFavouriteBtnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  favouriteButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
    borderWidth: 1,
  },
});

export default Home;