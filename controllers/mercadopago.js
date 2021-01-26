const mercadopago = require('mercadopago');
const dotenv = require('dotenv').config();

mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN_V || MP_ACCESS_TOKEN_V,
});

const payWithMP = function (req, res, next) {
  const payer = {
    name: 'TT017189',
    email: 'test_user_96757941@testuser.com',
  };

  let preference = {
    payer,
    items: [
      {
        title: req.body.title,
        unit_price: Number(req.body.price),
        quantity: Number(req.body.unit),
      },
    ],
    back_urls: {
      success: 'http://localhost:3000/detail/mercadopago',
      failure: 'http://localhost:3000',
      pending: 'http://localhost:3000',
    },
    auto_return: 'approved',
  };

  mercadopago.preferences
    .create(preference)
    .then((response) => {
      global.id = response.body.id;
      res.render('detail', {
        img: req.body.img,
        title: req.body.title,
        price: req.body.price,
        unit: req.body.unit,
        global_id: global.id,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

const getMpPaymentStatus = function (req, res, next) {
  if ((req.query.type = 'payment_id')) {
    const paymentInfo = {
      payment_id: req.query.payment_id,
      status: req.query.status,
      merchant_order_id: req.query.merchant_order_id,
    };

    mercadopago.payment
      .findById(paymentInfo.payment_id)
      .then((response) => {
        res.render('success', response.body);
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    return res.status(400).json('an error ocurred');
  }
};

const mpWebhook = function (req, res) {
  console.log(req.body);

  res.send('ok');
  res.status(200);
};

module.exports = { payWithMP, getMpPaymentStatus, mpWebhook };
