var express = require('express'),
    router = express.Router();

router.get("/", function(req, res){
    console.log(req.isAuthenticated())
    res.render("index")
})

module.exports = router;