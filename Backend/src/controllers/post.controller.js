import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import { Post } from '../models/post.model.js'
import { User } from '../models/user.model.js'


const uploadPost = asyncHandler(async (req, res) => {
    const { caption } = req.body
    const postImage = req.file?.path
    const userId = req.user._id

    if (!postImage) {
        throw new ApiError(400, 'Image is required')
    }

    const imageString = await uploadOnCloudinary(postImage)

    if (!imageString.url) {
        throw new ApiError(500, 'Failed to upload image')
    }

    const user = await User.findById(userId).select("-password -refreshToken")

    const post = await Post.create({
        caption,
        image: imageString.url,
        owner: user
    })

    if (!post) {
        throw new ApiError(500, 'Failed to create post')
    }

    user.post.push(post._id)
    await user.save()

    return res
        .status(200)
        .json(new ApiResponse(200, { post }, 'Post created successfully'))

})

const postDetailArr = asyncHandler(async (req, res) => {
    const { userId } = req.body

    const postDetails = await User.findById(userId).populate({
        path: 'post',
        select: 'image',
    })
    if (!postDetails) {
        throw new ApiError(404, 'Post not found')
    }

    return res
        .status(200)
        .json(new ApiResponse(200, postDetails.post, 'Post details retrieved successfully'))

})

const singlePostDetails = asyncHandler(async (req, res) => {
    const { postId } = req.body

    if (!postId) {
        throw new ApiError(400, 'Post id is required')
    }

    const postDetails = await Post.findById(postId).populate({
        path: 'owner',
        select: 'username profileImage'
    })
    if (!postDetails) {
        throw new ApiError(404, 'Post not found')
    }

    return res
        .status(200)
        .json(new ApiResponse(200, postDetails, "Post Fetched Successfully"))
})

const deletePost = asyncHandler(async (req, res) => {
    const { postId } = req.body

    if (!postId) {
        throw new ApiError(400, 'Post id is required')
    }
    const post = await Post.findByIdAndDelete(postId)

    if (!post) {
        throw new ApiError(404, 'Post not found')
    }

    const userPostArr = req.user.post

    const postIndex = userPostArr.findIndex(id => id.toString() === postId.toString())

    if (postIndex !== -1) {
        userPostArr.splice(postIndex, 1)
        await req.user.save();
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Post Deleted SuccessFully"))

})

const likePost = asyncHandler(async (req, res) => {
    const { postId } = req.body
    const userId = req.user._id

    if (!postId) {
        throw new ApiError(400, 'Post id is required')
    }

    const post = await Post.findById(postId).select("like")

    if (!post) {
        throw new ApiError(404, 'Post not found')
    }
    const userLikeArr = post.like
    const userLikeIndex = userLikeArr.findIndex(id => id.toString() === userId.toString())
    if (userLikeIndex !== -1) {
        userLikeArr.splice(userLikeIndex, 1)
        await post.save();
        return res
            .status(200)
            .json(new ApiResponse(200, {}, "Post Unliked Successfully"))
    }

    userLikeArr.push(userId)
    await post.save();

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Post Liked Successfully"))

})

export { uploadPost, postDetailArr, singlePostDetails, deletePost, likePost }