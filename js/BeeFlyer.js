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
        
        // Preload all bee frames to prevent loading errors
        this.preloadedImages = new Map();
        this.preloadFrames();
        
        this.scheduleNextFlight();
    }
    
    preloadFrames() {
        console.log('🐝 Preloading bee animation frames...');
        
        let loadedCount = 0;
        
        const checkAllLoaded = () => {
            loadedCount++;
            if (loadedCount === this.totalFrames) {
                console.log('🐝 All bee frames preloaded and cached!');
            }
        };
        
        // Preload bee frames (1-4)
        for (let i = 1; i <= this.totalFrames; i++) {
            const frameNumber = i.toString().padStart(2, '0');
            const img = new Image();
            img.onload = checkAllLoaded;
            img.onerror = () => {
                console.error(`Failed to load bee frame ${frameNumber}`);
                checkAllLoaded();
            };
            img.src = `sprite_sheet/bee/bee_${frameNumber}.png`;
            this.preloadedImages.set(i, img);
        }
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
        
        // Use preloaded image instead of changing src (prevents HTTP requests)
        const preloadedImg = this.preloadedImages.get(this.currentFrame);
        if (preloadedImg && preloadedImg.complete) {
            this.beeImage.src = preloadedImg.src;
        } else {
            // Fallback to original method if preload failed
            const frameNumber = this.currentFrame.toString().padStart(2, '0');
            this.beeImage.src = `sprite_sheet/bee/bee_${frameNumber}.png`;
        }
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
