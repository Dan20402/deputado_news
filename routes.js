const express = require('express');
const app = express();
const router = express.Router();
const fetch = require('node-fetch');
require('dotenv').config();

const DEPUTADOS_URL = `https://dadosabertos.camara.leg.br/api/v2/deputados?ordem=ASC&ordenarPor=nome`;

app.locals.listAllDeputados = [];
app.locals.selectedDeputado = {};
app.locals.allArticles = [];

router
  .route('/')
  .get(async (req, res) => {
    const response = await fetch(DEPUTADOS_URL);
    const data = await response.json();
    app.locals.listAllDeputados.push(...data.dados);
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

    const API_KEY = process.env.NEWS_API_KEY;
    const newsUrl = `http://newsapi.org/v2/everything?q=${app.locals.selectedDeputado.nome}&apiKey=${API_KEY}`;

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
