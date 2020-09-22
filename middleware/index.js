const Campground = require("../models/campground"),
	  Comment 	 = require("../models/comment");

// all the middlewares goes here
let middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
	// is user logged in?
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, (err, foundCampground) => {
			try {
				// does user own the campground?
				if (err || !foundCampground){
					console.log(err);
					req.flash('error', 'Sorry, that campground does not exist!');
					res.redirect('/campgrounds');
				} else if(foundCampground.author.id.equals(req.user._id)){
					req.campground = foundCampground;
					next();
				} else {
					req.flash("error", "You do not have permission to do that!");
					res.redirect('/campgrounds/' + req.params.id);
				}
			}
			catch(err) {
				req.flash("error", "Campground not found...");
				res.redirect("back");
			}
		});
	} else {
		req.flash("error", "You need to be logged in to do that!");
		res.redirect("back");
	}		
};

middlewareObj.checkCommentOwnership = function(req, res, next){
	// is user logged in?
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, (err, foundComment) => {
			try {
				if(err || !foundComment){
					console.log(err);
					req.flash('error', 'Sorry, that comment does not exist!');
					res.redirect('/campgrounds');
				} else if(foundComment.author.id.equals(req.user._id)){
					req.comment = foundComment;
					next();
				} else {
					req.flash("error", "You do not have permission to do that!");
					res.redirect('/campgrounds/' + req.params.id);
				}
			}
			catch(err) {
				req.flash("error", "Comment not found...");
				res.redirect("back");
			}
		});
	} else {
		req.flash("error", "You need to be logged in to do that!");
		res.redirect("back");
	}		
};

middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You need to be logged in to do that!");
	res.redirect("/login");
};

module.exports = middlewareObj;