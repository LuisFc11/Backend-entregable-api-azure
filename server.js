// backend/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import productsRouter from './routes/products.js';
import categoriesRouter from './routes/categories.js';
import usersRouter from './routes/users.js';
import chatRouter from './routes/chat.js';

dotenv.config();

const app = express();

// CORS MUY PERMISIVO (para tarea)
app.use(
  cors({
    origin: '*', // acepta cualquier origen
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ❌ IMPORTANTE: nada de app.options('*', cors()); eso es lo que te daba el error

app.use(express.json());

const PORT = process.env.PORT || 4000;

// Conexión a MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Conectado a MongoDB exitosamente 🚀');
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error.message);
    process.exit(1);
  }
};

// Ruta de prueba
app.get('/api', (req, res) => {
  res.json({ message: 'Servidor funcionando correctamente 🚀' });
});

// Rutas
app.use('/api/products', productsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/users', usersRouter);
app.use('/api/chat', chatRouter);

// Inicia servidor
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
  });
});
