/* catalog.js - Gestion du catalogue de produits */
document.addEventListener('DOMContentLoaded', async () => {
    // Récupérer les éléments du DOM
    const productsContainer = document.getElementById('products-container');
    const searchInput = document.getElementById('search-input');
    const filterGender = document.getElementById('filter-gender');
    const filterType = document.getElementById('filter-type');
    const filterColor = document.getElementById('filter-color');
    const sortSelect = document.getElementById('sort-select');
    
    // Récupérer tous les produits
    const products = await fetchProducts();
    
    // Initialiser l'affichage des produits
    displayProducts(products);
    
    // Fonction pour afficher les produits
    function displayProducts(productsToDisplay) {
        // Vider le conteneur
        productsContainer.innerHTML = '';
        
        if (productsToDisplay.length === 0) {
            productsContainer.innerHTML = '<p class="no-products">Aucun produit ne correspond à votre recherche.</p>';
            return;
        }
        
        // Récupérer le template de carte produit
        const template = document.getElementById('product-card-template');
        
        // Afficher chaque produit
        productsToDisplay.forEach(product => {
            // Cloner le template
            const productCard = template.content.cloneNode(true);
            
            // Mettre à jour les informations du produit
            const primaryImg = productCard.querySelector('.product-img.primary');
            const secondaryImg = productCard.querySelector('.product-img.secondary');
            const discountTag = productCard.querySelector('.product-tag.discount');
            const discountValue = productCard.querySelector('.discount-value');
            const productName = productCard.querySelector('.product-name');
            const currentPrice = productCard.querySelector('.current-price');
            const originalPrice = productCard.querySelector('.original-price');
            const currency = productCard.querySelector('.currency');
            const btnView = productCard.querySelector('.btn-view');
            const btnWishlist = productCard.querySelector('.btn-wishlist');
            const btnAddToCart = productCard.querySelector('.btn-add-to-cart');
            
            // Mise à jour des images
            primaryImg.src = `/images/products/${product.images[0]}`;
            primaryImg.alt = product.name;
            secondaryImg.src = `/images/products/${product.images.length > 1 ? product.images[1] : product.images[0]}`;
            secondaryImg.alt = product.name;
            
            // Afficher ou cacher la réduction
            if (product.discount > 0) {
                discountTag.style.display = 'block';
                discountValue.textContent = product.discount;
                originalPrice.textContent = product.price.toFixed(2);
                currentPrice.textContent = (product.price * (1 - product.discount / 100)).toFixed(2);
            } else {
                discountTag.style.display = 'none';
                originalPrice.style.display = 'none';
                currentPrice.textContent = product.price.toFixed(2);
            }
            
            productName.textContent = product.name;
            currency.textContent = product.currency;
            
            // Ajouter des événements aux boutons
            btnView.addEventListener('click', () => {
                window.location.href = `product.html?id=${product.id}`;
            });
            
            btnWishlist.addEventListener('click', () => {
                const added = addToWishlist(product);
                if (added) {
                    alert('Produit ajouté à votre liste de souhaits !');
                } else {
                    alert('Ce produit est déjà dans votre liste de souhaits.');
                }
            });
            
            btnAddToCart.addEventListener('click', () => {
                // Ajouter au panier avec les options par défaut (première couleur, première taille)
                const defaultColor = product.colors[0];
                const defaultSize = product.sizes ? product.sizes[0] : null;
                addToCart(product, 1, defaultColor, defaultSize);
                alert('Produit ajouté au panier !');
            });
            
            // Ajouter la carte produit au conteneur
            productsContainer.appendChild(productCard);
        });
    }
    
    // Fonction pour filtrer les produits
    function filterProducts() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedGender = filterGender.value;
        const selectedType = filterType.value;
        const selectedColor = filterColor.value;
        const sortOption = sortSelect.value;
        
        // Filtrer les produits
        let filteredProducts = products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm) || 
                                 product.description.toLowerCase().includes(searchTerm);
            
            const matchesGender = selectedGender === '' || product.gender === selectedGender;
            
            const matchesType = selectedType === '' || product.type === selectedType;
            
            const matchesColor = selectedColor === '' || product.colors.includes(selectedColor);
            
            return matchesSearch && matchesGender && matchesType && matchesColor;
        });
        
        // Trier les produits
        if (sortOption === 'price-asc') {
            filteredProducts.sort((a, b) => {
                const priceA = a.price * (1 - a.discount / 100);
                const priceB = b.price * (1 - b.discount / 100);
                return priceA - priceB;
            });
        } else if (sortOption === 'price-desc') {
            filteredProducts.sort((a, b) => {
                const priceA = a.price * (1 - a.discount / 100);
                const priceB = b.price * (1 - b.discount / 100);
                return priceB - priceA;
            });
        }
        
        // Afficher les produits filtrés
        displayProducts(filteredProducts);
    }
    
    // Ajouter des écouteurs d'événements pour les filtres
    searchInput.addEventListener('input', filterProducts);
    filterGender.addEventListener('change', filterProducts);
    filterType.addEventListener('change', filterProducts);
    filterColor.addEventListener('change', filterProducts);
    sortSelect.addEventListener('change', filterProducts);
});

