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





app.get('/', async (req, res)=>{
   const result = await Customer.findOne({ name: 'john doen' });
   res.send(result.email);
});


app.get('/api/customers', async (req, res)=>{
   try {      
      const result = await Customer.find();
      res.send({"customers":result});
   } catch (error) {
      res.status(500).json({error: error.message});
   }
});

app.get("/api/customers/:id", async(req,res)=>{
   console.log({
      requestParams:req.params,
      requestQuery:req.query
   });
   try {
      const {id: customerId} = req.params;
      console.log(customerId);
      const client = await Customer.findById(customerId);
      if (!client) {
         res.status(404).json({error:"user not found"})
      }else{
         res.send({client});
      }
   } catch (error) {
      res.status(500).json({er: "something went wrong"});
   }

});

app.get("/api/orders/:id",async(req,res)=>{
   try {
      const result = await Customer.findOne({"orders._id": req.params.id});
      if (result) {
         res.json(result);
      }else{
         res.status(404).json({err:"order not found"})
      }
   } catch (error) {
      res.status(500).json({err:"something went wrong"});
   }
});
 
app.delete("/api/customers/:id", async(req,res)=>{
   try {
      const customerId = req.params.id;
      const result = await Customer.deleteOne({_id:customerId});
      res.json({deleteCount:result.deletedCount});
   } catch (error) {
      res.status(500).json({er: "something went wrong"});
   }
})

app.put("/api/customers/:id", async(req , res)=>{
   try {
      const {id: customID} = req.params;
      const result = await Customer.findOneAndReplace({_id: customID},req.body,{new: true});
      console.log(result); 
      res.json({result});
   } catch (error) {
      res.status(500).json({err:"something went wrong"});
   }
});

app.patch("/api/customers/:id", async(req , res)=>{
   try {
      const {id: customID} = req.params;
      const result = await Customer.findOneAndUpdate({_id: customID},req.body,{new: true});
      console.log(result);
      res.json({result});
   } catch (error) {
      res.status(500).json({err:"something went wrong"});
   }
});

app.patch("/api/orders/:id", async(req,res)=>{
   try {
      console.log(req.params);
      const orderId = req.params.id;
      req.body._id = orderId;  
      const result = await Customer.findOneAndUpdate( 
         {"orders._id": orderId},
         {$set:{"orders.$":req.body}},
         {new: true}
      );
         console.log(result);
      if (result) {
         res.json({result});
      } else {
         res.status(404).json({erroe:"something went wrong"});
      }
   } catch (error) {
      console.log(error.message);
      res.status(500).json({error: "something went wrong"})
   }
})

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