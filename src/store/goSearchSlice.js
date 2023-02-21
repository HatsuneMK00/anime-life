import {createSlice} from "@reduxjs/toolkit";

export const goSearchSlice = createSlice({
  name: 'goSearch',
  initialState: {
    value: false,
  },
  reducers: {
    toggleGoSearch: (state) => {
      console.log("toggleGoSearch")
      state.value = !state.value
    }
  }
})

export const {toggleGoSearch} = goSearchSlice.actions;

export default goSearchSlice.reducer;