/* product.js - Gestion de la page détail produit */
document.addEventListener('DOMContentLoaded', async () => {
    // Récupérer l'ID du produit depuis l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (!productId) {
        // Rediriger vers la page d'accueil si aucun ID n'est spécifié
        window.location.href = 'index.html';
        return;
    }
    
    // Récupérer les détails du produit
    const product = await fetchProductById(productId);
    
    if (!product) {
        // Gérer le cas où le produit n'existe pas
        document.querySelector('main').innerHTML = '<div class="container"><h2>Produit non trouvé</h2><p>Le produit que vous recherchez n\'existe pas.</p><a href="index.html" class="btn btn-primary">Retour au catalogue</a></div>';
        return;
    }
    
    // Mettre à jour le titre de la page
    document.title = `${product.name} - ModaStyle`;
    
    // Récupérer les éléments du DOM
    const productName = document.getElementById('product-name');
    const currentPrice = document.getElementById('current-price');
    const originalPrice = document.getElementById('original-price');
    const currency = document.getElementById('currency');
    const discountBadge = document.getElementById('discount-badge');
    const discountValue = document.getElementById('discount-value');
    const mainProductImage = document.getElementById('main-product-image');
    const productThumbnails = document.getElementById('product-thumbnails');
    const colorOptions = document.getElementById('color-options');
    const sizeOptions = document.getElementById('size-options');
    const quantityInput = document.getElementById('quantity');
    const decreaseQuantity = document.getElementById('decrease-quantity');
    const increaseQuantity = document.getElementById('increase-quantity');
    const stockQuantity = document.getElementById('stock-quantity');
    const shortDescription = document.getElementById('short-description');
    const fullDescription = document.getElementById('full-description');
    const showMoreBtn = document.getElementById('show-more');
    const characteristicsList = document.getElementById('characteristics-list');
    const addToCartBtn = document.getElementById('add-to-cart');
    const addToWishlistBtn = document.getElementById('add-to-wishlist');
    const carouselPrev = document.querySelector('.carousel-prev');
    const carouselNext = document.querySelector('.carousel-next');
    const similarProductsContainer = document.getElementById('similar-products-container');
    
    // Variables pour stocker les options sélectionnées
    let selectedColor = product.colors[0];
    let selectedSize = product.sizes ? product.sizes[0] : null;
    let currentImageIndex = 0;
    let quantity = 1;
    
    // Mettre à jour les informations du produit
    productName.textContent = product.name;
    currentPrice.textContent = (product.price * (1 - product.discount / 100)).toFixed(2);
    currency.textContent = product.currency;
    stockQuantity.textContent = product.stock;
    
    // Afficher la réduction si elle existe
    if (product.discount > 0) {
        originalPrice.textContent = product.price.toFixed(2);
        discountBadge.style.display = 'inline-block';
        discountValue.textContent = product.discount;
    } else {
        originalPrice.style.display = 'none';
        discountBadge.style.display = 'none';
    }
    
    // Mettre à jour les images
    mainProductImage.src = `/images/products/${product.images[0]}`;
    mainProductImage.alt = product.name;
    
    // Créer les miniatures
    product.images.forEach((image, index) => {
        const thumbnail = document.createElement('div');
        thumbnail.className = `product-thumbnail ${index === 0 ? 'active' : ''}`;
        thumbnail.innerHTML = `<img src="/images/products/${image}" alt="${product.name} - Image ${index + 1}">`;
        
        thumbnail.addEventListener('click', () => {
            // Mettre à jour l'image principale
            mainProductImage.src = `/images/products/${image}`;
            
            // Mettre à jour la classe active
            document.querySelectorAll('.product-thumbnail').forEach(thumb => {
                thumb.classList.remove('active');
            });
            thumbnail.classList.add('active');
            
            // Mettre à jour l'index courant
            currentImageIndex = index;
        });
        
        productThumbnails.appendChild(thumbnail);
    });
    
    // Configurer les contrôles du carrousel
    carouselPrev.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex - 1 + product.images.length) % product.images.length;
        updateMainImage();
    });
    
    carouselNext.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex + 1) % product.images.length;
        updateMainImage();
    });
    
    function updateMainImage() {
        mainProductImage.src = `/images/products/${product.images[currentImageIndex]}`;
        
        // Mettre à jour la classe active sur les miniatures
        document.querySelectorAll('.product-thumbnail').forEach((thumb, index) => {
            thumb.classList.toggle('active', index === currentImageIndex);
        });
    }
    
    // Créer les options de couleur
    product.colors.forEach(color => {
        const colorOption = document.createElement('div');
        colorOption.className = `color-option ${color === selectedColor ? 'active' : ''}`;
        colorOption.style.backgroundColor = color;
        colorOption.setAttribute('data-color', color);
        
        colorOption.addEventListener('click', () => {
            // Mettre à jour la couleur sélectionnée
            selectedColor = color;
            
            // Mettre à jour la classe active
            document.querySelectorAll('.color-option').forEach(option => {
                option.classList.remove('active');
            });
            colorOption.classList.add('active');
        });
        
        colorOptions.appendChild(colorOption);
    });
    
    // Créer les options de taille (si disponibles)
    if (product.sizes && product.sizes.length > 0) {
        product.sizes.forEach(size => {
            const sizeOption = document.createElement('div');
            sizeOption.className = `size-option ${size === selectedSize ? 'active' : ''}`;
            sizeOption.textContent = size;
            sizeOption.setAttribute('data-size', size);
            
            sizeOption.addEventListener('click', () => {
                // Mettre à jour la taille sélectionnée
                selectedSize = size;
                
                // Mettre à jour la classe active
                document.querySelectorAll('.size-option').forEach(option => {
                    option.classList.remove('active');
                });
                sizeOption.classList.add('active');
            });
            
            sizeOptions.appendChild(sizeOption);
        });
    } else {
        document.querySelector('.product-sizes').style.display = 'none';
    }
    
    // Configurer les contrôles de quantité
    decreaseQuantity.addEventListener('click', () => {
        if (quantity > 1) {
            quantity--;
            quantityInput.value = quantity;
        }
    });
    
    increaseQuantity.addEventListener('click', () => {
        if (quantity < product.stock) {
            quantity++;
            quantityInput.value = quantity;
        }
    });
    
    quantityInput.addEventListener('change', () => {
        const value = parseInt(quantityInput.value);
        if (isNaN(value) || value < 1) {
            quantity = 1;
        } else if (value > product.stock) {
            quantity = product.stock;
        } else {
            quantity = value;
        }
        quantityInput.value = quantity;
    });
    
    // Configurer la description
    if (product.description.length > 150) {
        shortDescription.textContent = product.description.substring(0, 150) + '...';
        fullDescription.textContent = product.description;
        showMoreBtn.style.display = 'inline-block';
        
        showMoreBtn.addEventListener('click', () => {
            if (fullDescription.classList.contains('hidden')) {
                fullDescription.classList.remove('hidden');
                shortDescription.classList.add('hidden');
                showMoreBtn.textContent = 'Voir moins';
            } else {
                fullDescription.classList.add('hidden');
                shortDescription.classList.remove('hidden');
                showMoreBtn.textContent = 'Voir plus';
            }
        });
    } else {
        shortDescription.textContent = product.description;
        showMoreBtn.style.display = 'none';
    }
    
    // Afficher les caractéristiques du produit
    const characteristics = [
        { label: 'Genre', value: product.gender },
        { label: 'Type', value: product.type },
        { label: 'Couleurs disponibles', value: product.colors.join(', ') },
        { label: 'Tailles disponibles', value: product.sizes ? product.sizes.join(', ') : 'Taille unique' },
        { label: 'Matière', value: product.material }
    ];
    
    characteristics.forEach(char => {
        if (char.value) {
            const li = document.createElement('li');
            li.textContent = `${char.label}: ${char.value}`;
            characteristicsList.appendChild(li);
        }
    });
    
    // Configurer les boutons d'action
    addToCartBtn.addEventListener('click', () => {
        addToCart(product, quantity, selectedColor, selectedSize);
        alert('Produit ajouté au panier !');
    });
    
    addToWishlistBtn.addEventListener('click', () => {
        const added = addToWishlist(product);
        if (added) {
            alert('Produit ajouté à votre liste de souhaits !');
        } else {
            alert('Ce produit est déjà dans votre liste de souhaits.');
        }
    });
    
    // Charger les produits similaires
    const similarProducts = await fetchSimilarProducts(productId, product.type, product.gender);
    
    // Limiter à 4 produits similaires
    const limitedSimilarProducts = similarProducts.slice(0, 4);
    
    // Afficher les produits similaires
    if (limitedSimilarProducts.length > 0) {
        limitedSimilarProducts.forEach(similarProduct => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            
            const discountStr = similarProduct.discount > 0 
                ? `<div class="product-tag discount">-${similarProduct.discount}%</div>` 
                : '';
            
            const originalPriceStr = similarProduct.discount > 0 
                ? `<span class="original-price">${similarProduct.price.toFixed(2)}</span>` 
                : '';
            
            const currentPriceValue = similarProduct.discount > 0 
                ? (similarProduct.price * (1 - similarProduct.discount / 100)).toFixed(2) 
                : similarProduct.price.toFixed(2);
            
            productCard.innerHTML = `
                <div class="product-image">
                    <img src="/images/products/${similarProduct.images[0]}" alt="${similarProduct.name}" class="product-img primary">
                    <img src="/images/products/${similarProduct.images.length > 1 ? similarProduct.images[1] : similarProduct.images[0]}" alt="${similarProduct.name}" class="product-img secondary">
                    ${discountStr}
                </div>
                <div class="product-info">
                    <h3 class="product-name">${similarProduct.name}</h3>
                    <div class="product-price">
                        <span class="current-price">${currentPriceValue}</span>
                        ${originalPriceStr}
                        <span class="currency">${similarProduct.currency}</span>
                    </div>
                    <div class="product-actions">
                        <button class="btn btn-view">Voir</button>
                        <button class="btn btn-wishlist">❤</button>
                    </div>
                </div>
            `;
            
            // Ajouter des événements aux boutons
            const btnView = productCard.querySelector('.btn-view');
            const btnWishlist = productCard.querySelector('.btn-wishlist');
            
            btnView.addEventListener('click', () => {
                window.location.href = `product.html?id=${similarProduct.id}`;
            });
            
            btnWishlist.addEventListener('click', () => {
                const added = addToWishlist(similarProduct);
                if (added) {
                    alert('Produit ajouté à votre liste de souhaits !');
                } else {
                    alert('Ce produit est déjà dans votre liste de souhaits.');
                }
            });
            
            similarProductsContainer.appendChild(productCard);
        });
    } else {
        // Cacher la section si aucun produit similaire n'est trouvé
        document.querySelector('.similar-products').style.display = 'none';
    }
});

