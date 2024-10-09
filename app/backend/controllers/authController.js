const User = require('../models/User');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');

const multer = require('multer');
const fs = require('fs-extra');
const QRCode = require('qrcode');
const vCard = require('vcf');
const ejs = require('ejs');
const path = require('path');
const vCardsJS = require('vcards-js');
const crypto = require('crypto');
const VCardScan = require('../models/VCardScan');
const geoip = require('geoip-lite');



// ----------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------
// ----------------------------{ Vcards functions }-------------------------------------
// ----------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------

function generateVCardString(vCardData) {
  const vCard = vCardsJS();

  // Map the fields from vCardData to the vCard object
  vCardData.fields.forEach(field => {
    switch (field.name) {
      case 'name':
        const nameParts = field.value.split(' ');
        vCard.firstName = nameParts[0];
        vCard.lastName = nameParts.slice(1).join(' ');
        break;
      case 'firstName':
        vCard.firstName = field.value;
        break;
      case 'lastName':
        vCard.lastName = field.value;
        break;
      case 'jobTitle':
        vCard.title = field.value;
        break;
      case 'phone':
        vCard.workPhone = field.value;
        break;
      case 'email':
        vCard.email = field.value;
        break;
      case 'website':
        vCard.url = field.value;
        break;
      case 'address':
        vCard.workAddress.street = field.value;
        break;
      case 'city':
        vCard.workAddress.city = field.value;
        break;
      case 'postalCode':
        vCard.workAddress.postalCode = field.value;
        break;
      case 'workHours':
        vCard.note = `Work Hours: ${field.value}`;
        break;
      case 'alternatePhone':
        vCard.cellPhone = field.value;
        break;
      case 'profileImage':
        if (field.value) {
          vCard.photo.attachFromUrl(field.value);
        }
        break;
    }
  });

  return vCard.getFormattedString();
}

// async function generateAndSaveQRCode(vCardId, user, vCardIndex) {
//   try {
//     const previewUrl = `${process.env.FRONTEND_URL}/preview?vCardId=${vCardId}`;
//     const qrCodeDataUrl = await QRCode.toDataURL(previewUrl);
//     user.vCards[vCardIndex].qrCode = qrCodeDataUrl;
//     await user.save();
//     return qrCodeDataUrl;
//   } catch (error) {
//     console.error('Error generating QR code:', error);
//     throw error;
//   }
// }



async function generateAndSaveQRCode(vCardId, user, vCardIndex) {
  try {
    const scanUrl = `${process.env.BACKEND_URL}/api/auth/scan/${vCardId}`;
    const qrCodeDataUrl = await QRCode.toDataURL(scanUrl);
    user.vCards[vCardIndex].qrCode = qrCodeDataUrl;
    await user.save();
    return qrCodeDataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
}



exports.updateVCard = async (req, res) => {
  try {
    const { userId } = req.user;
    const { vCardId } = req.params;
    const { templateId, fields } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const vCardIndex = user.vCards.findIndex(card => card._id.toString() === vCardId);
    if (vCardIndex === -1) {
      return res.status(404).json({ error: 'vCard not found' });
    }

    user.vCards[vCardIndex].templateId = templateId;
    user.vCards[vCardIndex].fields = fields;

    const vCardString = generateVCardString(user.vCards[vCardIndex]);
    const qrCodeDataUrl = await generateAndSaveQRCode(vCardId, user, vCardIndex);

    await user.save();

    res.json({ 
      message: 'vCard updated successfully',
      vCardString,
      qrCodeDataUrl
    });
  } catch (error) {
    console.error('Error updating vCard:', error);
    res.status(500).json({ error: 'Error updating vCard', details: error.message });
  }
};

exports.getVCards = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).select('vCards');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user.vCards || []);
  } catch (error) {
    console.error('Error fetching vCards:', error);
    res.status(500).json({ error: 'Failed to fetch vCards' });
  }
};

exports.getVCard = async (req, res) => {
  try {
    const { vCardId } = req.params;
    const userId = req.user.userId;
    console.log(`Fetching vCard ${vCardId} for user ${userId}`);

    const user = await User.findOne({ _id: userId, 'vCards._id': vCardId });
    
    if (!user) {
      console.log(`User or vCard not found for userId: ${userId}, vCardId: ${vCardId}`);
      return res.status(404).json({ error: 'vCard not found' });
    }

    const vCard = user.vCards.id(vCardId);
    if (!vCard) {
      console.log(`vCard not found in user document for vCardId: ${vCardId}`);
      return res.status(404).json({ error: 'vCard not found in user document' });
    }

    console.log(`Successfully fetched vCard: ${JSON.stringify(vCard)}`);
    res.json({
      ...vCard.toObject(),
      qrCodeDataUrl: vCard.qrCode
    });
  } catch (error) {
    console.error('Error fetching vCard:', error);
    res.status(500).json({ error: 'Error fetching vCard', details: error.message });
  }
};

