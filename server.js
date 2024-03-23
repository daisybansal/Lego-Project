/********************************************************************************

* WEB322 – Assignment 04

*

* I declare that this assignment is my own work in accordance with Seneca's

* Academic Integrity Policy:

*

* https://www.senecacollege.ca/about/policies/academic-integrity-policy.html

*

* Name: Daisy Bansal Student ID: 139405229 Date: 22/03/2024

*

* Published URL: https://ruby-spotless-greyhound.cyclic.app
*

********************************************************************************/

const legoData = require("./modules/legoSets");
const path = require("path");
const express = require('express');
const app = express();
const HTTP_PORT = process.env.PORT || 8080;

app.use(express.static('public'));
app.set('view engine', 'ejs');

// Function to fetch random quote
async function getRandomQuote() {
  try {
    const fetch = await import('node-fetch').then(module => module.default);
    const response = await fetch('https://api.quotable.io/random');
    const data = await response.json();
    return data.content;
  } catch (error) {
    console.error('Error fetching quote:', error);
    return 'An error occurred while fetching the quote.';
  }
}

app.get('/', async (req, res) => {
  try {
    const quote = await getRandomQuote();
    res.render('home', { quote });
  } catch (error) {
    console.error('Error fetching quote:', error);
    res.status(500).send('An error occurred while fetching the quote.');
  }
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/quote', async (req, res) => {
  try {
    const quote = await getRandomQuote();
    res.render('quote', { quote });
  } catch (error) {
    console.error('Error fetching quote:', error);
    res.status(500).send('An error occurred while fetching the quote.');
  }
});

app.get("/lego/sets", async (req, res) => {
  try {
    let sets;
    if (req.query.theme) {
      sets = await legoData.getSetsByTheme(req.query.theme);
    } else {
      sets = await legoData.getAllSets();
    }
    res.render('sets', { sets, page: '/lego/sets' }); // Pass the 'page' variable here
  } catch (err) {
    res.status(404).send(err);
  }
});

app.get("/lego/sets/:num", async (req, res) => {
  try {
    const set = await legoData.getSetByNum(req.params.num);
    res.render('legoSetDetail', { set, page: '/lego/sets' }); // Pass the 'page' variable here
  } catch (err) {
    res.status(404).send(err);
  }
});

app.use((req, res, next) => {
  res.status(404).render('404');
});

legoData.initialize().then(() => {
  app.listen(HTTP_PORT, () => {
    console.log(`Server listening on: http://localhost:${HTTP_PORT}`);
  });
});
