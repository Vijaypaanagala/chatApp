import mongoose from "mongoose";
import bcrypt from 'bcryptjs'

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    pic: {
      type: String,
      default: "https://static.vecteezy.com/system/resources/thumbnails/009/734/564/small/default-avatar-profile-icon-of-social-media-user-vector.jpg",
    },
  },
  {
    timestamps: true,
  }
);
userSchema.methods.matchpass=async function(pass){
  return bcrypt.compare(pass,this.password);
}
userSchema.pre('save',async function(next){
  if(!this.isModified){
    next();
  }
  const salt =await bcrypt.genSalt(10);
  this.password=await bcrypt.hash(this.password,salt);

})

const User = mongoose.model("User", userSchema);
export default User;
