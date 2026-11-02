const adminOnly = (req, res, next) => {
  if (!["admin", "superadmin"].includes(req.user?.role)) {
    return res.status(403).json({
      success: false,
      message: "Administrator access required"
    });
  }

  next();
};

export default adminOnly;
