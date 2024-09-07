import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js"


const followersFollowingsDetails = asyncHandler(async (req, res) => {
    const { id } = req.body;

    if (!Array.isArray(id) || id.length === 0) {
        return res.status(400).json({ error: 'Invalid request, id should be a non-empty array of user IDs.' });
    }

    try {
        const users = await User.find({ _id: { $in: id } }).select("username fullName profileImage")

        return res
            .status(200)
            .json(new ApiResponse(200, users, "fetched all followers or followings details "));
    } catch (error) {
        return res.status(500).json(new ApiError(500, error.message, "Error fetching followers or followings details"))
    }
});


export {
    followersFollowingsDetails
}