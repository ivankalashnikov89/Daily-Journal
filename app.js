//jshint esversion:6

const express = require("express");// <====Requires the Express module
const bodyParser = require("body-parser");//<===extracts the entire body portion of an incoming request stream and exposes it on req.body
const ejs = require("ejs");// <====Requires the ejs module
const mongoose = require('mongoose');// <====Requires the mongoose module

//consts for description
const homeStartingContent = "This Daily Journal allows you to create an electronic version of your handwritten notes that you can access anywhere at any time, allowing you to save your thoughts wherever you are!";
const aboutContent = "This simple Daily Journal allows you to store all your notes in one place. You no longer need to keep your plans in mind!";
const contactContent = "Send mail:our_mail@gmail.com";

const app = express();//<===calls the express function "express()" and puts new Express application inside the app variable (to start a new Express application)

app.set('view engine', 'ejs');//<==selects an EJS file as a template to which arguments are passed from the Javascript file

app.use(bodyParser.urlencoded({extended: true}));//<==allows to choose between parsing the URL-encoded data with the querystring library (when false) or the qs library (when true)
app.use(express.static("public"));//<===adds a middleware for serving static files to your Express app.

mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true});//<====local connection

const postSchema = { //<====A Mongoose schema defines the structure of the document, default values, validators
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);//<==a Mongoose model provides an interface to the database for creating, querying, updating, deleting records

app.get("/", function(req, res){

  Post.find({}, function(err, posts){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
  });
});

//Requests and response the "Compose" path 
app.get("/compose", function(req, res){
  res.render("compose");
});

//requests supply additional data from the client
app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  //saves user's data from Compose
  post.save(function(err){
    if (!err){
        res.redirect("/");
    }
  });
});


app.get("/posts/:postId", function(req, res){

const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err, post){//<==Returns one document that satisfies the specified query criteria on the collection or view
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });

});

//Requests and response the "About" path 
app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

//Requests and response the "Contact us" path 
app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});


//The app.listen() method binds itself with the specified host and port to bind and listen for any connections
app.listen(3000, function() {
  console.log("Server started on port 3000");
});
