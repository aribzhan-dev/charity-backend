const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Please log in first' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Permission denied. Your role: ${req.user.role}`
      });
    }

    next();
  };
};

module.exports = { allowRoles };