import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { checkPaymentStatus, PRODUCT_CODE, verifySignature } from '../services/eSewaUtils';
import { AppContext } from '../../../context/AppContext';

const PaymentSuccessScreen = ({ route, navigation }) => {
  const { isDarkMode } = useContext(AppContext);
  const { packageDetails, transactionUuid, responseData } = route.params;
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);

  useEffect(() => {
    // Log the response data for debugging
    console.log('Response data in success screen:', responseData);
    
    // Verify the signature from the response if available
    let isSignatureValid = false;
    if (responseData && responseData.signature) {
      try {
        isSignatureValid = verifySignature(responseData);
        console.log('Signature verification result:', isSignatureValid);
      } catch (error) {
        console.error('Error verifying signature:', error);
      }
    }
    setVerificationResult(isSignatureValid);

    // Check payment status from eSewa API
    const verifyPayment = async () => {
      try {
        const totalAmount = responseData?.total_amount || packageDetails.price.toString();
        console.log('Checking payment status with:', {
          productCode: PRODUCT_CODE,
          transactionUuid,
          totalAmount
        });
        
        const status = await checkPaymentStatus(
          PRODUCT_CODE,
          transactionUuid,
          totalAmount
        );
        console.log('Payment status response:', status);
        setPaymentStatus(status);
      } catch (error) {
        console.error('Error checking payment status:', error);
        // Use response data as fallback if API call fails
        setPaymentStatus(responseData || { status: 'UNKNOWN' });
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [packageDetails, transactionUuid, responseData]);

  const handleBackToHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };

  if (loading) {
    return (
      <LinearGradient
        colors={isDarkMode ? ['#121212', '#121212', '#121212'] : ['#E8F5E9', '#C8E6C9', '#E8F5E9']}
        style={styles.loadingContainer}
      >
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={[styles.loadingText, {color: isDarkMode ? '#FFFFFF' : '#212121'}]}>
          Verifying your payment...
        </Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={isDarkMode ? ['#121212', '#121212', '#121212'] : ['#E8F5E9', '#C8E6C9', '#E8F5E9']}
      style={styles.container}
    >
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={isDarkMode ? "#121212" : "#E8F5E9"} />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <View style={styles.successIconContainer}>
            <Ionicons name="checkmark" size={50} color="#FFFFFF" />
          </View>
          
          <Text style={[styles.title, {color: isDarkMode ? '#FFFFFF' : '#212121'}]}>
            Payment Successful!
          </Text>
          <Text style={[styles.subtitle, {color: isDarkMode ? '#B0BEC5' : '#424242'}]}>
            Your premium subscription has been activated successfully.
          </Text>
          
          <View style={[
            styles.card, 
            {backgroundColor: isDarkMode ? 'rgba(42, 42, 42, 0.7)' : 'rgba(255, 255, 255, 0.7)'}
          ]}>
            <Text style={[styles.cardTitle, {color: isDarkMode ? '#FFFFFF' : '#212121'}]}>
              Transaction Details
            </Text>
            
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, {color: isDarkMode ? '#B0BEC5' : '#757575'}]}>
                Status:
              </Text>
              <Text style={[
                styles.detailValue, 
                { color: paymentStatus?.status === 'COMPLETE' ? '#4CAF50' : '#f0ad4e' }
              ]}>
                {paymentStatus?.status || 'COMPLETE'}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, {color: isDarkMode ? '#B0BEC5' : '#757575'}]}>
                Transaction ID:
              </Text>
              <Text style={[styles.detailValue, {color: isDarkMode ? '#FFFFFF' : '#212121'}]}>
                {transactionUuid}
              </Text>
            </View>
            
            {paymentStatus?.ref_id && (
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, {color: isDarkMode ? '#B0BEC5' : '#757575'}]}>
                  Reference ID:
                </Text>
                <Text style={[styles.detailValue, {color: isDarkMode ? '#FFFFFF' : '#212121'}]}>
                  {paymentStatus.ref_id}
                </Text>
              </View>
            )}
            
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, {color: isDarkMode ? '#B0BEC5' : '#757575'}]}>
                Amount:
              </Text>
              <Text style={[styles.detailValue, {color: isDarkMode ? '#FFFFFF' : '#212121'}]}>
                NPR {(paymentStatus?.total_amount || packageDetails.price)}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, {color: isDarkMode ? '#B0BEC5' : '#757575'}]}>
                Package:
              </Text>
              <Text style={[styles.detailValue, {color: isDarkMode ? '#FFFFFF' : '#212121'}]}>
                {packageDetails.name}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, {color: isDarkMode ? '#B0BEC5' : '#757575'}]}>
                Verification:
              </Text>
              <Text style={[
                styles.detailValue, 
                { color: verificationResult ? '#4CAF50' : '#ff5252' }
              ]}>
                {verificationResult ? 'Successful' : 'Pending'}
              </Text>
            </View>
          </View>
          
          <View style={styles.messageCard}>
            <Text style={styles.messageTitle}>
              Your Premium Benefits:
            </Text>
            {packageDetails.features.map((feature, index) => (
              feature.included && (
                <View key={index} style={styles.messageItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                  <Text style={styles.messageItemText}>{feature.text}</Text>
                </View>
              )
            ))}
          </View>
          
          <TouchableOpacity 
            style={styles.button} 
            onPress={handleBackToHome}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Continue to App</Text>
          </TouchableOpacity>
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
  contentContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  successIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
  },
  card: {
    borderRadius: 16,
    padding: 20,
    width: '100%',
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  detailLabel: {
    fontSize: 16,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  messageCard: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    marginBottom: 30,
  },
  messageTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 10,
  },
  messageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  messageItemText: {
    fontSize: 14,
    color: '#4CAF50',
    marginLeft: 8,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 12,
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default PaymentSuccessScreen;