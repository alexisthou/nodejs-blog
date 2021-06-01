const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

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

    // Receive PostCreated event, store in Query Service local storage
    if (type === 'PostCreated') {
        const {id, title} = data;
        posts[id] = {id, title, comments: []};
    }

    // Receive CommentCreated event, store in Query Service local storage
    if (type === 'CommentCreated') {
        const {id, content, postId, status} = data;
        if (posts[postId]) {
            const post = posts[postId];
            post.comments.push({id, content, status});
        }

    }

    // Received CommentUpdated from Event to update content + status properties
    if (type === 'CommentUpdated') { 
        const {id, content, postId, status} = data;

        if (posts[postId]) {
            const post = posts[postId];
            const comment = post.comments.find(comment => {
                return comment.id === id;
            });
            
            comment.status = status;
            comment.content = content;
        }
    }

    res.send({});
});

app.listen(4002, () => {
    console.log('Listening to port 4002');
});