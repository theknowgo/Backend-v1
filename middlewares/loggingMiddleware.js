// middlewares/loggingMiddleware.js
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';

// Define the log directory and file
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

const logFilePath = path.join(logsDir, 'access.log');

// Configure Morgan to log to both console and file
const morganMiddleware = morgan('combined', {
  stream: {
    write: (message) => {
      // Log to file
      fs.appendFileSync(logFilePath, message);
      // Log to console
      console.log(message.trim());
    },
  },
});

export default morganMiddleware;