/* main.js - Script principal */
document.addEventListener('DOMContentLoaded', () => {
    // Activer le menu burger pour le responsive
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }
});

/* cart.js - Gestion du panier */
document.addEventListener('DOMContentLoaded', async () => {
    if (!document.getElementById('cart-items')) {
        return; // Ne pas exécuter si on n'est pas sur la page panier
    }
    
    // Récupérer les éléments du DOM
    const cartItemsContainer = document.getElementById('cart-items');
    const subtotalElement = document.getElementById('subtotal');
    const taxElement = document.getElementById('tax');
    const totalElement = document.getElementById('total');
    const checkoutBtn = document.getElementById('checkout-btn');
    const addressForm = document.getElementById('address-form');
    const shippingAddressDisplay = document.getElementById('shipping-address-display');
    const changeAddressBtn = document.getElementById('change-address-btn');
    
    // Charger et afficher le panier
    loadCart();
    
    // Charger et afficher l'adresse de livraison
    loadShippingAddress();
    
    // Fonction pour charger et afficher le panier
    async function loadCart() {
        const cart = getCart();
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<tr><td colspan="6" class="empty-cart">Votre panier est vide.</td></tr>';
            updateTotals(0, 0, 0);
            checkoutBtn.disabled = true;
            return;
        }
        
        // Vider le conteneur
        cartItemsContainer.innerHTML = '';
        
        // Récupérer les détails complets de chaque produit
        for (let i = 0; i < cart.length; i++) {
            const item = cart[i];
            const product = await fetchProductById(item.productId);
            
            if (product) {
                const row = document.createElement('tr');
                
                const price = product.price * (1 - product.discount / 100);
                const itemTotal = price * item.quantity;
                
                row.innerHTML = `
                    <td class="product-image">
                        <img src="/images/products/${item.image}" alt="${item.name}">
                    </td>
                    <td class="product-name">${item.name}</td>
                    <td class="product-variant">
                        <span class="color-dot" style="background-color: ${item.color}"></span>
                        ${item.size ? item.size : ''}
                    </td>
                    <td class="product-price">${price.toFixed(2)} ${product.currency}</td>
                    <td class="product-quantity">
                        <div class="quantity-selector">
                            <button class="decrease">-</button>
                            <input type="number" value="${item.quantity}" min="1" max="${product.stock}">
                            <button class="increase">+</button>
                        </div>
                    </td>
                    <td class="product-total">${itemTotal.toFixed(2)} ${product.currency}</td>
                    <td class="product-actions">
                        <button class="btn-remove">×</button>
                    </td>
                `;
                
                // Ajouter des écouteurs d'événements
                const decreaseBtn = row.querySelector('.decrease');
                const increaseBtn = row.querySelector('.increase');
                const quantityInput = row.querySelector('input');
                const removeBtn = row.querySelector('.btn-remove');
                
                decreaseBtn.addEventListener('click', () => {
                    if (item.quantity > 1) {
                        updateQuantity(i, item.quantity - 1);
                    }
                });
                
                increaseBtn.addEventListener('click', () => {
                    if (item.quantity < product.stock) {
                        updateQuantity(i, item.quantity + 1);
                    }
                });
                
                quantityInput.addEventListener('change', () => {
                    const value = parseInt(quantityInput.value);
                    if (!isNaN(value) && value >= 1 && value <= product.stock) {
                        updateQuantity(i, value);
                    } else {
                        quantityInput.value = item.quantity;
                    }
                });
                
                removeBtn.addEventListener('click', () => {
                    removeFromCart(i);
                    loadCart();
                });
                
                cartItemsContainer.appendChild(row);
            }
        }
        
        // Calculer et afficher les totaux
        const subtotal = calculateCartTotal();
        const tax = subtotal * 0.2; // TVA à 20%
        const total = subtotal + tax;
        
        updateTotals(subtotal, tax, total);
        checkoutBtn.disabled = false;
    }
    
    // Fonction pour mettre à jour la quantité d'un article
    function updateQuantity(index, newQuantity) {
        updateCartItemQuantity(index, newQuantity);
        loadCart();
    }
    
    // Fonction pour mettre à jour les totaux
    function updateTotals(subtotal, tax, total) {
        if (subtotalElement) subtotalElement.textContent = subtotal.toFixed(2) + ' €';
        if (taxElement) taxElement.textContent = tax.toFixed(2) + ' €';
        if (totalElement) totalElement.textContent = total.toFixed(2) + ' €';
    }
    
    // Fonction pour charger et afficher l'adresse de livraison
    function loadShippingAddress() {
        const address = getShippingAddress();
        
        if (address) {
            // Afficher l'adresse enregistrée
            shippingAddressDisplay.innerHTML = `
                <p><strong>${address.fullName}</strong></p>
                <p>${address.street}</p>
                <p>${address.postalCode} ${address.city}</p>
                <p>${address.country}</p>
            `;
            
            shippingAddressDisplay.style.display = 'block';
            changeAddressBtn.style.display = 'block';
            addressForm.style.display = 'none';
        } else {
            // Afficher le formulaire d'adresse
            shippingAddressDisplay.style.display = 'none';
            changeAddressBtn.style.display = 'none';
            addressForm.style.display = 'block';
        }
    }
    
    // Gérer le formulaire d'adresse
    if (addressForm) {
        const addressSubmitBtn = addressForm.querySelector('button[type="submit"]');
        
        addressForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const fullName = addressForm.querySelector('#fullName').value;
            const street = addressForm.querySelector('#street').value;
            const postalCode = addressForm.querySelector('#postalCode').value;
            const city = addressForm.querySelector('#city').value;
            const country = addressForm.querySelector('#country').value;
            
            // Vérifier la validité de l'adresse avec une API (simulation)
            const isValidAddress = await validateAddress(street, postalCode, city, country);
            
            if (isValidAddress) {
                // Sauvegarder l'adresse
                saveShippingAddress({ fullName, street, postalCode, city, country });
                
                // Recharger l'affichage de l'adresse
                loadShippingAddress();
            } else {
                alert('Adresse invalide. Veuillez vérifier les informations saisies.');
            }
        });
    }
    
    // Gérer le bouton de changement d'adresse
    if (changeAddressBtn) {
        changeAddressBtn.addEventListener('click', () => {
            shippingAddressDisplay.style.display = 'none';
            changeAddressBtn.style.display = 'none';
            addressForm.style.display = 'block';
            
            // Pré-remplir le formulaire avec l'adresse actuelle
            const address = getShippingAddress();
            if (address) {
                addressForm.querySelector('#fullName').value = address.fullName;
                addressForm.querySelector('#street').value = address.street;
                addressForm.querySelector('#postalCode').value = address.postalCode;
                addressForm.querySelector('#city').value = address.city;
                addressForm.querySelector('#country').value = address.country;
            }
        });
    }
    
    // Gérer le bouton de passage à la commande
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', async () => {
            const cart = getCart();
            
            if (cart.length === 0) {
                alert('Votre panier est vide.');
                return;
            }
            
            const address = getShippingAddress();
            if (!address) {
                alert('Veuillez ajouter une adresse de livraison.');
                return;
            }
            
            // Simuler le passage de la commande
            alert('Commande passée avec succès ! Merci pour votre achat.');
            
            // Vider le panier
            saveCart([]);
            
            // Rediriger vers la page d'accueil
            window.location.href = 'index.html';
        });
    }
    
    // Fonction pour valider une adresse (simulation)
    async function validateAddress(street, postalCode, city, country) {
        // Simuler une validation d'adresse
        // Dans un cas réel, vous utiliseriez une API comme Google Places API
        return true;
    }
});

