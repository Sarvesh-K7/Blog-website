//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent =
  "Welcome to Daily Journal, where curiosity meets knowledge and inspiration takes flight! 🌟 Embark on a journey with us as we explore the realms of diverse topics, from the latest in technology to the wonders of art, from travel adventures that spark wanderlust to mindful living practices that nurture the soul. Here, we believe that every idea has the power to ignite change and every story has the potential to inspire. Join our vibrant community of thinkers, dreamers, and doers, and let's embark on a quest for wisdom, creativity, and meaningful connections. Get ready to dive into a world of fascinating insights and engaging narratives. Your adventure begins here!";
const aboutContent =
  "Daily Journal is more than a website, it's your daily adventure into the realms of inspiration and enlightenment. Our mission is to foster curiosity, empower minds, and create connections. Whether you're a tech enthusiast, an art lover, a travel buff, or someone seeking mindfulness, Daily Journal is your go-to source. We offer in-depth insights, inspiring stories, practical tips, and a vibrant community of thinkers and dreamers. Immerse yourself in inspiring narratives, explore informative articles, and celebrate creative expressions that highlight the beauty of the human spirit. We're here to enrich your daily life, providing reliable content that informs, educates, and uplifts. Our daily posts serve as your morning inspiration, setting a positive tone for the day ahead. At Daily Journal, we value community engagement. Share your thoughts, experiences, and ideas, and connect with like-minded individuals. Together, let's embark on a journey of self-discovery, knowledge, and creativity. Join us and let your curiosity take flight. Thank you for being a cherished part of the Daily Journal community!";
const contactContent =
  "We love hearing from our readers! If you have any questions, suggestions, or just want to say hello, feel free to reach out to us. Your feedback is invaluable and helps us improve your experience with Daily Journal. You can email us at: upadhyaysk417@gmail.com";

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const username = "sarveshbxr23";
const password = encodeURIComponent("Upadhyay@123"); // URL-encode the password
const clusterURL = "sarveshcluster.zqfbbn0.mongodb.net";
const databaseName = "BlogDailyJournal";

const url = `mongodb+srv://${username}:${password}@${clusterURL}/${databaseName}`;

mongoose.connect(url);

const postSchema = {
  title: String,
  content: String,
};

const Post = mongoose.model("Post", postSchema);

// let posts = [];

app.get("/", function (req, res) {
  // res.render("home", {
  //   startingContent: homeStartingContent,
  //   posts: posts,
  // });
  Post.find({}).then(function (posts) {
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts,
    });
  }).catch(function (err) {
    console.log(err); // Handle the error appropriately, e.g., show an error page
  });
});

app.get("/about", function (req, res) {
  res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", function (req, res) {
  res.render("contact", { contactContent: contactContent });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", function (req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody,
  });

  post.save()
    .then(() => {
      // If there is no error, redirect to the home page
      res.redirect("/");
    })
    .catch((err) => {
      // Handle the error, e.g., log the error and render an error page
      console.error(err);
      res.status(500).send("Internal Server Error");
    });
});

app.get("/posts/:postId", function (req, res) {
  // const requestedTitle = _.lowerCase(req.params.postName);

  // posts.forEach(function (post) {
  //   const storedTitle = _.lowerCase(post.title);

  //   if (storedTitle === requestedTitle) {
  //     res.render("post", {
  //       title: post.title,
  //       content: post.content,
  //     });
  //   }
  // });
  const requestedPostId = req.params.postId;

  Post.findOne({ _id: requestedPostId }).then(function (post) {
    if (post) {
      res.render("post", {
        title: post.title,
        content: post.content,
      });
    } else {
      // Handle the case where no post with the specified ID was found
      res.status(404).send("Post not found");
    }
  }).catch(function (err) {
    // Handle errors, e.g., database connection issues
    res.status(500).send("Internal Server Error");
  });
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
