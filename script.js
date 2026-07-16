// Music Control
const musicToggle = document.getElementById('musicToggle');
const bgMusic = document.getElementById('bgMusic');
let isPlaying = false;

musicToggle.addEventListener('click', function() {
    if (isPlaying) {
        bgMusic.pause();
        musicToggle.textContent = '🎵 Play Music';
        isPlaying = false;
    } else {
        bgMusic.play();
        musicToggle.textContent = '⏸ Pause Music';
        isPlaying = true;
    }
});

// Auto-play on page load (some browsers may block this)
window.addEventListener('load', function() {
    bgMusic.play().catch(function(error) {
        console.log('Autoplay prevented: ', error);
    });
    isPlaying = true;
    musicToggle.textContent = '⏸ Pause Music';
});

// Animated falling hearts background
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const hearts = [];

class Heart {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height - canvas.height;
        this.size = Math.random() * 20 + 10;
        this.speedY = Math.random() * 2 + 1;
        this.speedX = Math.random() * 2 - 1;
        this.opacity = Math.random() * 0.5 + 0.3;
    }
    
    update() {
        this.y += this.speedY;
        this.x += this.speedX;
        
        if (this.y > canvas.height) {
            this.y = -this.size;
            this.x = Math.random() * canvas.width;
        }
    }
    
    draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.font = `${this.size}px Arial`;
        ctx.fillText('❤️', this.x, this.y);
        ctx.restore();
    }
}

// Create hearts
for (let i = 0; i < 20; i++) {
    hearts.push(new Heart());
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    hearts.forEach(heart => {
        heart.update();
        heart.draw();
    });
    
    requestAnimationFrame(animate);
}

animate();

// Handle window resize
window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Add mouse movement effect
document.addEventListener('mousemove', function(e) {
    const x = e.clientX;
    const y = e.clientY;
    
    // Occasionally create a heart at mouse position
    if (Math.random() > 0.95) {
        const newHeart = new Heart();
        newHeart.x = x;
        newHeart.y = y;
        newHeart.speedY = Math.random() * 3 + 1;
        hearts.push(newHeart);
        
        if (hearts.length > 50) {
            hearts.shift();
        }
    }
});
