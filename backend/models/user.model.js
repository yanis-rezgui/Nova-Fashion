import mongoose from "mongoose";



const userSchema = new mongoose.Schema({

    firstName : {
        type : String,
        required : true,
        maxLength : 100,
        minLength : 2,
        trim : true
    },
    lastName : {
          type : String,
        required : true,
        maxLength : 100,
        minLength : 2,
        trim : true
    },
    email : {
           type : String,
       required: [true, "Email is required"],
       unique : true,
       match : [/\S+@\S+\.\S+/, 'Please fill a valid mail address'],
       minLength : 5,
       maxLength : 255
    },
     
    password : {
        type : String,
        required : [true, "Password is required"],
      
    }
}, {timestamps : true});

const User = mongoose.model('User', userSchema);

export default User;