/* wishlist.js - Gestion de la liste de souhaits */
document.addEventListener('DOMContentLoaded', async () => {
    if (!document.getElementById('wishlist-items')) {
        return; // Ne pas exécuter si on n'est pas sur la page liste de souhaits
    }
    
    // Récupérer les éléments du DOM
    const wishlistContainer = document.getElementById('wishlist-items');
    const sortSelect = document.getElementById('sort-wishlist');
    
    // Charger et afficher la liste de souhaits
    loadWishlist();
    
    // Fonction pour charger et afficher la liste de souhaits
    async function loadWishlist() {
        let wishlist = getWishlist();
        
        if (wishlist.length === 0) {
            wishlistContainer.innerHTML = '<div class="empty-wishlist">Votre liste de souhaits est vide.</div>';
            return;
        }
        
        // Trier la liste si nécessaire
        if (sortSelect && sortSelect.value) {
            wishlist = sortWishlist(wishlist, sortSelect.value);
        }
        
        // Vider le conteneur
        wishlistContainer.innerHTML = '';
        
        // Afficher chaque produit
        wishlist.forEach((item, index) => {
            const productCard = document.createElement('div');
            productCard.className = 'wishlist-item';
            
            const priceDisplay = item.discount > 0 
                ? `<span class="current-price">${(item.price * (1 - item.discount / 100)).toFixed(2)}</span>
                   <span class="original-price">${item.price.toFixed(2)}</span>` 
                : `<span class="current-price">${item.price.toFixed(2)}</span>`;
            
            productCard.innerHTML = `
                <div class="wishlist-item-image">
                    <img src="/images/products/${item.image}" alt="${item.name}">
                </div>
                <div class="wishlist-item-info">
                    <h3>${item.name}</h3>
                    <div class="wishlist-item-price">
                        ${priceDisplay} €
                    </div>
                    <div class="wishlist-item-priority">
                        <span>Priorité:</span>
                        <div class="priority-controls">
                            <button class="btn-move-up" ${index === 0 ? 'disabled' : ''}>▲</button>
                            <span class="priority-value">${item.priority + 1}</span>
                            <button class="btn-move-down" ${index === wishlist.length - 1 ? 'disabled' : ''}>▼</button>
                        </div>
                    </div>
                    <div class="wishlist-item-actions">
                        <button class="btn btn-primary btn-view">Voir le produit</button>
                        <button class="btn btn-secondary btn-add-to-cart">Ajouter au panier</button>
                        <button class="btn btn-danger btn-remove">Supprimer</button>
                    </div>
                </div>
            `;
            
            // Ajouter des écouteurs d'événements
            const btnView = productCard.querySelector('.btn-view');
            const btnAddToCart = productCard.querySelector('.btn-add-to-cart');
            const btnRemove = productCard.querySelector('.btn-remove');
            const btnMoveUp = productCard.querySelector('.btn-move-up');
            const btnMoveDown = productCard.querySelector('.btn-move-down');
            
            btnView.addEventListener('click', () => {
                window.location.href = `product.html?id=${item.id}`;
            });
            
            btnAddToCart.addEventListener('click', async () => {
                // Récupérer les détails complets du produit
                const product = await fetchProductById(item.id);
                
                if (product) {
                    // Ajouter au panier avec les options par défaut
                    const defaultColor = product.colors[0];
                    const defaultSize = product.sizes ? product.sizes[0] : null;
                    addToCart(product, 1, defaultColor, defaultSize);
                    alert('Produit ajouté au panier !');
                }
            });
            
            btnRemove.addEventListener('click', () => {
                removeFromWishlist(item.id);
                loadWishlist();
            });
            
            btnMoveUp.addEventListener('click', () => {
                if (index > 0) {
                    updateWishlistPriority(item.id, index - 1);
                    loadWishlist();
                }
            });
            
            btnMoveDown.addEventListener('click', () => {
                if (index < wishlist.length - 1) {
                    updateWishlistPriority(item.id, index + 1);
                    loadWishlist();
                }
            });
            
            wishlistContainer.appendChild(productCard);
        });
    }
    
    // Fonction pour trier la liste de souhaits
    function sortWishlist(wishlist, sortOption) {
        let sortedWishlist = [...wishlist];
        
        switch (sortOption) {
            case 'priority':
                sortedWishlist.sort((a, b) => a.priority - b.priority);
                break;
            case 'price-asc':
                sortedWishlist.sort((a, b) => {
                    const priceA = a.price * (1 - a.discount / 100);
                    const priceB = b.price * (1 - b.discount / 100);
                    return priceA - priceB;
                });
                break;
            case 'price-desc':
                sortedWishlist.sort((a, b) => {
                    const priceA = a.price * (1 - a.discount / 100);
                    const priceB = b.price * (1 - b.discount / 100);
                    return priceB - priceA;
                });
                break;
            case 'name':
                sortedWishlist.sort((a, b) => a.name.localeCompare(b.name));
                break;
        }
        
        return sortedWishlist;
    }
    
    // Gérer le changement de tri
    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            loadWishlist();
        });
    }
});