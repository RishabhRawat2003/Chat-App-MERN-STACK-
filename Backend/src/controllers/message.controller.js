import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";
import { getReceiverSocketId, io } from "../app.js";

const sendMessage = asyncHandler(async (req, res) => {
    try {
        const { message } = req.body
        const { id: receiverId } = req.params
        const senderId = req.user._id


        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        })

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
            })
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            message
        })

        if (newMessage) {
            conversation.messages.push(newMessage._id)
        }

        await Promise.all([conversation.save(), newMessage.save()])

        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
            newMessage.read = true
            await newMessage.save()
        }

        return res
            .status(200)
            .json(new ApiResponse(200, newMessage, "Message sent Successfully"))

    } catch (error) {
        throw new ApiError(500, "Internal server error")
    }
})

const getMessages = asyncHandler(async (req, res) => {
    try {
        const { id: receiverId } = req.params
        const senderId = req.user._id

        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        }).populate("messages")

        if (!conversation) {
            return res
                .status(200)
                .json(new ApiResponse(200, [], ""))
        }

        const messages = conversation.messages

        return res
            .status(200)
            .json(new ApiResponse(200, messages, ""))

    } catch (error) {
        throw new ApiResponse(500, "Internal server error")
    }
})

const getConversationUsers = asyncHandler(async (req, res) => {
    try {
        const userId = req.user._id;

        const conversations = await Conversation.find({
            participants: userId
        }).populate('participants', '_id username profileImage');

        const users = conversations.map(conversation => {
            return conversation.participants.filter(participant =>
                participant._id.toString() !== userId.toString()
            );
        }).flat();

        const uniqueUsers = Array.from(new Set(users.map(user => user._id.toString())))
            .map(id => users.find(user => user._id.toString() === id));

        const lastMessagesMap = await lastMessage(userId);

        const usersWithLastMessages = uniqueUsers.map(user => {
            return {
                ...user.toObject(),
                lastMessage: lastMessagesMap[user._id.toString()] || null
            };
        });

        return res
            .status(200)
            .json(new ApiResponse(200, usersWithLastMessages, "Conversation users and their last messages retrieved successfully"));

    } catch (error) {
        console.error(error);
        throw new ApiError(500, "Internal server error");
    }
});


const lastMessage = async (userId) => {
    try {
        const conversations = await Conversation.find({
            participants: userId
        }).populate('messages', '_id read message receiverId');

        const lastMessageMap = {};

        conversations.forEach(conversation => {
            const messages = conversation.messages;
            if (messages.length > 0) {
                const lastMessage = messages[messages.length - 1];
                const otherParticipant = conversation.participants.find(participant => participant._id.toString() !== userId.toString());
                if (otherParticipant) {
                    lastMessageMap[otherParticipant._id.toString()] = lastMessage;
                }
            }
        });

        return lastMessageMap;

    } catch (error) {
        console.error(error);
        throw new ApiError(500, "Internal server error");
    }
};



const readMessage = asyncHandler(async (req, res) => {
    try {
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        }).populate('messages');

        if (!conversation) {
            throw new ApiError(404, "Conversation not found");
        }

        let messages = conversation.messages;

        let unreadMessages = messages.filter(msg => !msg.read);
        if (unreadMessages.length > 0) {
            unreadMessages.forEach(async (msg) => {
                msg.read = true;
                await msg.save();
            });
        }

        return res.status(200).json(new ApiResponse(200, unreadMessages, "Messages read successfully"));

    } catch (error) {
        console.error(error);
        throw new ApiError(500, "Internal server error");
    }
});



export { sendMessage, getMessages, getConversationUsers, readMessage }