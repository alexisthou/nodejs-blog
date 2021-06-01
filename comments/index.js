const express = require('express');
const bodyParser = require('body-parser');
const {randomBytes} = require('crypto');
const cors = require('cors');
const axios = require('axios');


const app = express();
const commentsByPostId = {};

app.use(bodyParser.json()); 
app.use(cors());
app.get('/posts/:id/comments', (req, res) => {
    res.send(commentsByPostId[req.params.id] || []);
});

// User submit comment to the postId
// Save data in Comment service and dispatch PostCreated event to EventBus service
app.post('/posts/:id/comments', async (req, res) => {
    const commentId = randomBytes(4).toString('hex');
    const { content } = req.body;

    const comments = commentsByPostId[req.params.id] || [];

    comments.push({id: commentId, content, status: 'pending' });
    commentsByPostId[req.params.id] = comments;


    // Tells event bus that a comment was created
    await axios.post('http://localhost:4005/events', {
        type: 'CommentCreated',
        data: {
            id: commentId, 
            content: content, 
            postId: req.params.id,
            status: 'pending'
        }
    });


    res.status(201).send(comments);
});

// Acknowledge that it received an event
app.post('/events', async (req, res) => {
    console.log('Event received by Comment:', req.body.type);
    const {type, data} = req.body;
    
    if (type === 'CommentModerated') {        
        const {postId, id, status, content} = data;

        console.log(postId);
        console.log(commentsByPostId);
        if (commentsByPostId[postId]) {
            const comments = commentsByPostId[postId];

            const comment = comments.find(comment => {
                return comment.id === id;
            });
            comment.status = status;
    
            // Tells event bus that a comment was updated
            await axios.post('http://localhost:4005/events', {
                type: 'CommentUpdated',
                data: {
                    id, 
                    content, 
                    postId,
                    status
                }
            }).catch((err) => {
                console.log(err.message);
            });     
        }

    }

    res.send({});
});

app.listen(4001, () => {
    console.log('Listening to port 4001');
});