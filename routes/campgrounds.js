const express 	 = require("express"),
	  router  	 = express.Router(),
	  Campground = require("../models/campground"),
	  Comment 	 = require("../models/comment"),
	  middleware = require("../middleware");

//INDEX - show all campgrounds
router.get("/", function(req, res){
	// Get all campgrounds from DB
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		} else {
			res.render("campgrounds/index",{campgrounds: allCampgrounds, page: 'campgrounds'});
		}
	});
});

//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
	// Get data from form and add to campgrounds array
	let name = req.body.name;
	let price = req.body.price;
	let image = req.body.image;
	let desc = req.body.description;
	let author = {
		id: req.user._id,
		username: req.user.username
	};
	let newCampground = {name: name, price: price, image: image, description: desc, author: author};
	// Create a new campground and save to DB
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log(err);
		} else {
			// Redirect back to campgrounds page
			res.redirect("/campgrounds");
		}
	});
});

// NEW - show form to create a new campground
router.get("/new", middleware.isLoggedIn, (req, res) => res.render("campgrounds/new"));

// SHOW - shows more info about one campground
router.get("/:id", function(req, res){
	//find the campground with provided ID
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err || !foundCampground){
			console.log(err);
			req.flash('error', 'Sorry, that campground does not exist!');
			return res.redirect('/campgrounds');
		}
		console.log(foundCampground)
		//render show template with that campground
		res.render("campgrounds/show", {campground: foundCampground});
	});
});

// EDIT - show edit form
router.get("/:id/edit", middleware.isLoggedIn, middleware.checkCampgroundOwnership, (req, res) => {
	Campground.findById(req.params.id, (err, foundCampground) => {
		try {
			res.render("campgrounds/edit", {campground: req.campground})
		}
		catch(err) {
			res.redirect("back");
		}
	});
});

// UPDATE - update new info and then redirect
 router.put("/:id", middleware.checkCampgroundOwnership, (req, res) => {
	 // find and update the correct campground
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
		if(err){
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
 });

// DESTROY - Delete a campground
router.delete("/:id", middleware.checkCampgroundOwnership, async(req, res) => {
  try {
    let foundCampground = await Campground.findById(req.params.id);
    await foundCampground.remove();
    res.redirect("/campgrounds");
  } catch (error) {
    console.log(error.message);
    res.redirect("/campgrounds");
  }
});

module.exports = router;