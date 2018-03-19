var express 			= require('express'),
	methodOverride		= require('method-override'),
	expressSanitizer 	= require('express-sanitizer'),
	bodyParser 			= require('body-parser'),
	mongoose			= require('mongoose'),
	app					= express();

// APP CONFIG
mongoose.connect("mongodb://shawn:Aa9004327@ds113179.mlab.com:13179/restful-crud-blog-mongo");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer()); // must go after bodyParser
app.use(methodOverride("_method"));

// MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: {type: Date, default: Date.now}
});
var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
// 	title: "Test Blog",
// 	image: "https://images.unsplash.com/photo-1437075130536-230e17c888b5?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=ff573beba18e5bf45eb0cccaa2c862b3&auto=format&fit=crop&w=2250&q=80",
// 	body: "HELLo THIS IS A BLOG POST!"
// });

// RESTFUL ROUTES
app.get("/", function(req, res){
	res.redirect("/blogs");
});

// INDEX
app.get("/blogs", function(req, res){
	Blog.find({}, function(err, blogs){
		if(err) {
			console.log("ERROR!");
		} else {
			res.render("index", {blogs: blogs});
		}
	});
});

// NEW
app.get("/blogs/new",function(req, res){
	res.render("new");
});

//CREATE
app.post("/blogs", function(req, res){
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.create(req.body.blog, function(err, newBlog){
		if(err) {
			res.render("new");
		} else {
			res.redirect("/blogs");
		}
	});
});

// SHOW
app.get("/blogs/:id", function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err) {
			res.redirect("/blogs");
		} else {
			res.render("show", {blog: foundBlog});
		}
	});
});

// EDIT
app.get("/blogs/:id/edit", function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err) {
			res.redirect("/blogs");
		} else {
			res.render("edit", {blog: foundBlog});
		}
	});
});

// UPDATE
app.put("/blogs/:id", function(req, res){
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
		if(err) {
			res.redirect("/blogs");
		} else {
			res.redirect("/blogs/" + req.params.id);
		}
	});
});

// DESTROY
app.delete("/blogs/:id", function(req, res){
	Blog.findByIdAndRemove(req.params.id, function(err){
		if(err) {
			res.redirect("/blogs");
		} else {
			res.redirect("/blogs");
		}
	});
});


// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});

module.exports = app;