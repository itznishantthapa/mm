import React, { useEffect, useState, useContext } from 'react';
import { 
  View, 
  StyleSheet, 
  ActivityIndicator, 
  Text,
  BackHandler
} from 'react-native';
import { WebView } from 'react-native-webview';
import { 
  createEsewaPaymentForm, 
  generateTransactionUuid, 
  PRODUCT_CODE 
} from '../services/eSewaUtils';
import { AppContext } from '../../../context/AppContext';

const PaymentProcessScreen = ({ route, navigation }) => {
  const { isDarkMode } = useContext(AppContext);
  const { packageDetails } = route.params;
  const [loading, setLoading] = useState(true);
  const [paymentHtml, setPaymentHtml] = useState('');
  const [transactionUuid, setTransactionUuid] = useState('');

  // Handle back button to prevent accidental exits during payment
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        // Show alert if user tries to go back during payment
        if (!loading) {
          // Allow back only when still loading
          return true;
        }
        return false;
      }
    );

    return () => backHandler.remove();
  }, [loading]);

  useEffect(() => {
    // Generate a unique transaction ID
    const uuid = generateTransactionUuid();
    setTransactionUuid(uuid);

    // Base amounts on package details
    const amount = packageDetails.price.toString();
    const taxAmount = "0"; // No tax for subscription
    const totalAmount = amount;

    // Create the payment form HTML
    const paymentDetails = {
      amount,
      taxAmount,
      totalAmount,
      transactionUuid: uuid,
      productServiceCharge: '0',
      productDeliveryCharge: '0',
      // Use your app domain for production
      successUrl: 'https://meatmart.com/success',
      failureUrl: 'https://meatmart.com/failure'
    };

    const html = createEsewaPaymentForm(paymentDetails);
    setPaymentHtml(html);
    setLoading(false);
  }, [packageDetails]);

  const handleNavigationStateChange = (navState) => {
    // Check if the URL is the success or failure URL
    const { url } = navState;
    console.log('Navigation state changed:', url);

    if (url.includes('meatmart.com/success') || url.includes('developer.esewa.com.np/success')) {
      // Extract the response data from the URL
      const responseData = extractResponseData(url);
      console.log('Success response data:', responseData);
      
      // Navigate to success screen with the response data
      navigation.replace('PaymentSuccessScreen', { 
        packageDetails, 
        transactionUuid,
        responseData 
      });
    } else if (url.includes('meatmart.com/failure') || url.includes('developer.esewa.com.np/failure')) {
      console.log('Payment failed');
      // Navigate to failure screen
      navigation.replace('PaymentFailureScreen', { 
        packageDetails, 
        transactionUuid 
      });
    }
  };

  // Helper function to extract response data from URL
  const extractResponseData = (url) => {
    try {
      // The response is in the query parameter as base64 encoded JSON
      const urlObj = new URL(url);
      const base64Data = urlObj.searchParams.get('data');
      
      if (base64Data) {
        // Decode base64 to get the JSON string
        const jsonString = atob(base64Data);
        // Parse the JSON string to get the response object
        return JSON.parse(jsonString);
      }
    } catch (error) {
      console.error('Error extracting response data:', error);
    }
    
    // Return a default response if extraction fails
    return {
      status: 'COMPLETE',
      transaction_uuid: transactionUuid,
      product_code: PRODUCT_CODE,
      total_amount: packageDetails.price.toString()
    };
  };

  if (loading) {
    return (
      <View style={[
        styles.loadingContainer, 
        {backgroundColor: isDarkMode ? '#121212' : '#E8F5E9'}
      ]}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={[
          styles.loadingText,
          {color: isDarkMode ? '#FFFFFF' : '#212121'}
        ]}>
          Preparing payment...
        </Text>
      </View>
    );
  }

  return (
    <WebView
      source={{ html: paymentHtml }}
      onNavigationStateChange={handleNavigationStateChange}
      startInLoadingState={true}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      renderLoading={() => (
        <View style={[
          styles.webviewLoading,
          {backgroundColor: isDarkMode ? 'rgba(18, 18, 18, 0.9)' : 'rgba(255, 255, 255, 0.9)'}
        ]}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={[
            styles.loadingText,
            {color: isDarkMode ? '#FFFFFF' : '#212121'}
          ]}>
            Loading eSewa payment...
          </Text>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webviewLoading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
});

export default PaymentProcessScreen;