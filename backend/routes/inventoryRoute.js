const express = require('express');
const {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/inventoryController');   // ← was inventoryController
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// ─── PUBLIC ───
router.get('/', getProducts);
router.get('/:id', getProductById);

// ─── PROTECTED ───
router.use(authMiddleware);

router.post('/',   upload.array('images', 4), addProduct);
router.put('/:id', upload.array('images', 4), updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;