

// import { createSlice } from "@reduxjs/toolkit";
// import { fetchTotalUsers, loginUser, logoutUser, registerUser } from "../auth/AuthThunk";

// interface UserState {
//   loading: boolean;
//   error: string | null;
//   success: boolean;
//   totalUsers: number;
//   user: any | null; // backend response me user object with userRole
//   token: string | null;
// }

// const persistedToken = typeof localStorage !== 'undefined' ? localStorage.getItem("token") : null;
// const persistedUser = typeof localStorage !== 'undefined' ? localStorage.getItem("user") : null;

// const initialState: UserState = {
//   loading: false,
//   token: persistedToken,
//    totalUsers: 0,
//   error: null,
//   success: false,
//   user: persistedUser ? JSON.parse(persistedUser) : null,
// };

// const userSlice = createSlice({
//   name: "user",
//   initialState,
//   reducers: {
//     logout: (state) => {
//       state.user = null;
//       state.success = false;
//       state.error = null;
//       state.token = null;
//       if (typeof localStorage !== 'undefined') {
//         localStorage.removeItem("token");
//         localStorage.removeItem("user");
//       }
//     },
//   },
//   extraReducers: (builder) => {
//     // ✅ Register
//     builder
//       .addCase(registerUser.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//         state.success = false;
//       })
//       .addCase(registerUser.fulfilled, (state, action) => {
//         state.loading = false;
//         state.success = true;
//         state.user = action.payload;
//       })
//       .addCase(registerUser.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       });

//     // ✅ Login
//     builder
//       .addCase(loginUser.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(loginUser.fulfilled, (state, action) => {
//         state.loading = false;

//         // Extract user + token from response
//         const userData = action.payload.user || action.payload.data?.user;
//         const tokenData = action.payload.token || action.payload.data?.token;

//         state.user = userData;
//         state.token = tokenData;

//         if (typeof localStorage !== 'undefined') {
//           if (tokenData) localStorage.setItem("token", tokenData);
//           if (userData) localStorage.setItem("user", JSON.stringify(userData));
//         }
//       })
//       .addCase(loginUser.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       });

//     // ✅ Logout
//     builder
//       .addCase(logoutUser.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(logoutUser.fulfilled, (state) => {
//         state.loading = false;
//         state.user = null;
//         state.token = null;
//         if (typeof localStorage !== 'undefined') {
//           localStorage.removeItem("token");
//           localStorage.removeItem("user");
//         }
//       })
//       .addCase(logoutUser.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })

//        // 🔹 Pending
//       .addCase(fetchTotalUsers.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })

//       // 🔹 Fulfilled
//       .addCase(fetchTotalUsers.fulfilled, (state, action) => {
//         state.loading = false;
//         state.totalUsers = action.payload;
//         state.error = null;
//       })

//       // 🔹 Rejected
//       .addCase(fetchTotalUsers.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       });
//   },
// });

// export const { logout } = userSlice.actions;
// export default userSlice.reducer;



import { createSlice } from "@reduxjs/toolkit";
import { 
  fetchTotalUsers, 
  loginUser, 
  logoutUser, 
  registerUser 
} from "../auth/AuthThunk";
import { 
  getUserProfile, 
  updateUserProfile, 
  updatePassword,
  forgotPassword,
  verifyOtp,
  resetPassword
} from "./AuthThunk";

interface UserState {
  loading: boolean;
  error: string | null;
  success: boolean;
  totalUsers: number;
  user: any | null;
  token: string | null;
  profileLoading: boolean;
  profileError: string | null;
  updateSuccess: boolean;
  passwordUpdateLoading: boolean;
  passwordUpdateError: string | null;
  passwordUpdateSuccess: boolean;
  // forgot/reset flow
  forgotLoading: boolean;
  forgotError: string | null;
  forgotSuccess: boolean;
  verifyLoading: boolean;
  verifyError: string | null;
  verifySuccess: boolean;
  resetLoading: boolean;
  resetError: string | null;
  resetSuccess: boolean;
}

const persistedToken = typeof localStorage !== 'undefined' ? localStorage.getItem("token") : null;
const persistedUser = typeof localStorage !== 'undefined' ? localStorage.getItem("user") : null;

