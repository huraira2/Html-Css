// DOM Elements
const billingToggle = document.getElementById('billingToggle');
const priceAmounts = document.querySelectorAll('.price-amount');
const yearlySavings = document.querySelectorAll('.yearly-savings');
const faqItems = document.querySelectorAll('.faq-item');
const planButtons = document.querySelectorAll('.plan-btn');

// Billing toggle functionality
let isYearly = false;

billingToggle.addEventListener('change', function() {
    isYearly = this.checked;
    updatePricing();
});

function updatePricing() {
    priceAmounts.forEach(amount => {
        const monthlyPrice = amount.dataset.monthly;
        const yearlyPrice = amount.dataset.yearly;
        
        if (isYearly) {
            amount.textContent = yearlyPrice;
            amount.style.animation = 'priceChange 0.3s ease';
        } else {
            amount.textContent = monthlyPrice;
            amount.style.animation = 'priceChange 0.3s ease';
        }
        
        // Reset animation
        setTimeout(() => {
            amount.style.animation = '';
        }, 300);
    });
    
    // Show/hide yearly savings
    yearlySavings.forEach(saving => {
        if (isYearly) {
            saving.classList.remove('hidden');
            saving.classList.add('show');
        } else {
            saving.classList.add('hidden');
            saving.classList.remove('show');
        }
    });
    
    // Update period text
    const periodTexts = document.querySelectorAll('.price-period');
    periodTexts.forEach(period => {
        period.textContent = isYearly ? '/year' : '/month';
    });
}

// FAQ functionality
faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', function() {
        const isActive = item.classList.contains('active');
        
        // Close all FAQ items
        faqItems.forEach(faq => {
            faq.classList.remove('active');
        });
        
        // Open clicked item if it wasn't active
        if (!isActive) {
            item.classList.add('active');
        }
    });
});

// Plan button functionality
planButtons.forEach(button => {
    button.addEventListener('click', function() {
        const planType = this.classList[1].replace('-btn', ''); // basic, pro, enterprise
        
        // Add loading state
        const originalText = this.textContent;
        this.textContent = 'Loading...';
        this.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            this.textContent = originalText;
            this.disabled = false;
            
            if (planType === 'enterprise') {
                showContactModal();
            } else {
                showSignupModal(planType);
            }
        }, 1500);
        
        // Add click animation
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 150);
    });
});

// Show signup modal
function showSignupModal(planType) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Start Your ${planType.charAt(0).toUpperCase() + planType.slice(1)} Trial</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <p>You're about to start a 14-day free trial of our ${planType} plan.</p>
                <div class="trial-benefits">
                    <div class="benefit">✓ No credit card required</div>
                    <div class="benefit">✓ Full access to all features</div>
                    <div class="benefit">✓ Cancel anytime</div>
                </div>
                <button class="modal-btn primary">Start Free Trial</button>
                <button class="modal-btn secondary">Learn More</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners
    const closeBtn = modal.querySelector('.modal-close');
    const primaryBtn = modal.querySelector('.modal-btn.primary');
    const secondaryBtn = modal.querySelector('.modal-btn.secondary');
    
    closeBtn.addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
    
    primaryBtn.addEventListener('click', () => {
        showNotification('Redirecting to signup...', 'success');
        modal.remove();
    });
    
    secondaryBtn.addEventListener('click', () => {
        showNotification('Opening plan details...', 'info');
        modal.remove();
    });
}

// Show contact modal
function showContactModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Contact Sales</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <p>Get in touch with our sales team to discuss your enterprise needs.</p>
                <form class="contact-form">
                    <input type="text" placeholder="Your Name" required>
                    <input type="email" placeholder="Work Email" required>
                    <input type="text" placeholder="Company Name" required>
                    <textarea placeholder="Tell us about your needs" rows="3"></textarea>
                    <button type="submit" class="modal-btn primary">Send Message</button>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners
    const closeBtn = modal.querySelector('.modal-close');
    const form = modal.querySelector('.contact-form');
    
    closeBtn.addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        showNotification('Message sent! Our team will contact you soon.', 'success');
        modal.remove();
    });
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
    }, 4000);
}

// Card hover effects
const pricingCards = document.querySelectorAll('.pricing-card');

pricingCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        if (!this.classList.contains('popular')) {
            this.style.borderColor = '#667eea';
        }
    });
    
    card.addEventListener('mouseleave', function() {
        if (!this.classList.contains('popular')) {
            this.style.borderColor = '#e2e8f0';
        }
    });
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
    
    @keyframes priceChange {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
    
    .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    }
    
    .modal-content {
        background: white;
        border-radius: 16px;
        max-width: 500px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
        animation: slideInUp 0.3s ease;
    }
    
    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem;
        border-bottom: 1px solid #e2e8f0;
    }
    
    .modal-header h3 {
        color: #1e293b;
        font-size: 1.25rem;
        font-weight: 600;
    }
    
    .modal-close {
        background: none;
        border: none;
        font-size: 1.5rem;
        color: #64748b;
        cursor: pointer;
        padding: 0.25rem;
        border-radius: 4px;
        transition: all 0.3s ease;
    }
    
    .modal-close:hover {
        background: #f1f5f9;
        color: #1e293b;
    }
    
    .modal-body {
        padding: 1.5rem;
    }
    
    .modal-body p {
        color: #64748b;
        margin-bottom: 1.5rem;
        line-height: 1.6;
    }
    
    .trial-benefits {
        margin-bottom: 2rem;
    }
    
    .benefit {
        color: #10b981;
        margin-bottom: 0.5rem;
        font-weight: 500;
    }
    
    .contact-form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    
    .contact-form input,
    .contact-form textarea {
        padding: 0.75rem;
        border: 1px solid #d1d5db;
        border-radius: 8px;
        font-size: 1rem;
        transition: border-color 0.3s ease;
    }
    
    .contact-form input:focus,
    .contact-form textarea:focus {
        outline: none;
        border-color: #667eea;
    }
    
    .modal-btn {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        margin-right: 0.5rem;
    }
    
    .modal-btn.primary {
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
    }
    
    .modal-btn.primary:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }
    
    .modal-btn.secondary {
        background: #f8fafc;
        color: #64748b;
        border: 1px solid #e2e8f0;
    }
    
    .modal-btn.secondary:hover {
        background: #f1f5f9;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Set initial pricing
    updatePricing();
    
    // Add entrance animations
    const cards = document.querySelectorAll('.pricing-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 200);
    });
});