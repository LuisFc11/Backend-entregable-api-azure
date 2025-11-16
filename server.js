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

// ====== MIDDLEWARES ======

// CORS abierto mientras pruebas (luego lo restringes)
app.use(cors());

app.use(express.json());

// Puerto (Render pone PORT en env)
const PORT = process.env.PORT || 4000;

// ====== CONEXIÓN A MONGODB ======
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Conectado a MongoDB exitosamente 🚀");
  } catch (error) {
    console.error("Error al conectar a MongoDB:", error.message);
    process.exit(1);
  }
};

// ====== RUTAS DE PRUEBA ======
app.get("/", (req, res) => {
  res.json({
    ok: true,
    message: "API Online 🚀",
  });
});

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
