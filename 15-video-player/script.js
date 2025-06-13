// DOM Elements
const videoPlayer = document.getElementById('videoPlayer');
const videoPlaceholder = document.getElementById('videoPlaceholder');
const playOverlay = document.getElementById('playOverlay');
const playButtonLarge = document.getElementById('playButtonLarge');
const videoControls = document.getElementById('videoControls');
const playPauseBtn = document.getElementById('playPauseBtn');
const skipBackBtn = document.getElementById('skipBackBtn');
const skipForwardBtn = document.getElementById('skipForwardBtn');
const volumeBtn = document.getElementById('volumeBtn');
const volumeSlider = document.getElementById('volumeSlider');
const volumeFill = document.getElementById('volumeFill');
const volumeHandle = document.getElementById('volumeHandle');
const progressBar = document.getElementById('progressBar');
const progressPlayed = document.getElementById('progressPlayed');
const progressHandle = document.getElementById('progressHandle');
const timeTooltip = document.getElementById('timeTooltip');
const currentTime = document.getElementById('currentTime');
const totalTime = document.getElementById('totalTime');
const settingsBtn = document.getElementById('settingsBtn');
const settingsMenu = document.getElementById('settingsMenu');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const loadingSpinner = document.getElementById('loadingSpinner');

// Action buttons
const likeBtn = document.getElementById('likeBtn');
const dislikeBtn = document.getElementById('dislikeBtn');
const shareBtn = document.getElementById('shareBtn');
const saveBtn = document.getElementById('saveBtn');
const subscribeBtn = document.getElementById('subscribeBtn');
const autoplayToggle = document.getElementById('autoplayToggle');

// Player state
let isPlaying = false;
let isMuted = false;
let volume = 0.7;
let currentTimeSeconds = 0;
let totalTimeSeconds = 624; // 10:24
let playbackSpeed = 1;
let quality = '720p';
let isSubscribed = false;
let isAutoplay = true;
let controlsTimeout;

// Initialize player
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    updateVolumeDisplay();
    updateTimeDisplay();
    setupKeyboardControls();
});

// Setup event listeners
function setupEventListeners() {
    // Play/pause controls
    playButtonLarge.addEventListener('click', togglePlayPause);
    playPauseBtn.addEventListener('click', togglePlayPause);
    videoPlaceholder.addEventListener('click', togglePlayPause);
    
    // Skip controls
    skipBackBtn.addEventListener('click', () => skipTime(-10));
    skipForwardBtn.addEventListener('click', () => skipTime(10));
    
    // Volume controls
    volumeBtn.addEventListener('click', toggleMute);
    volumeSlider.addEventListener('click', setVolume);
    volumeSlider.addEventListener('mousedown', startVolumeDrag);
    
    // Progress controls
    progressBar.addEventListener('click', seekTo);
    progressBar.addEventListener('mousedown', startProgressDrag);
    progressBar.addEventListener('mousemove', showTimeTooltip);
    progressBar.addEventListener('mouseleave', hideTimeTooltip);
    
    // Settings
    settingsBtn.addEventListener('click', toggleSettings);
    setupSettingsOptions();
    
    // Fullscreen
    fullscreenBtn.addEventListener('click', toggleFullscreen);
    
    // Action buttons
    likeBtn.addEventListener('click', toggleLike);
    dislikeBtn.addEventListener('click', toggleDislike);
    shareBtn.addEventListener('click', shareVideo);
    saveBtn.addEventListener('click', saveVideo);
    subscribeBtn.addEventListener('click', toggleSubscribe);
    autoplayToggle.addEventListener('click', toggleAutoplay);
    
    // Playlist videos
    setupPlaylistVideos();
    
    // Controls visibility
    videoPlayer.addEventListener('mouseenter', showControls);
    videoPlayer.addEventListener('mouseleave', hideControls);
    videoPlayer.addEventListener('mousemove', showControls);
    
    // Click outside to close settings
    document.addEventListener('click', function(e) {
        if (!settingsMenu.contains(e.target) && !settingsBtn.contains(e.target)) {
            settingsMenu.classList.remove('show');
        }
    });
}

