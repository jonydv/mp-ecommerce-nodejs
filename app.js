var express = require('express');
const dotenv = require('dotenv');
var exphbs = require('express-handlebars');

const router = require('./routes/mercadopago');

var port = process.env.PORT || 3000;

dotenv.config();

var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.static('assets'));

app.use('/assets', express.static(__dirname + '/assets'));

app.use('/', router);

app.get('/', function (req, res, next) {
  res.render('home');
});
/*app.post('/detail', payWithMP);
/*app.get('/detail', function (req, res) {
  res.render('detail', req.query);
});*/
/**/

/*app.get('/pay/mercadopago', getMpPaymentStatus);*/
app.listen(port);
