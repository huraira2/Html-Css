// Image gallery functionality
const thumbnails = document.querySelectorAll('.thumbnail');
const mainImage = document.getElementById('mainImg');

thumbnails.forEach(thumbnail => {
    thumbnail.addEventListener('click', function() {
        // Remove active class from all thumbnails
        thumbnails.forEach(thumb => thumb.classList.remove('active'));
        
        // Add active class to clicked thumbnail
        this.classList.add('active');
        
        // Update main image
        mainImage.src = this.src.replace('w=100', 'w=500');
        
        // Add animation effect
        mainImage.style.opacity = '0';
        setTimeout(() => {
            mainImage.style.opacity = '1';
        }, 150);
    });
});

// Color selection
const colorOptions = document.querySelectorAll('.color-option');
colorOptions.forEach(option => {
    option.addEventListener('click', function() {
        colorOptions.forEach(opt => opt.classList.remove('active'));
        this.classList.add('active');
    });
});

// Size selection
const sizeOptions = document.querySelectorAll('.size-option');
sizeOptions.forEach(option => {
    option.addEventListener('click', function() {
        sizeOptions.forEach(opt => opt.classList.remove('active'));
        this.classList.add('active');
    });
});

// Quantity controls
const decreaseBtn = document.getElementById('decrease');
const increaseBtn = document.getElementById('increase');
const quantityValue = document.getElementById('quantity');

let quantity = 1;

decreaseBtn.addEventListener('click', function() {
    if (quantity > 1) {
        quantity--;
        quantityValue.textContent = quantity;
        updateQuantityButtons();
    }
});

increaseBtn.addEventListener('click', function() {
    if (quantity < 10) {
        quantity++;
        quantityValue.textContent = quantity;
        updateQuantityButtons();
    }
});

function updateQuantityButtons() {
    decreaseBtn.style.opacity = quantity === 1 ? '0.5' : '1';
    increaseBtn.style.opacity = quantity === 10 ? '0.5' : '1';
}

// Add to cart functionality
const addToCartBtn = document.querySelector('.add-to-cart');
const btnText = document.querySelector('.btn-text');
const btnIcon = document.querySelector('.btn-icon');

addToCartBtn.addEventListener('click', function() {
    // Get selected options
    const selectedColor = document.querySelector('.color-option.active').dataset.color;
    const selectedSize = document.querySelector('.size-option.active').textContent;
    
    // Animate button
    this.style.transform = 'scale(0.95)';
    btnText.textContent = 'Added!';
    btnIcon.textContent = '✓';
    
    setTimeout(() => {
        this.style.transform = 'scale(1)';
        btnText.textContent = 'Add to Cart';
        btnIcon.textContent = '🛒';
    }, 1500);
    
    // Show confirmation
    showNotification(`Added ${quantity} item(s) to cart - ${selectedColor} ${selectedSize}`);
});

// Wishlist functionality
const wishlistBtn = document.querySelector('.wishlist');
let isWishlisted = false;

wishlistBtn.addEventListener('click', function() {
    isWishlisted = !isWishlisted;
    const icon = this.querySelector('.btn-icon');
    
    if (isWishlisted) {
        icon.textContent = '♥';
        icon.style.color = '#e53e3e';
        showNotification('Added to wishlist');
    } else {
        icon.textContent = '♡';
        icon.style.color = '';
        showNotification('Removed from wishlist');
    }
    
    // Animate button
    this.style.transform = 'scale(1.1)';
    setTimeout(() => {
        this.style.transform = 'scale(1)';
    }, 200);
});

// Share functionality
const shareBtn = document.querySelector('.share');
shareBtn.addEventListener('click', function() {
    if (navigator.share) {
        navigator.share({
            title: 'Premium Wireless Headphones',
            text: 'Check out these amazing headphones!',
            url: window.location.href
        });
    } else {
        // Fallback - copy to clipboard
        navigator.clipboard.writeText(window.location.href);
        showNotification('Link copied to clipboard');
    }
});

// Notification system
function showNotification(message) {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #48bb78;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize quantity buttons
updateQuantityButtons();