const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
app.use(express.json());

// Function to get OAuth token
const getOAuthToken = async () => {
  const { CONSUMER_KEY, CONSUMER_SECRET } = process.env;
  const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');

  try {
    const response = await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });
    return response.data.access_token;
  } catch (error) {
    console.error('Error getting OAuth token:', error);
    throw new Error('Could not authenticate');
  }
};

// Function to initiate STK Push
const stkPush = async (phone, amount) => {
  const token = await getOAuthToken();
  const { SHORTCODE, PASSKEY, CALLBACK_URL } = process.env;
  const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
  const password = Buffer.from(`${SHORTCODE}${PASSKEY}${timestamp}`).toString('base64');

  const data = {
    BusinessShortCode: SHORTCODE,
    Password: password,
    Timestamp: timestamp,
    TransactionType: 'CustomerPayBillOnline',
    Amount: amount,
    PartyA: phone, // Customer's phone number
    PartyB: SHORTCODE, // Your business short code
    PhoneNumber: phone, // Customer's phone number again
    CallBackURL: CALLBACK_URL,
    AccountReference: 'Ref12345',
    TransactionDesc: 'Payment Description',
  };

  try {
    const response = await axios.post('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error initiating STK Push:', error.response.data);
    throw new Error('STK Push failed');
  }
};

// Route to handle STK push request
app.post('/api/stkpush', async (req, res) => {
  const { phone, amount } = req.body;
  try {
    const response = await stkPush(phone, amount);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: 'Payment failed', error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
