// backend/routes/users.js (con logs para depurar el 500, y export named para protect)
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'; // Asegúrate de importarlo para hashear en update
import User from '../models/User.js';

const router = express.Router();

// Middleware protect
export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-contrasena');
      if (req.user.rol !== 'Superadmin') {
        return res.status(403).json({ message: 'No autorizado: Rol insuficiente' });
      }
      next();
    } catch (error) {
      console.error('Error en protect:', error.stack);
      res.status(401).json({ message: 'No autorizado' });
    }
  } else {
    res.status(401).json({ message: 'Token no proporcionado' });
  }
};

// Register
router.post('/register', async (req, res) => {
  const { nombreCompleto, apellidoPaterno, apellidoMaterno, correo, contrasena, rol } = req.body;
  try {
    const userExists = await User.findOne({ correo });
    if (userExists) return res.status(400).json({ message: 'Usuario ya existe' });
    const user = await User.create({ nombreCompleto, apellidoPaterno, apellidoMaterno, correo, contrasena, rol });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.json({ _id: user._id, nombreCompleto: user.nombreCompleto, correo: user.correo, rol: user.rol, token });
  } catch (error) {
    console.error('Error en register:', error.stack);
    res.status(400).json({ message: 'Datos inválidos', error: error.message });
  }
});

// Login con logs y chequeo de campos requeridos
router.post('/login', async (req, res) => {
  console.log('Login request received:', req.body);
  const { correo, contrasena } = req.body;
  if (!correo || !contrasena) {
    console.log('Missing correo or contrasena');
    return res.status(400).json({ message: 'Correo y contraseña requeridos' });
  }
  try {
    console.log('Buscando user con correo:', correo);
    const user = await User.findOne({ correo });
    if (!user) {
      console.log('User no encontrado');
      return res.status(401).json({ message: 'Correo o contraseña inválidos' });
    }
    console.log('User encontrado:', user._id);
    const passwordMatch = await user.matchPassword(contrasena);
    console.log('Password match:', passwordMatch);
    if (passwordMatch) {
      console.log('Generando token...');
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
      console.log('Token generado OK');
      res.json({ _id: user._id, nombreCompleto: user.nombreCompleto, correo: user.correo, rol: user.rol, token });
    } else {
      res.status(401).json({ message: 'Correo o contraseña inválidos' });
    }
  } catch (error) {
    console.error('Error completo en login:', error.stack);
    res.status(500).json({ message: 'Error en login', error: error.message });
  }
});

// Ruta /me para fetch user con token
router.get('/me', protect, async (req, res) => {
  res.json(req.user);
});

// List all users (protegido, solo Superadmin)
router.get('/', protect, async (req, res) => {
  try {
    console.log('Fetching all users...');
    const users = await User.find({}).select('-contrasena');
    console.log('Users fetched:', users.length);
    res.json(users);
  } catch (error) {
    console.error('Error en get users:', error.stack);
    res.status(500).json({ message: 'Error al listar usuarios', error: error.message });
  }
});

// Create new user (protegido, similar a register pero con auth)
router.post('/', protect, async (req, res) => {
  const { nombreCompleto, apellidoPaterno, apellidoMaterno, correo, contrasena, rol } = req.body;
  try {
    console.log('Creating new user:', { correo, rol });
    const userExists = await User.findOne({ correo });
    if (userExists) return res.status(400).json({ message: 'Usuario ya existe' });
    const user = await User.create({ nombreCompleto, apellidoPaterno, apellidoMaterno, correo, contrasena, rol });
    console.log('User created:', user._id);
    res.json(user.select('-contrasena'));
  } catch (error) {
    console.error('Error en create user:', error.stack);
    res.status(400).json({ message: 'Datos inválidos', error: error.message });
  }
});

// Update user (protegido)
router.put('/:id', protect, async (req, res) => {
  try {
    console.log('Updating user:', req.params.id);
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User no encontrado' });
    // Hashea contraseña si se proporciona
    if (req.body.contrasena) {
      const salt = await bcrypt.genSalt(10);
      req.body.contrasena = await bcrypt.hash(req.body.contrasena, salt);
    }
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-contrasena');
    console.log('User updated:', updatedUser._id);
    res.json(updatedUser);
  } catch (error) {
    console.error('Error en update user:', error.stack);
    res.status(500).json({ message: 'Error al actualizar', error: error.message });
  }
});

// Delete user (protegido)
router.delete('/:id', protect, async (req, res) => {
  try {
    console.log('Deleting user:', req.params.id);
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User no encontrado' });
    console.log('User deleted:', req.params.id);
    res.json({ message: 'User eliminado' });
  } catch (error) {
    console.error('Error en delete user:', error.stack);
    res.status(500).json({ message: 'Error al eliminar', error: error.message });
  }
});

export default router;