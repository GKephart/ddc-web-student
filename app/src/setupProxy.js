const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(createProxyMiddleware('/apis', {
    logLevel: 'debug',
    target: "https://ddc-web-student.cnm.edu",
    changeOrigin: true,
    secure: true,
  }));
};