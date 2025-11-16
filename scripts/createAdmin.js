// backend/scripts/createAdmin.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js'; // Asegúrate de que la ruta al model sea correcta

dotenv.config();

// Conexión a DB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Conectado a MongoDB para crear admin');
  } catch (error) {
    console.error('Error conectando a Mongo:', error.message);
    process.exit(1);
  }
};

// Función para crear admin
const createAdmin = async () => {
  await connectDB();
  try {
    const userExists = await User.findOne({ correo: 'admin@example.com' });
    if (userExists) {
      console.log('Admin ya existe');
      process.exit(0);
    }

    const admin = new User({
      nombreCompleto: 'Admin User',
      apellidoPaterno: 'Admin',
      apellidoMaterno: 'Admin',
      correo: 'admin@example.com',
      contrasena: 'admin123',  // Contraseña en texto plano - el modelo la hasheará
      rol: 'Superadmin'
    });

    await admin.save();
    console.log('Admin creado exitosamente. Correo: admin@example.com, Contraseña: admin123');
  } catch (error) {
    console.error('Error creando admin:', error.stack);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
};

createAdmin();