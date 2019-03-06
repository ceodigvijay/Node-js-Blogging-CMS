var middlewareObj = {},
    Comment = require('../models/comment'),
    Post = require('../models/post');

middlewareObj.checkLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You must Be logged In to do that")
    res.redirect('/login')
};

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.commentId, function(err, foundComment){
            if(err){
                console.log(err)
            }else{
                //Check if user is authenticated
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                }else{
                    res.send("You are Not authorised To edit the page")
                }
            }
        })
    }else{
        req.flash("error", "You must Be logged In to do that")
        res.redirect("back")
    }
}


middlewareObj.checkPostOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Post.findById(req.params.id, function(err, foundPost){
            if(err){
                console.log(err)
            }else{
                //Check if user is authenticated
                if(foundPost.author.id.equals(req.user._id)){
                    next();
                }else{
                    res.send("You are Not authorised To edit the page")
                }
            }
        })
    }else{
        req.flash("error", "You must Be logged In to do that")
        res.redirect("back")
    }
}


module.exports = middlewareObj;