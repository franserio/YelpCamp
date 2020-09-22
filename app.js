const express   	 = require("express"),
	  app        	 = express(),
	  bodyParser 	 = require("body-parser"),
	  mongoose   	 = require("mongoose"),
	  flash			 = require("connect-flash"),
	  passport 		 = require("passport"),
	  LocalStrategy  = require("passport-local"),
	  methodOverride = require("method-override"),
	  Campground 	 = require("./models/campground"),
	  Comment 	 	 = require("./models/comment"),
	  User 			 = require("./models/user"),
	  seedDB 	 	 = require("./seeds");

let port = process.env.PORT || 3000;

// Requiring routes
const commentRoutes    = require("./routes/comments"),
	  campgroundRoutes = require("./routes/campgrounds"),
	  indexRoutes 	   = require("./routes/index");

// Seed the Database
// seedDB();

mongoose.connect('mongodb+srv://dbFranSerio:mypassword123@cluster0.yqdbi.mongodb.net/yelp_camp?retryWrites=true&w=majority', {
				useNewUrlParser: true,
				useUnifiedTopology: true
				})
		.then(() => console.log("Connected to DB!"))
		.catch(error => console.log(error.message));

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.use(flash());

// PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "Once again Rusty wins cutest dog!",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// middleware for navbar buttons if user is or is not logged in
app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

// Setup routes
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(port, () => console.log("The YelpCamp Server has started!"));