const express=require('express');
const cors=require('cors');

const {
createProxyMiddleware
}=require('http-proxy-middleware');

const app=express();

app.use(cors());

app.use(
'/films',
createProxyMiddleware({
target:'http://localhost:3001',
changeOrigin:true
})
);

app.use(
'/projections',
createProxyMiddleware({
target:'http://localhost:3002',
changeOrigin:true
})
);

app.use(
'/reservations',
createProxyMiddleware({
target:'http://localhost:3003',
changeOrigin:true
})
);

app.listen(3000);