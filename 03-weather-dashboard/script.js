// Current date and time
function updateDateTime() {
    const now = new Date();
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    
    document.getElementById('currentDateTime').textContent = 
        now.toLocaleDateString('en-US', options);
}

// Update time every minute
updateDateTime();
setInterval(updateDateTime, 60000);

// Temperature unit conversion
const unitButtons = document.querySelectorAll('.unit-btn');
const tempValue = document.querySelector('.temp-value');
const detailValues = document.querySelectorAll('.detail-value');
const forecastTemps = document.querySelectorAll('.high-temp, .low-temp');
const hourlyTemps = document.querySelectorAll('.hourly-temp');

let currentUnit = 'C';
let currentTemp = 22; // Base temperature in Celsius

unitButtons.forEach(button => {
    button.addEventListener('click', function() {
        // Remove active class from all buttons
        unitButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        this.classList.add('active');
        
        // Get selected unit
        const selectedUnit = this.dataset.unit;
        
        if (selectedUnit !== currentUnit) {
            currentUnit = selectedUnit;
            convertTemperatures();
        }
    });
});

function convertTemperatures() {
    // Convert main temperature
    const convertedTemp = currentUnit === 'F' 
        ? Math.round(currentTemp * 9/5 + 32)
        : currentTemp;
    
    tempValue.textContent = `${convertedTemp}°`;
    
    // Convert feels like temperature
    const feelsLikeElement = Array.from(detailValues).find(el => 
        el.parentElement.querySelector('.detail-label').textContent === 'Feels Like'
    );
    if (feelsLikeElement) {
        const feelsLikeTemp = currentUnit === 'F' ? 77 : 25;
        feelsLikeElement.textContent = `${feelsLikeTemp}°`;
    }
    
    // Convert forecast temperatures
    const forecastData = [
        { high: 25, low: 18 },
        { high: 23, low: 16 },
        { high: 19, low: 12 },
        { high: 21, low: 14 },
        { high: 26, low: 19 }
    ];
    
    forecastTemps.forEach((temp, index) => {
        const isHigh = temp.classList.contains('high-temp');
        const cardIndex = Math.floor(index / 2);
        const baseTemp = isHigh ? forecastData[cardIndex]?.high : forecastData[cardIndex]?.low;
        
        if (baseTemp) {
            const convertedTemp = currentUnit === 'F' 
                ? Math.round(baseTemp * 9/5 + 32)
                : baseTemp;
            temp.textContent = `${convertedTemp}°`;
        }
    });
    
    // Convert hourly temperatures
    const hourlyData = [22, 24, 25, 26, 24, 21];
    hourlyTemps.forEach((temp, index) => {
        const baseTemp = hourlyData[index];
        if (baseTemp) {
            const convertedTemp = currentUnit === 'F' 
                ? Math.round(baseTemp * 9/5 + 32)
                : baseTemp;
            temp.textContent = `${convertedTemp}°`;
        }
    });
}

// Search functionality
const searchInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const cityName = document.querySelector('.city-name');

function searchCity() {
    const city = searchInput.value.trim();
    if (city) {
        // Simulate city search (in real app, this would call weather API)
        cityName.textContent = city;
        searchInput.value = '';
        
        // Show loading animation
        searchBtn.style.transform = 'scale(0.9)';
        setTimeout(() => {
            searchBtn.style.transform = 'scale(1)';
        }, 200);
        
        // Simulate weather data update
        updateWeatherData(city);
    }
}

searchBtn.addEventListener('click', searchCity);
searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchCity();
    }
});

// Simulate weather data update
function updateWeatherData(city) {
    // This would normally fetch real weather data
    const weatherConditions = ['sunny', 'cloudy', 'rainy'];
    const randomCondition = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
    
    // Update weather icon
    const weatherIcon = document.getElementById('weatherIcon');
    const weatherDescription = document.querySelector('.weather-description');
    
    weatherIcon.className = `weather-icon ${randomCondition}`;
    
    switch(randomCondition) {
        case 'sunny':
            weatherIcon.innerHTML = '<div class="sun"><div class="sun-rays"></div></div>';
            weatherDescription.textContent = 'Sunny';
            break;
        case 'cloudy':
            weatherIcon.innerHTML = '☁️';
            weatherIcon.style.fontSize = '4rem';
            weatherDescription.textContent = 'Cloudy';
            break;
        case 'rainy':
            weatherIcon.innerHTML = '🌧️';
            weatherIcon.style.fontSize = '4rem';
            weatherDescription.textContent = 'Rainy';
            break;
    }
    
    // Update temperature with random value
    currentTemp = Math.floor(Math.random() * 20) + 15; // 15-35°C
    const displayTemp = currentUnit === 'F' 
        ? Math.round(currentTemp * 9/5 + 32)
        : currentTemp;
    tempValue.textContent = `${displayTemp}°`;
}

// Add hover effects to cards
const cards = document.querySelectorAll('.detail-card, .forecast-card, .hourly-item');

cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Add loading animation to search
function addLoadingAnimation() {
    const style = document.createElement('style');
    style.textContent = `
        .loading {
            animation: pulse 1.5s ease-in-out infinite;
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
        
        .weather-icon {
            transition: all 0.3s ease;
        }
        
        .detail-card, .forecast-card, .hourly-item {
            transition: all 0.3s ease;
        }
    `;
    document.head.appendChild(style);
}

// Initialize animations
addLoadingAnimation();

// Add smooth scrolling for mobile
if (window.innerWidth <= 768) {
    const hourlyContainer = document.querySelector('.hourly-container');
    let isScrolling = false;
    
    hourlyContainer.addEventListener('scroll', function() {
        if (!isScrolling) {
            window.requestAnimationFrame(function() {
                // Add scroll indicator or other mobile-specific features
                isScrolling = false;
            });
            isScrolling = true;
        }
    });
}