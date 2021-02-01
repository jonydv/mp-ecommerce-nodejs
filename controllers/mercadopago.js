const mercadopago = require('mercadopago');
const dotenv = require('dotenv').config();

mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN,
  integrator_id: process.env.MP_INTEGRATOR_ID,
});
console.log('--------------------------------------------');
console.log('access token: ' + process.env.MP_ACCESS_TOKEN);
console.log('--------------------------------------------');
const payWithMP = function (req, res, next) {
  const payer = {
    name: 'Lalo',
    surname: 'Landa',
    email: 'test_user_81131286@testuser.com',
    phone: {
      area_code: '52',
      number: 5549737300,
    },
    address: {
      street_name: 'Insurgentes Sur',
      street_number: 1602,
      zip_code: '03940',
    },
  };
  const img_url = req.body.img.split('.')[1];
  let preference = {
    payer,
    items: [
      {
        id: '1234',
        title: req.body.title,
        picture_url: `https://jonydv-mp-commerce-nodejs.herokuapp.com${img_url}`,
        description: 'Dispositivo móvil de Tienda e-commerce',
        unit_price: Number(req.body.price),
        quantity: Number(req.body.unit),
      },
    ],
    back_urls: {
      success:
        'https://jonydv-mp-commerce-nodejs.herokuapp.com/detail/mercadopago/success',
      failure:
        'https://jonydv-mp-commerce-nodejs.herokuapp.com/detail/mercadopago/failure',
      pending:
        'https://jonydv-mp-commerce-nodejs.herokuapp.com/detail/mercadopago/pending',
    },
    payment_methods: {
      excluded_payment_methods: [
        {
          id: 'amex',
        },
      ],
      excluded_payment_types: [
        {
          id: 'atm',
        },
      ],
      installments: 6,
    },
    notification_url:
      'https://jonydv-mp-commerce-nodejs.herokuapp.com/detail/mercadopago/webhook?source_news=webhooks',
    external_reference: 'jonatandavidvillalba@gmail.com',
  };

  mercadopago.preferences
    .create(preference)
    .then((response) => {
      console.log('--------------------------------------------');
      console.log('PREFERENCIA DE PAGO', +response);
      console.log('--------------------------------------------');
      res.render('detail', {
        img: req.body.img,
        title: req.body.title,
        price: req.body.price,
        unit: req.body.unit,
        initPoint: response.body.init_point,
      });
    })
    .catch((error) => {
      res.render('failure');
    });
};

const getMpPaymentStatus = function (req, res, next) {
  if ((req.query.type = 'payment_id')) {
    const paymentInfo = {
      payment_id: req.query.payment_id,
      status: req.query.status,
      external_reference: req.query.external_reference,
      merchant_order_id: req.query.merchant_order_id,
      payment_type: req.query.payment_type,
    };
    if (paymentInfo.payment_status === 'failure') {
    }
    mercadopago.payment
      .findById(paymentInfo.payment_id)
      .then((response) => {
        console.log('--------------------------------------------');
        console.log('PAGO CREADO', +response);
        console.log('--------------------------------------------');
        if (response.body.status === 'approved') {
          res.render('success', response.body, paymentInfo.payment_id);
        } else if (response.body.status === 'pending') {
          res.render('pending');
        } else if (response.body.status === 'failure') {
          res.render('failure');
        }
      })
      .catch((error) => {
        res.render('failure');
      });
  } else {
    return res.status(400).json('an error ocurred');
  }
};

const mpWebhook = function (req, res) {
  console.log(req.body);

  res.status(200);
};

module.exports = { payWithMP, getMpPaymentStatus, mpWebhook };
