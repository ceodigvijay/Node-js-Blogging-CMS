var express = require('express'),
    router = express.Router(),
    Post = require('../models/post'),
    Comment = require('../models/comment'),
    middleware = require('../middleware/auth')

router.get("/blog/:id/comment/new", middleware.checkLoggedIn, function(req, res){
    Post.findById(req.params.id, function(err, post){
        if(err){
            console.log(err);
        }else{
            res.render("comment/new", {post: post})
        }
    })
})

router.post("/blog/:id/comment", middleware.checkLoggedIn, function(req, res){
    Comment.create({
        name: req.body.name,
        comment: req.body.comment
    }, function(err, comment){
        Post.findById(req.params.id, function(err, foundPost){
            if(err){
                console.log("Error Finding User")
            }else{
                var author = {
                    id: req.user._id,
                    username: req.user.username
                }
                comment.author = author;
                comment.save();
                foundPost.comments.push(comment)
                foundPost.save(function(err, data){
                    if(err){
                        console.log(err)
                    }else{
                        console.log(data)
                        res.redirect('/blog/'+req.params.id)
                    }
                })
            }
        })
    })
})

router.get('/blog/:id/comment/:commentId/edit', middleware.checkLoggedIn, middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.commentId, function(err, comment){
        if(err){
            console.log(err)
        }else{
            res.render('comment/edit', {comment: comment, postId: req.params.id})
        }
    })
})

router.put('/blog/:id/comment/:commentId', middleware.checkLoggedIn, middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.commentId, req.body.comment, function(err, updatedComment){
        if(err){
            console.log(err)
        }else{
            res.redirect("/blog/"+req.params.id)
        }
    })
})

router.delete('/blog/:id/comment/:commentId', middleware.checkLoggedIn, middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.commentId, function(err, msg){
        if(err){
            console.log(err)
        }else{
            res.redirect("/blog/"+req.params.id)
        }
    })
})

module.exports = router;