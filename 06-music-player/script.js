// Song data
const songs = [
    {
        title: "Midnight Dreams",
        artist: "Luna & The Stars",
        album: "Cosmic Journey",
        year: "2024",
        duration: "3:45",
        cover: "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
    {
        title: "Electric Pulse",
        artist: "Neon Nights",
        album: "Digital Waves",
        year: "2024",
        duration: "4:12",
        cover: "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
    {
        title: "Ocean Waves",
        artist: "Calm Collective",
        album: "Serenity",
        year: "2023",
        duration: "5:23",
        cover: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
    {
        title: "City Lights",
        artist: "Urban Echo",
        album: "Metropolitan",
        year: "2024",
        duration: "3:58",
        cover: "https://images.pexels.com/photos/1389429/pexels-photo-1389429.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
    {
        title: "Starlight Serenade",
        artist: "Cosmic Dreams",
        album: "Infinite Space",
        year: "2023",
        duration: "4:35",
        cover: "https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=400"
    }
];

// Player state
let currentSongIndex = 0;
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;
let isMuted = false;
let currentTime = 0;
let duration = 225; // 3:45 in seconds
let volume = 0.7;

// DOM elements
const albumCover = document.getElementById('albumCover');
const songTitle = document.getElementById('songTitle');
const artistName = document.getElementById('artistName');
const albumName = document.getElementById('albumName');
const currentTimeEl = document.getElementById('currentTime');
const totalTimeEl = document.getElementById('totalTime');
const progressBar = document.getElementById('progressBar');
const progressFill = document.getElementById('progressFill');
const progressHandle = document.getElementById('progressHandle');
const playPauseBtn = document.getElementById('playPauseBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const shuffleBtn = document.getElementById('shuffleBtn');
const repeatBtn = document.getElementById('repeatBtn');
const volumeBtn = document.getElementById('volumeBtn');
const volumeBar = document.getElementById('volumeBar');
const volumeFill = document.getElementById('volumeFill');
const volumeHandle = document.getElementById('volumeHandle');
const playlist = document.getElementById('playlist');
const albumArt = document.querySelector('.album-art');
const visualizer = document.querySelector('.visualizer');

// Initialize player
function initPlayer() {
    loadSong(currentSongIndex);
    updateVolumeDisplay();
    
    // Set up event listeners
    playPauseBtn.addEventListener('click', togglePlayPause);
    prevBtn.addEventListener('click', previousSong);
    nextBtn.addEventListener('click', nextSong);
    shuffleBtn.addEventListener('click', toggleShuffle);
    repeatBtn.addEventListener('click', toggleRepeat);
    volumeBtn.addEventListener('click', toggleMute);
    
    // Progress bar events
    progressBar.addEventListener('click', seekTo);
    progressBar.addEventListener('mousedown', startProgressDrag);
    
    // Volume bar events
    volumeBar.addEventListener('click', setVolume);
    volumeBar.addEventListener('mousedown', startVolumeDrag);
    
    // Playlist events
    playlist.addEventListener('click', handlePlaylistClick);
    
    // Start progress simulation
    setInterval(updateProgress, 1000);
}

// Load song
function loadSong(index) {
    const song = songs[index];
    
    albumCover.src = song.cover;
    songTitle.textContent = song.title;
    artistName.textContent = song.artist;
    albumName.textContent = song.album;
    totalTimeEl.textContent = song.duration;
    
    // Convert duration to seconds for progress calculation
    const [minutes, seconds] = song.duration.split(':').map(Number);
    duration = minutes * 60 + seconds;
    
    // Reset progress
    currentTime = 0;
    updateProgressDisplay();
    
    // Update playlist active state
    updatePlaylistActive();
}

// Toggle play/pause
function togglePlayPause() {
    isPlaying = !isPlaying;
    
    const playIcon = playPauseBtn.querySelector('.play-icon');
    const pauseIcon = playPauseBtn.querySelector('.pause-icon');
    
    if (isPlaying) {
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
        albumArt.classList.add('playing');
        visualizer.classList.add('playing');
    } else {
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
        albumArt.classList.remove('playing');
        visualizer.classList.remove('playing');
    }
}

// Previous song
function previousSong() {
    if (isShuffle) {
        currentSongIndex = Math.floor(Math.random() * songs.length);
    } else {
        currentSongIndex = currentSongIndex > 0 ? currentSongIndex - 1 : songs.length - 1;
    }
    loadSong(currentSongIndex);
    
    if (isPlaying) {
        // Keep playing
        setTimeout(() => {
            if (!isPlaying) togglePlayPause();
        }, 100);
    }
}

// Next song
function nextSong() {
    if (isShuffle) {
        currentSongIndex = Math.floor(Math.random() * songs.length);
    } else {
        currentSongIndex = currentSongIndex < songs.length - 1 ? currentSongIndex + 1 : 0;
    }
    loadSong(currentSongIndex);
    
    if (isPlaying) {
        // Keep playing
        setTimeout(() => {
            if (!isPlaying) togglePlayPause();
        }, 100);
    }
}

// Toggle shuffle
function toggleShuffle() {
    isShuffle = !isShuffle;
    shuffleBtn.classList.toggle('active', isShuffle);
}

// Toggle repeat
function toggleRepeat() {
    isRepeat = !isRepeat;
    repeatBtn.classList.toggle('active', isRepeat);
}

// Toggle mute
function toggleMute() {
    isMuted = !isMuted;
    
    const volumeIcon = volumeBtn.querySelector('.volume-icon');
    const muteIcon = volumeBtn.querySelector('.mute-icon');
    
    if (isMuted) {
        volumeIcon.style.display = 'none';
        muteIcon.style.display = 'block';
        volumeFill.style.width = '0%';
        volumeHandle.style.left = '0%';
    } else {
        volumeIcon.style.display = 'block';
        muteIcon.style.display = 'none';
        updateVolumeDisplay();
    }
}

// Update progress
function updateProgress() {
    if (isPlaying && currentTime < duration) {
        currentTime += 1;
        updateProgressDisplay();
        
        // Auto next song when finished
        if (currentTime >= duration) {
            if (isRepeat) {
                currentTime = 0;
            } else {
                nextSong();
            }
        }
    }
}

// Update progress display
function updateProgressDisplay() {
    const progress = (currentTime / duration) * 100;
    progressFill.style.width = `${progress}%`;
    progressHandle.style.left = `${progress}%`;
    
    const minutes = Math.floor(currentTime / 60);
    const seconds = Math.floor(currentTime % 60);
    currentTimeEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Seek to position
function seekTo(e) {
    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const progress = clickX / rect.width;
    
    currentTime = progress * duration;
    updateProgressDisplay();
}

// Start progress drag
function startProgressDrag(e) {
    e.preventDefault();
    
    const handleDrag = (e) => {
        const rect = progressBar.getBoundingClientRect();
        const dragX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        const progress = dragX / rect.width;
        
        currentTime = progress * duration;
        updateProgressDisplay();
    };
    
    const stopDrag = () => {
        document.removeEventListener('mousemove', handleDrag);
        document.removeEventListener('mouseup', stopDrag);
    };
    
    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('mouseup', stopDrag);
}

// Set volume
function setVolume(e) {
    const rect = volumeBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    volume = clickX / rect.width;
    
    if (isMuted) {
        toggleMute();
    }
    
    updateVolumeDisplay();
}

// Start volume drag
function startVolumeDrag(e) {
    e.preventDefault();
    
    const handleDrag = (e) => {
        const rect = volumeBar.getBoundingClientRect();
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
}

// Handle playlist click
function handlePlaylistClick(e) {
    const playlistItem = e.target.closest('.playlist-item');
    if (playlistItem) {
        const songIndex = parseInt(playlistItem.dataset.song);
        currentSongIndex = songIndex;
        loadSong(currentSongIndex);
        
        if (!isPlaying) {
            togglePlayPause();
        }
    }
}

// Update playlist active state
function updatePlaylistActive() {
    const playlistItems = playlist.querySelectorAll('.playlist-item');
    playlistItems.forEach((item, index) => {
        item.classList.toggle('active', index === currentSongIndex);
    });
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    switch (e.code) {
        case 'Space':
            e.preventDefault();
            togglePlayPause();
            break;
        case 'ArrowLeft':
            e.preventDefault();
            previousSong();
            break;
        case 'ArrowRight':
            e.preventDefault();
            nextSong();
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
        case 'KeyS':
            e.preventDefault();
            toggleShuffle();
            break;
        case 'KeyR':
            e.preventDefault();
            toggleRepeat();
            break;
    }
});

// Add visual feedback for interactions
function addRippleEffect(element, e) {
    const ripple = document.createElement('div');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
    `;
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Add ripple effect to buttons
document.querySelectorAll('.control-btn, .volume-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        addRippleEffect(btn, e);
    });
});

// Add CSS for ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    .playlist-item {
        position: relative;
        overflow: hidden;
    }
    
    .playlist-item::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        width: 4px;
        height: 100%;
        background: linear-gradient(135deg, #667eea, #764ba2);
        transform: scaleY(0);
        transition: transform 0.3s ease;
    }
    
    .playlist-item.active::before {
        transform: scaleY(1);
    }
    
    .control-btn, .volume-btn {
        position: relative;
        overflow: hidden;
    }
`;
document.head.appendChild(style);

// Initialize the player when the page loads
document.addEventListener('DOMContentLoaded', initPlayer);