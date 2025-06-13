// Theme toggle functionality
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light';
if (currentTheme === 'dark') {
    body.setAttribute('data-theme', 'dark');
    themeToggle.textContent = '☀️';
}

themeToggle.addEventListener('click', function() {
    if (body.hasAttribute('data-theme')) {
        body.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        themeToggle.textContent = '🌙';
    } else {
        body.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        themeToggle.textContent = '☀️';
    }
});

// Category filtering
const filterBtns = document.querySelectorAll('.filter-btn');
const articleCards = document.querySelectorAll('.article-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        
        // Add active class to clicked button
        this.classList.add('active');
        
        // Get selected category
        const selectedCategory = this.dataset.category;
        
        // Filter articles
        articleCards.forEach(card => {
            if (selectedCategory === 'all' || card.dataset.category === selectedCategory) {
                card.style.display = 'block';
                card.style.animation = 'fadeInUp 0.5s ease';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// Search functionality
const searchInput = document.querySelector('.search-input');
const searchButton = document.querySelector('.search-button');

function performSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        // Show all articles
        articleCards.forEach(card => {
            card.style.display = 'block';
        });
        return;
    }
    
    articleCards.forEach(card => {
        const title = card.querySelector('.card-title').textContent.toLowerCase();
        const excerpt = card.querySelector('.card-excerpt').textContent.toLowerCase();
        const category = card.querySelector('.card-category').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || excerpt.includes(searchTerm) || category.includes(searchTerm)) {
            card.style.display = 'block';
            card.style.animation = 'fadeInUp 0.5s ease';
        } else {
            card.style.display = 'none';
        }
    });
}

searchButton.addEventListener('click', performSearch);
searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        performSearch();
    }
});

// Like button functionality
const likeBtns = document.querySelectorAll('.like-btn');

likeBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        
        this.classList.toggle('liked');
        
        // Get current count
        const text = this.textContent.trim();
        const currentCount = parseInt(text.split(' ♡')[1] || text.split('♥')[1]);
        
        if (this.classList.contains('liked')) {
            this.innerHTML = `♥ ${currentCount + 1}`;
            this.style.color = '#ef4444';
        } else {
            this.innerHTML = `♡ ${currentCount - 1}`;
            this.style.color = '';
        }
        
        // Add animation
        this.style.transform = 'scale(1.2)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 200);
    });
});

// Share button functionality
const shareBtns = document.querySelectorAll('.share-btn');

shareBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        
        const articleCard = this.closest('.article-card');
        const title = articleCard.querySelector('.card-title').textContent;
        
        if (navigator.share) {
            navigator.share({
                title: title,
                text: 'Check out this article!',
                url: window.location.href
            });
        } else {
            // Fallback - copy to clipboard
            navigator.clipboard.writeText(window.location.href);
            showNotification('Link copied to clipboard!');
        }
        
        // Add animation
        this.style.transform = 'rotate(45deg) scale(1.2)';
        setTimeout(() => {
            this.style.transform = 'rotate(0deg) scale(1)';
        }, 300);
    });
});

// Article card click functionality
articleCards.forEach(card => {
    card.addEventListener('click', function() {
        const title = this.querySelector('.card-title').textContent;
        showNotification(`Opening: ${title}`);
        
        // Add click animation
        this.style.transform = 'scale(0.98)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 150);
    });
});

// Load more functionality
const loadMoreBtn = document.getElementById('loadMoreBtn');
let articlesLoaded = 6;

loadMoreBtn.addEventListener('click', function() {
    // Simulate loading more articles
    this.textContent = 'Loading...';
    this.disabled = true;
    
    setTimeout(() => {
        // Create new article cards (simulation)
        const articlesGrid = document.getElementById('articlesGrid');
        
        for (let i = 0; i < 3; i++) {
            const newCard = createArticleCard({
                title: `New Article ${articlesLoaded + i + 1}`,
                excerpt: 'This is a newly loaded article with interesting content...',
                category: 'web-dev',
                author: 'New Author',
                date: 'Just now',
                readTime: '5 min read',
                likes: Math.floor(Math.random() * 50),
                image: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=400'
            });
            
            articlesGrid.appendChild(newCard);
        }
        
        articlesLoaded += 3;
        
        this.textContent = 'Load More Articles';
        this.disabled = false;
        
        showNotification('New articles loaded!');
    }, 1500);
});

