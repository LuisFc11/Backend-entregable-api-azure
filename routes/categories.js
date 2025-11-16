// backend/routes/categories.js (mantenido similar, pero con PUT/DELETE y logs. GET público)
import express from 'express';
import Category from '../models/Category.js';
import { protect } from './users.js'; // Importa protect

const router = express.Router();

// GET: Listar categorías (SIN protect)
router.get("/", async (req, res) => {
  try {
    console.log('GET /api/categories llamado');
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    console.error('Error en GET categories:', error.message);
    res.status(500).json({ message: "Error al obtener categorías", error: error.message });
  }
});

// POST: Agregar categoría (CON protect)
router.post("/", protect, async (req, res) => {
  try {
    console.log('POST /api/categories datos:', req.body);
    const newCategory = new Category(req.body);
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    console.error('Error en POST categories:', error.message);
    res.status(400).json({ message: "Error al agregar categoría", error: error.message });
  }
});

// PUT y DELETE similares si necesitas (agrega si usas en dashboard)

export default router;