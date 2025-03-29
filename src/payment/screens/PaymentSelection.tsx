import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Dimensions,
  StatusBar,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { AppContext } from '../../../context/AppContext';

const { width } = Dimensions.get('window');

const PaymentSelection = ({ navigation, route }) => {
  const { isDarkMode } = useContext(AppContext);
  const [selectedPayment, setSelectedPayment] = useState(null);
  
  // Get package details from route params if available
  const packageDetails = route.params?.packageDetails || {
    name: 'Visit Contact',
    price: 75,
    description: 'Enhanced access to visit shops and view details'
  };

  const paymentMethods = [
    {
      id: 'esewa',
      name: 'eSewa',
      logo: require('../../../assets/images/esewa.png'), // Add this image to your assets
      description: 'Pay using eSewa mobile wallet',
      color: '#60BB46',
    },
    {
      id: 'khalti',
      name: 'Khalti',
      logo: require('../../../assets/images/khalti.png'), // Add this image to your assets
      description: 'Pay using Khalti digital wallet',
      color: '#5C2D91',
    }
  ];

  const handlePaymentSelect = (paymentId) => {
    setSelectedPayment(paymentId);
  };

  const handlePaymentProceed = () => {
    if (!selectedPayment) {
      Alert.alert('Select Payment Method', 'Please select a payment method to continue');
      return;
    }
    
    // Handle payment method specific redirection
    console.log(`Proceeding with ${selectedPayment} payment for package: ${packageDetails.name}`);
    
    // Navigate to the appropriate payment processor based on selection
    if (selectedPayment === 'esewa') {
      navigation.navigate('PaymentProcessScreen', { 
        packageDetails,
        paymentMethod: selectedPayment 
      });
    } else if (selectedPayment === 'khalti') {
      // For Khalti, show a "Coming Soon" message for now
      // You can implement Khalti integration later
      Alert.alert(
        'Coming Soon',
        'Khalti payment integration will be available soon.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <LinearGradient
      colors={isDarkMode ? ['#121212', '#121212', '#121212'] : ['#E8F5E9', '#C8E6C9', '#E8F5E9']}
      style={styles.container}
    >
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={isDarkMode ? "#121212" : "#E8F5E9"} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={isDarkMode ? "#FFFFFF" : "#212121"} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: isDarkMode ? "#FFFFFF" : "#212121" }]}>Payment Method</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Order summary */}
          <View style={[styles.summaryContainer, { backgroundColor: isDarkMode ? 'rgba(42, 42, 42, 0.7)' : 'rgba(255, 255, 255, 0.7)' }]}>
            <Text style={[styles.summaryTitle, { color: isDarkMode ? "#FFFFFF" : "#212121" }]}>Order Summary</Text>
            
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: isDarkMode ? "#B0BEC5" : "#757575" }]}>Package</Text>
              <Text style={[styles.summaryValue, { color: isDarkMode ? "#FFFFFF" : "#212121" }]}>{packageDetails.name}</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: isDarkMode ? "#B0BEC5" : "#757575" }]}>Duration</Text>
              <Text style={[styles.summaryValue, { color: isDarkMode ? "#FFFFFF" : "#212121" }]}>1 Year</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: isDarkMode ? "#B0BEC5" : "#757575" }]}>Description</Text>
              <Text style={[styles.summaryValue, { color: isDarkMode ? "#FFFFFF" : "#212121", flex: 1, textAlign: 'right' }]}>
                {packageDetails.description}
              </Text>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.totalRow}>
              <Text style={[styles.totalLabel, { color: isDarkMode ? "#FFFFFF" : "#212121" }]}>Total Amount</Text>
              <View style={styles.priceContainer}>
                <Text style={[styles.currency, { color: isDarkMode ? "#B0BEC5" : "#757575" }]}>NPR</Text>
                <Text style={[styles.totalAmount, { color: "#4CAF50" }]}>{packageDetails.price}</Text>
              </View>
            </View>
          </View>

          <Text style={[styles.sectionTitle, { color: isDarkMode ? "#FFFFFF" : "#212121" }]}>
            Select Payment Method
          </Text>

          {/* Payment methods */}
          <View style={styles.paymentMethodsContainer}>
            {paymentMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.paymentMethodCard,
                  { backgroundColor: isDarkMode ? 'rgba(42, 42, 42, 0.7)' : 'rgba(255, 255, 255, 0.7)' },
                  selectedPayment === method.id && {
                    borderColor: method.color,
                    borderWidth: 2,
                  }
                ]}
                onPress={() => handlePaymentSelect(method.id)}
                activeOpacity={0.8}
              >
                <View style={styles.paymentMethodContent}>
                  <Image
                    source={method.logo}
                    style={styles.paymentLogo}
                    resizeMode="contain"
                  />
                  <View style={styles.paymentMethodInfo}>
                    <Text style={[styles.paymentMethodName, { color: isDarkMode ? "#FFFFFF" : "#212121" }]}>
                      {method.name}
                    </Text>
                    <Text style={[styles.paymentMethodDescription, { color: isDarkMode ? "#B0BEC5" : "#757575" }]}>
                      {method.description}
                    </Text>
                  </View>
                </View>
                
                <View style={[
                  styles.radioButton,
                  selectedPayment === method.id && { borderColor: method.color }
                ]}>
                  {selectedPayment === method.id && (
                    <View style={[styles.radioButtonInner, { backgroundColor: method.color }]} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Security and Information */}
          <View style={styles.securityInfoContainer}>
            <View style={styles.securityRow}>
              <Ionicons name="shield-checkmark" size={20} color="#4CAF50" />
              <Text style={[styles.securityText, { color: isDarkMode ? "#B0BEC5" : "#757575" }]}>
                Your payment information is secure
              </Text>
            </View>
            <View style={styles.securityRow}>
              <Ionicons name="lock-closed" size={20} color="#4CAF50" />
              <Text style={[styles.securityText, { color: isDarkMode ? "#B0BEC5" : "#757575" }]}>
                Transactions are encrypted and protected
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Button */}
        <View style={styles.bottomButtonContainer}>
          <TouchableOpacity
            style={[
              styles.proceedButton,
              !selectedPayment && styles.disabledButton
            ]}
            onPress={handlePaymentProceed}
            disabled={!selectedPayment}
            activeOpacity={0.8}
          >
            <Text style={styles.proceedButtonText}>Proceed to Payment</Text>
            <MaterialIcons name="arrow-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100, // Extra padding for bottom button
  },
  summaryContainer: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.3)',
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(76, 175, 80, 0.3)',
    marginVertical: 16,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  currency: {
    fontSize: 14,
    marginRight: 4,
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  paymentMethodsContainer: {
    marginBottom: 24,
  },
  paymentMethodCard: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  paymentMethodContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentLogo: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 16,
  },
  paymentMethodInfo: {
    flex: 1,
  },
  paymentMethodName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  paymentMethodDescription: {
    fontSize: 14,
  },
  radioButton: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  securityInfoContainer: {
    marginBottom: 24,
  },
  securityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  securityText: {
    fontSize: 14,
    marginLeft: 10,
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'transparent',
  },
  proceedButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: 'rgba(76, 175, 80, 0.4)',
  },
  proceedButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
});

export default PaymentSelection;
