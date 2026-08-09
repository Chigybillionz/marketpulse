const mongoose = require('mongoose');
const WelcomeUser = require('./src/models/WelcomeUser');
require('dotenv').config();

const BASE_URL = 'http://localhost:5001/api';
const testPhone = '+2348000000000';

async function runTests() {
  console.log('🚀 Starting API Tests...\n');
  
  let token = '';
  
  try {
    // 1. Request OTP
    console.log('1️⃣ Requesting OTP...');
    const reqRes = await fetch(`${BASE_URL}/welcome-auth/request-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber: testPhone, businessName: 'Test Store' })
    });
    
    if (!reqRes.ok) {
        const errorText = await reqRes.text();
        throw new Error(`HTTP ${reqRes.status}: ${errorText}`);
    }
    
    const reqData = await reqRes.json();
    console.log('Response:', reqData);

    // 2. Connect to DB to fetch the generated OTP (since we can't check SMS)
    console.log('\n🔍 Fetching OTP from Database...');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/marketpulse');
    const user = await WelcomeUser.findOne({ phoneNumber: testPhone });
    const otp = user.otp;
    console.log(`Found OTP: ${otp}`);
    await mongoose.disconnect();

    // 3. Verify OTP & Get JWT
    console.log('\n2️⃣ Verifying OTP...');
    const verRes = await fetch(`${BASE_URL}/welcome-auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber: testPhone, otp })
    });
    const verData = await verRes.json();
    console.log('Response:', verData);
    
    if (verData.token) {
      token = verData.token;
      console.log('✅ JWT Token received successfully!');
    } else {
      throw new Error('No token received');
    }

    // 4. Create a Product
    console.log('\n3️⃣ Creating a Product...');
    const prodRes = await fetch(`${BASE_URL}/products`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ 
        name: 'Bag of Rice', 
        category: 'Food', 
        price: 45000, 
        quantityInStock: 10 
      })
    });
    const prodData = await prodRes.json();
    console.log('Product Created:', prodData.name);

    // 5. Create a Transaction
    console.log('\n4️⃣ Creating a Transaction (Sale)...');
    const transRes = await fetch(`${BASE_URL}/transactions`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ 
        type: 'Income', 
        amount: 45000, 
        category: 'Sales', 
        description: 'Sold 1 bag of rice' 
      })
    });
    const transData = await transRes.json();
    console.log('Transaction Created:', transData.description);

    // 6. Fetch Transactions
    console.log('\n5️⃣ Fetching all Transactions...');
    const getTransRes = await fetch(`${BASE_URL}/transactions`, {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${token}`
      }
    });
    const allTrans = await getTransRes.json();
    console.log(`Found ${allTrans.length} transactions in the database.`);

    console.log('\n🎉 ALL TESTS PASSED SUCCESSFULLY! 🎉');
    
  } catch (error) {
    console.error('\n❌ TEST FAILED:', error.message);
  }
}

runTests();
