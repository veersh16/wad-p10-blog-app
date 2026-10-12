const mongoose = require('mongoose');
const app = require('../backend/app');

let cached = global._mongoose;
if (!cached) cached = global._mongoose = { conn: null };

async function connect() {
  if (cached.conn) return cached.conn;
  cached.conn = await mongoose.connect(process.env.MONGO_URI);
  return cached.conn;
}

module.exports = async (req, res) => {
  await connect();
  if (req.url.startsWith('/api')) req.url = req.url.slice(4) || '/';
  return app(req, res);
};
