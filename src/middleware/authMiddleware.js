const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token mavjud emas' });
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token muddati tugagan' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token yaroqsiz' });
    }
    res.status(500).json({ message: 'Server xatosi', error: error.message });
  }
};

module.exports = { protect };