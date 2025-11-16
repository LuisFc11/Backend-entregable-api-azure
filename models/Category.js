// backend/models/Category.js (corregido: campos en español para consistencia)
import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String, required: true },
  imagen: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('Category', categorySchema);