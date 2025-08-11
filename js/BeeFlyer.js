// Bee Flyer Controller
window.BeeFlyer = class BeeFlyer {
    constructor() {
        this.beeContainer = document.getElementById('bee-container');
        this.beeImage = document.getElementById('bee-flyer');
        this.currentFrame = 1;
        this.totalFrames = 4; // Only use frames 01-04 (05-09 are attack frames)
        this.isFlying = false;
        this.animationInterval = null;
        this.frameRate = 120; // Fast frame rate for buzzing effect
        this.flyTimer = null;
        
        this.scheduleNextFlight();
    }
    
    scheduleNextFlight() {
        // More frequent flights - every 8-25 seconds
        const nextFlightTime = Math.random() * 17000 + 8000;
        this.flyTimer = setTimeout(() => {
            this.startFlying();
        }, nextFlightTime);
    }
    
    startFlying() {
        if (this.isFlying) return;
        
        this.isFlying = true;
        this.currentFrame = 1;
        
        // Randomly choose direction
        const flyingReverse = Math.random() < 0.5;
        
        // Reset position and classes
        this.beeContainer.classList.remove('flying', 'flying-reverse');
        
        if (flyingReverse) {
            this.beeContainer.classList.add('flying-reverse');
        } else {
            this.beeContainer.classList.add('flying');
        }
        
        // Start frame animation
        this.animationInterval = setInterval(() => {
            this.nextFrame();
        }, this.frameRate);
        
        // Stop flying after 18 seconds (duration of CSS animation)
        setTimeout(() => {
            this.stopFlying();
            this.scheduleNextFlight();
        }, 18000);
        
        console.log(`🐝 A bee is buzzing ${flyingReverse ? 'right to left' : 'left to right'}!`);
    }
    
    stopFlying() {
        this.isFlying = false;
        this.beeContainer.classList.remove('flying', 'flying-reverse');
        
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
        }
    }
    
    nextFrame() {
        this.currentFrame++;
        if (this.currentFrame > this.totalFrames) {
            this.currentFrame = 1; // Loop back to first frame
        }
        
        // Update the image source with zero-padded frame number
        const frameNumber = this.currentFrame.toString().padStart(2, '0');
        this.beeImage.src = `sprite_sheet/bee/bee_${frameNumber}.png`;
    }
    
    // Global pause/resume methods
    pauseAll() {
        // Pause CSS animation
        this.beeContainer.classList.add('paused');
        
        // Pause frame animation
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
        }
        
        // Pause flight timer
        if (this.flyTimer) {
            clearTimeout(this.flyTimer);
            this.flyTimer = null;
        }
    }
    
    resumeAll() {
        // Resume CSS animation
        this.beeContainer.classList.remove('paused');
        
        // Resume frame animation if flying
        if (this.isFlying) {
            this.animationInterval = setInterval(() => {
                this.nextFrame();
            }, this.frameRate);
        }
        
        // Reschedule next flight if not currently flying
        if (!this.isFlying) {
            this.scheduleNextFlight();
        }
    }
}