function createArticleCard(article) {
    const card = document.createElement('article');
    card.className = 'article-card';
    card.dataset.category = article.category;
    
    card.innerHTML = `
        <div class="card-image">
            <img src="${article.image}" alt="${article.title}">
            <div class="card-category">${article.category}</div>
        </div>
        <div class="card-content">
            <h3 class="card-title">${article.title}</h3>
            <p class="card-excerpt">${article.excerpt}</p>
            <div class="card-meta">
                <div class="author-info">
                    <img src="https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=50" alt="Author" class="author-avatar">
                    <span class="author-name">${article.author}</span>
                </div>
                <span class="publish-date">${article.date}</span>
            </div>
            <div class="card-footer">
                <span class="read-time">${article.readTime}</span>
                <div class="card-actions">
                    <button class="action-btn like-btn">♡ ${article.likes}</button>
                    <button class="action-btn share-btn">↗</button>
                </div>
            </div>
        </div>
    `;
    
    // Add event listeners to new card
    const likeBtn = card.querySelector('.like-btn');
    const shareBtn = card.querySelector('.share-btn');
    
    likeBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        this.classList.toggle('liked');
        const currentCount = parseInt(this.textContent.split('♡')[1] || this.textContent.split('♥')[1]);
        
        if (this.classList.contains('liked')) {
            this.innerHTML = `♥ ${currentCount + 1}`;
            this.style.color = '#ef4444';
        } else {
            this.innerHTML = `♡ ${currentCount - 1}`;
            this.style.color = '';
        }
    });
    
    shareBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        showNotification('Link copied to clipboard!');
    });
    
    card.addEventListener('click', function() {
        showNotification(`Opening: ${article.title}`);
    });
    
    return card;
}

// Newsletter subscription
const newsletterForm = document.querySelector('.newsletter-form');

newsletterForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = this.querySelector('.newsletter-input').value;
    
    if (email) {
        showNotification('Thank you for subscribing!', 'success');
        this.reset();
    }
});

// Navigation functionality
const navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Remove active class from all links
        navLinks.forEach(l => l.classList.remove('active'));
        
        // Add active class to clicked link
        this.classList.add('active');
    });
});

// Mobile navigation toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.querySelector('.nav-menu');

navToggle.addEventListener('click', function() {
    navMenu.classList.toggle('active');
    this.classList.toggle('active');
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Scroll to top functionality
let scrollToTopBtn;

function createScrollToTopBtn() {
    scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '↑';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--primary-color);
        color: white;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
    `;
    
    document.body.appendChild(scrollToTopBtn);
    
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Show/hide scroll to top button
window.addEventListener('scroll', function() {
    if (!scrollToTopBtn) {
        createScrollToTopBtn();
    }
    
    if (window.pageYOffset > 300) {
        scrollToTopBtn.style.opacity = '1';
        scrollToTopBtn.style.visibility = 'visible';
    } else {
        scrollToTopBtn.style.opacity = '0';
        scrollToTopBtn.style.visibility = 'hidden';
    }
});

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification
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
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
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
    
    .nav-menu.active {
        display: flex;
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        background: var(--bg-primary);
        flex-direction: column;
        padding: 1rem;
        box-shadow: var(--shadow-lg);
        border-top: 1px solid var(--border-color);
    }
    
    .nav-toggle.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }
    
    .nav-toggle.active span:nth-child(2) {
        opacity: 0;
    }
    
    .nav-toggle.active span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
    }
    
    @media (max-width: 768px) {
        .nav-menu {
            display: none;
        }
    }
`;
document.head.appendChild(style);