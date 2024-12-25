import express from "express";
import protect from "../middleWare/authmiddle.js";
import Chat from "../models/chatsmodel.js";
import User from "../models/usermodel.js";

const route = express.Router();

// @description     Create or fetch One-to-One Chat
// @route           POST /api/chat/
// @access          Protected
route.post("/", protect, async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("UserId param not sent with request");
    return res.status(400).json({ message: "UserId is required" });
  }

  try {
    // Check if the chat already exists
    let isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");

    isChat = await User.populate(isChat, {
      path: "latestMessage.sender",
      select: "name pic email",
    });

    // If chat exists, return it
    if (isChat.length > 0) {
      return res.status(200).json(isChat[0]);
    }

    // Create a new chat if it doesn't exist
    const chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    const createdChat = await Chat.create(chatData);

    const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
      "users",
      "-password"
    );

    return res.status(200).json(fullChat);
  } catch (error) {
    console.error("Error in chat creation:", error.message);
    return res.status(500).json({ error: error.message });
  }
});
route.get('/', protect, async (req, res) => {
  try {
    let chats = await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate('users', '-password')
      .populate('groupAdmin', '-password')
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    // Populate the nested `latestMessage.sender`
    chats = await User.populate(chats, {
      path: "latestMessage.sender",
      select: "name pic email",
    });

    res.status(201).send(chats);
    // Use the correct variable
  } catch (error) {
    console.error("Error in fetching chats:", error.message);
    return res.status(500).json({ error: error.message });
  }
});
route.post("/group", protect, async (req, res) => {
  const { name, users } = req.body;

  // Validate required fields
  if (!name || !users || users.length < 2) {
    return res.status(400).send("All fields are required and at least 2 users must be selected");
  }

  try {
    // Ensure there are at least 2 users in the group
    let usersArray = users; // Directly use the array

    // Add the current user to the group
    usersArray.push(req.user._id);

    // Create the group chat
    const group = await Chat.create({
      chatName: name,
      isGroupChat: true,
      users: usersArray,
      groupAdmin: req.user._id,
    });

    // Populate full group info
    const fullInfo = await Chat.findOne({ _id: group._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

   // Debugging
    res.status(201).send(fullInfo);
  } catch (error) {
    console.error("Error in creating group chat:", error.stack);
    return res.status(500).json({ error: error.message });
  }
});

route.put('/rename',protect,async (req,res)=>{
  const {chatId,chatName}=req.body;
  const details =await Chat.findByIdAndUpdate(chatId,
    {
      chatName,
    },
    {
      new:true
    }
  )
  .populate('users','-password')
  .populate('groupAdmin','-password')
  if(!details){
    return res.send("chat not found")
  }
  else{
    
    res.status(201).json(details)
  }

})
route.put('/AddGroup',protect,async (req,res)=>{
  const {chatId,userId}=req.body;
  const details =await Chat.findByIdAndUpdate(chatId,
    
      {$push:{users:userId}}
    ,
    {
      new:true
    }
  )
  .populate('users','-password')
  .populate('groupAdmin','-password')
  if(!details){
    return res.send("chat not found")
  }
  else{
   
    res.status(201).json(details)
  }

})
route.put('/RemoveGroup',protect,async (req,res)=>{
  const {chatId,userId}=req.body;
  const details =await Chat.findByIdAndUpdate(chatId,
    
      {$pull:{users:userId}}
    ,
    {
      new:true
    }
  )
  .populate('users','-password')
  .populate('groupAdmin','-password')
  if(!details){
    return res.send("chat not found")
  }
  else{

    res.status(201).json(details)
  }

})




export default route;
