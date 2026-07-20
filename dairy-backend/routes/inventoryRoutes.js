const router = require("express").Router();
const auth = require("../middleware/authMiddleware");

const {
    addProduct,
    getProducts,
    updateProduct,
    deleteProduct
} = require("../controllers/inventoryController");

router.post("/", auth(["admin"]), addProduct);
router.put("/:id", auth(["admin"]), updateProduct);
router.delete("/:id", auth(["admin"]), deleteProduct);

router.get("/", getProducts);

module.exports = router;