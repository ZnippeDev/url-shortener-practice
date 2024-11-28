require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const dns = require('dns');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.use(bodyParser.urlencoded({ extended: false }));

// Your first API endpoint

let urlPath;
let counter;


app.post('/api/shorturl', function(req, res) {
  const {url} = req.body
  console.log(url)
  if (url != ""){
    const { hostname } = new URL(url);
    dns.lookup(hostname, (err) => {
      if (err) {
        res.json({ 'error':"Invalid Url"})
      } else {
        urlPath = url;
        const randomWholeNumber = Math.floor(Math.random() * (100 + 1));
        counter = randomWholeNumber
        res.json({ original_url: url, short_url: counter})
      }
    });
  } else{
    res.json({ 'error':"Invalid Url"})
  }
});

app.get('/api/shorturl/:id', function(req,res){
  const { id } = req.params;
  if (id != counter){
    res.json({ 'error':"Invalid Url"})
  } else{
    res.redirect(urlPath)
  }
})



app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