exports.getPublicVCard = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Fetching public vCard with id: ${id}`);
    
    const user = await User.findOne({ 'vCards._id': id });
    
    if (!user) {
      console.log(`vCard not found for id: ${id}`);
      return res.status(404).json({ error: 'vCard not found' });
    }

    const vCard = user.vCards.id(id);
    
    if (!vCard) {
      console.log(`vCard not found in user document for id: ${id}`);
      return res.status(404).json({ error: 'vCard not found' });
    }

    console.log(`Successfully fetched public vCard: ${JSON.stringify(vCard)}`);
    res.json({
      ...vCard.toObject(),
      qrCodeDataUrl: vCard.qrCode
    });
  } catch (error) {
    console.error('Error fetching public vCard:', error);
    res.status(500).json({ error: 'Error fetching vCard' });
  }
};

exports.createVCard = async (req, res) => {
  try {
    console.log('CreateVCard function called');
    console.log('Request body:', req.body);
    console.log('Request files:', req.files);

    const userId = req.user.userId;
    let templateId, fields;

    if (req.body.data) {
      try {
        ({ templateId, fields } = JSON.parse(req.body.data));
        console.log('Parsed data:', { templateId, fields });
      } catch (error) {
        console.error('Error parsing JSON data:', error);
        return res.status(400).json({ error: 'Invalid JSON data' });
      }
    } else {
      console.log('No data field found in request body');
      return res.status(400).json({ error: 'Missing data field' });
    }

    // Handle file upload
    if (req.files && req.files.profileImage) {
      const file = req.files.profileImage;
      const fileName = `${Date.now()}-${file.name}`;
      const uploadPath = path.join(__dirname, '..', 'public', 'uploads', fileName);
      await file.mv(uploadPath);
      console.log('File uploaded:', uploadPath);

      // Update the profileImage field with the file path
      const profileImageField = fields.find(field => field.name === 'profileImage');
      if (profileImageField) {
        profileImageField.value = `/uploads/${fileName}`;
      } else {
        fields.push({ name: 'profileImage', value: `/uploads/${fileName}` });
      }
    }

    // Find the user and update their vCards
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const newVCard = { templateId, fields };
    user.vCards.push(newVCard);
    await user.save();

    const vCardId = user.vCards[user.vCards.length - 1]._id;
    const vCardString = generateVCardString(newVCard);
    const qrCodeDataUrl = await generateAndSaveQRCode(vCardId, user, user.vCards.length - 1);

    res.status(201).json({ 
      message: 'vCard created successfully', 
      vCardId: vCardId,
      vCardString: vCardString,
      qrCodeDataUrl: qrCodeDataUrl
    });
  } catch (error) {
    console.error('Error creating vCard:', error);
    res.status(500).json({ error: 'Error creating vCard', details: error.message });
  }
};

exports.uploadChunk = async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  const { chunk } = req.files;
  const { fileName, chunkIndex, totalChunks } = req.body;

  const uploadDir = path.join(__dirname, '..', 'public', 'uploads');
  const chunkDir = path.join(uploadDir, fileName);
  await fs.ensureDir(chunkDir);

  const chunkPath = path.join(chunkDir, `chunk_${chunkIndex}`);
  
  try {
    await chunk.mv(chunkPath);
    
    if (parseInt(chunkIndex) === parseInt(totalChunks) - 1) {
      // All chunks received, start reassembly
      const finalPath = path.join(uploadDir, fileName);
      const writeStream = fs.createWriteStream(finalPath);
      for (let i = 0; i < totalChunks; i++) {
        const chunkData = await fs.readFile(path.join(chunkDir, `chunk_${i}`));
        writeStream.write(chunkData);
      }
      writeStream.end();

      // Clean up chunk files
      await fs.remove(chunkDir);

      res.send({ message: 'File upload completed', filePath: `/uploads/${fileName}` });
    } else {
      res.send('Chunk received');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};
exports.getPublicVCardPreview = async (req, res) => {
  try {
    const { vCardId } = req.params;
    console.log(`Fetching public vCard preview with id: ${vCardId}`);
    
    const user = await User.findOne({ 'vCards._id': vCardId });
    
    if (!user) {
      console.log(`vCard not found for id: ${vCardId}`);
      return res.status(404).json({ error: 'vCard not found' });
    }

    const vCard = user.vCards.id(vCardId);
    
    if (!vCard) {
      console.log(`vCard not found in user document for id: ${vCardId}`);
      return res.status(404).json({ error: 'vCard not found' });
    }

    console.log(`Successfully fetched public vCard for preview: ${JSON.stringify(vCard)}`);

    // Send the vCard data as JSON without the QR code
    res.json({
      templateId: vCard.templateId,
      fields: vCard.fields
    });
  } catch (error) {
    console.error('Error fetching public vCard preview:', error);
    res.status(500).json({ error: 'Error fetching vCard preview', details: error.message });
  }
};



exports.handleQRScan = async (req, res) => {
  try {
    const { vCardId } = req.params;
    let ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];
    
    // Remove IPv6 prefix if present
    ipAddress = ipAddress.replace(/^::ffff:/, '');

    // Perform IP geolocation
    const geo = geoip.lookup(ipAddress);
    
    const scanData = {
      vCardId,
      ipAddress,
      userAgent,
      scanDate: new Date(),
      location: {
        latitude: geo ? geo.ll[0] : null,
        longitude: geo ? geo.ll[1] : null,
        city: geo ? geo.city : 'Unknown',
        country: geo ? geo.country : 'Unknown'
      }
    };

    console.log('Scan data:', JSON.stringify(scanData, null, 2));

    const newScan = new VCardScan(scanData);
    await newScan.save();

    console.log('Saved scan data:', JSON.stringify(newScan, null, 2));

    // Find the user associated with the vCard and update their scan count
    const user = await User.findOne({ 'vCards._id': vCardId });
    if (user) {
      const vCardIndex = user.vCards.findIndex(card => card._id.toString() === vCardId);
      if (vCardIndex !== -1) {
        user.vCards[vCardIndex].scans.push(newScan._id);
        await user.save();
        console.log('Updated user vCard scans:', user.vCards[vCardIndex].scans);
      }
    }

    // Redirect to the vCard preview
    res.redirect(`${process.env.FRONTEND_URL}/preview?vCardId=${vCardId}`);
  } catch (error) {
    console.error('Error handling QR scan:', error);
    res.status(500).json({ error: 'Error handling QR scan', details: error.message });
  }
};

exports.getVCardAnalytics = async (req, res) => {
  try {
    const { vCardId } = req.params;
    
    console.log('Fetching analytics for vCardId:', vCardId);

    // Fetch all scans for this specific vCard
    const scans = await VCardScan.find({ vCardId }).sort({ scanDate: -1 });
    
    console.log('Found scans:', JSON.stringify(scans, null, 2));

    const totalScans = scans.length;
    const recentScans = scans.slice(0, 5).map(scan => ({
      scanDate: scan.scanDate,
      location: {
        city: scan.location.city || 'Unknown',
        country: scan.location.country || 'Unknown'
      }
    }));

    // Process location breakdown
    const locationBreakdown = scans.reduce((acc, scan) => {
      const location = `${scan.location.city || 'Unknown'}, ${scan.location.country || 'Unknown'}`;
      acc[location] = (acc[location] || 0) + 1;
      return acc;
    }, {});

    // Process device breakdown
    const deviceBreakdown = scans.reduce((acc, scan) => {
      const device = scan.userAgent.includes('Mobile') ? 'Mobile' : 'Desktop';
      acc[device] = (acc[device] || 0) + 1;
      return acc;
    }, {});

    const analyticsData = {
      totalScans,
      recentScans,
      locationBreakdown,
      deviceBreakdown
    };

    console.log('Analytics data:', JSON.stringify(analyticsData, null, 2));

    res.json(analyticsData);
  } catch (error) {
    console.error('Error fetching vCard analytics:', error);
    res.status(500).json({ error: 'Error fetching vCard analytics', details: error.message });
  }
};

exports.getVCardScanAnalytics = async (req, res) => {
  try {
    const { vCardId } = req.params;
    const { userId } = req.user;

    // Check if the vCard belongs to the user
    const user = await User.findOne({ _id: userId, 'vCards._id': vCardId });
    if (!user) {
      return res.status(404).json({ error: 'vCard not found or does not belong to the user' });
    }

    const scans = await VCardScan.find({ vCardId }).sort({ scanDate: -1 });

    const analytics = {
      totalScans: scans.length,
      recentScans: scans.slice(0, 10).map(scan => ({
        scanDate: scan.scanDate,
        location: {
          city: scan.location.city || 'Unknown',
          country: scan.location.country || 'Unknown'
        }
      })),
      locationBreakdown: {},
      deviceBreakdown: {}
    };

    scans.forEach(scan => {
      // Location breakdown
      const country = scan.location.country || 'Unknown';
      analytics.locationBreakdown[country] = (analytics.locationBreakdown[country] || 0) + 1;

      // Device breakdown (simplified, you might want to use a proper user-agent parser for better accuracy)
      const device = scan.userAgent.includes('Mobile') ? 'Mobile' : 'Desktop';
      analytics.deviceBreakdown[device] = (analytics.deviceBreakdown[device] || 0) + 1;
    });

    res.json(analytics);
  } catch (error) {
    console.error('Error fetching vCard scan analytics:', error);
    res.status(500).json({ error: 'Error fetching vCard scan analytics' });
  }
};

exports.getUserScanAnalytics = async (req, res) => {
  try {
    const { userId } = req.user;

    const user = await User.findById(userId).select('vCards._id');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const vCardIds = user.vCards.map(vCard => vCard._id);
    const scans = await VCardScan.find({ vCardId: { $in: vCardIds } }).sort({ scanDate: -1 });

    const analytics = {
      totalScans: scans.length,
      scansByVCard: {},
      overallLocationBreakdown: {},
      overallDeviceBreakdown: {}
    };

    scans.forEach(scan => {
      // Scans by vCard
      analytics.scansByVCard[scan.vCardId] = (analytics.scansByVCard[scan.vCardId] || 0) + 1;

      // Overall location breakdown
      const country = scan.location.country || 'Unknown';
      analytics.overallLocationBreakdown[country] = (analytics.overallLocationBreakdown[country] || 0) + 1;

      // Overall device breakdown
      const device = scan.userAgent.includes('Mobile') ? 'Mobile' : 'Desktop';
      analytics.overallDeviceBreakdown[device] = (analytics.overallDeviceBreakdown[device] || 0) + 1;
    });

    res.json(analytics);
  } catch (error) {
    console.error('Error fetching user scan analytics:', error);
    res.status(500).json({ error: 'Error fetching user scan analytics' });
  }
};






// ----------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------
// ----------------------------{ auth functions }-------------------------------------
// ----------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------







exports.register = async (req, res) => {
  try {
    console.log('Register request body:', req.body);
    const { username, email, password } = req.body;
    
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create verification token
    const verificationToken = crypto.randomBytes(20).toString('hex');
    const verificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    user = new User({
      username,
      email,
      password,
      verificationToken,
      verificationExpires,
      isVerified: false
    });
    await user.save();

    // Send verification email
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    const message = `Please click on the following link to verify your email: ${verificationUrl}`;

    await sendEmail({
      to: user.email,
      subject: 'Email Verification',
      text: message,
    });

    res.status(201).json({ message: 'User registered successfully. Please check your email to verify your account.' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

exports.login = async (req, res) => {
  try {
    console.log('Login request body:', req.body);
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    if (!user.isVerified) {
      return res.status(403).json({ error: 'Please verify your email before logging in' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user._id, email: user.email, plan: user.plan } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    console.log('Forgot password request body:', req.body);
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // Token expires in 10 minutes
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    const message = `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\nPlease click on the following link, or paste this into your browser to complete the process:\n\n${resetUrl}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.`;

    console.log('Attempting to send email to:', user.email);

    try {
      await sendEmail({
        to: user.email,
        subject: 'Password Reset Request',
        text: message,
      });

      res.status(200).json({ message: 'Password reset email sent' });
    } catch (error) {
      console.error('Send email error:', error);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      return res.status(500).json({ error: 'Error sending password reset email' });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    console.log('Reset password request body:', req.body);
    console.log('Reset password token from params:', req.params.token);
    
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ error: 'Password reset token is invalid or has expired' });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Password has been reset' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Error resetting password' });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ error: 'Error fetching user data' });
  }
};

exports.getUserPlan = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('plan');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ planName: user.plan?.name || 'Free' });
  } catch (error) {
    console.error('Get user plan error:', error);
    res.status(500).json({ error: 'Error fetching user plan' });
  }
};

exports.getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('username email plan');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get user info error:', error);
    res.status(500).json({ error: 'Error fetching user info' });
  }
};

exports.checkVerificationStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('isVerified');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ isVerified: user.isVerified });
  } catch (error) {
    console.error('Check verification status error:', error);
    res.status(500).json({ error: 'Error checking verification status' });
  }
};
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({
      verificationToken: token,
      verificationExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired verification token' });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationExpires = undefined;
    await user.save();

    res.json({ message: 'Email verified successfully. You can now log in.' });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ error: 'Email verification failed' });
  }
};

exports.resendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ error: 'Email already verified' });
    }

    // Check if a minute has passed since the last verification email
    if (user.lastVerificationSent && Date.now() - user.lastVerificationSent < 60000) {
      return res.status(400).json({ error: 'Please wait a minute before requesting a new verification email' });
    }

    // Create new verification token
    user.verificationToken = crypto.randomBytes(20).toString('hex');
    user.verificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    user.lastVerificationSent = Date.now();
    await user.save();

    // Send verification email
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${user.verificationToken}`;
    const message = `Please click on the following link to verify your email: ${verificationUrl}`;

    await sendEmail({
      to: user.email,
      subject: 'Email Verification',
      text: message,
    });

    res.json({ message: 'Verification email sent. Please check your inbox.' });
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({ error: 'Failed to resend verification email' });
  }
};









module.exports = exports;