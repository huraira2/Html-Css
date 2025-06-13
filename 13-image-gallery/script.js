// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const filterBtns = document.querySelectorAll('.filter-btn');
const viewBtns = document.querySelectorAll('.view-btn');
const galleryGrid = document.getElementById('galleryGrid');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxTitle = document.getElementById('lightboxTitle');
const lightboxDescription = document.getElementById('lightboxDescription');
const lightboxPhotographer = document.getElementById('lightboxPhotographer');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');

// Gallery state
let currentFilter = 'all';
let currentView = 'grid';
let currentLightboxIndex = 0;
let galleryItems = [];

// Initialize gallery
document.addEventListener('DOMContentLoaded', function() {
    galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
    animateGalleryItems();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // Filter buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.dataset.filter;
            filterGallery();
        });
    });

    // View buttons
    viewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            viewBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentView = this.dataset.view;
            changeView();
        });
    });

    // Load more button
    loadMoreBtn.addEventListener('click', loadMoreImages);

    // Lightbox controls
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
    lightboxNext.addEventListener('click', () => navigateLightbox(1));

    // Close lightbox on background click
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (lightbox.classList.contains('active')) {
            switch(e.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowLeft':
                    navigateLightbox(-1);
                    break;
                case 'ArrowRight':
                    navigateLightbox(1);
                    break;
            }
        }
    });

    // Setup action buttons for existing items
    setupActionButtons();
}

// Setup action buttons
function setupActionButtons() {
    const actionBtns = document.querySelectorAll('.action-btn');
    
    actionBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            
            if (this.classList.contains('like-btn')) {
                toggleLike(this);
            } else if (this.classList.contains('download-btn')) {
                downloadImage(this);
            } else if (this.classList.contains('share-btn')) {
                shareImage(this);
            } else if (this.classList.contains('fullscreen-btn')) {
                openLightbox(this);
            }
        });
    });
}

// Search functionality
function performSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    galleryItems.forEach(item => {
        const title = item.querySelector('.image-title').textContent.toLowerCase();
        const description = item.querySelector('.image-description').textContent.toLowerCase();
        const tags = item.dataset.tags.toLowerCase();
        const photographer = item.querySelector('.photographer').textContent.toLowerCase();
        
        const matches = title.includes(searchTerm) || 
                       description.includes(searchTerm) || 
                       tags.includes(searchTerm) || 
                       photographer.includes(searchTerm);
        
        if (searchTerm === '' || matches) {
            item.style.display = 'block';
            item.style.animation = 'fadeInUp 0.5s ease';
        } else {
            item.style.display = 'none';
        }
    });
}

// Filter gallery
function filterGallery() {
    galleryItems.forEach(item => {
        const category = item.dataset.category;
        
        if (currentFilter === 'all' || category === currentFilter) {
            item.style.display = 'block';
            item.style.animation = 'fadeInUp 0.5s ease';
        } else {
            item.style.display = 'none';
        }
    });
}

// Change view
function changeView() {
    galleryGrid.className = `gallery-grid ${currentView}`;
    
    // Re-animate items for new layout
    setTimeout(() => {
        animateGalleryItems();
    }, 100);
}

// Animate gallery items
function animateGalleryItems() {
    galleryItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
    });
}

// Toggle like
function toggleLike(btn) {
    const isLiked = btn.classList.contains('liked');
    const likesElement = btn.closest('.gallery-item').querySelector('.likes');
    let currentLikes = parseInt(likesElement.textContent.replace('♡ ', ''));
    
    if (isLiked) {
        btn.classList.remove('liked');
        btn.textContent = '♡';
        likesElement.textContent = `♡ ${currentLikes - 1}`;
    } else {
        btn.classList.add('liked');
        btn.textContent = '♥';
        likesElement.textContent = `♥ ${currentLikes + 1}`;
    }
    
    // Add animation
    btn.style.transform = 'scale(1.3)';
    setTimeout(() => {
        btn.style.transform = 'scale(1)';
    }, 200);
}

// Download image
function downloadImage(btn) {
    const img = btn.closest('.gallery-item').querySelector('img');
    const title = btn.closest('.gallery-item').querySelector('.image-title').textContent;
    
    // Simulate download
    showNotification(`Downloading "${title}"...`, 'info');
    
    // Add animation
    btn.style.transform = 'scale(1.2)';
    setTimeout(() => {
        btn.style.transform = 'scale(1)';
    }, 200);
}

// Share image
function shareImage(btn) {
    const title = btn.closest('.gallery-item').querySelector('.image-title').textContent;
    
    if (navigator.share) {
        navigator.share({
            title: title,
            text: `Check out this amazing photo: ${title}`,
            url: window.location.href
        });
    } else {
        // Fallback - copy to clipboard
        navigator.clipboard.writeText(window.location.href);
        showNotification('Link copied to clipboard!', 'success');
    }
    
    // Add animation
    btn.style.transform = 'rotate(45deg) scale(1.2)';
    setTimeout(() => {
        btn.style.transform = 'rotate(0deg) scale(1)';
    }, 300);
}

