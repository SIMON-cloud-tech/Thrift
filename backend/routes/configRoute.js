const router = require('express').Router();

router.get('/', (req, res) => {
  res.json({
    whatsappNumber: process.env.WHATSAPP_NUMBER || '254789679161',
    phoneNumber:    process.env.PHONE_NUMBER    || '254789679161',
    mpesa: {
      paybill:      process.env.MPESA_PAYBILL       || '',
      businessName: process.env.MPESA_BUSINESS_NAME || 'DRIP MTAANI',
      account:      process.env.MPESA_ACCOUNT       || '',
    },
  });
});

module.exports = router;