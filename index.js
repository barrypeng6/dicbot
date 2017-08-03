const line = require('@line/bot-sdk');
const express = require('express');
const fs = require('fs');

const config = {
  channelAccessToken: '/oDyzG4L2rx00RWJJ2UUb6xjEEwUBYy1AhkKnEiPQImTnViTOpuu4j7yKLUHtkNw7YPookYMjSYd1xImN5pV5MWeXDonJZ737ztf4+xzQPjvrrHCg2RIN9RewhsFrNdh30ZTLc/yTgtHosjOBQEguwdB04t89/1O/w1cDnyilFU=',
  channelSecret: 'ae1af91782cb133bc14058b445f64ebc'
};

const client = new line.Client(config);
const app = express();

app.post('/webhook', line.middleware(config), (req, res) => {
  Promise.all(req.body.events.map(handleEvent)).then(result =>
    res.json(result)
  );
});

function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  const echo = { type: 'text', text: 'Hi！' };

  return client.replyMessage(event.replyToken, echo);
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
