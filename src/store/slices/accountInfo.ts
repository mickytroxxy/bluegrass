import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type AccountType = {
  fullName: string;
  password?: string;
  email: string;
  phoneNumber: string;
};

const initialState: {
  accountInfo: AccountType | null;
} = {
  accountInfo: null,
};

const accountSlice = createSlice({
  name: "accountSlice",
  initialState,
  reducers: {
    setAccountInfo: (state, action: PayloadAction<AccountType | null>) => {
      state.accountInfo = action.payload;
    },
  },
});

export const { setAccountInfo } = accountSlice.actions;
export default accountSlice.reducer;
