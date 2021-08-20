// create express app
const exp = require('express');
const app = exp();
const path = require("path")
const cors = require('cors')
app.use(cors())


//RazorPay
const shortid = require('shortid')
const Razorpay = require('razorpay')
const bodyParser = require('body-parser')
app.use(bodyParser.json())
//RazorPay

//connecting built of react with current server
app.use(exp.static(path.join(__dirname, './build/')))

//import apis
const adminApi = require("./APIS/admin-api")
const booksApi = require("./APIS/books-api")
const userApi = require("./APIS/user-api")
const cartApi = require("./APIS/cart-api")
const orderApi = require("./APIS/order-api")


//execute specific api based on path
app.use('/admin', adminApi)
app.use('/books', booksApi)
app.use('/user', userApi)
app.use('/cart', cartApi)
app.use('/order', orderApi)


//import mongo client
const mongoClient = require("mongodb").MongoClient;

//db connectivity
//db connection url
const dburl = process.env.DATABASE_URL;


//database obj

//connect with mongo server
mongoClient.connect(dburl, {useNewUrlParser:true,useUnifiedTopology:true}, (err,client)=>{

    if(err){
        console.log("err in db connect",err)
    }
    else{
        let databaseObject = client.db("book-store")
        let admincollectionObject=databaseObject.collection("admincollection")
        let bookscollectionObject=databaseObject.collection("bookscollection")
        let usercollectionObject=databaseObject.collection("usercollection")
        let usercartcollectionObject=databaseObject.collection("usercartcollection")
        let userordercollectionObject=databaseObject.collection("userordercollection")
        

        //sharing collection object
        app.set("admincollectionObject", admincollectionObject)
        app.set("bookscollectionObject", bookscollectionObject)
        app.set("usercollectionObject", usercollectionObject)
        app.set("usercartcollectionObject", usercartcollectionObject)
        app.set("userordercollectionObject", userordercollectionObject)


        console.log("DB connection success")
    }
})

//RazorPay
app.use(cors())
app.use(bodyParser.json())

const razorpay = new Razorpay({
	key_id: 'rzp_test_qtqNRFhd8MRg8Z',
	key_secret: 'r4hpO08Rf30dc9s6mBfEa8sH'
})

app.get('/logo.svg', (req, res) => {
	res.sendFile(path.join(__dirname, 'logo.svg'))
})

app.post('/verification', (req, res) => {
	// do a validation
	const secret = '12345678'

	console.log(req.body)

	const crypto = require('crypto')

	const shasum = crypto.createHmac('sha256', secret)
	shasum.update(JSON.stringify(req.body))
	const digest = shasum.digest('hex')

	console.log(digest, req.headers['x-razorpay-signature'])

	if (digest === req.headers['x-razorpay-signature']) {
		console.log('request is legit')
		// process it
		require('fs').writeFileSync('payment1.json', JSON.stringify(req.body, null, 4))
	} else {
		// pass it
	}
	res.json({ status: 'ok' })
})

app.post('/razorpay/:totalPrice', async (req, res) => {
	const payment_capture = 1
	const amount = req.params.totalPrice
	const currency = 'INR'

	const options = {
		amount: amount * 100,
		currency,
		receipt: shortid.generate(),
		payment_capture
	}

	try {
		const response = await razorpay.orders.create(options)
		console.log(response)
		res.json({
			id: response.id,
			currency: response.currency,
			amount: response.amount
		})
	} catch (error) {
		console.log(error)
	}
})
//RazorPay





//assign port 
const port = process.env.PORT||8080;
app.listen(port, () => console.log(`server listening on port ${port}..`))