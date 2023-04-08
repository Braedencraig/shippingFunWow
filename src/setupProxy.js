const createProxyMiddleware = require("http-proxy-middleware");
const cors = require("cors");

module.exports = function (app) {
  app.use(cors());
  // app.use(function (request, response, next) {
  //   response.header("Access-Control-Allow-Origin", "*");
  //   response.header(
  //     "Access-Control-Allow-Headers",
  //     "Origin, X-Requested-With, Content-Type, Accept"
  //   );
  //   next();
  // });
  // app.use(
  //   createProxyMiddleware("/oauth_token", {
  //     changeOrigin: true,
  //     secure: false,
  //     target: "https://bandcamp.com",
  //   })
  // );
  // app.use(
  //   createProxyMiddleware("/api", {
  //     changeOrigin: true,
  //     secure: false,
  //     target: "https://bandcamp.com",
  //   })
  // );
  // app.use(
  //   createProxyMiddleware("/webflow", {
  //     changeOrigin: true,
  //     secure: false,
  //     target: "https://api.webflow.com",
  //   })
  // );
  // STAGING CHANGE HERE
  // app.use(
  //   createProxyMiddleware("/clients", {
  //     changeOrigin: true,
  //     secure: false,
  //     target: "https://chitchats.com/api/v1",
  //   })
  // );
};
