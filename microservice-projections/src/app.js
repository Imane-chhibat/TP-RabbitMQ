const express=require('express');
const app=express();

const {startConsumer}=
require('./rabbitmq/consumer');

// Health check endpoint (required by Docker healthcheck)
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', service: 'microservice-projections' });
});

startConsumer().catch(console.error);

app.use(
'/api/projections',
require('./routes/projectionRoutes')
);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`microservice-projections running on port ${PORT}`));