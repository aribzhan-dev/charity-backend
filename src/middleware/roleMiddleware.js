const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Avval login qiling' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Ruxsat yo'q. Sizning rolingiz: ${req.user.role}`
      });
    }

    next();
  };
};

module.exports = { allowRoles };