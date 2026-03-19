require("dotenv").config();
const mongoose=require ("mongoose");
const Schema = mongoose.Schema;
const review = require ("./review.js");
const dburl=process.env.ALTAS_KEY;
async function main(){
    await mongoose.connect(dburl);
}
main().then(()=>{
    console.log("connection successfull");
});

const listschema=new mongoose.Schema({
    title:{type:String, required:true},
    description:{type:String}, 
    image: {
        filename: {
        type: String,
         default: "listingimage",
         },
         url: {
          type: String,
         default:
         "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGhvdGVsc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
          set: (v) =>
         v === ""
          ? "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGhvdGVsc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
            : v,
    },
    },
    price:{type:Number},
    location:{type:String},
    country:({type:String}),
    reviews:[{type:Schema.Types.ObjectId,
            ref:"review"}],
    owner:{type:Schema.Types.ObjectId,
            ref:"User"},
});

listschema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await review.deleteMany({ _id: { $in: listing.reviews } });
  }
});
const listing=mongoose.model("listing",listschema);
module.exports=listing;