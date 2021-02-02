var express = require('express');
var exphbs = require('express-handlebars');

const PaymentController = require("./controllers/PaymentController");
const PaymentService = require("./services/PaymentService");
const PaymentInstance = new PaymentController(new PaymentService());


var port = process.env.PORT || 3000;


var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


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
  res.render("success", req.query);
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
