// backend/routes/users.js
import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const router = express.Router();

/**
 * Middleware "protect" vacío.
 * NO valida token, solo deja pasar todas las peticiones.
 * Lo dejamos porque tus otros archivos lo importan.
 */
export const protect = (req, res, next) => {
  next();
};

// =================== AUTH BÁSICA ===================

// REGISTER (crear usuario desde formulario público si quisieras)
router.post('/register', async (req, res) => {
  const {
    nombreCompleto,
    apellidoPaterno,
    apellidoMaterno,
    correo,
    contrasena,
    rol,
  } = req.body;

  try {
    const userExists = await User.findOne({ correo });
    if (userExists) {
      return res.status(400).json({ message: 'Usuario ya existe' });
    }

    const user = await User.create({
      nombreCompleto,
      apellidoPaterno,
      apellidoMaterno,
      correo,
      contrasena,
      rol,
    });

    // No mandamos token
    res.json({
      _id: user._id,
      nombreCompleto: user.nombreCompleto,
      correo: user.correo,
      rol: user.rol,
    });
  } catch (error) {
    console.error('Error en register:', error.stack);
    res
      .status(400)
      .json({ message: 'Datos inválidos', error: error.message });
  }
});

// LOGIN (sin token)
router.post('/login', async (req, res) => {
  console.log('Login request received:', req.body);
  const { correo, contrasena } = req.body;

  if (!correo || !contrasena) {
    return res
      .status(400)
      .json({ message: 'Correo y contraseña requeridos' });
  }

  try {
    const user = await User.findOne({ correo });
    if (!user) {
      return res
        .status(401)
        .json({ message: 'Correo o contraseña inválidos' });
    }

    const passwordMatch = await user.matchPassword(contrasena);
    if (!passwordMatch) {
      return res
        .status(401)
        .json({ message: 'Correo o contraseña inválidos' });
    }

    // SIN JWT: solo devolvemos info del usuario
    res.json({
      _id: user._id,
      nombreCompleto: user.nombreCompleto,
      correo: user.correo,
      rol: user.rol,
    });
  } catch (error) {
    console.error('Error completo en login:', error.stack);
    res
      .status(500)
      .json({ message: 'Error en login', error: error.message });
  }
});

// =================== CRUD PARA LA TABLA DE USUARIOS ===================

// Listar todos los usuarios
router.get('/', async (req, res) => {
  try {
    const users = await User.find({}).select('-contrasena');
    res.json(users);
  } catch (error) {
    console.error('Error al listar usuarios:', error.stack);
    res
      .status(500)
      .json({ message: 'Error al listar usuarios', error: error.message });
  }
});

// Crear usuario (desde el panel de admin)
router.post('/', async (req, res) => {
  const {
    nombreCompleto,
    apellidoPaterno,
    apellidoMaterno,
    correo,
    contrasena,
    rol,
  } = req.body;

  try {
    const userExists = await User.findOne({ correo });
    if (userExists) {
      return res.status(400).json({ message: 'Usuario ya existe' });
    }

    const user = await User.create({
      nombreCompleto,
      apellidoPaterno,
      apellidoMaterno,
      correo,
      contrasena,
      rol,
    });

    res.json({
      _id: user._id,
      nombreCompleto: user.nombreCompleto,
      apellidoPaterno: user.apellidoPaterno,
      apellidoMaterno: user.apellidoMaterno,
      correo: user.correo,
      rol: user.rol,
    });
  } catch (error) {
    console.error('Error al crear usuario:', error.stack);
    res
      .status(400)
      .json({ message: 'Datos inválidos', error: error.message });
  }
});

// Actualizar usuario
router.put('/:id', async (req, res) => {
  try {
    const { contrasena, ...rest } = req.body;
    const updateData = { ...rest };

    // Si viene contraseña nueva, la hasheamos
    if (contrasena) {
      const salt = await bcrypt.genSalt(10);
      updateData.contrasena = await bcrypt.hash(contrasena, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select('-contrasena');

    if (!updatedUser) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error('Error al actualizar usuario:', error.stack);
    res
      .status(500)
      .json({ message: 'Error al actualizar', error: error.message });
  }
});

// Eliminar usuario
router.delete('/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json({ message: 'Usuario eliminado' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error.stack);
    res
      .status(500)
      .json({ message: 'Error al eliminar', error: error.message });
  }
});

export default router;
