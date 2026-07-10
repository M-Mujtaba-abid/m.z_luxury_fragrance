// import ApiError from "../utils/apiError.js";

// const errorMiddleware = (err, req, res, next) => {
//   let statusCode = err.statusCode || 500;
//   let message = err.message || "Internal Server Error";

//   // Agar hamara custom ApiError hai
//   if (err instanceof ApiError) {
//     return res.status(statusCode).json({
//       success: false,
//       statusCode,
//       message,
//       errors: err.errors || [],
//       stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
//     });
//   }

//   // Agar koi aur error hai (unexpected)
//   return res.status(statusCode).json({
//     success: false,
//     statusCode,
//     message,
//     errors: [],
//     stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
//   });
// };

// export default errorMiddleware;



import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js"; // ✅ Added import for ApiResponse

const errorMiddleware = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // ✅ Agar hamara custom ApiError hai
  if (err instanceof ApiError) {
    // ❌ Direct object return na karo (circular issue ho sakta hai)
    // ✅ ApiResponse ka use kiya hai consistency ke liye
    const response = new ApiResponse(
      statusCode,
      null, // error ke case me data null
      message
    );
    response.success = false; // ✅ overwrite success=false in error case
    response.errors = err.errors || []; // ✅ added detailed errors if any
    response.stack =
      process.env.NODE_ENV === "development" ? err.stack : undefined;

    return res.status(statusCode).json(response); // ✅ safe response
  }

  // ✅ Agar koi unexpected error aata hai
  const response = new ApiResponse(statusCode, null, message);
  response.success = false;
  response.errors = [];
  response.stack =
    process.env.NODE_ENV === "development" ? err.stack : undefined;

  return res.status(statusCode).json(response);
};

export default errorMiddleware;
