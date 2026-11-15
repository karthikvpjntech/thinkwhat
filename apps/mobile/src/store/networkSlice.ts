import { createSlice, PayloadAction } from '@reduxjs/toolkit';
const networkSlice = createSlice({
  name: 'network',
  initialState: { isOnline: true },
  reducers: { setOnline: (s, a: PayloadAction<boolean>) => { s.isOnline = a.payload; } },
});
export const { setOnline } = networkSlice.actions;
export default networkSlice.reducer;
