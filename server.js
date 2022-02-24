require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

const dns = require('dns');
const bodyParser = require('body-parser');
const {URL} = require('url');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

let links = [];
let id = 0;
// Your first API endpoint
app.post('/api/shorturl/', function(req, res) {

  const original_url = req.body.url

  if(original_url.includes('http:/') || original_url.includes('ftp:/')){
    return res.json({ error: 'invalid url' })
  }

  try{
    let urlObject = new URL(original_url)

    dns.lookup(urlObject.hostname, (err) => {
      if(err) {
        res.json({ error: 'invalid url' })
      }else{

        id++;

        let newUrl = {
          original_url,
          short_url: id
        }

        links.push(newUrl);
        res.json(newUrl);
      }
    });


  }catch(err){
    res.json({ error: 'invalid url' })
  }

});

app.get('/api/shorturl/:short_url', (req, res) => {

  const {short_url} = req.params;
  const redirectUrl = links.find(link => link.short_url === parseInt(short_url));

  if(redirectUrl){
    res.redirect(redirectUrl.original_url);
  }else{
    res.json({notFound: 'not short url'});
  }
  
})


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
