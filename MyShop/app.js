var express = require("express"); // call express to be used by the application
var app = express();
const path = require('path');
const VIEWS = path.join(__dirname, 'views');
var fs = require('fs'); //file system
app.set('view engine', 'jade');

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extend: true}));


var mysql = require('mysql'); // allow access to sql

app.use(express.static("scripts")); // allow the application to access the scripts folder content to use the application 
app.use(express.static("images")); // allow the application to access the images folder content to use the application 
app.use(express.static("models")); // allow the application to access the models folder content to use the application 

// function to set up a simple hello response

var reviews = require("./models/reviews.json")


const db = mysql.createConnection({
 
host: 'den1.mysql3.gear.host',
user: 'renata',
password: 'mutantes1!',
database: 'renata',
  
});


db.connect((err) =>{
if (err){
  console.log("Connection Refused ... Please check login details")
  //throw(err)
}
else{
  console.log("Well done you are connect...")
}
})



// Create a Database Table

app.get('/createtable', function(req,res){
let sql = 'CREATE TABLE books (Id int NOT NUll AUTO_INCREMENT PRIMARY KEY, Name varchar(255), Price int, Image varchar(255), Author varchar(255));'
// let sql = 'drop table books' 
  let query = db.query(sql,(err,res)=>{
  if (err) throw err;
   console.log(res);
   
 })
 res.send("table created! Great!")

});



app.get('/createreviewstable', function(req,res){
let sql = 'CREATE TABLE reviews (Id int NOT NUll AUTO_INCREMENT PRIMARY KEY, Name varchar(255), Review varchar(255));'
// let sql = 'drop table books' 
  let query = db.query(sql,(err,res)=>{
  if (err) throw err;
   console.log(res);
   
 })
 res.send("table created! Great!")

});

//End create table


//SQL Insert Data Example

app.get('/insert', function(req,res){
  let sql = 'INSERT INTO books (Name, Price, Image, Author) VALUES ("My Diarrhe", 17, "my diarrhe.jpg", "Miranda Sings");' 
 // let sql = 'INSERT INTO books (Name, Price, Image, Author) VALUES ("Diary of a Wimpy Kid: The Getaway", 12, "diary of wimpy kid.jpg", "Jeff Kinney");'
 let query = db.query(sql,(err,res)=>{
  if (err) throw err;
   console.log(res);
   
 })
 res.send("Item Created!")

});


// End SQL Insert Data Example



// SQL QUERY Just for show example

app.get('/queryme', function(req,res){
 let sql = 'SELECT * FROM books'
 let query = db.query(sql,(err,res)=>{
  if (err) throw err;
   console.log(res);
   
 })
 res.send("Well Done!!")

});


// End SQL QUERY just for show Example



// function to render the home page
app.get('/', function(req, res){
  //res.send("Hello World!"); // this is commented out to allow the index 
  res.render('index', {root: VIEWS});
  console.log("Home Page!");
});

//function to render the books page
app.get('/books', function(req, res){
  //res.send("Hello World!"); // this is commented out to allow the index 
  let sql = 'SELECT * FROM books;' 
  let query = db.query(sql, (err, res1) =>{
   if (err)
   throw(err);  
  
  res.render('books', {root: VIEWS, res1}); // use the render command so that the object render HTML page
  console.log(res1);
});

console.log("Home Page!");
});



//function the Individual books page
app.get('/item/:id', function(req, res){
  //res.send("Hello World!"); // this is commented out to allow the index 
  let sql = 'SELECT * FROM books WHERE Id = "'+req.params.id+'";' 
  let query = db.query(sql, (err, res1) =>{
   if (err)
   throw(err);  
  
  res.render('item', {root: VIEWS, res1}); // use the render command so that the object render HTML page
  
});

console.log("It's the Individual books page!");
});




// function to render the create page
app.get('/create', function(req, res){

  res.render('create', {root: VIEWS});
  console.log("Create Page!");
});



// function to add data to data based on button press
app.post('/create', function(req, res){
  var name = req.body.name
  let sql = 'INSERT INTO books (Name, Price, Image, Author) VALUES ("'+req.body.name+'", '+req.body.price+', "'+req.body.image+'", "'+req.body.author+'");'
  let query = db.query(sql,(err,res)=>{
  if (err) throw err;
   console.log(res);
   console.log(name)
   
 });  
res.render('index',{ root: VIEWS});
});


// Function to edit database data used on button press and form
app.get('/edit/:id', function(req, res){

let sql = 'SELECT * FROM books WHERE Id = "'+req.params.id+'";' 
  let query = db.query(sql, (err, res1) =>{
   if (err)
   throw(err);  
  
  res.render('edit', {root: VIEWS, res1}); // use the render command so that the object render HTML page
  console.log(res1);
});
});



app.post('/edit/:id', function(req, res){
  var name = req.body.name
  let sql = 'UPDATE books set Name = "'+req.body.name+'", Price =  "'+req.body.price+'", Image = "'+req.body.image+'", Author = "'+req.body.author+'" WHERE Id = "'+req.params.id+'";'  
  let query = db.query(sql,(err,res)=>{
  if (err) throw err;
   console.log(res);
   console.log(name)
   
 });  
res.redirect('/item/' + req.params.id);
});



 // function to delete database adta based on button press and form
