const express=require('express');
const app=express();

const {initRabbitMQ}=require('./rabbitmq/producer');

app.use(express.json());

// Health check endpoint (required by Docker healthcheck)
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', service: 'microservice-films' });
});

initRabbitMQ().catch(console.error);

app.use('/api/films',require('./routes/filmRoutes'));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`microservice-films running on port ${PORT}`));