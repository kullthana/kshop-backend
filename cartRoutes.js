const express = require('express');
const db = require('./db');
const { verifyToken } = require('./jwtUtils');

const router = express.Router();

// Add product to cart
router.post('/add', verifyToken, (req, res) => {
    const { product_id, quantity } = req.body;
    const query = 'SELECT * FROM carts WHERE user_id = ? AND product_id = ?';
    db.query(query, [req.user.id, product_id], (err, results) => {
        if (err) return res.status(500).json({ message: 'Error checking cart' });

        if (results.length > 0) {
            const cartItem = results[0];
            const newQuantity = cartItem.quantity + quantity;
            const updateQuery = 'UPDATE carts SET quantity = ? WHERE id = ?';
            db.query(updateQuery, [newQuantity, cartItem.id], (err, result) => {
                if (err) return res.status(500).json({ message: 'Error updating cart' });
                res.json({ message: 'Product quantity updated in cart' });
            });
        } else {
            const insertQuery = 'INSERT INTO carts (user_id, product_id, quantity) VALUES (?, ?, ?)';
            db.query(insertQuery, [req.user.id, product_id, quantity], (err, result) => {
                if (err) return res.status(500).json({ message: 'Error adding product to cart' });
                res.json({ message: 'Product added to cart' });
            });
        }
    });
});

// Remove product from cart (decrease quantity)
router.post('/remove', verifyToken, (req, res) => {
    const { product_id, quantity } = req.body;
    const query = 'SELECT * FROM carts WHERE user_id = ? AND product_id = ?';
    db.query(query, [req.user.id, product_id], (err, results) => {
        if (err) return res.status(500).json({ message: 'Error checking cart' });

        if (results.length > 0) {
            const cartItem = results[0];
            let newQuantity = cartItem.quantity - quantity;
            if (newQuantity <= 0) {
                const deleteQuery = 'DELETE FROM carts WHERE id = ?';
                db.query(deleteQuery, [cartItem.id], (err, result) => {
                    if (err) return res.status(500).json({ message: 'Error removing product from cart' });
                    res.json({ message: 'Product removed from cart' });
                });
            } else {
                const updateQuery = 'UPDATE carts SET quantity = ? WHERE id = ?';
                db.query(updateQuery, [newQuantity, cartItem.id], (err, result) => {
                    if (err) return res.status(500).json({ message: 'Error updating cart' });
                    res.json({ message: 'Product quantity decreased in cart' });
                });
            }
        } else {
            res.status(404).json({ message: 'Product not found in cart' });
        }
    });
});

// Get user's cart
router.get('/', verifyToken, (req, res) => {
    const query = `
        SELECT p.*, c.quantity FROM products p
        JOIN carts c ON p.id = c.product_id
        WHERE c.user_id = ?`;
    db.query(query, [req.user.id], (err, results) => {
        if (err) return res.status(500).json({ message: 'Error retrieving cart' });
        res.json(results);
    });
});

module.exports = router;
