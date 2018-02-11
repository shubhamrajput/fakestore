const express = require('express');
const MoltinGateway = require('@moltin/sdk').gateway;
const keys = require('./keys');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const app = express();


app.set('view engine', 'ejs');
app.use('/assets', express.static('assets'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

const Moltin = MoltinGateway({
    client_id: keys.molten.client_id,
    client_secret: keys.molten.client_secret,
});



Moltin.Authenticate().then((response) => {
    console.log('authenticated');
});

//Middleware

const cartLength = (req,res,next)=>{
	 Moltin.Cart().Items().then((items) => {
        console.log(items);
        if(items.data.length>0){
        	next();
        }
        else{
        	res.redirect('/');
        }
    });

	
};




app.get('/', (req, res) => {

    const products = Moltin.Products.All().then((products) => {
    	console.log(products.data[0].price[0].amount);
        res.render('index', {
            products: products.data
        });
    });

});

app.get('/cart', (req, res) => {
    console.log(req.query);
    Moltin.Cart().AddProduct(req.query.id, 1).then((item) => {
        res.redirect('/');
    });


});


app.get('/cartItems',cartLength, (req, res) => {
    const cart = Moltin.Cart().Items().then((items) => {
        console.log(items);
        res.render('cartitems', {
            items: items.data
        });
    });



});

app.get('/remove', (req, res) => {
    console.log(req.query.id);
    Moltin.Cart().RemoveItem(req.query.id).then((cart) => {
        res.redirect('/cartItems');
    });

});

app.get('/delete', (req, res) => {
    Moltin.Cart().Delete().then((cart) => {
        res.redirect('/');
    });

});

app.get('/login',(req,res)=>{
	res.render('loginPage');
});

app.get('/register',(req,res)=>{
	res.render('registerPage',{
		errors:[]
	});
});

app.post('/register',(req,res)=>{
	let errors = [];
	if(req.body.email===""){
		errors.push({text:"Enter your Email!"});

	}
	if(req.body.name===""){
		errors.push({text:"Enter your Name!"});

	}
	if(req.body.password===""){
		errors.push({text:"Enter your Password!"});

	}
	if(errors.length>0)
	{
		res.render('registerPage',{
			errors:errors

		});
	}
	else{
		res.send("Succesfully registered");
	}


});

app.listen(3000, () => {
    console.log("app running on port 3000");

});