import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from '../../context/AppContext';

const { width } = Dimensions.get('window');

const GetPremium = ({ navigation }) => {
  const { isDarkMode } = useContext(AppContext);
  const [selectedPackage, setSelectedPackage] = useState(2); // Default to middle package

  const packages = [
    {
      id: 1,
      name: 'Location Contact',
      price: 50,
      features: [
        { text: 'View locations on maps', included: true },
        { text: 'Visit shop details', included: false },
        { text: 'Contact shop owners', included: false },
      ],
      description: 'Basic access to view locations only',
    },
    {
      id: 2,
      name: 'Visit Contact',
      price: 75,
      features: [
        { text: 'View locations on maps', included: true },
        { text: 'Visit shop details', included: true },
        { text: 'Contact shop owners', included: false },
      ],
      description: 'Enhanced access to visit shops and view details',
      popular: true,
    },
    {
      id: 3,
      name: 'Contact',
      price: 100,
      features: [
        { text: 'View locations on maps', included: true },
        { text: 'Visit shop details', included: true },
        { text: 'Contact shop owners', included: true },
      ],
      description: 'Full access to all features',
    },
  ];

  const handleSubscribe = () => {
    // Handle subscription logic
    console.log(`Selected package: ${packages[selectedPackage - 1].name}`);
    // Navigate to payment screen or process payment
    navigation.navigate('PaymentSelection', { packageDetails: packages[selectedPackage - 1] });
  };


  return (
    <LinearGradient
      colors={isDarkMode ? ['#121212', '#121212', '#121212'] : ['#E8F5E9', '#C8E6C9', '#E8F5E9']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: isDarkMode ? '#FFFFFF' : '#212121' }]}>Get</Text>
            <Text style={styles.premiumText}>Premium</Text>
            <Text style={[styles.title, { color: isDarkMode ? '#FFFFFF' : '#212121' }]}>Access</Text>
          </View>

          <View style={styles.benefitsContainer}>
            <Text style={[styles.benefitsTitle, { color: isDarkMode ? '#e0e0e0' : '#424242' }]}>With premium you can:</Text>
            <View style={styles.benefitRow}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={[styles.benefitText, { color: isDarkMode ? '#FFFFFF' : '#212121' }]}>Find desired locations on maps</Text>
            </View>
            <View style={styles.benefitRow}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={[styles.benefitText, { color: isDarkMode ? '#FFFFFF' : '#212121' }]}>Visit shops for details and items</Text>
            </View>
            <View style={styles.benefitRow}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={[styles.benefitText, { color: isDarkMode ? '#FFFFFF' : '#212121' }]}>Contact shop owners instantly</Text>
            </View>
          </View>

          <View style={styles.packagesContainer}>
            {packages.map((pkg) => (
              <TouchableOpacity
                key={pkg.id}
                style={[
                  styles.packageCard,
                  { backgroundColor: isDarkMode ? 'rgba(42, 42, 42, 0.7)' : 'rgba(255, 255, 255, 0.7)' },
                  selectedPackage === pkg.id && {
                    borderColor: '#4CAF50',
                    backgroundColor: isDarkMode ? 'rgba(0, 230, 118, 0.1)' : 'rgba(0, 230, 118, 0.1)'
                  },
                  pkg.popular && { borderColor: '#4CAF50' },
                ]}
                onPress={() => setSelectedPackage(pkg.id)}
                activeOpacity={0.8}
              >
                {pkg.popular && (
                  <View style={styles.popularBadge}>
                    <Text style={styles.popularText}>Popular</Text>
                  </View>
                )}
                <View style={styles.packageHeader}>
                  <Text style={[styles.packageName, { color: isDarkMode ? '#FFFFFF' : '#212121' }]}>{pkg.name}</Text>
                  <View style={styles.priceContainer}>
                    <Text style={[styles.currency, { color: isDarkMode ? '#e0e0e0' : '#757575' }]}>NPR</Text>
                    <Text style={[styles.price, { color: isDarkMode ? '#FFFFFF' : '#212121' }]}>{pkg.price}</Text>
                    <Text style={[styles.period, { color: isDarkMode ? '#e0e0e0' : '#757575' }]}>/year</Text>
                  </View>
                </View>
                
                <View style={styles.packageFeatures}>
                  {pkg.features.map((feature, index) => (
                    <View key={index} style={styles.featureRow}>
                      <Ionicons
                        name={feature.included ? "checkmark-circle" : "close-circle"}
                        size={18}
                        color={feature.included ? "#4CAF50" : "#ff5252"}
                      />
                      <Text
                        style={[
                          styles.featureText,
                          { color: isDarkMode ? '#FFFFFF' : '#212121' },
                          !feature.included && { color: isDarkMode ? '#a0a0a0' : '#a0a0a0' },
                        ]}
                      >
                        {feature.text}
                      </Text>
                    </View>
                  ))}
                </View>
                
                <Text style={[styles.packageDescription, { color: isDarkMode ? '#B0BEC5' : '#757575' }]}>
                  {pkg.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={styles.subscribeButton}
            onPress={handleSubscribe}
            activeOpacity={0.8}
          >
            <Text style={styles.subscribeButtonText}>Subscribe Now</Text>
          </TouchableOpacity>

          <Text style={[styles.termsText, { color: isDarkMode ? '#a0a0a0' : '#757575' }]}>
            Automatic renewal. Cancel anytime.
          </Text>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingTop: 40,
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  premiumText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  benefitsContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  benefitsTitle: {
    fontSize: 16,
    color: '#e0e0e0',
    marginBottom: 12,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  benefitText: {
    fontSize: 14,
    color: 'white',
    marginLeft: 8,
  },
  packagesContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  packageCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  selectedPackage: {
    borderColor: '#00e676',
    backgroundColor: 'rgba(0, 230, 118, 0.1)',
  },
  popularPackage: {
    borderColor: '#00e676',
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    right: 20,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularText: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  packageHeader: {
    marginBottom: 16,
  },
  packageName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  currency: {
    fontSize: 16,
    color: '#e0e0e0',
    marginRight: 4,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  period: {
    fontSize: 16,
    color: '#e0e0e0',
    marginLeft: 4,
    marginBottom: 4,
  },
  packageFeatures: {
    marginBottom: 16,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: 'white',
    marginLeft: 8,
  },
  disabledFeature: {
    color: '#a0a0a0',
  },
  packageDescription: {
    fontSize: 12,
    color: '#e0e0e0',
    fontStyle: 'italic',
  },
  subscribeButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 24,
    marginBottom: 16,
  },
  subscribeButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  termsText: {
    textAlign: 'center',
    color: '#a0a0a0',
    fontSize: 12,
    marginBottom: 40,
  },
});

export default GetPremium;