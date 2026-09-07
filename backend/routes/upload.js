const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name:  process.env.CLOUDINARY_CLOUD_NAME,
  api_key:     process.env.CLOUDINARY_API_KEY,
  api_secret:  process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => ({
    folder:          'portfolio',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'],
    transformation:  [{ quality: 'auto', fetch_format: 'auto' }],
    public_id:       `${Date.now()}-${file.originalname.replace(/\.[^/.]+$/, '')}`,
  }),
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed'));
  },
});

const express = require('express');
const router  = express.Router();
const { requireAdmin } = require('../middleware/auth');

// POST /api/upload — upload image to Cloudinary
router.post('/', requireAdmin, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  res.json({
    url:       req.file.path,
    public_id: req.file.filename,
  });
});

// DELETE /api/upload/:publicId — remove image from Cloudinary
router.delete('/:publicId', requireAdmin, async (req, res) => {
  try {
    const id = decodeURIComponent(req.params.publicId);
    await cloudinary.uploader.destroy(id);
    res.json({ message: 'Image deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
