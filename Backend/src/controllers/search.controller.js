import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"



const searchUsers = asyncHandler(async (req, res) => {
    const { username } = req.body
    if (!username) {
        throw new ApiError(400, "User ID is required")
    }

    const currentUserId = req.user._id;
    const user = await User.find({
        _id: { $ne: currentUserId },
        username: new RegExp(`^${username.toLowerCase()}`, 'i')
    }).select("-refreshToken -password");

    if (!user) {
        throw new ApiError(404, "User not found")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, user, "User Fetched"))

})

const searchedUserDetails = asyncHandler(async (req, res) => {
    const { searchedUserId } = req.body

    if (!searchedUserId) {
        throw new ApiError(400, "User ID is required")
    }

    const userDetails = await User.findById(searchedUserId).select("-password -refreshToken")

    if (!userDetails) {
        throw new ApiError(404, "User not found")
    }

    const isFollowing = req.user.following.includes(searchedUserId);

    const responseUserDetails = {
        ...userDetails.toObject(),
        isFollowing: isFollowing
    };

    return res
        .status(200)
        .json(new ApiResponse(200, responseUserDetails, "Searched User Details Fetched Successfully"))
})

const searchedUserFollow = asyncHandler(async (req, res) => {
    const { searchedUserId } = req.body;

    if (!searchedUserId) {
        throw new ApiError(400, "User ID is required");
    }

    if (req.user.following.includes(searchedUserId)) {
        return res.status(400).json(new ApiResponse(400, {}, "Already following this user"));
    }

    try {
        req.user.following.push(searchedUserId);
        await req.user.save();

        const searchedUser = await User.findById(searchedUserId);
        if (!searchedUser) {
            throw new ApiError(404, "User not found");
        }

        searchedUser.followers.push(req.user._id);
        await searchedUser.save();

        return res
            .status(200)
            .json(new ApiResponse(200, {}, "Followed User successfully"));
    } catch (error) {
        throw new ApiError(500, "Failed to follow user");
    }
});

const searchedUserUnfollow = asyncHandler(async (req, res) => {
    const { searchedUserId } = req.body;

    if (!searchedUserId) {
        throw new ApiError(400, "User ID is required");
    }

    const index = req.user.following.indexOf(searchedUserId);
    if (index === -1) {
        return res.status(400).json(new ApiResponse(400, {}, "User is not being followed"));
    }

    try {
        req.user.following = req.user.following.filter(id => id.toString() !== searchedUserId);
        await req.user.save();

        const searchedUser = await User.findById(searchedUserId);
        if (!searchedUser) {
            throw new ApiError(404, "User not found");
        }

        searchedUser.followers = searchedUser.followers.filter(id => id.toString() !== req.user._id.toString());
        await searchedUser.save();

        return res
            .status(200)
            .json(new ApiResponse(200, {}, "Unfollowed user successfully"));
    } catch (error) {
        throw new ApiError(500, "Failed to unfollow user");
    }
});



export {
    searchUsers,
    searchedUserDetails,
    searchedUserFollow,
    searchedUserUnfollow
}