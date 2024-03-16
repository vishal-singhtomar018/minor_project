const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const methodOverride = require('method-override');
const path=require("path");
const MONGO_URL=('mongodb://localhost:27017/wanderlust');
const ejsMate=require("ejs-mate");
const WrapAsync=require("./util/wrapAsyncs.js");
const ExpressError=require("./util/ExpressError.js");
const wrapAsyncs = require("./util/wrapAsyncs.js");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public")))



main()
.then((res)=>{
    console.log("connected to DB");
})
.catch((err)=>
{
    console.log(err);
})

async function main()
{
    await mongoose.connect(MONGO_URL);
}


app.get("/",(req,res)=>
{
    res.send("hi i am a root");
})

// index route
app.get("/listings",wrapAsyncs( async(req,res)=>{
        const allListings = await Listing.find({})
        console.log(allListings);
         res.render("listings/index.ejs",{allListings});
}));

// new route

app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
})

// create route
app.post("/listings", async(req,res,next)=>
{
    const newListing =new Listing(req.body.listing);
    await  newListing.save()
    res.redirect("/listings");
}
);
// show route

app.get("/listings/:id", async (req,res)=>
{
    let {id}=req.params;
   const listing= await Listing.findById(id);
    res.render("listings/show.ejs",{listing})

});

// edit route
app.get("/listings/:id/edit",WrapAsync( async(req,res)=>
{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}));

// update route
app.put("/listings/:id",WrapAsync( async (req,res)=>
{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

app.delete("/listings/:id",WrapAsync( async(req,res)=>
{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));
// app.get("/testListing",async (req,res)=>{
//     let samplelisting=new Listing({
//         title:"My new villa",
//         description:"My the beach",
//         price:1200,
//         location:"calangute,Goa",
//         country:"India",
//     });

//     await samplelisting.save()
//     .then((res)=>{
//         console.log("sample was saved");
//     })
//     .catch((err)=>{
//         console.log(err);
//     })
// });
app.all("*",(req,res,next)=>
{
    next(new ExpressError(404 ,"Page Not Found!"));
})

app.use((err,req,res,next)=>
{
   let {statuscode=500 ,message="something went wrong"}=err;
   res.status(statuscode).send(message);
})

app.listen(3000,()=>{
    console.log("server is listening to port 3000");
})