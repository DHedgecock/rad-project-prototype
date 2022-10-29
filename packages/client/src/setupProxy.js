const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function (app) {
  app.use(
    '/api/v1/user',
    createProxyMiddleware({
      target: 'http://localhost:9000',
      changeOrigin: true,
    }),
  )
  app.use(
    '/api/v1/projects',
    createProxyMiddleware({
      target: 'http://localhost:9001',
      changeOrigin: true,
    }),
  )
}
