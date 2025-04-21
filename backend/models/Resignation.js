const mongoose =require('mongoose')
const ResignationSchema=new mongoose.Schema(
  {
    sender:{type:String,required:true},
    firstName:{type:String,required:true},
    lastDay:{type:Date,required:true},
    reason:{type:String,required:true}
  },
  {
    timestamps:true,
  }
)
module.exports=mongoose.model("Resignation",ResignationSchema)
