// routes/products.js - Routes pour les produits
const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// Chemin vers le fichier JSON des produits
const productsFilePath = path.join(__dirname, '../data/products.json');

// Fonction pour lire les produits depuis le fichier JSON
function getProducts() {
    try {
        const productsData = fs.readFileSync(productsFilePath, 'utf8');
        return JSON.parse(productsData);
    } catch (error) {
        console.error('Erreur lors de la lecture des produits:', error);
        return [];
    }
}

// Fonction pour écrire les produits dans le fichier JSON
function saveProducts(products) {
    try {
        fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error('Erreur lors de l\'écriture des produits:', error);
        return false;
    }
}

// Route pour récupérer tous les produits
router.get('/', (req, res) => {
    const products = getProducts();
    res.json(products);
});

// Route pour récupérer des produits similaires
// Cette route doit être placée AVANT la route /:id
router.get('/similar', (req, res) => {
    const { id, type, gender } = req.query;
    const products = getProducts();
    
    // Filtrer les produits similaires (même type et genre, mais ID différent)
    const similarProducts = products.filter(p => 
        p.id !== id && 
        p.type === type && 
        p.gender === gender
    );
    
    res.json(similarProducts);
});

// Route pour récupérer un produit par ID
router.get('/:id', (req, res) => {
    const products = getProducts();
    const product = products.find(p => p.id === req.params.id);
    
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Produit non trouvé' });
    }
});

// Route pour mettre à jour la quantité en stock d'un produit
router.put('/:id/stock', (req, res) => {
    const { quantity } = req.body;
    const products = getProducts();
    const productIndex = products.findIndex(p => p.id === req.params.id);
    
    if (productIndex !== -1) {
        // Vérifier que la quantité est valide
        if (typeof quantity === 'number' && quantity >= 0) {
            products[productIndex].stock = quantity;
            
            // Sauvegarder les modifications
            if (saveProducts(products)) {
                res.json({ message: 'Stock mis à jour avec succès' });
            } else {
                res.status(500).json({ message: 'Erreur lors de la mise à jour du stock' });
            }
        } else {
            res.status(400).json({ message: 'Quantité invalide' });
        }
    } else {
        res.status(404).json({ message: 'Produit non trouvé' });
    }
});

module.exports = router;