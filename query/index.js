const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

const handleEvent = (type, data) => {

    switch(type) {
        // Receive PostCreated event, store in Query Service local storage
        case 'PostCreated': {
            const {id, title} = data;
            posts[id] = {id, title, comments: []};
            break;
        }
        // Receive CommentCreated event, store in Query Service local storage
        case 'CommentCreated': {

            const {id, content, postId, status} = data;
            if (posts[postId]) {
                const post = posts[postId];
                post.comments.push({id, content, status});
            }

            break;
        }
        // Received CommentUpdated from Event to update content + status properties
        case 'CommentUpdated': {
            const {id, content, postId, status} = data;

            if (posts[postId]) {
                const post = posts[postId];
                const comment = post.comments.find(comment => {
                    return comment.id === id;
                });
                
                comment.status = status;
                comment.content = content;
            }
            break;
        }
    }
}

// Get all posts stored in Query Service
app.get('/posts', (req, res) => {
    res.send(posts);
});

// Get all comments related to a post in Query Service
app.get('/posts/:id/comments', (req, res) => {
    res.status(201).send(posts[req.params.id].comments || []);
});

// Receive event from Post or Comment service
app.post('/events', (req, res) => {
    const {type, data} = req.body;

    handleEvent(type, data);

    res.send({});
});

app.listen(4002, async () => {
    console.log('Listening to port 4002');

    try {
        const res = await axios.get('http://localhost:4005/events');

        for(let event of res.data) {
            console.log('Processing event:', event.type);
            handleEvent(event.type, event.data);
        }
    } catch(err) {
        console.log(err.message);
    }
    
});