const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/tracksale',
    createProxyMiddleware({
      target: 'https://api.tracksale.co',
      changeOrigin: true,
      pathRewrite: {
        '^/tracksale': ''
      },
      onProxyRes: function (proxyRes) {
        proxyRes.headers['Access-Control-Allow-Origin'] = '*';
      }
    })
  );
};