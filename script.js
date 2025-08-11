// DK Dance Animation Controller
class DKDancer {
    constructor() {
        this.dkImage = document.getElementById('dk-dancer');
        this.audio = document.getElementById('dk-rap');
        this.playButton = document.getElementById('play-button');
        this.pauseButton = document.getElementById('pause-button');
        this.resumeButton = document.getElementById('resume-button');
        
        this.currentFrame = 1;
        this.totalFrames = 23; // We have frames 01-23
        this.isAnimating = false;
        this.animationInterval = null;
        this.frameRate = 200; // milliseconds between frames (5 FPS for that classic feel)
        
        this.init();
    }
    
    init() {
        // Set up event listeners
        this.playButton.addEventListener('click', () => this.startDanceParty());
        this.pauseButton.addEventListener('click', () => this.pauseMusic());
        this.resumeButton.addEventListener('click', () => this.resumeMusic());
        
        // Set initial volume
        this.audio.volume = 0.7;
        
        // Audio event listeners
        this.audio.addEventListener('loadstart', () => {
            console.log('Loading DK Rap...');
        });
        
        this.audio.addEventListener('canplaythrough', () => {
            console.log('DK Rap ready to rock!');
        });
        
        this.audio.addEventListener('ended', () => {
            this.stopDancing();
        });
        
        // Error handling
        this.audio.addEventListener('error', (e) => {
            console.error('Audio error:', e);
            alert('Oops! Could not load the DK Rap. Make sure dkrap.mp3 is in the music folder!');
        });
        
        // Add some fun keyboard controls
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case ' ': // Spacebar
                    e.preventDefault();
                    this.toggleMusic();
                    break;
                case 'ArrowUp':
                    this.increaseSpeed();
                    break;
                case 'ArrowDown':
                    this.decreaseSpeed();
                    break;
            }
        });
        
        console.log('DK Dancer initialized! Press spacebar to toggle, arrow keys to change speed!');
    }
    
    startDanceParty() {
        this.playButton.style.display = 'none';
        this.pauseButton.style.display = 'inline-block';
        this.resumeButton.style.display = 'none';
        
        // Start the music
        this.audio.play().then(() => {
            console.log('🎵 DK Rap is playing! 🎵');
            document.body.classList.add('music-playing');
            this.startDancing();
        }).catch((error) => {
            console.error('Failed to play audio:', error);
            alert('Could not start the music. Try clicking again!');
            this.resetButtons();
        });
    }
    
    startDancing() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        document.body.classList.add('dancing');
        
        this.animationInterval = setInterval(() => {
            this.nextFrame();
        }, this.frameRate);
        
        console.log('🕺 DK is dancing! 🕺');
    }
    
    stopDancing() {
        this.isAnimating = false;
        document.body.classList.remove('dancing', 'music-playing');
        
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
        }
        
        this.resetButtons();
        console.log('Dance party over!');
    }
    
    nextFrame() {
        this.currentFrame++;
        if (this.currentFrame > this.totalFrames) {
            this.currentFrame = 1; // Loop back to first frame
        }
        
        // Update the image source with zero-padded frame number
        const frameNumber = this.currentFrame.toString().padStart(2, '0');
        this.dkImage.src = `sprite_sheet/dk_dance/dkc_dk_dance_sheet_${frameNumber}.png`;
    }
    
    pauseMusic() {
        this.audio.pause();
        this.pauseButton.style.display = 'none';
        this.resumeButton.style.display = 'inline-block';
        document.body.classList.remove('dancing');
        
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
            this.isAnimating = false;
        }
    }
    
    resumeMusic() {
        this.audio.play();
        this.pauseButton.style.display = 'inline-block';
        this.resumeButton.style.display = 'none';
        this.startDancing();
    }
    
    toggleMusic() {
        if (this.audio.paused) {
            if (this.audio.currentTime === 0) {
                this.startDanceParty();
            } else {
                this.resumeMusic();
            }
        } else {
            this.pauseMusic();
        }
    }
    
    resetButtons() {
        this.playButton.style.display = 'inline-block';
        this.pauseButton.style.display = 'none';
        this.resumeButton.style.display = 'none';
    }
    
    increaseSpeed() {
        if (this.frameRate > 50) {
            this.frameRate -= 25;
            console.log(`🚀 Speed increased! Frame rate: ${this.frameRate}ms`);
            if (this.isAnimating) {
                this.stopDancing();
                this.startDancing();
            }
        }
    }
    
    decreaseSpeed() {
        if (this.frameRate < 500) {
            this.frameRate += 25;
            console.log(`🐌 Speed decreased! Frame rate: ${this.frameRate}ms`);
            if (this.isAnimating) {
                this.stopDancing();
                this.startDancing();
            }
        }
    }
}

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const dancer = new DKDancer();
    
    // Add some fun console messages
    console.log('🍌 Welcome to DK\'s Dance Party! 🍌');
    console.log('🎮 Controls:');
    console.log('   • Click the button or press SPACEBAR to start/pause');
    console.log('   • Arrow UP/DOWN to change dance speed');
    console.log('   • Get ready to rap with DK! 🎤');
});

// Add some visual flair with random banana drops (just for fun!)
function createBanana() {
    const banana = document.createElement('div');
    banana.innerHTML = '🍌';
    banana.style.position = 'fixed';
    banana.style.fontSize = '30px';
    banana.style.left = Math.random() * window.innerWidth + 'px';
    banana.style.top = '-50px';
    banana.style.zIndex = '5';
    banana.style.pointerEvents = 'none';
    banana.style.animation = 'fall 3s linear forwards';
    
    document.body.appendChild(banana);
    
    setTimeout(() => {
        banana.remove();
    }, 3000);
}

// Add falling animation for bananas
const style = document.createElement('style');
style.textContent = `
    @keyframes fall {
        to {
            transform: translateY(calc(100vh + 50px)) rotate(360deg);
        }
    }
`;
document.head.appendChild(style);

// Randomly drop bananas during the dance party
setInterval(() => {
    if (document.body.classList.contains('music-playing') && Math.random() < 0.3) {
        createBanana();
    }
}, 1000);
