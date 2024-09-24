import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Post } from "../models/post.model.js";
import { Comment } from '../models/comment.model.js'


const sendComment = asyncHandler(async (req, res) => {
    const { comment, postId } = req.body;
    const userId = req.user._id

    if (!postId) {
        throw new ApiError(400, "Post id is required")
    }

    const createComment = await Comment.create(
        {
            owner: userId,
            post: postId,
            content: comment
        }
    )

    if (!createComment) {
        throw new ApiError(400, "Failed to create comment")
    }

    const post = await Post.findById(postId).populate("comments")
    const postCommentsArr = post.comments
    postCommentsArr.push(createComment._id)
    post.save()

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Comment Made Successfully"))


})

const allCommentsDetails = asyncHandler(async (req, res) => {
    const { postId } = req.body

    if (!postId) {
        throw new ApiError(400, "Post id is required")
    }

    const postComments = await Post.findById(postId).populate({
        path: 'comments',
        populate: {
            path: 'owner',
            select: 'username profileImage'
        }
    })

    if (!postComments) {
        throw new ApiError(404, "Post not found")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, postComments.comments, "Fetched All Comments"))
})

const deleteComment = asyncHandler(async (req, res) => {
    const { commentId, postId } = req.body

    if (!commentId || !postId) {
        throw new ApiError(400, "Comment id and Post id is required")
    }

    await Comment.findByIdAndDelete(commentId)
    const post = await Post.findById(postId)
    if (!post) {
        throw new ApiError(404, "Post not found")
    }
    const commentsArr = post.comments
    const index = commentsArr.indexOf(commentId)
    if (index !== -1) {
        commentsArr.splice(index, 1)
        await post.save()
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Comment Deleted Successfully"))
})


export { sendComment, allCommentsDetails, deleteComment }