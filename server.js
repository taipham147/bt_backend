const express = require("express");
// const bodyParser = require("body-parser"); /* deprecated */
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};

const Logger = require('logger-nodejs');
const log = new Logger();

const customLoggerMiddleware = (request, response, next) => {
  const { method, originalUrl, body } = request;
  log.info(`[REQUEST] ${method} ${originalUrl} ${JSON.stringify(!!body ? body : "")}`);

  let oldWrite = response.write,
      oldEnd = response.end;

  let chunks = [];

  response.write = function (chunk) {
    chunks.push(chunk);
    return oldWrite.apply(response, arguments);
  };

  response.end = function (chunk) {
    const { statusCode } = response;
    if (chunk)
      chunks.push(chunk);
    if (statusCode === 200) {
      let body1 = !!chunks && chunks.length > 0 ? Buffer.concat(chunks).toString('utf8') : "";
      log.info(
        `[RESPONSE] ${method} ${originalUrl} ${statusCode} ${body1}`,
      );
    } else {
      let body1 = chunk;
      log.info(
        `[RESPONSE] ${method} ${originalUrl} ${statusCode} ${body1}`,
      );
    }
    

    oldEnd.apply(response, arguments);
  };
  next();
};

// Sử dụng custom logger middleware
app.use(customLoggerMiddleware);

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());  /* bodyParser.json() is deprecated */

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));   /* bodyParser.urlencoded() is deprecated */

const db = require("./app/models");

db.sequelize.sync();
// // drop the table if it already exists
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db.");
// });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

require("./app/routes/turorial.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
