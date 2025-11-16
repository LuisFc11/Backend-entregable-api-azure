// backend/models/Product.js (corregido: campos coinciden con tu DB captura - 'descripcion' e 'imagen' en lugar de 'description' e 'image_url')
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String, required: true },
  precio: { type: Number, required: true },
  imagen: { type: String, required: true },
  stock: { type: Number, required: true, default: 0 },
  categoria: { type: String, required: true },
  featured: { type: Boolean, default: false },
  marca: { type: String },  // Opcional, de tu captura
}, { timestamps: true });

export default mongoose.model('Product', productSchema);