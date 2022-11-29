import {createSlice} from "@reduxjs/toolkit";

export const globalStatusSlice = createSlice({
  name: 'globalStatus',
  initialState: {
    showPopupAlert: false,
    popupAlertVariant: 'success',
    popupAlertMsg: 'Hello world',
    loadingMsgOfAddAnimeModal: '请稍等...'
  },
  reducers: {
    setShowPopupAlert: (state, action) => {
      const {show, variant, message} = action.payload;
      state.showPopupAlert = show;
      variant && (state.popupAlertVariant = variant);
      message && (state.popupAlertMsg = message);
    },
    setLoadingMsgOfAddAnimeModal: (state, action) => {
      state.loadingMsgOfAddAnimeModal = action.payload;
    }
  }
})

export const {
  setShowPopupAlert,
  setLoadingMsgOfAddAnimeModal
} = globalStatusSlice.actions;

export default globalStatusSlice.reducer;