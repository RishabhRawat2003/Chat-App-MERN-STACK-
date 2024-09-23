import { createSlice } from "@reduxjs/toolkit";

const intialState = {
    toggle: false
}

const toggleSlice = createSlice({
    name: "toggle",
    initialState: intialState,
    reducers: {
        toggle: (state, action) => {
            state.toggle = action.payload
        }
    }
})

export const {toggle} = toggleSlice.actions
export default toggleSlice