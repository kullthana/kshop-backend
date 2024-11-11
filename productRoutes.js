const express = require('express');
const db = require('./db');
const { verifyToken } = require('./jwtUtils');

const router = express.Router();

// Create multiple products
router.post('/', verifyToken, (req, res) => {
    const products = req.body.products; // Array of products
    const query = 'INSERT INTO products (name, price, stock, detail, CPU, Graphics, RAM, SSD, image) VALUES ?';
    const values = products.map(product => [
        product.name, product.price, product.stock, product.detail, product.CPU, product.Graphics, product.RAM, product.SSD, product.image
    ]);

    db.query(query, [values], (err, result) => {
        if (err) return res.status(500).json({ message: 'Error creating products' });
        res.status(201).json({ message: `${result.affectedRows} products created successfully` });
    });
});

// Get all products
router.get('/', (req, res) => {
    const query = 'SELECT * FROM products';
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ message: 'Error retrieving products' });
        res.json(results);
    });
});

// Update product stock or details (optional)
router.put('/:id', verifyToken, (req, res) => {
    const { name, price, stock, detail, CPU, Graphics, RAM, SSD, image } = req.body;
    const query = 'UPDATE products SET name = ?, price = ?, stock = ?, detail = ?, CPU = ?, Graphics = ?, RAM = ?, SSD = ?, image = ? WHERE id = ?';
    db.query(query, [name, price, stock, detail, CPU, Graphics, RAM, SSD, image, req.params.id], (err, result) => {
        if (err) return res.status(500).json({ message: 'Error updating product' });
        res.json({ message: 'Product updated successfully' });
    });
});

// Delete a product by ID
router.delete('/:id', verifyToken, (req, res) => {
    const productId = req.params.id;

    const deleteQuery = 'DELETE FROM products WHERE id = ?';
    db.query(deleteQuery, [productId], (err, result) => {
        if (err) return res.status(500).json({ message: 'Error deleting product' });
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({ message: 'Product deleted successfully' });
    });
});

module.exports = router;
