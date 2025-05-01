# FashionHub - Site E-commerce de Vêtements

## Description du projet
ModaStyle est un site e-commerce de vêtements développé dans le cadre du Challenge JS. Cette application web permet aux utilisateurs de parcourir un catalogue de produits, de filtrer et trier les articles, d'ajouter des produits au panier et à une liste de souhaits, et de simuler un processus de commande.

## Fonctionnalités
- Catalogue de 20 produits uniques avec descriptions détaillées
- Filtrage par nom, genre, type et couleur
- Tri par prix (croissant/décroissant)
- Affichage d'images alternatives au survol
- Détail des produits avec description tronquée
- Carrousel d'images avec miniatures et contrôles
- Sélection de variantes (couleurs, tailles)
- Gestion du panier (ajout, modification, suppression)
- Gestion des stocks
- Application des réductions
- Saisie d'adresse de livraison
- Liste de souhaits avec tri par priorité
- Design responsive pour desktop, tablette et mobile

## Technologies utilisées
- **Frontend**: HTML, CSS et JavaScript vanilla (sans framework)
- **Backend**: Node.js avec Express
- **Données**: Stockage en JSON
- **Images**: Stockées sur le serveur

## Structure du projet

boutique-vetements/
├── frontend/
│   ├── index.html        # Page d'accueil/catalogue
│   ├── product.html      # Page détail d'un produit
│   ├── cart.html         # Page panier
│   ├── wishlist.html     # Page liste de souhaits
│   ├── assets/
│   │   ├── css/
│   │   │   ├── style.css       # Styles généraux
│   │   │   └── responsive.css  # Médias queries
│   │   └── js/
│   │       ├── main.js         # JavaScript principal
│   │       ├── api.js          # Gestion des appels API
│   │       ├── catalog.js      # Logique du catalogue
│   │       ├── product.js      # Logique de la page produit
│   │       ├── cart.js         # Logique du panier
│   │       └── wishlist.js     # Logique de la liste de souhaits
├── backend/
│   ├── server.js            # Point d'entrée du serveur Express
│   ├── routes/
│   │   ├── products.js      # Routes pour les produits
│   │   ├── cart.js          # Routes pour le panier
│   │   └── wishlist.js      # Routes pour la liste de souhaits
│   ├── data/
│   │   └── products.json    # Données des produits
│   └── public/
│       └── images/
│           └── products/    # Images des produits
└── package.json

## Prérequis
- Node.js (version recommandée : 14.x ou supérieure)
- npm (généralement installé avec Node.js)

## Installation
1. Cloner le dépôt
git clone (utilisez l'url du repo)
cd boutique-vetements

2. Installer les dépendances
npm install

## Démarrage du serveur
1. Lancer le serveur en mode développement
npm run dev
Ou en mode production
npm start

2. Accéder au site
Ouvrir votre navigateur à l'adresse http://localhost:3000

## Fonctionnement

### Catalogue
- La page d'accueil affiche tous les produits disponibles
- Utiliser les filtres pour affiner les résultats par genre, type ou couleur
- Utiliser la barre de recherche pour trouver des produits par nom
- Cliquer sur "Voir" pour accéder aux détails du produit

### Page Produit
- Parcourir les images avec les flèches du carrousel ou les miniatures
- Sélectionner une couleur et une taille (si disponible)
- Ajuster la quantité avec les boutons + et -
- Ajouter au panier ou à la liste de souhaits

### Panier
- Modifier les quantités directement dans le panier
- Supprimer des articles
- Ajouter une adresse de livraison
- Procéder au paiement (simulation)

### Liste de souhaits
- Ajuster la priorité des articles
- Trier selon différents critères (priorité, prix, nom)
- Ajouter directement au panier depuis la liste de souhaits

## Instructions pour l'évaluation
Ce projet répond aux exigences suivantes du Challenge JS :
- Conception d'une application d'e-commerce
- Maîtrise des bases du langage Javascript
- Manipulation du DOM
- Interaction avec l'utilisateur
- Dynamisation d'une page web
- Manipulation des données d'une API
- Stockage en cache dans le navigateur
- Respect des contraintes techniques (HTML/CSS/JS et Express)

## Auteurs
MOLL Nans, Etienne Bebiere

## Licence
Ce projet est réalisé dans le cadre d'un projet scolaire.

---
*Projet réalisé pour le module Challenge JS - Bachelor 1 Informatique - Ynov*RéessayerClaude peut faire des erreurs. Assurez-vous de vérifier ses réponses. 3.7 Sonnet
