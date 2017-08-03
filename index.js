const line = require('@line/bot-sdk');
const express = require('express');
const request = require('request');

const config = {
  channelAccessToken: '',
  channelSecret: ''
};

const app_id = ''
const app_key = ''

const client = new line.Client(config);
const app = express();

app.post('/webhook', line.middleware(config), (req, res) => {
  Promise.all(req.body.events.map(handleEvent)).then(result => {
    return res.json(result)
  });
  // return res.sendStatus(200)
});

function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  const options = {
    url: `https://od-api.oxforddictionaries.com/api/v1/entries/en/${event.message.text}`,
    headers: {
      'app_id': app_id,
      'app_key': app_key
    }
  };

  request(options, (error, res, body) => {
    if (!error && res.statusCode == 200) {
      let result = JSON.parse(body);
      let senses = result.results[0].lexicalEntries[0].entries[0].senses;
      console.log('>>', senses);
      let answer = senses.reduce((acc, e, i) => {
        return acc + (i+1) + ': ' + e.definitions[0] + '\n\n'
      }, '');
      let definitions = result.results[0].lexicalEntries[0].entries[0].senses[0].definitions[0]
      return client.replyMessage(event.replyToken, { type: 'text', text: '你查的是' + result.results[0].word + '\n定義：\n' + answer });
    }
  });
}





const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
