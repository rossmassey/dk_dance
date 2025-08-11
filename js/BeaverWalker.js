// Beaver Walker Controller
window.BeaverWalker = class BeaverWalker {
    constructor() {
        this.beaverContainer = document.getElementById('beaver-container');
        this.beaverImage = document.getElementById('beaver-walker');
        this.currentFrame = 3; // Start with walking frame
        this.isWalking = false;
        this.isStopped = false;
        this.animationInterval = null;
        this.walkTimer = null;
        this.stopTimer = null;
        this.walkingRightToLeft = false;
        
        // Animation settings
        this.walkFrameRate = 150; // milliseconds between walking frames
        this.stopFrameRate = 800; // slower for stop animation
        this.walkingFrameStart = 3;
        this.walkingFrameEnd = 10;
        this.stopFrames = [1, 2]; // frames for stopping animation
        
        this.scheduleNextWalk();
    }
    
    scheduleNextWalk() {
        // More frequent beaver walks - every 8-25 seconds
        const nextWalkTime = Math.random() * 17000 + 8000;
        this.walkTimer = setTimeout(() => {
            this.startWalking();
        }, nextWalkTime);
    }
    
    startWalking() {
        if (this.isWalking) return;
        
        this.isWalking = true;
        this.isStopped = false;
        this.currentFrame = this.walkingFrameStart;
        
        // Randomly choose direction (left to right or right to left)
        this.walkingRightToLeft = Math.random() < 0.5;
        
        // Reset position and classes
        this.beaverContainer.classList.remove('walking', 'walking-right-to-left');
        
        if (this.walkingRightToLeft) {
            this.beaverContainer.classList.add('walking-right-to-left');
        } else {
            this.beaverContainer.classList.add('walking');
        }
        
        // Start walking animation
        this.startWalkingAnimation();
        
        // Schedule random stops during the walk
        this.scheduleRandomStops();
        
        // Stop walking after 22 seconds (give extra time for CSS animation to complete)
        setTimeout(() => {
            this.stopWalking();
            this.scheduleNextWalk();
        }, 22000);
        
        console.log(`🦫 A beaver is walking ${this.walkingRightToLeft ? 'right to left' : 'left to right'}!`);
    }
    
    scheduleRandomStops() {
        // Schedule 1-3 random stops during the walk
        const numberOfStops = Math.floor(Math.random() * 3) + 1;
        
        for (let i = 0; i < numberOfStops; i++) {
            const stopTime = Math.random() * 15000 + 2000; // Random time between 2-17 seconds
            setTimeout(() => {
                if (this.isWalking && !this.isStopped) {
                    this.pauseAndStop();
                }
            }, stopTime);
        }
    }
    
    pauseAndStop() {
        if (this.isStopped) return;
        
        this.isStopped = true;
        console.log('🦫 Beaver is taking a break!');
        
        // Pause the CSS position animation
        this.beaverContainer.classList.add('paused');
        
        // Clear walking animation completely
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
        }
        
        // Small delay to ensure walking animation is fully stopped before starting stop animation
        setTimeout(() => {
            this.playStopAnimation();
        }, 50);
        
        // Resume walking after 1-10 seconds
        const stopDuration = Math.random() * 9000 + 1000;
        this.stopTimer = setTimeout(() => {
            if (this.isWalking) {
                this.resumeWalking();
            }
        }, stopDuration);
    }
    
    playStopAnimation() {
        let stopFrameIndex = 0;
        const stopSequence = [1, 2, 1, 2, 1, 2, 1]; // Alternate between 01 (looking at screen) and 02 (turning towards walk)
        
        const stopInterval = setInterval(() => {
            if (stopFrameIndex < stopSequence.length) {
                const frameNumber = stopSequence[stopFrameIndex].toString().padStart(2, '0');
                this.beaverImage.src = `sprite_sheet/beaver/beavert_${frameNumber}.png`;
                stopFrameIndex++;
            } else {
                clearInterval(stopInterval);
            }
        }, this.stopFrameRate);
    }
    
    resumeWalking() {
        if (!this.isWalking) return;
        
        this.isStopped = false;
        
        // Resume the CSS position animation
        this.beaverContainer.classList.remove('paused');
        
        // Ensure we're back to walking frames
        this.currentFrame = this.walkingFrameStart;
        
        // Clear any existing animation interval before starting new one
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
        }
        
        this.startWalkingAnimation();
        console.log('🦫 Beaver is walking again!');
    }
    
    startWalkingAnimation() {
        this.animationInterval = setInterval(() => {
            if (!this.isStopped) {
                this.nextWalkingFrame();
            }
        }, this.walkFrameRate);
    }
    
    stopWalking() {
        this.isWalking = false;
        this.isStopped = false;
        this.beaverContainer.classList.remove('walking', 'walking-right-to-left', 'paused');
        
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
        }
        
        if (this.stopTimer) {
            clearTimeout(this.stopTimer);
            this.stopTimer = null;
        }
        
        console.log('🦫 Beaver has finished walking');
    }
    
    nextWalkingFrame() {
        this.currentFrame++;
        if (this.currentFrame > this.walkingFrameEnd) {
            this.currentFrame = this.walkingFrameStart; // Loop back to first walking frame
        }
        
        // Update the image source with zero-padded frame number
        const frameNumber = this.currentFrame.toString().padStart(2, '0');
        this.beaverImage.src = `sprite_sheet/beaver/beavert_${frameNumber}.png`;
    }
    
    // Global pause/resume methods
    pauseAll() {
        // Pause CSS animation
        this.beaverContainer.classList.add('paused');
        
        // Pause frame animation
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
        }
        
        // Pause timers
        if (this.walkTimer) {
            clearTimeout(this.walkTimer);
            this.walkTimer = null;
        }
        if (this.stopTimer) {
            clearTimeout(this.stopTimer);
            this.stopTimer = null;
        }
    }
    
    resumeAll() {
        // Resume CSS animation
        this.beaverContainer.classList.remove('paused');
        
        // Resume frame animation if walking
        if (this.isWalking && !this.isStopped) {
            this.startWalkingAnimation();
        }
        
        // Reschedule next walk if not currently walking
        if (!this.isWalking) {
            this.scheduleNextWalk();
        }
    }
}
