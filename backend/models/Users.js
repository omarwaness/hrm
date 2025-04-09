const mongoose=require("mongoose");

const UserSchema=new mongoose.Schema(
    {
        firstName:{type:String , required:true},
        lastName:{type:String, required:true},
        phoneNumber:{type:Number,required:true},
        role:{type:String,enum:['Admin','HR','Employee','Conditate'],required:true},
        email:{type:String, required:true,unique:true},
        password:{type:String,required:true}
    },
    {
        timestamps:true
    }
);
module.exports=mongoose.model("User",UserSchema);