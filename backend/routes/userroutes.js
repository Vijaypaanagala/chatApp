import express from 'express';
const route = express.Router();
import User from '../models/usermodel.js';  // Updated import for default export
import jwt from 'jsonwebtoken'
import protect from '../middleWare/authmiddle.js'
const ctoken = (_id) => {
  return jwt.sign({ _id }, 'mhcvjmgkuhlihhvmhvjgkg', { expiresIn: '30d' });
};
route.post('/register', async (req, res) => {
  const { name, email, password, pic} = req.body;
  try {
    if (!name || !email || !password) {
      throw new Error("Name, email, and password are required.");
    }

    const users = await User.findOne({ email });
    if (users) {
      throw new Error("User already exists.");
    }

    const details = await User.create({
      name,
      email,
      password,
      pic,
    });

    if (details) {

       res.status(201).send({
        _id: details.id,
        name: details.name,
        email: details.email,
        password: details.password,
        pic: details.pic,
        token: ctoken(details._id),
       
      });
    } else {
      res.status(400);
      throw new Error("An error occurred while creating the user.");
    }
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: err.message });
  }
});
route.post('/login',async (req,res)=>{
  try{

  
  const {email,password}=req.body;
  if(!email||!password){
    throw new Error("email, and password are required.");
  }
  const details=await User.findOne({email})
  if(details&&(await details.matchpass(password))){
    res.status(201).send({
      _id: details.id,
      name: details.name,
      email: details.email,
      password: details.password,
      pic: details.pic,
      token: ctoken(details._id),
    });
  }
  else{
    res.status(404)
    throw new Error("An error occurred while login the user.");

  }
}
catch (err) {
  console.error(err.message);
  return res.status(500).json({ error: err.message });

}})
route.get('/', protect, async (req, res) => {
  try {
   

    const keyword = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: 'i' } },
            { email: { $regex: req.query.search, $options: 'i' } },
          ],
        }
      : {};

   

    const users = await User.find(keyword).find({
      _id: req.user ? { $ne: req.user._id } : undefined,
    });

    
    res.status(200).send(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});



export default route;
