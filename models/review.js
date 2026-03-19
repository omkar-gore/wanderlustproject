const mongoose=require ("mongoose");
const Schema = mongoose.Schema;
// async function main(){
//     await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
// }
// main().then(()=>{
//     console.log("connection successfull");
// });
const reviweschema=new mongoose.Schema({
    comment:{type: String},
    rating:{type:Number,min:1,max:5},
     author: {
    type: Schema.Types.ObjectId,
    ref: "User"
    },
    createdAt:{type:Date, default:Date.now()},
});
const review=mongoose.model("review",reviweschema);
module.exports=review;