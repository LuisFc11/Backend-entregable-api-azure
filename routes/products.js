// backend/routes/products.js (corregido: GET sin protect para que sea público y funcione en e-commerce y dashboard; POST/PUT/DELETE con protect para seguridad en admin. Agregué logs para depurar)
import express from 'express';
import Product from '../models/Product.js';
import { protect } from './users.js'; // Importa protect de users.js (asegúrate que exista)

const router = express.Router();

// GET: Listar todos los productos (SIN protect, público para e-commerce y dashboard)
router.get("/", async (req, res) => {
  try {
    console.log('GET /api/products llamado'); // Log para verificar en consola server
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error('Error en GET products:', error.message); // Log detallado
    res.status(500).json({ message: "Error al obtener productos", error: error.message });
  }
});

// POST: Agregar un producto nuevo (CON protect, solo para admin)
router.post("/", protect, async (req, res) => {
  try {
    console.log('POST /api/products datos:', req.body); // Log
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error en POST products:', error.message);
    res.status(400).json({ message: "Error al agregar producto", error: error.message });
  }
});

// PUT: Actualizar producto (CON protect)
router.put("/:id", protect, async (req, res) => {
  try {
    console.log('PUT /api/products/', req.params.id, ' datos:', req.body);
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ message: "Producto no encontrado" });
    res.json(product);
  } catch (error) {
    console.error('Error en PUT products:', error.message);
    res.status(400).json({ message: "Error al actualizar producto", error: error.message });
  }
});

// DELETE: Eliminar producto (CON protect)
router.delete("/:id", protect, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Producto no encontrado" });
    res.json({ message: "Producto eliminado" });
  } catch (error) {
    console.error('Error en DELETE products:', error.message);
    res.status(500).json({ message: "Error al eliminar producto", error: error.message });
  }
});

export default router;