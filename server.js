// backend/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import productsRouter from './routes/products.js';
import categoriesRouter from './routes/categories.js';
import usersRouter from './routes/users.js';
import chatRouter from './routes/chat.js'; // 👈 NUEVO

dotenv.config();
const app = express();

// CORS (incluye tus frontends)
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
}));

app.use(express.json());

const PORT = process.env.PORT || 4000;

// Conexión a MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Conectado a MongoDB exitosamente 🚀");
  } catch (error) {
    console.error("Error al conectar a MongoDB:", error.message);
    process.exit(1);
  }
};

// Ruta de prueba
app.get("/api", (req, res) => {
  res.json({ message: "Servidor funcionando correctamente 🚀" });
});

// Rutas existentes
app.use("/api/products", productsRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/users", usersRouter);

// 👉 Ruta del chatbot
app.use("/api/chat", chatRouter);

// Inicia servidor
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
});