app.get('/delete/:id', function(req, res){
 // res.send("Hello cruel world!"); // This is commented out to allow the index view to be rendered
 let sql = 'DELETE FROM books WHERE Id = "'+req.params.id+'";'
 let query = db.query(sql, (err, res1) =>{
  if(err)
  throw(err);
 
  res.redirect('/books'); // use the render command so that the response object renders a HHTML page
  
 });
 
  console.log("Its Gone!");
 });



// From here on is JSON DATA Manipulation 
app.get('/reviews', function(req, res){
 res.render("reviews", {reviews:reviews}
 
 );
 console.log("Reviews on Show");
}

);

// route to render add JSON page
app.get('/add', function(req, res){
 // res.send("Hello cruel world!"); // This is commented out to allow the index view to be rendered
  res.render('add', {root: VIEWS});
  console.log("Now you are leaving feedback!");
});


// post request to add JSO REVIEW


app.post('/add', function(req, res){
	var count = Object.keys(reviews).length; // Tells us how many products we have its not needed but is nice to show how we can do this
	console.log(count);
	
	// This will look for the current largest id in the reviews JSON file this is only needed if you want the reviews to have an auto ID which is a good idea 
	
	function getMax(reviews, id) {
		var max
		for (var i=0; i<reviews.length; i++) {
			if(!max || parseInt(reviews[i][id]) > parseInt(max[id]))
				max = reviews[i];
			
		}
		return max;
	}
	
	var maxPpg = getMax(reviews, "id"); // This calls the function above and passes the result as a variable called maxPpg.
	newId = maxPpg.id + 1;  // this creates a nwe variable called newID which is the max Id + 1
	console.log(newId); // We console log the new id for show reasons only
	
	// create a new product based on what we have in our form on the add page 
	
	var review = {
		name: req.body.name, // name called from the add.jade page textbox
		id: newId, // this is the variable created above
		content: req.body.content, // content called from the add.jade page textbox

	};
		console.log(review) // Console log the new product 
	var json  = JSON.stringify(reviews); // Convert from object to string
	
	// The following function reads the json file then pushes the data from the variable above to the reviews JSON file. 
	fs.readFile('./models/reviews.json', 'utf8', function readFileCallback(err, data){
							if (err){
		throw(err);
	 }else {
		reviews.push(review); // add the information from the above variable
		json = JSON.stringify(reviews, null , 4); // converted back to JSON the 4 spaces the json file out so when we look at it it is easily read. So it indents it. 
		fs.writeFile('./models/reviews.json', json, 'utf8'); // Write the file back
		
	}});
	res.redirect("/reviews")
});


// Page to render edit review
// This function filters the reviews by looking for any review which has an Id the same as the one passed in the url
app.get('/editreviews/:id', function(req, res){
 function chooseProd(indOne){
   return indOne.id === parseInt(req.params.id)
  
 }
 
 console.log("Id of this review is " + req.params.id);
 // declare a variable called indOne which is a filter of reviews based on the filtering function above 
  var indOne = reviews.filter(chooseProd);
 // pass the filtered JSON data to the page as indOne
 res.render('editreview' , {indOne:indOne});
  console.log("Edit Review Page Shown");
 });


// end Page to edit review 

// Create post request to edit the individual review
app.post('/editreviews/:id', function(req, res){
 var json = JSON.stringify(reviews);
 var keyToFind = parseInt(req.params.id); // Id passed through the url
 var data = reviews; // declare data as the reviews json file
 var index = data.map(function(review){review.id}).keyToFind // use the paramater passed in the url as a pointer to find the correct review to edit
  //var x = req.body.name;
 var y = req.body.content
 var z = parseInt(req.params.id)
 reviews.splice(index, 1, {name: req.body.name, content: y, id: z});
 json = JSON.stringify(reviews, null, 4);
 fs.writeFile('./models/reviews.json', json, 'utf8'); // Write the file back
 res.redirect("/reviews");
});

// end post request to edit the individual review


// end route to delete review

app.get('/deletereview/:id', function(req, res){
 var json = JSON.stringify(reviews);
 
 var keyToFind = parseInt(req.params.id); // Id passed through the url
 
 var data = reviews;
 
 var index = data.map(function(d){d['id'];}).indexOf(keyToFind)
 
 reviews.splice(index, 1);
 
 json = JSON.stringify(reviews, null, 4);
 fs.writeFile('./models/reviews.json', json, 'utf8'); // Write the file back
 res.redirect("/reviews");
 
});


// End delete review


// Search function
app.post('/search', function(req, res) {
  let sql = 'SELECT * FROM books WHERE name LIKE "%'+req.body.search+'%";';
  let query = db.query(sql, (err, res1) => {
    if(err)
    throw (err)
    // res.redirect("/error")
    
    res.render('books', {root: VIEWS, res1});
    console.log("Successful search......");
  });
});

// End search function


// render the contact page
app.get('/contact' , function(req, res){
  res.render("contact.jade") 

})

//End contact

// we need to set the requirements for the application to run

app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0" , function(){
  console.log("App is running ..... yeeeeeeessssss!"); 
});
