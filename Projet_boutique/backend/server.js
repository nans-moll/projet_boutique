// server.js - Point d'entrée du serveur Express
const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

// Création de l'application Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware pour le parsing du JSON et des formulaires
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/images/products', express.static(path.join(__dirname, 'public/images/products')));

// Importer les routes
const productsRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const wishlistRoutes = require('./routes/wishlist');

// Utiliser les routes
app.use('/api/products', productsRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);

// Route pour la page d'accueil
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});