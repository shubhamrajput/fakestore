const express = require('express');
const MoltinGateway = require('@moltin/sdk').gateway;
const keys = require('./keys');
const app = express();


app.set('view engine', 'ejs');
app.use('/assets', express.static('assets'));

const Moltin = MoltinGateway({
  client_id: keys.molten.client_id,
  client_secret:keys.molten.client_secret,
});



Moltin.Authenticate().then((response) => {
  console.log('authenticated');
});


app.get('/',(req,res)=>{

	const products = Moltin.Products.All().then((products) => {
		res.render('index',{products:products.data});
});
	
});

app.get('/cart',(req,res)=>{
console.log(req.query);
	Moltin.Cart().AddProduct(req.query.id, 1).then((item) => {
		res.redirect('/');
});


});


app.get('/cartItems',(req,res)=>{
	const cart = Moltin.Cart().Items().then((items)=>{
		console.log(items);
		res.render('cartitems',{items:items.data});
	});
	
	

});

app.get('/remove',(req,res)=>{
	console.log(req.query.id);
	Moltin.Cart().RemoveItem(req.query.id).then((cart) => {
		res.redirect('/cartItems');
});

});

app.get('/delete',(req,res)=>{
	Moltin.Cart().Delete().then((cart) => {
		res.redirect('/');
});

});

app.listen(3000,()=>{
	console.log("app running on port 3000");

});