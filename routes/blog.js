var express = require("express"),
  router = express.Router(),
  Post = require("../models/post"),
  middleware = require("../middleware/auth");

router.get("/blog", function(req, res) {
  // Get data from Db and send it to blog Page template
  Post.find({}, function(err, posts) {
    if (err) {
      console.log("Some error occured");
    } else {
      res.render("blog/blog", { posts: posts });
    }
  });
});

// NEW route for our blog app
router.get("/blog/new", middleware.checkLoggedIn, function(req, res) {
  res.render("blog/new");
});

router.post("/blog", middleware.checkLoggedIn, function(req, res) {
  // Save Incomming Details to Db and redirect To /blog
  var author = {
    id: req.user._id,
    username: req.user.username
  };
  Post.create(
    {
      title: req.body.title,
      content: req.body.content,
      image: req.body.image,
      author: author
    },
    function(err, savedPost) {
      if (err) {
        console.log("Some Error Occured");
      } else {
        res.redirect("/blog");
      }
    }
  );
});

// SHOW route for our blog app
router.get("/blog/:id", function(req, res) {
  Post.findById(req.params.id)
    .populate("comments")
    .exec(function(err, post) {
      if (err) {
        console.log(err);
      } else {
        res.render("blog/post", { post: post });
      }
    });
});

// EDIT route for our blog app
router.get("/blog/:id/edit", middleware.checkPostOwnership, function(req, res) {
  Post.findById(req.params.id, function(err, post) {
    if (err) {
      console.log("Some error Occured");
    } else {
      res.render("blog/edit", { post: post });
    }
  });
});

router.put("/blog/:id", middleware.checkPostOwnership, function(req, res) {
  newData = {
    title: req.body.title,
    image: req.body.image,
    content: req.body.content
  };
  Post.updateOne({ _id: req.params.id }, newData, function(err, returnedData) {
    if (err) {
      console.log("Some error Occured");
    } else {
      // console.log(returnedData)
      res.redirect("/blog/" + req.params.id);
    }
  });
});

router.delete("/blog/:id", middleware.checkPostOwnership, function(req, res) {
  Post.remove({ _id: req.params.id }, function(err, returnedData) {
    if (err) {
      console.log("Some error occured");
    } else {
      // console.log(returnedData)
      res.redirect("/blog");
    }
  });
});

module.exports = router;
