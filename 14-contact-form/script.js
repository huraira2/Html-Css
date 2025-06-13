// DOM Elements
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const successMessage = document.getElementById('successMessage');
const charCount = document.getElementById('charCount');
const messageTextarea = document.getElementById('message');
const faqItems = document.querySelectorAll('.faq-item');

// Form validation rules
const validationRules = {
    firstName: {
        required: true,
        minLength: 2,
        pattern: /^[a-zA-Z\s]+$/,
        message: 'First name must be at least 2 characters and contain only letters'
    },
    lastName: {
        required: true,
        minLength: 2,
        pattern: /^[a-zA-Z\s]+$/,
        message: 'Last name must be at least 2 characters and contain only letters'
    },
    email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Please enter a valid email address'
    },
    phone: {
        required: false,
        pattern: /^[\+]?[1-9][\d]{0,15}$/,
        message: 'Please enter a valid phone number'
    },
    subject: {
        required: true,
        message: 'Please select a subject'
    },
    message: {
        required: true,
        minLength: 10,
        maxLength: 500,
        message: 'Message must be between 10 and 500 characters'
    },
    privacy: {
        required: true,
        message: 'You must agree to the privacy policy'
    }
};

// Initialize form
document.addEventListener('DOMContentLoaded', function() {
    setupFormValidation();
    setupCharacterCounter();
    setupFAQ();
    setupSocialLinks();
    setupInfoCards();
});

// Setup form validation
function setupFormValidation() {
    const formInputs = contactForm.querySelectorAll('input, select, textarea');
    
    formInputs.forEach(input => {
        // Real-time validation
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
            if (input.classList.contains('error')) {
                validateField(input);
            }
        });
    });
    
    // Form submission
    contactForm.addEventListener('submit', handleFormSubmit);
}

// Validate individual field
function validateField(field) {
    const fieldName = field.name;
    const value = field.value.trim();
    const rules = validationRules[fieldName];
    
    if (!rules) return true;
    
    let isValid = true;
    let errorMessage = '';
    
    // Required validation
    if (rules.required && !value) {
        isValid = false;
        errorMessage = `${getFieldLabel(fieldName)} is required`;
    }
    
    // Checkbox validation
    if (field.type === 'checkbox' && rules.required && !field.checked) {
        isValid = false;
        errorMessage = rules.message;
    }
    
    // Pattern validation
    if (value && rules.pattern && !rules.pattern.test(value)) {
        isValid = false;
        errorMessage = rules.message;
    }
    
    // Length validation
    if (value && rules.minLength && value.length < rules.minLength) {
        isValid = false;
        errorMessage = rules.message;
    }
    
    if (value && rules.maxLength && value.length > rules.maxLength) {
        isValid = false;
        errorMessage = rules.message;
    }
    
    // Update field appearance
    updateFieldStatus(field, isValid, errorMessage);
    
    return isValid;
}

// Update field status
function updateFieldStatus(field, isValid, errorMessage) {
    const errorElement = document.getElementById(field.name + 'Error');
    
    field.classList.remove('error', 'success');
    
    if (isValid && field.value.trim()) {
        field.classList.add('success');
        if (errorElement) {
            errorElement.classList.remove('show');
        }
    } else if (!isValid) {
        field.classList.add('error');
        if (errorElement) {
            errorElement.textContent = errorMessage;
            errorElement.classList.add('show');
        }
    } else {
        if (errorElement) {
            errorElement.classList.remove('show');
        }
    }
}

