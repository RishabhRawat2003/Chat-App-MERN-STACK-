import mongoose, { Schema } from "mongoose"

const messageSchema = new Schema(
    {
        senderId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        receiverId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        message: {
            type: String,
            required: true
        },
        read: {
            type: Boolean,
            default: false
        },
    },
    {
        timestamps: true
    }
)

export const Message = mongoose.model("Message", messageSchema)