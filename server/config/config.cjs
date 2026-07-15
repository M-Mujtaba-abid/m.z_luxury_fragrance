require("dotenv").config();

const withUrl = {
  url: process.env.DATABASE_URL,
  dialect: "postgres",
  dialectOptions: {
    ssl: { require: true, rejectUnauthorized: false },
  },
};

module.exports = {
  development: withUrl,
  test: withUrl,
  production: withUrl,
};
