import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";

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
                participant._id.toString() !== userId.toString());
        }).flat();

        const uniqueUsers = Array.from(new Set(users.map(user => user._id.toString())))
            .map(id => users.find(user => user._id.toString() === id));

        return res
            .status(200)
            .json(new ApiResponse(200, uniqueUsers, "Conversation users retrieved successfully"));

    } catch (error) {
        throw new ApiError(500, "Internal server error");
    }
})

export { sendMessage, getMessages, getConversationUsers }