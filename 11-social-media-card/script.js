// DOM Elements
const followBtn = document.getElementById('followBtn');
const likeActions = document.querySelectorAll('.like-action');
const postActions = document.querySelectorAll('.post-action');

// Follow button functionality
let isFollowing = false;

followBtn.addEventListener('click', function() {
    isFollowing = !isFollowing;
    
    if (isFollowing) {
        this.classList.add('following');
        this.querySelector('.btn-text').textContent = 'Following';
        this.querySelector('.btn-icon').textContent = '✓';
        this.style.background = '#10b981';
        
        // Update follower count
        updateFollowerCount(1);
    } else {
        this.classList.remove('following');
        this.querySelector('.btn-text').textContent = 'Follow';
        this.querySelector('.btn-icon').textContent = '+';
        this.style.background = '';
        
        // Update follower count
        updateFollowerCount(-1);
    }
    
    // Add animation
    this.style.transform = 'scale(0.95)';
    setTimeout(() => {
        this.style.transform = 'scale(1)';
    }, 150);
});

// Update follower count
function updateFollowerCount(change) {
    const followerStat = document.querySelector('.stat-item:nth-child(2) .stat-number');
    const currentCount = parseFloat(followerStat.textContent.replace('K', '')) * 1000;
    const newCount = currentCount + change;
    
    if (newCount >= 1000) {
        followerStat.textContent = (newCount / 1000).toFixed(1) + 'K';
    } else {
        followerStat.textContent = newCount.toString();
    }
}

// Like functionality
likeActions.forEach(action => {
    action.addEventListener('click', function() {
        const isLiked = this.classList.contains('liked');
        const countElement = this.querySelector('.action-count');
        const iconElement = this.querySelector('.action-icon');
        let currentCount = parseInt(countElement.textContent);
        
        if (isLiked) {
            this.classList.remove('liked');
            iconElement.textContent = '♡';
            countElement.textContent = currentCount - 1;
            this.style.color = '#64748b';
        } else {
            this.classList.add('liked');
            iconElement.textContent = '♥';
            countElement.textContent = currentCount + 1;
            this.style.color = '#ef4444';
        }
        
        // Add animation
        this.style.transform = 'scale(1.2)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 200);
    });
});

// Comment and share actions
postActions.forEach(action => {
    if (!action.classList.contains('like-action')) {
        action.addEventListener('click', function() {
            const actionType = this.classList.contains('comment-action') ? 'comment' : 'share';
            
            // Add animation
            this.style.transform = 'scale(1.1)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
            
            // Show notification
            showNotification(`${actionType.charAt(0).toUpperCase() + actionType.slice(1)} feature coming soon!`);
        });
    }
});

// Message button functionality
const messageBtn = document.querySelector('.message-btn');
messageBtn.addEventListener('click', function() {
    showNotification('Opening message composer...');
    
    // Add animation
    this.style.transform = 'scale(0.95)';
    setTimeout(() => {
        this.style.transform = 'scale(1)';
    }, 150);
});

// More button functionality
const moreBtn = document.querySelector('.more-btn');
moreBtn.addEventListener('click', function() {
    showMoreOptions();
});

function showMoreOptions() {
    const options = ['Block User', 'Report', 'Copy Profile Link', 'Share Profile'];
    const optionsList = options.map((option, index) => `${index + 1}. ${option}`).join('\n');
    
    const choice = prompt(`Choose an option:\n${optionsList}`);
    
    if (choice) {
        const optionIndex = parseInt(choice) - 1;
        if (optionIndex >= 0 && optionIndex < options.length) {
            showNotification(`${options[optionIndex]} selected`);
        }
    }
}

// Friend avatar interactions
const friendAvatars = document.querySelectorAll('.friend-avatar');
friendAvatars.forEach(avatar => {
    avatar.addEventListener('click', function() {
        const friendName = this.nextElementSibling.textContent;
        showNotification(`Viewing ${friendName}'s profile...`);
        
        // Add click animation
        this.style.transform = 'scale(1.2)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 200);
    });
});

// Profile avatar click
const profileAvatar = document.getElementById('profileImg');
profileAvatar.addEventListener('click', function() {
    showNotification('Profile picture viewer opened');
    
    // Add animation
    this.style.transform = 'scale(1.1)';
    setTimeout(() => {
        this.style.transform = 'scale(1)';
    }, 300);
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
        background: #1e293b;
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

// Simulate real-time updates
setInterval(() => {
    // Randomly update online status
    const onlineStatus = document.querySelector('.online-status');
    if (Math.random() > 0.8) {
        onlineStatus.style.background = onlineStatus.style.background === 'rgb(239, 68, 68)' ? '#10b981' : '#ef4444';
    }
}, 5000);

// Add hover effects to stats
const statItems = document.querySelectorAll('.stat-item');
statItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05)';
        this.style.cursor = 'pointer';
    });
    
    item.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
    
    item.addEventListener('click', function() {
        const label = this.querySelector('.stat-label').textContent.toLowerCase();
        showNotification(`Viewing ${label} details...`);
    });
});