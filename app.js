const request = require('request');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const path = require('path');
var sslRedirect = require('heroku-ssl-redirect');
var favicon = require('serve-favicon')
const handlebars = require('express-handlebars');

app.engine('.hbs', handlebars({
  extname: '.hbs'
}));

app.set("PORT", PORT);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', '.hbs');

app.use(express.static(path.join(__dirname, 'assets')));
app.use(sslRedirect());
app.use(favicon(path.join(__dirname, 'assets', 'img', 'branding', 'favicon.ico')))


app.get('/', function(req, res) {
  res.render("index", {
    title: "MeetPass"
  });
});

app.get('/privacy', function(req, res) {
  res.render("privacy");
});

app.get('/terms', function(req, res) {
  res.render("terms");
});

app.get('/:cID', function(req, res) {
  var cID = req.params.cID;

  request(`https://meetpass-server.herokuapp.com/cards/1/${cID}`, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      var card = JSON.parse(body);
      var foreground;
      var background;
      switch (card.themeId) {
        case "0":
          foreground = "#000000";
          background = "#FFFFFF";
          break;
        case "1":
          foreground = "#4D0722";
          background = "#FFD8E4";
          break;
        case "2":
          foreground = "#823E37";
          background = "#FFE1D1";
          break;
        case "3":
          foreground = "#432905";
          background = "#FFEBB6";
          break;
        case "4":
          foreground = "#082408";
          background = "#C5FDC7";
          break;
        case "5":
          foreground = "#2E3A5E";
          background = "#CAF1FE";
          break;
        case "6":
          foreground = "#2E3A5E";
          background = "#CDDFFD";
          break;
        case "7":
          foreground = "#122A5D";
          background = "#99C5FF";
          break;
        case "8":
          foreground = "#391B4C";
          background = "#EFDFFC";
          break;
        default:
          foreground = "#000000";
          background = "#FFFFFF";
          break;
      }
      res.render("card", {
        title: `MeetPass - ${card.cardName}`,
        accounts: card.accounts,
        card: card,
        background: background,
        foreground: foreground
      });
    }
    else {
      //Make a 404 page and insert here
      res.render("404");
    }
  });
});

app.listen(app.get('PORT'), function() {
  console.log('Express started on http://localhost:' +
    app.get('PORT'));
});
