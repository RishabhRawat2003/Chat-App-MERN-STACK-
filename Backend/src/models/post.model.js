import mongoose, { Schema } from "mongoose"

const postSchema = new Schema(
    {
        description: {
            type: String
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        like: {
            type: Schema.Types.ObjectId,
            ref: 'Like',
        },
        comments: {
            type: Schema.Types.ObjectId,
            ref: 'Comment',
        },
        image: {
            type: String,
            required: true
        },
    },
    {
        timestamps: true
    }
)

export const Post = mongoose.model("Post", postSchema)