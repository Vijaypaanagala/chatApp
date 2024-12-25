import express from 'express';
import protect from "../middleWare/authmiddle.js";
import Message from '../models/messagesmodel.js';
import User from '../models/usermodel.js';
import Chat from '../models/chatsmodel.js';

const router = express.Router();

router.post('/', protect, async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    return res.status(400).json({ message: "Content and chatId are required." });
  }

  const newMessage = {
    sender: req.user._id,
    content,
    chat: chatId,
  };

  try {
    let message = await Message.create(newMessage);

    // Populate sender and chat separately
    message = await Message.findById(message._id)
      .populate('sender', 'name pic')
      .populate('chat')
      .exec();

    // Populate chat users
    message = await User.populate(message, {
      path: 'chat.users',
      select: 'name email pic',
    });

    // Update latestMessage in the chat
    await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

    res.status(201).json(message);
  } catch (error) {
    console.error("Error creating message:", error.message);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});
router.get('/:chatId',protect, async(req,res)=>{
  try {
    const messages =await Message.find({chat:req.params.chatId})
    .populate('sender',"name email pic")
    .populate('chat')
    res.status(201).json(messages)
  } catch (error) {
    console.error("Error creating message:", error.message);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
})
export default router