# Blog post POC

#The purpose of this POC is to build a small application blog post application using **ReactJS**, **ExpressJS**.

There are 1 client and 5 backend services: 

- React Frontend which allows to add a Post and attach comments to them
- post service which receives POST requests whenever a user create a post
- comment service which receives POST requests whenever a user create a comment
- query service aggregates data from post and comment services to servce the client
- moderation service serves to moderate comment 
- event-bus service dispatch events to different services in order to trigger handlers 
- - For example, the query will get notified when a new post has been submitted so that it can refresh it's data.

