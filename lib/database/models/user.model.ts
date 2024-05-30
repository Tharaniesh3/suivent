import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
    zkid:{type: String,required:true,unique : true},

})  
const User = models.User || model('User',UserSchema);
export default User;