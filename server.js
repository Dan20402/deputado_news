const express = require('express');
const fetch = require('node-fetch');
const ejs = require('ejs');
const bodyParser = require('body-parser');

//require('dotenv').config();

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(500).send('Something Broke!');
});

const DEPUTADOS_URL = `https://dadosabertos.camara.leg.br/api/v2/deputados?ordem=ASC&ordenarPor=nome`;

app.locals.listAllDeputados = [];
app.locals.selectedDeputado = {};
app.locals.allArticles = [];

app.get('/', async (req, res) => {
  const response = await fetch(DEPUTADOS_URL);
  const data = await response.json();
  app.locals.listAllDeputados.push(...data.dados); //This avoids arr within an arr issue
  res.render('index', {
    deputados: app.locals.listAllDeputados,
    selected: app.locals.selectedDeputado,
    allArticles: app.locals.allArticles,
  });
});

app.post('/', async (req, res, next) => {
  try {
    const thisDeputadoId = await req.body.selected_deputado_id;
    app.locals.selectedDeputado = app.locals.listAllDeputados.find(
      (deputado) => deputado.id == thisDeputadoId
    );

    const apiKey = '5d425dea7e5246bda907a9cae559a448';
    const newsUrl = `http://newsapi.org/v2/everything?q=${app.locals.selectedDeputado.nome}&apiKey=${apiKey}`;

    const response = await fetch(newsUrl);
    const data = await response.json();
    app.locals.allArticles = [];

    const news = data.articles.filter((obj) => {
      return (
        obj.source.name === 'Terra.com.br' ||
        obj.source.name === 'Uol.com.br' ||
        obj.source.name === 'Abril.com.br' ||
        obj.source.name === 'R7.com' ||
        obj.source.name === 'Ig.com.br' ||
        obj.source.name === 'Globo'
      );
    });

    app.locals.allArticles.push(...news);

    res.render('index', {
      deputados: app.locals.listAllDeputados,
      selected: app.locals.selectedDeputado,
      allArticles: app.locals.allArticles,
    });
  } catch (err) {
    return next(err);
  }
});

const PORT = 3000;
app.listen(PORT, console.log(`Listening on port ${PORT}`));
