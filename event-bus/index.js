const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

// Receives and event everytime a post or a comment is created
app.post('/events', (req, res) => {
    const event = req.body;

    // Send to post Service, only a notification
    axios.post('http://localhost:4000/events', event).catch((err) => {
        console.log(err.message);
    });

    // Send to comment Service, only a notification
    axios.post('http://localhost:4001/events', event).catch((err) => {
        console.log(err.message);
    });

    // Send to query Service, triger stuff
    axios.post('http://localhost:4002/events', event).catch((err) => {
        console.log(err.message);
    });

    // Send to query Moderation, trigger comment moderation
    axios.post('http://localhost:4003/events', event).catch((err) => {
        console.log(err.message);
    });


    res.send({status: 'OK'});

});

app.listen(4005, () => {
    console.log('Listening to port 4005');
});