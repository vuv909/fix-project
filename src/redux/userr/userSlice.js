import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: {},
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        addUser: (state, action) => {
            state.value = action.payload
        },
        retmoveUser: (state, action) => {
            state.value = {}
        }
    }
})

export const { addUser , retmoveUser } = userSlice.actions

export default userSlice.reducer