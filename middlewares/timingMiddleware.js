
// middlewares/timingMiddleware.js
export const setRequestTiming = (req, res, next) => {
    req.startTime = Date.now(); // Set the start time for the request
    next();
  };
