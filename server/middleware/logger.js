const fs = require('fs');
const path = require('path');

const logDirectory = path.join(__dirname, '..', '..', 'logs');

if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

const requestLogger = {
  stream: {
    write: (message) => {
      const logFile = path.join(logDirectory, 'access.log');
      fs.appendFileSync(logFile, message);
    },
  },
};

module.exports = { requestLogger };
