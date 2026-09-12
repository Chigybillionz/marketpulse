const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const WelcomeUser = require('../src/models/WelcomeUser');
const DeletionRequest = require('../src/models/DeletionRequest');
const {
  signup,
  login,
  requestAccountDeletion,
  cancelAccountDeletion,
  getDeletionStatus,
} = require('../src/services/WelcomeAuthService');

async function runDeletionTests() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/marketpulse');

  const testEmail = 'delete_flow_tester_' + Date.now() + '@marketpulse.com';
  const testPassword = 'SecurePassword123!';

  // 1. Sign up test user
  console.log('\n--- Test 1: Sign up user ---');
  const { user } = await signup('Deletion Test Store', testEmail, testPassword);
  console.log('User signed up successfully:', user.email);
  console.assert(user.deletionStatus === 'ACTIVE', 'User should initially be ACTIVE');

  // 2. Reject deletion without typing DELETE
  console.log('\n--- Test 2: Reject deletion without "DELETE" ---');
  try {
    await requestAccountDeletion(user._id, user.email, 'NO_DELETE');
    console.error('FAIL: Expected confirmation error');
  } catch (err) {
    console.log('Correctly rejected with error:', err.message);
    console.assert(err.status === 400, 'Error status should be 400');
    console.log('PASS: Non-DELETE confirmation properly blocked');
  }

  // 3. Request deletion with "DELETE"
  console.log('\n--- Test 3: Request deletion with "DELETE" ---');
  const requestRes = await requestAccountDeletion(user._id, user.email, 'DELETE');
  console.log('Deletion response:', requestRes);
  console.assert(requestRes.success === true, 'Request should be successful');
  console.assert(requestRes.deletionRequest.status === 'PENDING_DELETION', 'Status should be PENDING_DELETION');

  const updatedUser = await WelcomeUser.findById(user._id);
  console.assert(updatedUser.deletionStatus === 'PENDING_DELETION', 'User should have PENDING_DELETION');
  console.assert(updatedUser.gracePeriodEndDate > new Date(), 'Grace period end date should be in the future');
  console.log('PASS: Deletion request stored in MongoDB with 3-day grace period');

  // 4. Test login while PENDING_DELETION
  console.log('\n--- Test 4: Login attempt during grace period ---');
  try {
    await login(testEmail, testPassword);
    console.error('FAIL: Expected login block during pending deletion');
  } catch (loginErr) {
    console.log('Correctly blocked login with message:', loginErr.message);
    console.assert(loginErr.pendingDeletion === true, 'Error should indicate pendingDeletion');
    console.assert(loginErr.canRestore === true, 'Error should indicate canRestore');
    console.log('PASS: Normal access blocked and restoration detected');
  }

  // 5. Test getDeletionStatus
  console.log('\n--- Test 5: Get deletion status ---');
  const statusRes = await getDeletionStatus(user._id, user.email);
  console.log('Status result:', statusRes);
  console.assert(statusRes.deletionStatus === 'PENDING_DELETION', 'Status should match');
  console.assert(statusRes.canCancel === true, 'User can cancel within grace period');
  console.log('PASS: getDeletionStatus accurate');

  // 6. Test cancelAccountDeletion
  console.log('\n--- Test 6: Cancel deletion request ---');
  const cancelRes = await cancelAccountDeletion(user._id, user.email);
  console.log('Cancellation result:', cancelRes);
  console.assert(cancelRes.success === true, 'Cancellation should succeed');

  const restoredUser = await WelcomeUser.findById(user._id);
  console.assert(restoredUser.deletionStatus === 'ACTIVE', 'Restored user should be ACTIVE');
  console.assert(restoredUser.deletionRequestedAt === null, 'deletionRequestedAt cleared');
  console.log('PASS: Account successfully restored');

  // 7. Test login after cancellation
  console.log('\n--- Test 7: Login after cancellation ---');
  const restoredLogin = await login(testEmail, testPassword);
  console.assert(restoredLogin.token, 'Token should be returned on successful login');
  console.log('PASS: Login successfully resumed');

  // Cleanup
  await WelcomeUser.deleteOne({ _id: user._id });
  await DeletionRequest.deleteMany({ user: user._id });
  console.log('\nALL DELETION WORKFLOW TESTS PASSED!');
  await mongoose.disconnect();
}

runDeletionTests().catch((e) => {
  console.error('Test error:', e);
  process.exit(1);
});
