require("dotenv").config();
const http = require("http");
const express = require("express");
const router = require("./routers/index");
const bodyParser = require("body-parser");
const { createTerminus } = require("@godaddy/terminus");
const cors = require("cors");
const helmet = require("helmet");
const logger = require("./lib/loggers");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./stackhawk/OpenApiConfig.json");

const corsOptionsDelegate = function (req, callback) {
  let corsOptions;
  if (process.env.WHITELISTS.indexOf(req.header("Origin")) !== -1) {
    corsOptions = { origin: true };
  } else {
    corsOptions = { origin: false };
  }
  callback(null, corsOptions);
};

const logs = (level, message) => {
  logger.log(level, message);
};

const validateQueryParams = (req, res, next) => {
  const allowedParams = ["type", "id", "limit", "page"];
  for (const param in req.query) {
    if (!allowedParams.includes(param)) {
      return res
        .status(400)
        .json({ error: `Invalid query parameter: ${param}` });
    }
  }
  next();
};

/** Index variables */
const app = express();
const port = process.env.PORT;

/** Open Database Connection */
const { Sequelize } = require("sequelize");
const mysql = new Sequelize(
  process.env.DATABASE,
  process.env.DATABASE_USERNAME,
  process.env.DATABASE_PASSWORD,
  {
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    dialect: "mysql",
  }
);

const mysqlConnection = async () => {
  try {
    await mysql.authenticate();
    logs("info", "mysql Connection Success!");
  } catch (err) {
    logs("error", `Failed to connect to DB: ${err}`);
  }
};
mysqlConnection();
/** Initialize router */
app.use(cors(corsOptionsDelegate));
app.use(helmet());
app.use(
  helmet.contentSecurityPolicy({
    directives: { defaultSrc: ["'self'"] },
    browserSniff: false,
    setAllHeaders: true,
  })
);
app.use(
  helmet.strictTransportSecurity({ maxAge: 31536000, includeSubDomains: true })
);
app.use(require("sanitize").middleware);
app.use(validateQueryParams);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(router);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

const server = http.createServer(app);
function onSignal() {
  logs("info", "server is starting cleanup");
  // start cleanup of resource, like databases or file descriptors
}

async function onHealthCheck() {
  return Promise.resolve([
    {
      uptime: process.uptime(),
    },
  ]);
}

createTerminus(server, {
  signal: "SIGINT",
  healthChecks: { "/hedwigconsole/ruok": onHealthCheck },
  onSignal,
});

/** Start app */
server.listen(port, () => {
  logs("info", `Example app listening on port ${port}`);
});