// Toggle play/pause
function togglePlayPause() {
    isPlaying = !isPlaying;
    
    const playIcon = playPauseBtn.querySelector('.play-icon');
    const pauseIcon = playPauseBtn.querySelector('.pause-icon');
    
    if (isPlaying) {
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
        playOverlay.style.display = 'none';
        startPlayback();
    } else {
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
        playOverlay.style.display = 'flex';
        stopPlayback();
    }
}

// Start playback simulation
function startPlayback() {
    if (window.playbackInterval) {
        clearInterval(window.playbackInterval);
    }
    
    window.playbackInterval = setInterval(() => {
        if (isPlaying && currentTimeSeconds < totalTimeSeconds) {
            currentTimeSeconds += playbackSpeed;
            updateProgressDisplay();
            updateTimeDisplay();
        } else if (currentTimeSeconds >= totalTimeSeconds) {
            // Video ended
            isPlaying = false;
            togglePlayPause();
            if (isAutoplay) {
                // Auto-play next video
                setTimeout(() => {
                    playNextVideo();
                }, 1000);
            }
        }
    }, 1000);
}

// Stop playback
function stopPlayback() {
    if (window.playbackInterval) {
        clearInterval(window.playbackInterval);
    }
}

// Skip time
function skipTime(seconds) {
    currentTimeSeconds = Math.max(0, Math.min(currentTimeSeconds + seconds, totalTimeSeconds));
    updateProgressDisplay();
    updateTimeDisplay();
    
    // Show skip feedback
    const skipText = seconds > 0 ? `+${seconds}s` : `${seconds}s`;
    showSkipFeedback(skipText);
}

