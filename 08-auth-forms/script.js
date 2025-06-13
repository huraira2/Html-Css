// DOM Elements
const tabBtns = document.querySelectorAll('.tab-btn');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const successMessage = document.getElementById('successMessage');
const loginFormElement = document.getElementById('loginFormElement');
const signupFormElement = document.getElementById('signupFormElement');
const forgotPasswordModal = document.getElementById('forgotPasswordModal');
const forgotPasswordForm = document.getElementById('forgotPasswordForm');

// Tab switching functionality
tabBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const targetTab = this.dataset.tab;
        
        // Remove active class from all tabs
        tabBtns.forEach(tab => tab.classList.remove('active'));
        
        // Add active class to clicked tab
        this.classList.add('active');
        
        // Hide all forms
        loginForm.classList.add('hidden');
        signupForm.classList.add('hidden');
        successMessage.classList.add('hidden');
        
        // Show target form
        if (targetTab === 'login') {
            loginForm.classList.remove('hidden');
        } else {
            signupForm.classList.remove('hidden');
        }
        
        // Clear all forms
        clearAllErrors();
    });
});

// Password toggle functionality
const togglePasswordBtns = document.querySelectorAll('.toggle-password');

togglePasswordBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const targetId = this.dataset.target;
        const targetInput = document.getElementById(targetId);
        
        if (targetInput.type === 'password') {
            targetInput.type = 'text';
            this.textContent = '🙈';
        } else {
            targetInput.type = 'password';
            this.textContent = '👁️';
        }
    });
});

// Form validation
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    return {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /\d/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
}

function calculatePasswordStrength(password) {
    const checks = validatePassword(password);
    const score = Object.values(checks).filter(Boolean).length;
    
    if (score < 2) return { strength: 'weak', color: '#ef4444', width: '25%' };
    if (score < 4) return { strength: 'medium', color: '#f59e0b', width: '50%' };
    if (score < 5) return { strength: 'good', color: '#3b82f6', width: '75%' };
    return { strength: 'strong', color: '#10b981', width: '100%' };
}

function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId + 'Error');
    
    field.classList.add('error');
    field.classList.remove('success');
    errorElement.textContent = message;
    errorElement.classList.add('show');
}

function showSuccess(fieldId) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId + 'Error');
    
    field.classList.remove('error');
    field.classList.add('success');
    errorElement.classList.remove('show');
}

function clearError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId + 'Error');
    
    field.classList.remove('error', 'success');
    errorElement.classList.remove('show');
}

function clearAllErrors() {
    const errorMessages = document.querySelectorAll('.error-message');
    const inputs = document.querySelectorAll('input');
    
    errorMessages.forEach(error => error.classList.remove('show'));
    inputs.forEach(input => input.classList.remove('error', 'success'));
}

// Password strength indicator
const signupPasswordInput = document.getElementById('signupPassword');
const passwordStrengthElement = document.getElementById('passwordStrength');
const strengthFill = passwordStrengthElement.querySelector('.strength-fill');
const strengthText = passwordStrengthElement.querySelector('.strength-text');

signupPasswordInput.addEventListener('input', function() {
    const password = this.value;
    
    if (password.length === 0) {
        strengthFill.style.width = '0%';
        strengthText.textContent = 'Password strength';
        return;
    }
    
    const result = calculatePasswordStrength(password);
    strengthFill.style.width = result.width;
    strengthFill.style.background = result.color;
    strengthText.textContent = `Password strength: ${result.strength}`;
    strengthText.style.color = result.color;
});

// Real-time validation
function setupRealTimeValidation() {
    // Email validation
    const emailInputs = ['loginEmail', 'signupEmail'];
    emailInputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        input.addEventListener('blur', function() {
            if (this.value && !validateEmail(this.value)) {
                showError(inputId, 'Please enter a valid email address');
            } else if (this.value) {
                showSuccess(inputId);
            }
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('error') && validateEmail(this.value)) {
                showSuccess(inputId);
            }
        });
    });
    
    // Name validation
    const nameInputs = ['firstName', 'lastName'];
    nameInputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        input.addEventListener('blur', function() {
            if (this.value && this.value.length < 2) {
                showError(inputId, 'Name must be at least 2 characters long');
            } else if (this.value) {
                showSuccess(inputId);
            }
        });
    });
    
    // Password confirmation
    const confirmPasswordInput = document.getElementById('confirmPassword');
    confirmPasswordInput.addEventListener('input', function() {
        const password = signupPasswordInput.value;
        const confirmPassword = this.value;
        
        if (confirmPassword && password !== confirmPassword) {
            showError('confirmPassword', 'Passwords do not match');
        } else if (confirmPassword) {
            showSuccess('confirmPassword');
        }
    });
}

// Login form submission
loginFormElement.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    let isValid = true;
    
    // Clear previous errors
    clearAllErrors();
    
    // Validate email
    if (!email) {
        showError('loginEmail', 'Email is required');
        isValid = false;
    } else if (!validateEmail(email)) {
        showError('loginEmail', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate password
    if (!password) {
        showError('loginPassword', 'Password is required');
        isValid = false;
    }
    
    if (isValid) {
        simulateLogin();
    }
});

