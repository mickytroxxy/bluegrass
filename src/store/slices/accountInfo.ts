import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export type AccountType = {
  fullName:string;
  password?:string;
  email:string;
  phoneNumber:string;
}

export type SignupRequest = {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
}

export type SignupResponse = {
  success: boolean;
  user?: AccountType;
  message?: string;
}

// RTK Query API
export const accountApi = createApi({
  reducerPath: 'accountApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/', // This is a dummy base URL
  }),
  endpoints: (builder) => ({
    signup: builder.mutation<SignupResponse, SignupRequest>({
      // Since this is a dummy call, we'll simulate the response using queryFn
      queryFn: async (userData) => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Simulate random success/failure for demo purposes
        const isSuccess = Math.random() > 0.3; // 70% success rate

        if (isSuccess) {
          return {
            data: {
              success: true,
              user: {
                fullName: userData.fullName,
                email: userData.email,
                phoneNumber: userData.phoneNumber,
              }
            }
          };
        } else {
          return {
            error: {
              status: 400,
              data: {
                success: false,
                message: 'Registration failed. Please try again.'
              }
            }
          };
        }
      },
    }),
  }),
});

const initialState: {
  accountInfo:AccountType | null
} = {
  accountInfo:null
};

const accountSlice = createSlice({
  name: "accountSlice",
  initialState,
  reducers: {
    setAccountInfo: (state, action: PayloadAction<AccountType | null>) => {
      state.accountInfo = action.payload;
    }
  },
});

export const { useSignupMutation } = accountApi;
export const { setAccountInfo } = accountSlice.actions;
export default accountSlice.reducer;
