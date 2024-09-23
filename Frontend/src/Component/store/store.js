import {configureStore} from '@reduxjs/toolkit'
import toggleSlice from './toggleSlice'
import postSlice from './postSlice'

const store = configureStore({
    reducer: {
        toggle: toggleSlice.reducer,
        post: postSlice.reducer
    }
})

export default store