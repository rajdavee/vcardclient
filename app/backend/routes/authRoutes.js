const express = require('express');
const router = express.Router();
const { 
  register, 
  login, 
  forgotPassword, 
  resetPassword, 
  getCurrentUser, 
  getUserPlan, 
  getUserInfo, 
  createVCard, 
  updateVCard, 
  getVCards,
  getVCard,
  getPublicVCard,
  uploadChunk,
  getPublicVCardPreview
} = require('../controllers/authController');
const authenticateJWT = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/getUser', authenticateJWT, getCurrentUser);
router.get('/user-info', authenticateJWT, getUserInfo);
router.get('/user-plan', authenticateJWT, getUserPlan);
router.post('/vcard', authenticateJWT, createVCard);
router.put('/vcard/:vCardId', authenticateJWT, updateVCard);
router.get('/vcard/:vCardId', authenticateJWT, getVCard);
router.get('/vcards', authenticateJWT, getVCards);
router.get('/public-vcard/:vCardId', getPublicVCard);
router.get('/public-vcard-preview/:vCardId', getPublicVCardPreview); 
router.post('/upload-chunk', authenticateJWT, uploadChunk);

module.exports = router;