// Show skip feedback
function showSkipFeedback(text) {
    const feedback = document.createElement('div');
    feedback.textContent = text;
    feedback.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        font-weight: bold;
        z-index: 100;
        animation: skipFeedback 1s ease;
    `;
    
    videoPlayer.appendChild(feedback);
    
    setTimeout(() => {
        feedback.remove();
    }, 1000);
}

// Toggle mute
function toggleMute() {
    isMuted = !isMuted;
    
    const volumeIcon = volumeBtn.querySelector('.volume-icon');
    
    if (isMuted) {
        volumeIcon.textContent = '🔇';
        volumeFill.style.width = '0%';
        volumeHandle.style.left = '0%';
    } else {
        volumeIcon.textContent = volume > 0.5 ? '🔊' : '🔉';
        updateVolumeDisplay();
    }
}

// Set volume
function setVolume(e) {
    const rect = volumeSlider.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    volume = Math.max(0, Math.min(clickX / rect.width, 1));
    
    if (isMuted) {
        toggleMute();
    }
    
    updateVolumeDisplay();
}

// Start volume drag
function startVolumeDrag(e) {
    e.preventDefault();
    
    const handleDrag = (e) => {
        const rect = volumeSlider.getBoundingClientRect();
        const dragX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        volume = dragX / rect.width;
        
        if (isMuted) {
            toggleMute();
        }
        
        updateVolumeDisplay();
    };
    
    const stopDrag = () => {
        document.removeEventListener('mousemove', handleDrag);
        document.removeEventListener('mouseup', stopDrag);
    };
    
    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('mouseup', stopDrag);
}

// Update volume display
function updateVolumeDisplay() {
    const volumePercent = volume * 100;
    volumeFill.style.width = `${volumePercent}%`;
    volumeHandle.style.left = `${volumePercent}%`;
    
    const volumeIcon = volumeBtn.querySelector('.volume-icon');
    if (!isMuted) {
        volumeIcon.textContent = volume > 0.5 ? '🔊' : volume > 0 ? '🔉' : '🔇';
    }
}

// Seek to position
function seekTo(e) {
    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const progress = clickX / rect.width;
    
    currentTimeSeconds = progress * totalTimeSeconds;
    updateProgressDisplay();
    updateTimeDisplay();
}

// Start progress drag
function startProgressDrag(e) {
    e.preventDefault();
    
    const handleDrag = (e) => {
        const rect = progressBar.getBoundingClientRect();
        const dragX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        const progress = dragX / rect.width;
        
        currentTimeSeconds = progress * totalTimeSeconds;
        updateProgressDisplay();
        updateTimeDisplay();
    };
    
    const stopDrag = () => {
        document.removeEventListener('mousemove', handleDrag);
        document.removeEventListener('mouseup', stopDrag);
    };
    
    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('mouseup', stopDrag);
}

// Update progress display
function updateProgressDisplay() {
    const progress = (currentTimeSeconds / totalTimeSeconds) * 100;
    progressPlayed.style.width = `${progress}%`;
    progressHandle.style.left = `${progress}%`;
}

// Show time tooltip
function showTimeTooltip(e) {
    const rect = progressBar.getBoundingClientRect();
    const hoverX = e.clientX - rect.left;
    const progress = hoverX / rect.width;
    const hoverTime = progress * totalTimeSeconds;
    
    timeTooltip.textContent = formatTime(hoverTime);
    timeTooltip.style.left = `${hoverX}px`;
    timeTooltip.style.opacity = '1';
}

// Hide time tooltip
function hideTimeTooltip() {
    timeTooltip.style.opacity = '0';
}

// Update time display
function updateTimeDisplay() {
    currentTime.textContent = formatTime(currentTimeSeconds);
    totalTime.textContent = formatTime(totalTimeSeconds);
}

// Format time
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Toggle settings
function toggleSettings() {
    settingsMenu.classList.toggle('show');
}

// Setup settings options
function setupSettingsOptions() {
    const speedOptions = settingsMenu.querySelectorAll('[data-speed]');
    const qualityOptions = settingsMenu.querySelectorAll('[data-quality]');
    
    speedOptions.forEach(option => {
        option.addEventListener('click', function() {
            speedOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            playbackSpeed = parseFloat(this.dataset.speed);
            showNotification(`Playback speed: ${playbackSpeed}x`);
        });
    });
    
    qualityOptions.forEach(option => {
        option.addEventListener('click', function() {
            qualityOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            quality = this.dataset.quality;
            showNotification(`Quality: ${quality}`);
            
            // Simulate quality change loading
            showLoading();
            setTimeout(() => {
                hideLoading();
            }, 1000);
        });
    });
}

// Toggle fullscreen
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        videoPlayer.requestFullscreen().catch(err => {
            console.log('Fullscreen not supported');
        });
    } else {
        document.exitFullscreen();
    }
}

// Show/hide controls
function showControls() {
    videoControls.classList.add('show');
    
    if (controlsTimeout) {
        clearTimeout(controlsTimeout);
    }
    
    controlsTimeout = setTimeout(() => {
        if (isPlaying) {
            videoControls.classList.remove('show');
        }
    }, 3000);
}

function hideControls() {
    if (controlsTimeout) {
        clearTimeout(controlsTimeout);
    }
    
    controlsTimeout = setTimeout(() => {
        if (isPlaying) {
            videoControls.classList.remove('show');
        }
    }, 1000);
}

// Action button functions
function toggleLike() {
    const isLiked = likeBtn.classList.contains('active');
    
    if (isLiked) {
        likeBtn.classList.remove('active');
        updateLikeCount(-1);
    } else {
        likeBtn.classList.add('active');
        dislikeBtn.classList.remove('active');
        updateLikeCount(1);
    }
}

function toggleDislike() {
    const isDisliked = dislikeBtn.classList.contains('active');
    
    if (isDisliked) {
        dislikeBtn.classList.remove('active');
    } else {
        dislikeBtn.classList.add('active');
        likeBtn.classList.remove('active');
        updateLikeCount(-1);
    }
}

function updateLikeCount(change) {
    const countElement = likeBtn.querySelector('.action-count');
    const currentCount = parseInt(countElement.textContent.replace('K', '')) * 1000;
    const newCount = currentCount + change;
    
    if (newCount >= 1000) {
        countElement.textContent = Math.round(newCount / 1000) + 'K';
    } else {
        countElement.textContent = newCount.toString();
    }
}

function shareVideo() {
    if (navigator.share) {
        navigator.share({
            title: 'Amazing Nature Documentary: Wildlife in 4K',
            text: 'Check out this amazing nature documentary!',
            url: window.location.href
        });
    } else {
        navigator.clipboard.writeText(window.location.href);
        showNotification('Link copied to clipboard!');
    }
}

function saveVideo() {
    saveBtn.classList.toggle('active');
    const isSaved = saveBtn.classList.contains('active');
    showNotification(isSaved ? 'Video saved to Watch Later' : 'Video removed from Watch Later');
}

function toggleSubscribe() {
    isSubscribed = !isSubscribed;
    
    if (isSubscribed) {
        subscribeBtn.textContent = 'Subscribed';
        subscribeBtn.classList.add('subscribed');
        showNotification('Subscribed to Nature Explorer!');
    } else {
        subscribeBtn.textContent = 'Subscribe';
        subscribeBtn.classList.remove('subscribed');
        showNotification('Unsubscribed from Nature Explorer');
    }
}

function toggleAutoplay() {
    isAutoplay = !isAutoplay;
    autoplayToggle.classList.toggle('active', isAutoplay);
    showNotification(`Autoplay ${isAutoplay ? 'enabled' : 'disabled'}`);
}

// Setup playlist videos
function setupPlaylistVideos() {
    const playlistVideos = document.querySelectorAll('.playlist-video');
    
    playlistVideos.forEach((video, index) => {
        video.addEventListener('click', function() {
            // Remove active class from all videos
            playlistVideos.forEach(v => v.classList.remove('active'));
            
            // Add active class to clicked video
            this.classList.add('active');
            
            // Update main video
            const title = this.querySelector('.playlist-video-title').textContent;
            const thumbnail = this.querySelector('img').src;
            
            document.querySelector('.video-title').textContent = title;
            document.querySelector('.video-thumbnail').src = thumbnail;
            
            // Reset player state
            currentTimeSeconds = 0;
            updateProgressDisplay();
            updateTimeDisplay();
            
            showNotification(`Now playing: ${title}`);
        });
    });
}

function playNextVideo() {
    const playlistVideos = document.querySelectorAll('.playlist-video');
    const activeVideo = document.querySelector('.playlist-video.active');
    const currentIndex = Array.from(playlistVideos).indexOf(activeVideo);
    const nextIndex = (currentIndex + 1) % playlistVideos.length;
    
    playlistVideos[nextIndex].click();
    
    // Auto-start playing
    if (!isPlaying) {
        setTimeout(() => {
            togglePlayPause();
        }, 500);
    }
}

// Keyboard controls
function setupKeyboardControls() {
    document.addEventListener('keydown', function(e) {
        // Only handle if not typing in an input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }
        
        switch(e.code) {
            case 'Space':
                e.preventDefault();
                togglePlayPause();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                skipTime(-10);
                break;
            case 'ArrowRight':
                e.preventDefault();
                skipTime(10);
                break;
            case 'ArrowUp':
                e.preventDefault();
                volume = Math.min(1, volume + 0.1);
                if (isMuted) toggleMute();
                updateVolumeDisplay();
                break;
            case 'ArrowDown':
                e.preventDefault();
                volume = Math.max(0, volume - 0.1);
                if (isMuted) toggleMute();
                updateVolumeDisplay();
                break;
            case 'KeyM':
                e.preventDefault();
                toggleMute();
                break;
            case 'KeyF':
                e.preventDefault();
                toggleFullscreen();
                break;
        }
    });
}

// Show loading
function showLoading() {
    loadingSpinner.classList.add('show');
}

// Hide loading
function hideLoading() {
    loadingSpinner.classList.remove('show');
}

// Notification system
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
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
    
    @keyframes skipFeedback {
        0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
        }
        20% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
        80% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
        100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
        }
    }
`;
document.head.appendChild(style);