
var version = "1.0.0";

module.exports = function(app, passport){
	app.get("/", function(req, res){
		res.render("static/index.ejs", {version: version});
	});
}