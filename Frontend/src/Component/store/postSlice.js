import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    postDetails: {},
    imagePath: '',
    rotateIndicator: false
}

const postSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {
        getPostDetails(state, action) {
            const { name, size, type, lastModified } = action.payload;
            state.postDetails = { name, size, type, lastModified };
        },
        setImagePath(state, action) {
            state.imagePath = action.payload
        },
        setRotate(state, action) {
            state.rotateIndicator = action.payload
        }
    }
})

export const { getPostDetails, setImagePath, setRotate } = postSlice.actions
export default postSlice