// Signup form submission
signupFormElement.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;
    let isValid = true;
    
    // Clear previous errors
    clearAllErrors();
    
    // Validate first name
    if (!firstName) {
        showError('firstName', 'First name is required');
        isValid = false;
    } else if (firstName.length < 2) {
        showError('firstName', 'First name must be at least 2 characters long');
        isValid = false;
    }
    
    // Validate last name
    if (!lastName) {
        showError('lastName', 'Last name is required');
        isValid = false;
    } else if (lastName.length < 2) {
        showError('lastName', 'Last name must be at least 2 characters long');
        isValid = false;
    }
    
    // Validate email
    if (!email) {
        showError('signupEmail', 'Email is required');
        isValid = false;
    } else if (!validateEmail(email)) {
        showError('signupEmail', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate password
    if (!password) {
        showError('signupPassword', 'Password is required');
        isValid = false;
    } else {
        const passwordChecks = validatePassword(password);
        if (!passwordChecks.length) {
            showError('signupPassword', 'Password must be at least 8 characters long');
            isValid = false;
        } else if (Object.values(passwordChecks).filter(Boolean).length < 3) {
            showError('signupPassword', 'Password must contain uppercase, lowercase, and numbers');
            isValid = false;
        }
    }
    
    // Validate confirm password
    if (!confirmPassword) {
        showError('confirmPassword', 'Please confirm your password');
        isValid = false;
    } else if (password !== confirmPassword) {
        showError('confirmPassword', 'Passwords do not match');
        isValid = false;
    }
    
    // Validate terms agreement
    if (!agreeTerms) {
        showError('agreeTerms', 'You must agree to the terms and conditions');
        isValid = false;
    }
    
    if (isValid) {
        simulateSignup();
    }
});

// Simulate login process
function simulateLogin() {
    const submitBtn = loginFormElement.querySelector('.auth-btn');
    
    submitBtn.classList.add('loading');
    
    setTimeout(() => {
        submitBtn.classList.remove('loading');
        showNotification('Login successful! Welcome back.', 'success');
        
        // Simulate redirect or success action
        setTimeout(() => {
            resetForms();
        }, 2000);
    }, 2000);
}

// Simulate signup process
function simulateSignup() {
    const submitBtn = signupFormElement.querySelector('.auth-btn');
    
    submitBtn.classList.add('loading');
    
    setTimeout(() => {
        submitBtn.classList.remove('loading');
        
        // Show success message
        signupForm.classList.add('hidden');
        successMessage.classList.remove('hidden');
    }, 2000);
}

// Reset forms
function resetForms() {
    loginFormElement.reset();
    signupFormElement.reset();
    clearAllErrors();
    
    // Reset to login tab
    tabBtns.forEach(tab => tab.classList.remove('active'));
    tabBtns[0].classList.add('active');
    
    loginForm.classList.remove('hidden');
    signupForm.classList.add('hidden');
    successMessage.classList.add('hidden');
    
    // Reset password strength indicator
    const strengthFill = document.querySelector('.strength-fill');
    const strengthText = document.querySelector('.strength-text');
    strengthFill.style.width = '0%';
    strengthText.textContent = 'Password strength';
    strengthText.style.color = '#64748b';
}

// Forgot password functionality
const forgotPasswordLink = document.querySelector('.forgot-password');
const modalClose = document.querySelector('.modal-close');

forgotPasswordLink.addEventListener('click', function(e) {
    e.preventDefault();
    forgotPasswordModal.classList.add('show');
});

modalClose.addEventListener('click', function() {
    forgotPasswordModal.classList.remove('show');
});

forgotPasswordModal.addEventListener('click', function(e) {
    if (e.target === this) {
        this.classList.remove('show');
    }
});

forgotPasswordForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('resetEmail').value;
    
    if (!email) {
        showNotification('Please enter your email address', 'error');
        return;
    }
    
    if (!validateEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    // Simulate sending reset email
    const submitBtn = this.querySelector('.auth-btn');
    submitBtn.classList.add('loading');
    
    setTimeout(() => {
        submitBtn.classList.remove('loading');
        forgotPasswordModal.classList.remove('show');
        showNotification('Password reset link sent to your email!', 'success');
        this.reset();
    }, 2000);
});

// Social authentication
const socialBtns = document.querySelectorAll('.social-btn');

socialBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const provider = this.classList.contains('google') ? 'Google' : 'GitHub';
        showNotification(`Redirecting to ${provider}...`, 'info');
        
        // Add loading state
        this.style.opacity = '0.7';
        this.style.pointerEvents = 'none';
        
        setTimeout(() => {
            this.style.opacity = '1';
            this.style.pointerEvents = 'auto';
        }, 2000);
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
    
    .input-wrapper input:focus + .input-icon {
        color: #667eea;
    }
    
    .auth-btn:focus {
        outline: none;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.3);
    }
    
    .social-btn:focus {
        outline: none;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.3);
    }
`;
document.head.appendChild(style);

// Initialize real-time validation
setupRealTimeValidation();

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // ESC to close modal
    if (e.key === 'Escape' && forgotPasswordModal.classList.contains('show')) {
        forgotPasswordModal.classList.remove('show');
    }
    
    // Tab switching with Ctrl+1/2
    if (e.ctrlKey) {
        if (e.key === '1') {
            e.preventDefault();
            tabBtns[0].click();
        } else if (e.key === '2') {
            e.preventDefault();
            tabBtns[1].click();
        }
    }
});

// Auto-focus first input when switching tabs
tabBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        setTimeout(() => {
            const activeForm = document.querySelector('.auth-form-container:not(.hidden)');
            const firstInput = activeForm.querySelector('input');
            if (firstInput) {
                firstInput.focus();
            }
        }, 100);
    });
});

// Initialize with focus on first input
document.addEventListener('DOMContentLoaded', function() {
    const firstInput = document.querySelector('#loginEmail');
    if (firstInput) {
        firstInput.focus();
    }
});