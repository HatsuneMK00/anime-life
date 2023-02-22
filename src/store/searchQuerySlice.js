import {createSlice} from "@reduxjs/toolkit";

export const searchQuerySlice = createSlice({
  name: 'searchQuery',
  initialState: {
    value: '',
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.value = action.payload;
    }
  }
})

export const {setSearchQuery} = searchQuerySlice.actions;

export default searchQuerySlice.reducer;