 const express = require("express");
 const mongoose = require("mongoose");
 const Customer = require("./models/custormer");
 

 const app = express();
 mongoose.set('strictQuery',false);

 if (process.env.NODE_ENV !== "production" ) {
      require("dotenv").config();
 } 

 const CONNECTION = process.env.CONNECTION;

 app.use(express.json());
 app.use(express.urlencoded({ extended: true}));

 const PORT = process.env.PORT || 3000;


app.post('/api/customers', async (req, res)=>{
   console.log(req.body);
   const customer = new Customer(req.body);
   try {
      await customer.save();
      res.status(201).json({customer});
   } catch (error) {
      res.status(400).json({error: error.message});
   }

});


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