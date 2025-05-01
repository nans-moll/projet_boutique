/* api.js */
const API_URL = 'http://localhost:3000/api';

// Fonction pour récupérer tous les produits
async function fetchProducts() {
    try {
        const response = await fetch(`${API_URL}/products`);
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des produits');
        }
        return await response.json();
    } catch (error) {
        console.error('Erreur API:', error);
        return [];
    }
}

// Fonction pour récupérer un produit par ID
async function fetchProductById(productId) {
    try {
        const response = await fetch(`${API_URL}/products/${productId}`);
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération du produit');
        }
        return await response.json();
    } catch (error) {
        console.error('Erreur API:', error);
        return null;
    }
}

// Fonction pour récupérer les produits similaires
async function fetchSimilarProducts(productId, type, gender) {
    try {
        const response = await fetch(`${API_URL}/products/similar?id=${productId}&type=${type}&gender=${gender}`);
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des produits similaires');
        }
        return await response.json();
    } catch (error) {
        console.error('Erreur API:', error);
        return [];
    }
}

// Fonction pour récupérer le panier
function getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

// Fonction pour sauvegarder le panier
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

// Fonction pour ajouter un produit au panier
function addToCart(product, quantity, selectedColor, selectedSize) {
    const cart = getCart();
    
    // Vérifier si le produit existe déjà dans le panier
    const existingItemIndex = cart.findIndex(item => 
        item.productId === product.id && 
        item.color === selectedColor && 
        item.size === selectedSize
    );
    
    if (existingItemIndex !== -1) {
        // Mettre à jour la quantité si le produit existe déjà
        cart[existingItemIndex].quantity += quantity;
    } else {
        // Ajouter un nouveau produit au panier
        cart.push({
            productId: product.id,
            name: product.name,
            price: product.price,
            discount: product.discount,
            image: product.images[0],
            color: selectedColor,
            size: selectedSize,
            quantity: quantity
        });
    }
    
    saveCart(cart);
    return cart;
}

// Fonction pour mettre à jour la quantité d'un produit dans le panier
function updateCartItemQuantity(index, quantity) {
    const cart = getCart();
    if (cart[index]) {
        cart[index].quantity = quantity;
        saveCart(cart);
    }
    return cart;
}

// Fonction pour supprimer un produit du panier
function removeFromCart(index) {
    const cart = getCart();
    if (cart[index]) {
        cart.splice(index, 1);
        saveCart(cart);
    }
    return cart;
}

// Fonction pour calculer le total du panier
function calculateCartTotal() {
    const cart = getCart();
    return cart.reduce((total, item) => {
        const price = item.price * (1 - item.discount / 100);
        return total + (price * item.quantity);
    }, 0);
}

// Fonction pour mettre à jour le compteur du panier
function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(element => {
        element.textContent = count;
    });
}

// Fonction pour récupérer la liste de souhaits
function getWishlist() {
    const wishlist = localStorage.getItem('wishlist');
    return wishlist ? JSON.parse(wishlist) : [];
}

// Fonction pour sauvegarder la liste de souhaits
function saveWishlist(wishlist) {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

// Fonction pour ajouter un produit à la liste de souhaits
function addToWishlist(product) {
    const wishlist = getWishlist();
    
    // Vérifier si le produit existe déjà dans la liste de souhaits
    const existingItemIndex = wishlist.findIndex(item => item.id === product.id);
    
    if (existingItemIndex === -1) {
        // Ajouter un nouveau produit à la liste de souhaits
        wishlist.push({
            id: product.id,
            name: product.name,
            price: product.price,
            discount: product.discount,
            image: product.images[0],
            priority: wishlist.length // La priorité est basée sur l'ordre d'ajout
        });
        
        saveWishlist(wishlist);
        return true;
    }
    
    return false;
}

// Fonction pour supprimer un produit de la liste de souhaits
function removeFromWishlist(productId) {
    const wishlist = getWishlist();
    const newWishlist = wishlist.filter(item => item.id !== productId);
    saveWishlist(newWishlist);
    return newWishlist;
}

// Fonction pour mettre à jour la priorité d'un produit dans la liste de souhaits
function updateWishlistPriority(productId, newPriority) {
    const wishlist = getWishlist();
    const productIndex = wishlist.findIndex(item => item.id === productId);
    
    if (productIndex !== -1 && newPriority >= 0 && newPriority < wishlist.length) {
        const product = wishlist[productIndex];
        wishlist.splice(productIndex, 1);
        wishlist.splice(newPriority, 0, product);
        
        // Mettre à jour les priorités de tous les produits
        wishlist.forEach((item, index) => {
            item.priority = index;
        });
        
        saveWishlist(wishlist);
        return wishlist;
    }
    
    return wishlist;
}

// Fonction pour récupérer l'adresse de livraison
function getShippingAddress() {
    const address = localStorage.getItem('shippingAddress');
    return address ? JSON.parse(address) : null;
}

// Fonction pour sauvegarder l'adresse de livraison
function saveShippingAddress(address) {
    localStorage.setItem('shippingAddress', JSON.stringify(address));
}

// Initialiser le compteur du panier au chargement de la page
document.addEventListener('DOMContentLoaded', updateCartCount);