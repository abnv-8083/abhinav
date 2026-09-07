/**
 * Admin auth middleware — simple Bearer token check against ADMIN_PASSWORD env var.
 * Usage: add requireAdmin to any route you want to protect.
 */
const requireAdmin = (req, res, next) => {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';

  if (!token || token !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

module.exports = { requireAdmin };
