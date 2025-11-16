// server.js  (o backend/server.js según tu proyecto)
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Rutas
import productsRouter from './routes/products.js';
import categoriesRouter from './routes/categories.js';
import usersRouter from './routes/users.js';
import chatRouter from './routes/chat.js';

dotenv.config();

const app = express();

// ====== MIDDLEWARES ======

// CORS (puedes ajustar los orígenes según tu frontend)
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    // Agrega aquí tu frontend en producción cuando lo tengas, por ejemplo:
    // 'https://tu-frontend.onrender.com',
    // 'https://tu-frontend.vercel.app',
  ],
}));

app.use(express.json());

// Puerto (Render usa process.env.PORT, local puedes usar 4000)
const PORT = process.env.PORT || 4000;

// ====== CONEXIÓN A MONGODB ======
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Conectado a MongoDB exitosamente 🚀");
  } catch (error) {
    console.error("Error al conectar a MongoDB:", error.message);
    process.exit(1); // Cierra si falla la conexión
  }
};

// ====== RUTAS DE PRUEBA ======

// raíz -> para evitar "Cannot GET /"
app.get("/", (req, res) => {
  res.json({
    ok: true,
    message: "API Online 🚀",
  });
});

// /api -> para probar rápidamente que el backend responde
app.get("/api", (req, res) => {
  res.json({
    ok: true,
    message: "Servidor funcionando correctamente 🚀",
  });
});

// ====== RUTAS PRINCIPALES ======

app.use("/api/products", productsRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/users", usersRouter);
app.use("/api/chat", chatRouter);

// ====== INICIAR SERVIDOR ======
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
  });
});
