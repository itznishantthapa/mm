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
import { checkPaymentStatus, PRODUCT_CODE } from '../services/eSewaUtils';
import { AppContext } from '../../../context/AppContext';

const PaymentFailureScreen = ({ route, navigation }) => {
  const { isDarkMode } = useContext(AppContext);
  const { packageDetails, transactionUuid } = route.params;
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    console.log('Payment failure screen - Transaction UUID:', transactionUuid);
    
    // Check payment status from eSewa API to confirm failure
    const verifyPayment = async () => {
      try {
        const totalAmount = packageDetails.price.toString();
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
        
        if (status.code && status.message) {
          // This is an error response
          setErrorMessage(status.message);
          setPaymentStatus({ status: 'FAILED' });
        } else {
          setPaymentStatus(status);
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
        setErrorMessage('Could not verify payment status');
        setPaymentStatus({ status: 'NOT_FOUND' });
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [packageDetails, transactionUuid]);

  const handleTryAgain = () => {
    // Navigate back to payment selection to try again
    navigation.navigate('PaymentSelection', { packageDetails });
  };

  const handleBackToHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ 
        name: 'DrawerNavigator',
        params: {
          screen: 'Home'
        }
      }],
    });
  };

  if (loading) {
    return (
      <LinearGradient
        colors={isDarkMode ? ['#121212', '#121212', '#121212'] : ['#E8F5E9', '#C8E6C9', '#E8F5E9']}
        style={styles.loadingContainer}
      >
        <ActivityIndicator size="large" color="#FF5252" />
        <Text style={[styles.loadingText, {color: isDarkMode ? '#FFFFFF' : '#212121'}]}>
          Checking payment status...
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
          <View style={styles.failureIconContainer}>
            <Ionicons name="close" size={50} color="#FFFFFF" />
          </View>
          
          <Text style={[styles.title, {color: isDarkMode ? '#FFFFFF' : '#212121'}]}>
            Payment Failed
          </Text>
          <Text style={[styles.subtitle, {color: isDarkMode ? '#B0BEC5' : '#424242'}]}>
            Your payment for {packageDetails.name} package could not be processed.
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
              <Text style={[styles.detailValue, { color: '#FF5252' }]}>
                {paymentStatus?.status || 'FAILED'}
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
            
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, {color: isDarkMode ? '#B0BEC5' : '#757575'}]}>
                Amount:
              </Text>
              <Text style={[styles.detailValue, {color: isDarkMode ? '#FFFFFF' : '#212121'}]}>
                NPR {packageDetails.price}
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
            
            {errorMessage && (
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, {color: isDarkMode ? '#B0BEC5' : '#757575'}]}>
                  Error:
                </Text>
                <Text style={[styles.detailValue, { color: '#FF5252' }]}>
                  {errorMessage}
                </Text>
              </View>
            )}
          </View>
          
          <View style={styles.messageCard}>
            <Text style={styles.messageTitle}>
              Possible Reasons for Failure:
            </Text>
            <View style={styles.messageItem}>
              <Ionicons name="information-circle" size={16} color="#FF5252" />
              <Text style={styles.messageItemText}>Insufficient balance in eSewa account</Text>
            </View>
            <View style={styles.messageItem}>
              <Ionicons name="information-circle" size={16} color="#FF5252" />
              <Text style={styles.messageItemText}>Transaction timed out</Text>
            </View>
            <View style={styles.messageItem}>
              <Ionicons name="information-circle" size={16} color="#FF5252" />
              <Text style={styles.messageItemText}>Payment was cancelled</Text>
            </View>
            <View style={styles.messageItem}>
              <Ionicons name="information-circle" size={16} color="#FF5252" />
              <Text style={styles.messageItemText}>Technical issue with eSewa service</Text>
            </View>
          </View>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.tryAgainButton} 
              onPress={handleTryAgain}
              activeOpacity={0.8}
            >
              <Text style={styles.tryAgainButtonText}>Try Again</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.homeButton} 
              onPress={handleBackToHome}
              activeOpacity={0.8}
            >
              <Text style={styles.homeButtonText}>Back to Home</Text>
            </TouchableOpacity>
          </View>
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
  failureIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FF5252',
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
    backgroundColor: 'rgba(255, 82, 82, 0.1)',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    marginBottom: 30,
  },
  messageTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF5252',
    marginBottom: 10,
  },
  messageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  messageItemText: {
    fontSize: 14,
    color: '#FF5252',
    marginLeft: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  tryAgainButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    flex: 1,
    marginRight: 10,
  },
  tryAgainButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  homeButton: {
    backgroundColor: '#757575',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    flex: 1,
    marginLeft: 10,
  },
  homeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default PaymentFailureScreen;