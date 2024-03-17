const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const listingSchema=new Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image:{
        type:String,
        default:
        "https://cdn.pixabay.com/photo/2018/01/14/23/12/nature-3082832_1280.jpg",
        set:(v)=>
        v ===" "
        ?"https://cdn.pixabay.com/photo/2018/01/14/23/12/nature-3082832_1280.jpg"
        :v,
    },
    price:Number,
    location:String,
    country:String,
    lastTreatment:String,
    Time:String
})

const Queries=mongoose.model("Queries",listingSchema);
module.exports=Queries;



const suggestionSchema=new Schema({

    solution:String,
    image:{
        type:String,
        default:
        "https://cdn.pixabay.com/photo/2018/01/14/23/12/nature-3082832_1280.jpg",
        set:(v)=>
        v ===" "
        ?"https://cdn.pixabay.com/photo/2018/01/14/23/12/nature-3082832_1280.jpg"
        :v,
    },

})

const suggestion=mongoose.model("suggestion",suggestionSchema);
module.exports=suggestion;