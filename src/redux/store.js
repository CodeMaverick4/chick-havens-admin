import { configureStore } from "@reduxjs/toolkit";
import authSlicer from './slice/authSlicer'

export const store = configureStore({
    reducer : {
        auth: authSlicer,        
    },
})