// Open lightbox
function openLightbox(btn) {
    const galleryItem = btn.closest('.gallery-item');
    const img = galleryItem.querySelector('img');
    const title = galleryItem.querySelector('.image-title').textContent;
    const description = galleryItem.querySelector('.image-description').textContent;
    const photographer = galleryItem.querySelector('.photographer').textContent;
    
    // Find current index
    currentLightboxIndex = galleryItems.indexOf(galleryItem);
    
    // Set lightbox content
    lightboxImage.src = img.src;
    lightboxImage.alt = img.alt;
    lightboxTitle.textContent = title;
    lightboxDescription.textContent = description;
    lightboxPhotographer.textContent = photographer;
    
    // Show lightbox
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close lightbox
function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Navigate lightbox
function navigateLightbox(direction) {
    const visibleItems = galleryItems.filter(item => item.style.display !== 'none');
    const currentVisibleIndex = visibleItems.indexOf(galleryItems[currentLightboxIndex]);
    
    let newIndex = currentVisibleIndex + direction;
    
    if (newIndex < 0) {
        newIndex = visibleItems.length - 1;
    } else if (newIndex >= visibleItems.length) {
        newIndex = 0;
    }
    
    const newItem = visibleItems[newIndex];
    currentLightboxIndex = galleryItems.indexOf(newItem);
    
    // Update lightbox content
    const img = newItem.querySelector('img');
    const title = newItem.querySelector('.image-title').textContent;
    const description = newItem.querySelector('.image-description').textContent;
    const photographer = newItem.querySelector('.photographer').textContent;
    
    lightboxImage.style.opacity = '0';
    setTimeout(() => {
        lightboxImage.src = img.src;
        lightboxImage.alt = img.alt;
        lightboxTitle.textContent = title;
        lightboxDescription.textContent = description;
        lightboxPhotographer.textContent = photographer;
        lightboxImage.style.opacity = '1';
    }, 150);
}

// Load more images
function loadMoreImages() {
    loadMoreBtn.textContent = 'Loading...';
    loadMoreBtn.disabled = true;
    
    // Simulate loading delay
    setTimeout(() => {
        // Create new gallery items
        const newImages = [
            {
                category: 'nature',
                tags: 'mountain landscape snow',
                src: 'https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=600',
                title: 'Mountain Peak',
                description: 'Snow-capped mountain against clear blue sky',
                photographer: '📷 Mountain Explorer',
                likes: 123,
                views: 890
            },
            {
                category: 'city',
                tags: 'street urban night',
                src: 'https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg?auto=compress&cs=tinysrgb&w=600',
                title: 'City Street',
                description: 'Bustling city street at night with neon lights',
                photographer: '📷 Street Photographer',
                likes: 234,
                views: 1200
            },
            {
                category: 'abstract',
                tags: 'geometric shapes colors',
                src: 'https://images.pexels.com/photos/1323712/pexels-photo-1323712.jpeg?auto=compress&cs=tinysrgb&w=600',
                title: 'Geometric Art',
                description: 'Abstract geometric patterns in vibrant colors',
                photographer: '📷 Digital Artist',
                likes: 345,
                views: 1500
            }
        ];
        
        newImages.forEach(imageData => {
            const galleryItem = createGalleryItem(imageData);
            galleryGrid.appendChild(galleryItem);
            galleryItems.push(galleryItem);
        });
        
        // Setup action buttons for new items
        setupActionButtons();
        
        // Reset button
        loadMoreBtn.textContent = 'Load More Photos';
        loadMoreBtn.disabled = false;
        
        showNotification('New photos loaded!', 'success');
    }, 1500);
}

// Create gallery item
function createGalleryItem(imageData) {
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item';
    galleryItem.dataset.category = imageData.category;
    galleryItem.dataset.tags = imageData.tags;
    
    galleryItem.innerHTML = `
        <div class="image-container">
            <img src="${imageData.src}" alt="${imageData.title}" loading="lazy">
            <div class="image-overlay">
                <div class="image-actions">
                    <button class="action-btn like-btn" title="Like">♡</button>
                    <button class="action-btn download-btn" title="Download">⬇</button>
                    <button class="action-btn share-btn" title="Share">↗</button>
                    <button class="action-btn fullscreen-btn" title="View Full">⛶</button>
                </div>
            </div>
        </div>
        <div class="image-info">
            <h3 class="image-title">${imageData.title}</h3>
            <p class="image-description">${imageData.description}</p>
            <div class="image-meta">
                <span class="photographer">${imageData.photographer}</span>
                <span class="image-stats">
                    <span class="likes">♡ ${imageData.likes}</span>
                    <span class="views">👁 ${imageData.views}</span>
                </span>
            </div>
        </div>
    `;
    
    // Add entrance animation
    galleryItem.style.opacity = '0';
    galleryItem.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        galleryItem.style.transition = 'all 0.6s ease';
        galleryItem.style.opacity = '1';
        galleryItem.style.transform = 'translateY(0)';
    }, 100);
    
    return galleryItem;
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        info: '#3b82f6',
        warning: '#f59e0b'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type]};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Lazy loading for images
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src || img.src;
            img.classList.remove('lazy');
            observer.unobserve(img);
        }
    });
});

// Observe all images for lazy loading
document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    imageObserver.observe(img);
});

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
    
    .gallery-item {
        transition: all 0.3s ease;
    }
    
    .lightbox-image {
        transition: opacity 0.3s ease;
    }
`;
document.head.appendChild(style);