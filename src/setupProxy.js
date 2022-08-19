const createProxyMiddleware = require("http-proxy-middleware");

module.exports = function(app) {
    app.use(
        createProxyMiddleware("/oauth_token", {
            changeOrigin: true,
            secure: false,
            target: "https://bandcamp.com",
        })
    );
    app.use(
        createProxyMiddleware("/api", {
            changeOrigin: true,
            secure: false,
            target: "https://bandcamp.com",
        })
    );
    // STAGING CHANGE HERE
    app.use(
        createProxyMiddleware("/clients", {
            changeOrigin: true,
            secure: false,
            target: "https://staging.chitchats.com/api/v1",
        })
    );
};