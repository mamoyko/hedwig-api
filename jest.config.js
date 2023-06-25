require("dotenv").config();
process.env = Object.assign(process.env, {
  CHUNK_PER_FILE: 4,
});