const initialState: UserState = {
  loading: false,
  token: persistedToken,
  totalUsers: 0,
  error: null,
  success: false,
  user: persistedUser ? JSON.parse(persistedUser) : null,
  profileLoading: false,
  profileError: null,
  updateSuccess: false,
  passwordUpdateLoading: false,
  passwordUpdateError: null,
  passwordUpdateSuccess: false,
  forgotLoading: false,
  forgotError: null,
  forgotSuccess: false,
  verifyLoading: false,
  verifyError: null,
  verifySuccess: false,
  resetLoading: false,
  resetError: null,
  resetSuccess: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.success = false;
      state.error = null;
      state.token = null;
      state.profileError = null;
      state.updateSuccess = false;
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    },
    clearProfileError: (state) => {
      state.profileError = null;
    },
    clearUpdateSuccess: (state) => {
      state.updateSuccess = false;
    },
    clearPasswordUpdateState: (state) => {
      state.passwordUpdateLoading = false;
      state.passwordUpdateError = null;
      state.passwordUpdateSuccess = false;
    },
    clearForgotFlow: (state) => {
      state.forgotLoading = false;
      state.forgotError = null;
      state.forgotSuccess = false;
      state.verifyLoading = false;
      state.verifyError = null;
      state.verifySuccess = false;
      state.resetLoading = false;
      state.resetError = null;
      state.resetSuccess = false;
    },
  },
  extraReducers: (builder) => {
    // ✅ Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ✅ Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        const userData = action.payload.user || action.payload.data?.user;
        const tokenData = action.payload.token || action.payload.data?.token;
        state.user = userData;
        state.token = tokenData;
        if (typeof localStorage !== 'undefined') {
          if (tokenData) localStorage.setItem("token", tokenData);
          if (userData) localStorage.setItem("user", JSON.stringify(userData));
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ✅ Logout
    builder
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

    // ✅ Total Users
    builder
      .addCase(fetchTotalUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTotalUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.totalUsers = action.payload;
        state.error = null;
      })
      .addCase(fetchTotalUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ✅ Get User Profile
    builder
      .addCase(getUserProfile.pending, (state) => {
        state.profileLoading = true;
        state.profileError = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.user = action.payload.data || action.payload;
        // Update localStorage with latest user data
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem("user", JSON.stringify(state.user));
        }
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.profileLoading = false;
        state.profileError = action.payload as string;
      });

    // ✅ Update User Profile
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.profileLoading = true;
        state.profileError = null;
        state.updateSuccess = false;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.user = action.payload.data || action.payload;
        state.updateSuccess = true;
        // Update localStorage with latest user data
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem("user", JSON.stringify(state.user));
        }
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.profileLoading = false;
        state.profileError = action.payload as string;
        state.updateSuccess = false;
      });

    // ✅ Update Password
    builder
      .addCase(updatePassword.pending, (state) => {
        state.passwordUpdateLoading = true;
        state.passwordUpdateError = null;
        state.passwordUpdateSuccess = false;
      })
      .addCase(updatePassword.fulfilled, (state) => {
        state.passwordUpdateLoading = false;
        state.passwordUpdateSuccess = true;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.passwordUpdateLoading = false;
        state.passwordUpdateError = action.payload as string;
      });

    // ✅ Forgot Password
    builder
      .addCase(forgotPassword.pending, (state) => {
        state.forgotLoading = true;
        state.forgotError = null;
        state.forgotSuccess = false;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.forgotLoading = false;
        state.forgotSuccess = true;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.forgotLoading = false;
        state.forgotError = action.payload as string;
      });

    // ✅ Verify OTP
    builder
      .addCase(verifyOtp.pending, (state) => {
        state.verifyLoading = true;
        state.verifyError = null;
        state.verifySuccess = false;
      })
      .addCase(verifyOtp.fulfilled, (state) => {
        state.verifyLoading = false;
        state.verifySuccess = true;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.verifyLoading = false;
        state.verifyError = action.payload as string;
      });

    // ✅ Reset Password
    builder
      .addCase(resetPassword.pending, (state) => {
        state.resetLoading = true;
        state.resetError = null;
        state.resetSuccess = false;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.resetLoading = false;
        state.resetSuccess = true;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.resetLoading = false;
        state.resetError = action.payload as string;
      });
  },
});

export const { logout, clearProfileError, clearUpdateSuccess, clearPasswordUpdateState, clearForgotFlow } = userSlice.actions;
export default userSlice.reducer;