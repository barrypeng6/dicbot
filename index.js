const line = require('@line/bot-sdk');
const express = require('express');
const request = require('request');

const config = {
  channelAccessToken: '/oDyzG4L2rx00RWJJ2UUb6xjEEwUBYy1AhkKnEiPQImTnViTOpuu4j7yKLUHtkNw7YPookYMjSYd1xImN5pV5MWeXDonJZ737ztf4+xzQPjvrrHCg2RIN9RewhsFrNdh30ZTLc/yTgtHosjOBQEguwdB04t89/1O/w1cDnyilFU=',
  channelSecret: 'ae1af91782cb133bc14058b445f64ebc'
};

const app_id = '6f51efe4'
const app_key = '07ca336e2b0dbbc6cf67a6b12d7a29d6'

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
      return client.replyMessage(event.replyToken, { type: 'text', text: '你查的是' + result.results[0].word + '\n定義：\n' + answer });
    }
    return client.replyMessage(event.replyToken, { type: 'text', text: '查無' + event.message.text});
  });
}





const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
