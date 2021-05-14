const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get('/posts', (req, res) => {
    res.send(posts);
});

app.get('/posts/:id/comments', (req, res) => {
    res.status(201).send(posts[req.params.id].comments || []);
});


app.post('/events', (req, res) => {
    const {type, data} = req.body;

    if (type === 'PostCreated') {
        const {id, title} = data;
        posts[id] = {id, title, comments: []};
    }

    if (type === 'CommentCreated') {
        const {id, content, postId} = data;
        if (posts[postId]) {
            const post = posts[postId];
            post.comments.push({id, content});
        }

    }

    console.log("All the Posts");
    console.log(posts);

    res.send({});
});

app.listen(4002, () => {
    console.log('Listening to port 4002');
});