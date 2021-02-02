const axios = require("axios");

class PaymentService {
  constructor() {
    this.tokensMercadoPago = {
      prod: {},
      test: {
        access_token:
          "APP_USR-1159009372558727-072921-8d0b9980c7494985a5abd19fbe921a3d-617633181"
      }
    };
    this.mercadoPagoUrl = "https://api.mercadopago.com/checkout";
  }

  async createPaymentMercadoPago(name, price, unit, img) {
    const url = `${this.mercadoPagoUrl}/preferences?access_token=${this.tokensMercadoPago.test.access_token}`;
    const img_url = img.split('.')[1];
    const items = [
      {
        id: "1234",
        title: name,
        description: "Dispositivo movil de Tienda e-commerce",
        picture_url: `https://jonydv-mp-commerce-nodejs.herokuapp.com${img_url}.jpg`,
        category_id: "1234",
        quantity: parseInt(unit),
        currency_id: "ARS",
        unit_price: parseFloat(price)
      }
    ];

    const preferences = {
      items,
      external_reference: "jonatandavidvillalba@gmail.com",
      payer: {
        name: "Lalo",
        surname: "Landa",
        email: "test_user_81131286@testuser.com",
        phone: {
            area_code: "52",
            number: "5549737300",
        },
        address: {
          zip_code: "03940",
          street_name: "Insurgentes Sur",
          street_number: "1602"
        }
      },
      payment_methods: {
        excluded_payment_methods: [
          {
            id: "amex"
          }
        ],
        excluded_payment_types: [{ id: "atm" }],
        installments: 6,
        default_installments: 6
      },
      back_urls: {
        success: "https://jonydv-mp-commerce-nodejs.herokuapp.com/detail/mercadopago/success",
        pending: "https://jonydv-mp-commerce-nodejs.herokuapp.com/detail/mercadopago/pending",
        failure: "https://jonydv-mp-commerce-nodejs.herokuapp.com/detail/mercadopago/failure"
        
      },
      notification_url: "https://jonydv-mp-commerce-nodejs.herokuapp.com/detail/mercadopago/webhook",
      auto_return: "approved"
    };

    try {
      const request = await axios.post(url, preferences, {
        headers: {
          "Content-Type": "application/json",
          "x-integrator-id": "dev_24c65fb163bf11ea96500242ac130004"
        }
      });
      return request.data;
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = PaymentService;