// Get field label
function getFieldLabel(fieldName) {
    const labels = {
        firstName: 'First name',
        lastName: 'Last name',
        email: 'Email',
        phone: 'Phone',
        subject: 'Subject',
        message: 'Message',
        privacy: 'Privacy agreement'
    };
    return labels[fieldName] || fieldName;
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    // Validate all fields
    const formInputs = contactForm.querySelectorAll('input, select, textarea');
    let isFormValid = true;
    
    formInputs.forEach(input => {
        if (!validateField(input)) {
            isFormValid = false;
        }
    });
    
    if (!isFormValid) {
        showNotification('Please fix the errors in the form', 'error');
        return;
    }
    
    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        
        // Show success message
        contactForm.style.display = 'none';
        successMessage.classList.add('show');
        
        // Send data (simulation)
        const formData = new FormData(contactForm);
        console.log('Form submitted with data:', Object.fromEntries(formData));
        
        showNotification('Message sent successfully!', 'success');
    }, 2000);
}

// Reset form
function resetForm() {
    contactForm.reset();
    contactForm.style.display = 'block';
    successMessage.classList.remove('show');
    
    // Clear all validation states
    const formInputs = contactForm.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        input.classList.remove('error', 'success');
    });
    
    const errorElements = contactForm.querySelectorAll('.form-error');
    errorElements.forEach(error => {
        error.classList.remove('show');
    });
    
    // Reset character counter
    charCount.textContent = '0';
}

// Setup character counter
function setupCharacterCounter() {
    messageTextarea.addEventListener('input', function() {
        const currentLength = this.value.length;
        const maxLength = 500;
        
        charCount.textContent = currentLength;
        
        // Change color based on length
        if (currentLength > maxLength * 0.9) {
            charCount.style.color = '#ef4444';
        } else if (currentLength > maxLength * 0.7) {
            charCount.style.color = '#f59e0b';
        } else {
            charCount.style.color = '#64748b';
        }
    });
}

// Setup FAQ functionality
function setupFAQ() {
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
}

// Setup social links
function setupSocialLinks() {
    const socialLinks = document.querySelectorAll('.social-link');
    
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const platform = this.classList[1];
            showNotification(`Opening ${platform.charAt(0).toUpperCase() + platform.slice(1)}...`, 'info');
            
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
}

// Setup info cards
function setupInfoCards() {
    const infoCards = document.querySelectorAll('.info-card');
    
    infoCards.forEach(card => {
        card.addEventListener('click', function() {
            const title = this.querySelector('.info-title').textContent;
            const text = this.querySelector('.info-text').textContent;
            
            if (title.includes('Email')) {
                window.location.href = `mailto:${text}`;
            } else if (title.includes('Call')) {
                window.location.href = `tel:${text.replace(/\s/g, '')}`;
            } else if (title.includes('Visit')) {
                showNotification('Opening maps...', 'info');
            } else if (title.includes('Live Chat')) {
                showNotification('Starting live chat...', 'info');
            }
        });
    });
}

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
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 4000);
}

// Auto-save form data to localStorage
function setupAutoSave() {
    const formInputs = contactForm.querySelectorAll('input, select, textarea');
    
    // Load saved data
    formInputs.forEach(input => {
        const savedValue = localStorage.getItem(`contact_form_${input.name}`);
        if (savedValue && input.type !== 'checkbox') {
            input.value = savedValue;
        } else if (savedValue && input.type === 'checkbox') {
            input.checked = savedValue === 'true';
        }
    });
    
    // Save data on input
    formInputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.type === 'checkbox') {
                localStorage.setItem(`contact_form_${this.name}`, this.checked);
            } else {
                localStorage.setItem(`contact_form_${this.name}`, this.value);
            }
        });
    });
}

// Clear saved data on successful submission
function clearAutoSaveData() {
    const formInputs = contactForm.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        localStorage.removeItem(`contact_form_${input.name}`);
    });
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
    
    .form-input, .form-select, .form-textarea {
        transition: all 0.3s ease;
    }
    
    .info-card {
        cursor: pointer;
    }
    
    .social-link {
        transition: all 0.3s ease;
    }
`;
document.head.appendChild(style);

// Initialize auto-save
setupAutoSave();

// Add entrance animations
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.info-card, .form-container, .faq-item');
    
    animatedElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.6s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 100);
    });
});