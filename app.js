var express=require("express");
var path=require("path");
var bodyParser=require("body-parser");
//init app

var app=express();


//setup template enginee
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//mongodb connections
const MongoClient=require("mongodb").MongoClient;
const mongoURL="mongodb://localhost:27017/todo";
const objectId=require("mongodb").ObjectId;

MongoClient.connect(mongoURL, function(err, database){
	console.log("MongoDB connected!");
	if(err){
		console.log(err);
	}
	todos=database.collection("todos");
});



//routes
app.get("/",function(req,res){
	//res.send("Index page");
	todos.find({}).toArray(function(err, docs){
		if(err){
			console.log(err);
		}
		res.render("index",{docs: docs});
	});	
});

app.get("/todos/:id",function(req,res){
	todos.findOne({_id: objectId(req.params.id)}, function(err, doc){
		if(err)
			{
				console.log(err);
			}
		res.render("show", {doc: doc});
	});
});

app.post("/todos/add",function(req,res){
	todos.insert({title: req.body.title, description: req.body.description},function(err, result){
		if(err){
			console.log(err);
		}
		res.redirect("/");
	});	
});

app.get("/todos/edit/:id",function(req,res){
	
	res.render("edit");
});

app.post("/todos/update/:id",function(req,res){
	res.redirect("/");
});

app.get("/todos/delete/:id",function(req,res){
	res.redirect("/");
});
/*app.get("/manage",function(req,res){
	
	res.render("manage",{title:"Manage"});
});

app.get("/posts",function(req,res){
	
	res.render("posts",{title:"Posts"});
});

app.get("/private",function(req,res){
	
	res.render("private",{title:"Private"});
});*/


	
app.listen(5000, function(){
	console.log("App listening at http://localhost:5000");
});