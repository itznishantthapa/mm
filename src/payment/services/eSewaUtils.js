import CryptoJS from 'crypto-js';

// Secret key for UAT (testing) environment
const SECRET_KEY = '8gBm/:&EnhH.1/q';

// eSewa API URLs
export const ESEWA_EPAY_URL = 'https://rc-epay.esewa.com.np/api/epay/main/v2/form';
export const ESEWA_STATUS_URL = 'https://rc.esewa.com.np/api/epay/transaction/status/';

// Product code for testing
export const PRODUCT_CODE = 'EPAYTEST';

/**
 * Generate HMAC SHA256 signature for eSewa payment
 * @param {string} totalAmount - Total payment amount
 * @param {string} transactionUuid - Unique transaction ID
 * @param {string} productCode - Product code provided by eSewa
 * @returns {string} - Base64 encoded HMAC signature
 */
export const generateSignature = (totalAmount, transactionUuid, productCode) => {
  // The input string should be:
  // "total_amount=100,transaction_uuid=11-201-13,product_code=EPAYTEST"
  const inputString = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${productCode}`;
  
  // Generate HMAC SHA256 hash and convert to Base64
  const hash = CryptoJS.HmacSHA256(inputString, SECRET_KEY);
  const hashInBase64 = CryptoJS.enc.Base64.stringify(hash);
  
  return hashInBase64;
};

/**
 * Generate a unique transaction ID
 * @returns {string} - Transaction UUID in format YYMMDD-HHMMSS
 */
export const generateTransactionUuid = () => {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  return `${year}${month}${day}-${hours}${minutes}${seconds}`;
};

/**
 * Verify the signature from eSewa response
 * @param {Object} response - Response from eSewa
 * @returns {boolean} - Whether the signature is valid
 */
export const verifySignature = (response) => {
  const { 
    transaction_code, 
    status, 
    total_amount, 
    transaction_uuid, 
    product_code, 
    signed_field_names,
    signature 
  } = response;
  
  // Get the fields to sign from signed_field_names
  const fieldsToSign = signed_field_names.split(',');
  
  // Create input string for signature verification
  const inputString = fieldsToSign.map(field => `${field}=${response[field]}`).join(',');
  
  // Generate signature
  const hash = CryptoJS.HmacSHA256(inputString, SECRET_KEY);
  const calculatedSignature = CryptoJS.enc.Base64.stringify(hash);
  
  // Compare signatures
  return signature === calculatedSignature;
};

/**
 * Create HTML form for eSewa payment
 * @param {Object} paymentDetails - Payment details
 * @returns {string} - HTML form for eSewa payment
 */
export const createEsewaPaymentForm = (paymentDetails) => {
  const {
    amount,
    taxAmount,
    totalAmount,
    transactionUuid,
    productServiceCharge,
    productDeliveryCharge,
    successUrl,
    failureUrl
  } = paymentDetails;
  
  // Generate signature
  const signature = generateSignature(totalAmount, transactionUuid, PRODUCT_CODE);
  
  // Create HTML form
  return `
    <html>
      <head>
        <title>eSewa Payment</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: 'Arial', sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-color: #f7f9fc;
            flex-direction: column;
          }
          .loader {
            border: 5px solid #f3f3f3;
            border-radius: 50%;
            border-top: 5px solid #4CAF50;
            width: 50px;
            height: 50px;
            animation: spin 1s linear infinite;
            margin-bottom: 20px;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          h2 {
            color: #333;
            margin-bottom: 10px;
          }
          p {
            color: #666;
          }
        </style>
      </head>
      <body onload="document.eSewaForm.submit()">
        <form name="eSewaForm" action="${ESEWA_EPAY_URL}" method="POST">
          <input type="hidden" name="amount" value="${amount}">
          <input type="hidden" name="tax_amount" value="${taxAmount}">
          <input type="hidden" name="total_amount" value="${totalAmount}">
          <input type="hidden" name="transaction_uuid" value="${transactionUuid}">
          <input type="hidden" name="product_code" value="${PRODUCT_CODE}">
          <input type="hidden" name="product_service_charge" value="${productServiceCharge}">
          <input type="hidden" name="product_delivery_charge" value="${productDeliveryCharge}">
          <input type="hidden" name="success_url" value="${successUrl}">
          <input type="hidden" name="failure_url" value="${failureUrl}">
          <input type="hidden" name="signed_field_names" value="total_amount,transaction_uuid,product_code">
          <input type="hidden" name="signature" value="${signature}">
        </form>
        <div class="loader"></div>
        <h2>Redirecting to eSewa Payment...</h2>
        <p>Please wait while we connect you to eSewa.</p>
      </body>
    </html>
  `;
};

/**
 * Check payment status
 * @param {string} productCode - Product code
 * @param {string} transactionUuid - Transaction UUID
 * @param {string} totalAmount - Total amount
 * @returns {Promise} - Promise that resolves to payment status
 */
export const checkPaymentStatus = async (productCode, transactionUuid, totalAmount) => {
  try {
    const url = `${ESEWA_STATUS_URL}?product_code=${productCode}&total_amount=${totalAmount}&transaction_uuid=${transactionUuid}`;
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.error('Error checking payment status:', error);
    throw error;
  }
};