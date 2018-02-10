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
		//console.log(products.data[0].relationships.main_image.data.id);
		res.render('index',{products:products.data});
});
	
});




app.listen(3000,()=>{
	console.log("app running on port 3000");

});