// Set launch date (30 days from now)
const launchDate = new Date();
launchDate.setDate(launchDate.getDate() + 30);

// DOM Elements
const daysElement = document.getElementById('days');
const hoursElement = document.getElementById('hours');
const minutesElement = document.getElementById('minutes');
const secondsElement = document.getElementById('seconds');
const signupForm = document.getElementById('signupForm');
const emailInput = document.getElementById('emailInput');
const formMessage = document.getElementById('formMessage');
const successModal = document.getElementById('successModal');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');

// Countdown Timer
function updateCountdown() {
    const now = new Date().getTime();
    const distance = launchDate.getTime() - now;

    if (distance < 0) {
        // Launch date has passed
        daysElement.textContent = '00';
        hoursElement.textContent = '00';
        minutesElement.textContent = '00';
        secondsElement.textContent = '00';
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Add leading zeros and update display
    daysElement.textContent = days.toString().padStart(2, '0');
    hoursElement.textContent = hours.toString().padStart(2, '0');
    minutesElement.textContent = minutes.toString().padStart(2, '0');
    secondsElement.textContent = seconds.toString().padStart(2, '0');

    // Add animation effect when seconds change
    if (seconds !== parseInt(secondsElement.dataset.lastValue || '0')) {
        secondsElement.style.transform = 'scale(1.1)';
        setTimeout(() => {
            secondsElement.style.transform = 'scale(1)';
        }, 200);
        secondsElement.dataset.lastValue = seconds;
    }
}

// Email validation
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show message
function showMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = `form-message show ${type}`;
    
    setTimeout(() => {
        formMessage.classList.remove('show');
    }, 5000);
}

// Form submission
signupForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = emailInput.value.trim();
    const submitBtn = this.querySelector('.signup-btn');
    
    // Clear previous messages
    formMessage.classList.remove('show');
    
    // Validate email
    if (!email) {
        showMessage('Please enter your email address', 'error');
        emailInput.focus();
        return;
    }
    
    if (!validateEmail(email)) {
        showMessage('Please enter a valid email address', 'error');
        emailInput.focus();
        return;
    }
    
    // Show loading state
    submitBtn.classList.add('loading');
    
    // Simulate API call
    setTimeout(() => {
        submitBtn.classList.remove('loading');
        
        // Check if email is already registered (simulation)
        const registeredEmails = JSON.parse(localStorage.getItem('registeredEmails') || '[]');
        
        if (registeredEmails.includes(email)) {
            showMessage('This email is already registered!', 'error');
            return;
        }
        
        // Add email to registered list
        registeredEmails.push(email);
        localStorage.setItem('registeredEmails', JSON.stringify(registeredEmails));
        
        // Show success modal
        successModal.classList.add('show');
        
        // Reset form
        emailInput.value = '';
        
        // Update subscriber count
        updateSubscriberCount();
        
    }, 2000);
});

// Close modal
function closeModal() {
    successModal.classList.remove('show');
}

// Close modal when clicking outside
successModal.addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});

// Progress animation
function animateProgress() {
    let currentProgress = 0;
    const targetProgress = 85;
    const increment = targetProgress / 100;
    
    const progressInterval = setInterval(() => {
        currentProgress += increment;
        
        if (currentProgress >= targetProgress) {
            currentProgress = targetProgress;
            clearInterval(progressInterval);
        }
        
        progressFill.style.width = `${currentProgress}%`;
        progressText.textContent = `${Math.round(currentProgress)}% Complete`;
    }, 20);
}

// Subscriber count animation
function updateSubscriberCount() {
    const registeredEmails = JSON.parse(localStorage.getItem('registeredEmails') || '[]');
    const count = registeredEmails.length;
    
    // You could display this count somewhere on the page
    console.log(`Total subscribers: ${count}`);
}

// Social link interactions
const socialLinks = document.querySelectorAll('.social-link');

socialLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        const platform = this.classList[1]; // Get the platform class
        
        // Add click animation
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 150);
        
        // Show notification
        showNotification(`Opening ${platform.charAt(0).toUpperCase() + platform.slice(1)}...`, 'info');
        
        // In a real application, you would redirect to the actual social media page
        setTimeout(() => {
            // window.open('https://twitter.com/yourhandle', '_blank');
        }, 1000);
    });
});

// Feature card interactions
const featureCards = document.querySelectorAll('.feature-card');

featureCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
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

// Parallax effect for floating shapes
function updateParallax() {
    const scrolled = window.pageYOffset;
    const shapes = document.querySelectorAll('.floating-shape');
    
    shapes.forEach((shape, index) => {
        const speed = (index + 1) * 0.1;
        const yPos = -(scrolled * speed);
        shape.style.transform = `translateY(${yPos}px)`;
    });
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animationPlayState = 'running';
        }
    });
}, observerOptions);

// Observe animated elements
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('[style*="animation"]');
    animatedElements.forEach(el => {
        el.style.animationPlayState = 'paused';
        observer.observe(el);
    });
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // ESC to close modal
    if (e.key === 'Escape' && successModal.classList.contains('show')) {
        closeModal();
    }
    
    // Enter to focus email input
    if (e.key === 'Enter' && document.activeElement !== emailInput && !successModal.classList.contains('show')) {
        emailInput.focus();
    }
});

// Email input enhancements
emailInput.addEventListener('input', function() {
    // Clear any existing error messages when user starts typing
    if (formMessage.classList.contains('show') && formMessage.classList.contains('error')) {
        formMessage.classList.remove('show');
    }
});

emailInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        signupForm.dispatchEvent(new Event('submit'));
    }
});

// Dynamic progress updates
function simulateProgressUpdates() {
    const milestones = document.querySelectorAll('.milestone');
    let currentMilestone = 3; // Currently on "Testing"
    
    // Simulate progress updates every 30 seconds
    setInterval(() => {
        const currentProgress = parseInt(progressText.textContent);
        
        if (currentProgress < 100) {
            const newProgress = Math.min(currentProgress + Math.random() * 2, 100);
            progressFill.style.width = `${newProgress}%`;
            progressText.textContent = `${Math.round(newProgress)}% Complete`;
            
            // Update milestones based on progress
            if (newProgress >= 100 && currentMilestone < 4) {
                milestones[currentMilestone].classList.remove('active');
                milestones[currentMilestone].classList.add('completed');
                currentMilestone++;
                if (currentMilestone < milestones.length) {
                    milestones[currentMilestone].classList.add('active');
                }
            }
        }
    }, 30000);
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
    
    .time-unit {
        transition: transform 0.2s ease;
    }
    
    .feature-card {
        transition: transform 0.3s ease;
    }
    
    .email-input:focus {
        transform: scale(1.02);
    }
`;
document.head.appendChild(style);

// Initialize everything
document.addEventListener('DOMContentLoaded', function() {
    // Start countdown timer
    updateCountdown();
    setInterval(updateCountdown, 1000);
    
    // Animate progress bar
    setTimeout(animateProgress, 1000);
    
    // Start progress simulation
    simulateProgressUpdates();
    
    // Add parallax effect
    window.addEventListener('scroll', updateParallax);
    
    // Focus email input after page loads
    setTimeout(() => {
        emailInput.focus();
    }, 2000);
    
    // Show initial subscriber count
    updateSubscriberCount();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Page is hidden, pause animations
        document.querySelectorAll('.floating-shape').forEach(shape => {
            shape.style.animationPlayState = 'paused';
        });
    } else {
        // Page is visible, resume animations
        document.querySelectorAll('.floating-shape').forEach(shape => {
            shape.style.animationPlayState = 'running';
        });
    }
});