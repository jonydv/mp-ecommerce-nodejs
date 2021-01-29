const express = require('express');

const {
  payWithMP,
  getMpPaymentStatus,
  mpWebhook,
} = require('../controllers/mercadopago');

const router = express.Router();

router.post('/detail', payWithMP);
router.get('/detail/mercadopago/success', getMpPaymentStatus);
router.get('/detail/mercadopago/failure', getMpPaymentStatus);
router.get('/detail/mercadopago/pending', getMpPaymentStatus);
router.post('/detail/mercadopago/webhook', mpWebhook);

module.exports = router;
