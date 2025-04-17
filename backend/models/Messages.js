/*const mongoose = require("mongoose")

const MessageSchema = new mongoose.Schema(
  {
    sender: { type: String, required: true },
    reciever: { type: String, required: true },
    content: { type: String, required: true }
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model("Message", MessageSchema)*/
const mongoose=require('mongoose')

const MessageSchema=new mongoose.Schema(
  {
    sender:{type:String,required:true},
    reciever:{type:String,require:true},
    content:{type:String,require:true}
  },{timestamps:true}
)
module.exports=mongoose.model('Message',MessageSchema)