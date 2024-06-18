const express = require('express')
const { createProxyMiddleware } = require('http-proxy-middleware')
const dotenv = require('dotenv')

dotenv.config();

const app = express();

// proxy configuration
app.use('/users', createProxyMiddleware({ target: process.env.USER_SERVICE_URL, changeOrigin: true, }))
app.use('/products', createProxyMiddleware({ target: process.env.PRODUCT_SERVICE_URL, changeOrigin: true, }))
app.use('/orders', createProxyMiddleware({ target: process.env.ORDER_SERVICE_URL, changeOrigin: true, }))

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`)
})