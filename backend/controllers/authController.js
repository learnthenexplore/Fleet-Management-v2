import bcrypt from 'bcryptjs';
import User from '../models/User.js';

export const registerUser = async (req, res) => {
  const { name, employeeId, password, role } = req.body;
  console.log('Registering user:', { name, employeeId, role });
  if (!name || !employeeId || !password || !role) {
    return res.status(400).json({ message: 'All fields (name, employeeId, password, role) are required' });
  }

  try {
    const existing = await User.findOne({ employeeId });
    if (existing) {
      return res.status(400).json({ message: 'User with this employee ID already exists' });
    }
  console.log('Creating user with role:', role);
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, employeeId, password: hashedPassword, role });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        name: user.name,
        employeeId: user.employeeId,
        role: user.role,
      },
    });
    console
  } catch (error) {
     console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { employeeId, password } = req.body;

  if (!employeeId || !password) {
    return res.status(400).json({ message: 'Employee ID and password are required' });
  }

  try {
    const user = await User.findOne({ employeeId });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        employeeId: user.employeeId,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};
