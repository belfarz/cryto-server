 const express = require("express");
 const axios = require('axios');
 const mongoose = require("mongoose");
 const Customer = require("./models/custormer");
 const User = require("./models/users")
 const Payed = require("./models/payed")
 const cors = require('cors');
 const bcrypt = require('bcrypt')


 const app = express();
 app.use(cors());
 mongoose.set('strictQuery',false);

 if (process.env.NODE_ENV !== "production" ) {
      require("dotenv").config();
 } 

 const CONNECTION = process.env.CONNECTION;

 app.use(express.json());
 app.use(express.urlencoded({ extended: true}));

 const PORT = process.env.PORT || 3000;

 //--------------------------------end points--------------------------------------------------------------------
app.post('/api/customers', async (req, res)=>{
   console.log(req.body);
   const { coinId } = req.body
   console.log(coinId);
   const findUser = await Customer.findOne({ coinId });
   if(findUser != null){
      return res.send('Coin Already exist')
   }
   const customer = new Customer(req.body);
   try {
      await customer.save();
      res.status(201).json({customer});
   } catch (error) {
      res.status(400).json({error: error.message});
   }

});
 //----------------------------------------------------------------------------------------------------
app.post('/api/payed', async (req, res)=>{
   console.log(req.body);
   const payed = new Payed(req.body);
   try {
      await payed.save();
      res.status(201).json({payed});
   } catch (error) {
      res.status(400).json({error: error.message});
   }

});
 //----------------------------------------------------------------------------------------------------
app.get("/api/coindetails/:id",async (req, res) => {                                                     
   const cmc_id = req.params.id;
   try {
      // console.log(undefinedVariable);
       const option1 = await Customer.findOne({"cmc_id": cmc_id});
       const option2 = await Payed.findOne({"cmc_id": cmc_id});
       const user = option1 ? option1 : option2
       res.json(user);
   } catch (error) {
       res.status(404).json({error: error.message})  
   }

 });
 //----------------------------------------------------------------------------------------------------
app.post('/api/login', async (req, res)=>{
   
   const {email , password} = req.body
   const findUser = await User.findOne({ email });
   console.log(findUser);

   if(findUser == null){
      return res.status(400).send('Cannot find user')
   }

   try {
      if(await bcrypt.compare(password, findUser.password)) {
         res.status(200).json({
            user: email,
            token: "Enjoy your pizza, here's your tokens."
          });
       } else {
         res.status(401).json({ message: "No user with those credentials found!" });
       }
      
   } catch (error) {
      res.status(400).json({error: error.message});
   }

});
 //----------------------------------------------------------------------------------------------------
app.post('/api/register', async (req, res)=>{
   
   try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10)
      const newUser = { email: req.body.email, password: hashedPassword }
      const user = new User(newUser);
      await user.save();
      res.status(201).json("Hurray you've been registered!!!!");
   } catch (error) {
      res.status(400).json({error: error.message});
   }

});
 //----------------------------------------------------------------------------------------------------
app.get("/api/promoted", async (req, res)=>{
   const data = await Customer.find()
   try {
       
       res.json(data);
   } catch (error) {
      res.status(404).json({error: error.message}) 
   }
})
 //----------------------------------------------------------------------------------------------------
app.get("/api/payedpromotion", async (req, res)=>{
   const data = await Payed.find()
   try {
       
       res.json(data);
   } catch (error) {
      res.status(404).json({error: error.message}) 
   }
})
//----------------------------------------------------------------------------------------------------
app.post('/api/coins', async (req, res) => {
   try {
     const { payedUrl } = req.body; // Extracting payedUrl from the request body;
     // Make a call to another API using axios
     console.log(payedUrl)
     const response = await axios.get(payedUrl);
 
     // Sending the response from the other API back to the client

     res.status(200).json(response.data);
   } catch (error) {
     console.error(error);
     res.status(500).json({ error: 'Internal Server Error' });
   }
 });
 //----------------------------------------------------------------------------------------------------

 app.get("/api/latest", async (req, res) =>{
   try {
      const response = await axios.get("https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest", {
       headers: {
         'X-CMC_PRO_API_KEY': 'f14de90f-4965-4528-8a0f-b41e916cbcf8'
      },
     });
 
     res.json(response.data.data);
   } catch (error) {
      res.status(404).json({error: error.message}) 
   }
 });
 //----------------------------------------------------------------------------------------------------
 app.get("/api/address/:id", async (req, res) =>{
   try {
      const address = req.params.id
      const response = await axios.get(`https://pro-api.coinmarketcap.com/v2/cryptocurrency/info?address=${address}`, {
       headers: {
         'X-CMC_PRO_API_KEY': 'f14de90f-4965-4528-8a0f-b41e916cbcf8'
      },
     });
     const dataKeys = Object.keys(response.data.data);
     res.json(dataKeys);
   } catch (error) {
      res.status(404).json({error: error.message}) 
   }
 });

 //----------------------------------------------------------------------------------------------------
 app.post('/api/coinmarketcap', async (req, res) => {
   try {
     const { coinIds } = req.body; // Extract coin IDs from the request body
     console.log("hello"+coinIds)
     const response = await axios.get(`https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?id=${coinIds}`, {
       headers: {
         'X-CMC_PRO_API_KEY': 'f14de90f-4965-4528-8a0f-b41e916cbcf8', 
         "skip_invalid" : true
    },
     });
 
     res.json(response.data);
   } catch (error) {
     console.error(error.message);
     res.status(500).send('Internal Server Error');
   }
 });
 //----------------------------------------------------------------------------------------------------
 app.post('/api/metadata', async (req, res) => {

   try {
     const { coinIds } = req.body; // Extract coin IDs from the request body
     console.log("hello"+coinIds)
     const response = await axios.get(`https://pro-api.coinmarketcap.com/v2/cryptocurrency/info?id=${coinIds}&skip_invalid=true`, {
       headers: {
         'X-CMC_PRO_API_KEY': 'f14de90f-4965-4528-8a0f-b41e916cbcf8', 
         "skip_invalid" : true
    },
     });
     console.log(response)
     res.json(response.data);
   } catch (error) {
     console.error(error.message);
     res.status(500).send('Internal Server Error'+error.message);
   }
 });

 //----------------------------------------------------------------------------------------------------
app.post('/', (req, res)=>{
   res.send("hello belfarz post!!");
});

const start = async() => {
   try {
   await mongoose.connect(CONNECTION, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

   app.listen( PORT, ()=>{
      console.log("app listening on port " + PORT + " and database connection is a sucess");
   });
   } catch (error) {
      console.log(error.message);  
   };
};

start();