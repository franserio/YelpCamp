const express 	 = require("express"),
	  router  	 = express.Router({mergeParams: true}),
	  Campground = require("../models/campground"),
	  Comment 	 = require("../models/comment"),
	  middleware = require("../middleware");

// NEW - create new comment
router.get("/new", middleware.isLoggedIn, (req, res) => {
	// find campground by id
	Campground.findById(req.params.id, (err, campground) => {
		err ? console.log(err) : res.render("comments/new", {campground: campground});
	});	
});

// SHOW - shows comments in the campground site
router.post("/", middleware.isLoggedIn, (req, res) => {
	Campground.findById(req.params.id, (err, campground) => {
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			Comment.create(req.body.comment, (err, comment) => {
				if(err){
					req.flash("error", "Something went wrong :'(");
					console.log(err);	
				} else {
					//add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					//save comment
					comment.save();
					campground.comments.push(comment);
					campground.save();
					req.flash("success", "Successfully added comment!");
					res.redirect('/campgrounds/' + campground._id);
				}
			});
		}
	});
});

// EDIT - show comment form
router.get("/:comment_id/edit", middleware.isLoggedIn, middleware.checkCommentOwnership, (req, res) => {
	Comment.findById(req.params.comment_id, (err, foundComment) => {
		if(err){
			res.redirect("back");
		} else {
			res.render("comments/edit",
			   {campground_id: req.params.id,
			   comment: foundComment});
		}
	});
});

// UPDATE - update a comment and then redirect
router.put("/:comment_id/", middleware.checkCommentOwnership, (req, res) => {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
		if(err){
			res.redirect("back");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

// DESTROY - delete a comment
router.delete("/:comment_id", middleware.checkCommentOwnership, async (req, res) => {
	try {
		let foundComment = await Comment.findById(req.params.comment_id);
		await foundComment.remove();
		req.flash("success","Comment deleted!");
		res.redirect("/campgrounds/" + req.params.id);
	} catch(err){
		console.log(err.message);
		res.redirect("back");
	}
});

module.exports = router;