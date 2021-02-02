var express = require('express');
var exphbs = require('express-handlebars');
const mercadopago = require('mercadopago');
const PaymentController = require("./controllers/PaymentController");
const PaymentService = require("./services/PaymentService");
const PaymentInstance = new PaymentController(new PaymentService());


var port = process.env.PORT || 3000;


var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN,
  integrator_id: process.env.MP_INTEGRATOR_ID,
});

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');


app.get('/', function (req, res, next) {
  res.render('home');
});


app.get("/", (req, res) => {
  res.render("home");
});

app.get("/detail", (req, res) => {
  res.render("detail", req.query);
});

app.get("/detail/mercadopago/success", (req, res) => {
  let paymentInfo;
  mercadopago.payment
  .findById(req.query.payment_id)
  .then((response) => {
    paymentInfo = {
      external_reference: req.query.external_reference,
      preference_id: req.query.preference_id,
      payment_id: req.query.payment_id,
      payment_method_id: response.body.payment_method_id
    }
    res.render('success', paymentInfo);
  })
  .catch((error) => {
    console.log(error);
  });
  
});

app.get("/detail/mercadopago/failure", (req, res) => {
  res.render("failure");
});

app.get("/detail/mercadopago/pending", (req, res) => {
  res.render("pending");
});

app.post("/payment/new", (req, res) =>
  PaymentInstance.getMercadoPagoLink(req, res)
);

app.post("/detail/mercadopago/webhook", (req, res) => PaymentInstance.webhook(req, res));

app.use(express.static('assets'));


app.use('/assets', express.static(__dirname + '/assets'));

app.listen(port);
