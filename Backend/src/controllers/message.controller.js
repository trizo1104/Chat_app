const User = require("../models/user.model");
const Message = require("../models/message.model");
const cloudinary = require("../lib/cloundinary");
const { getRecieverSocketId, io } = require("../lib/socket");

const getUserForSideBar = async (req, res) => {
  try {
    const loggInUserId = req.user._id;
    const filterUser = await User.find({ _id: { $ne: loggInUserId } }).select(
      "-password"
    );
    return res.status(200).json(filterUser);
  } catch (error) {
    console.log("get user for side bar error: ", error);
    return res.status(500).json({ mess: "Internal server" });
  }
};

const getMessage = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, recieverId: userToChatId },
        { senderId: userToChatId, recieverId: myId },
      ],
    }).sort({ createdAt: 1 });

    return res.status(200).json(messages);
  } catch (error) {
    console.log("get message error: ", error);
    return res.status(500).json({ mess: "Internal server" });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: recieverId } = req.params;

    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      recieverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    const receiverSocketId = getRecieverSocketId(recieverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    return res.status(201).json(newMessage);
  } catch (error) {
    console.log("send message error: ", error);
    return res.status(500).json({ mess: "Internal server" });
  }
};

module.exports = { getUserForSideBar, getMessage, sendMessage };
