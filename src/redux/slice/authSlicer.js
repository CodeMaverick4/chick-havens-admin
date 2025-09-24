import { createSlice } from "@reduxjs/toolkit";

const authSlicer = createSlice({
    name: "userDetails",
    initialState: { user: null, token: null },
    reducers: {
        login: (state, action) => {
            localStorage.setItem('token',action.payload.token)
            localStorage.setItem('user',JSON.stringify(action.payload.user))
            state.user = action.payload.user
            state.token = action.payload.token
        },

        logout: (state, action) => {
            state.user = null
            state.token = null
        },
        loadLoginDetails:(state,action)=>{
            const token = localStorage.getItem('token');
            const user = JSON.parse(localStorage.getItem('user'));
            if(token && user){
                state.user = user;
                state.token = token;
            }
        }
    }
});

export const { login, logout ,loadLoginDetails} = authSlicer.actions
export default authSlicer.reducer;
