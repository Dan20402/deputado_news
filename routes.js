const express = require('express');
const app = express();
const router = express.Router();
const fetch = require('node-fetch');
const ejs = require('ejs');
//const bodyParser = require('body-parser');

const DEPUTADOS_URL = `https://dadosabertos.camara.leg.br/api/v2/deputados?ordem=ASC&ordenarPor=nome`;

app.locals.listAllDeputados = [];
app.locals.selectedDeputado = {};
app.locals.allArticles = [];

router
  .route('/')
  .get(async (req, res) => {
    const response = await fetch(DEPUTADOS_URL);
    const data = await response.json();
    app.locals.listAllDeputados.push(...data.dados); //This avoids arr within an arr issue
    res.render('index', {
      deputados: app.locals.listAllDeputados,
      selected: app.locals.selectedDeputado,
      allArticles: app.locals.allArticles,
    });
  })
  .post(async (req, res, next) => {
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
  });

module.exports = router;
