// DK Dance Animation Controller
window.DKDancer = class DKDancer {
    constructor(beaver, bee) {
        this.dkImage = document.getElementById('dk-dancer');
        this.audio = document.getElementById('dk-rap');
        this.okayAudio = document.getElementById('okay-sound');
        this.playButton = document.getElementById('play-button');
        this.pauseButton = document.getElementById('pause-button');
        this.resumeButton = document.getElementById('resume-button');
        
        this.currentFrame = 1;
        this.totalFrames = 23; // We have frames 01-23 for dance
        this.isAnimating = false;
        this.isPlayingIntro = false;
        this.animationInterval = null;
        this.frameRate = 40; // milliseconds between frames (same speed as swing animation)
        
        // Dance move settings
        this.currentMove = 'handsOut'; // 'handsOut', 'handsOutFlipped', or 'fingerPoint'
        this.isFlipped = false; // Track if hands out move is flipped
        this.handsOutRange = { start: 1, end: 10, switchFrame: 5 };
        this.fingerPointRange = { start: 11, end: 23, switchFrame: 11 }; // frame 11 matches frame 5
        this.fingerPointDirection = 'forward'; // 'forward' or 'reverse'
        this.moveStartTime = 0; // Track when current move started
        this.minMoveDuration = 3000; // 3 seconds minimum before allowing switch
        this.maxMoveDuration = 10000; // 10 seconds maximum before forcing switch
        
        // Intro animation settings
        this.swingFrameRate = 40; // 2x faster for intro animation (was 80ms)
        this.introSequence = [];
        this.currentIntroIndex = 0;
        this.musicStarted = false; // Track if music has started during swing
        this.isFalling = false; // Track if DK is in falling animation
        this.fallingStarted = false; // Track if falling has been initiated
        
        // Store references to other controllers
        this.beaver = beaver;
        this.bee = bee;
        
        this.buildIntroSequence();
        this.init();
    }
    
    buildIntroSequence() {
        // Build the intro sequence: 1-26, 26-16 reverse, 27-53
        
        // Part 1: frames 1 to 26
        for (let i = 1; i <= 26; i++) {
            this.introSequence.push(i);
        }
        
        // Part 2: frames 26 to 16 in reverse
        for (let i = 26; i >= 16; i--) {
            this.introSequence.push(i);
        }
        
        // Part 3: frames 27 to 53
        for (let i = 27; i <= 53; i++) {
            this.introSequence.push(i);
        }
        
        console.log(`🎬 Intro sequence built: ${this.introSequence.length} frames`);
    }
    
    playIntroAnimation() {
        if (this.isPlayingIntro) return;
        
        this.isPlayingIntro = true;
        this.currentIntroIndex = 0;
        this.musicStarted = false; // Reset music flag for new intro
        
        // Set the first swing frame BEFORE making DK visible
        const firstFrame = this.introSequence[0];
        const paddedFrameNumber = firstFrame.toString().padStart(2, '0');
        this.dkImage.src = `sprite_sheet/dk_swing/swing_dk-export_${paddedFrameNumber}.png`;
        
        // Clear any existing state and show DK with correct frame already loaded and position at top
        this.dkImage.classList.remove('flipped', 'falling', 'dancing-final');
        this.dkImage.classList.add('visible', 'swinging');
        
        // Play OKAY sound
        this.okayAudio.currentTime = 0;
        this.okayAudio.play().catch(error => {
            console.error('Could not play OKAY sound:', error);
        });
        
        console.log('🎬 Starting DK intro animation!');
        
        // Start from the second frame since we already set the first
        this.currentIntroIndex = 1;
        
        // Start intro frame animation
        this.animationInterval = setInterval(() => {
            this.nextIntroFrame();
        }, this.swingFrameRate);
    }
    
    nextIntroFrame() {
        if (this.currentIntroIndex >= this.introSequence.length) {
            // Intro complete, start main dance
            this.finishIntro();
            return;
        }
        
        const frameNumber = this.introSequence[this.currentIntroIndex];
        const paddedFrameNumber = frameNumber.toString().padStart(2, '0');
        this.dkImage.src = `sprite_sheet/dk_swing/swing_dk-export_${paddedFrameNumber}.png`;
        
        // Check if we've reached frame 28 - start falling animation!
        if (frameNumber >= 28 && !this.fallingStarted) {
            this.fallingStarted = true;
            this.isFalling = true;
            console.log('🎯 Frame 28 reached! DK starts falling!');
            
            // Start falling animation by changing classes
            this.dkImage.classList.remove('swinging');
            this.dkImage.classList.add('falling');
            
            // Set initial falling position (at top using translateY)
            this.dkImage.style.transform = this.dkImage.classList.contains('flipped') ? 
                'scale(-4, 4) translateY(-10vh)' : 'scale(4) translateY(-10vh)';
            
            // Trigger falling animation to center position
            setTimeout(() => {
                this.dkImage.style.transform = this.dkImage.classList.contains('flipped') ? 
                    'scale(-4, 4) translateY(0)' : 'scale(4) translateY(0)';
            }, 50); // Small delay to ensure transition works
        }
        
        // Check if we've reached frame 36 - transition to final dance position!
        if (frameNumber >= 36 && this.isFalling) {
            this.isFalling = false;
            console.log('🎯 Frame 36 reached! DK reaches final dance position!');
            
            // Transition to final dance position
            this.dkImage.classList.remove('falling');
            this.dkImage.classList.add('dancing-final');
            
            // Clear inline styles
            this.dkImage.style.transform = '';
        }
        
        // Check if we've reached frame 40 - start music and bouncing!
        if (frameNumber >= 40 && !this.musicStarted) {
            this.musicStarted = true;
            console.log('🎵 Frame 40 reached! Starting music and bounce effect!');
            
            // Start the music
            this.audio.play().then(() => {
                console.log('🎵 DK Rap is playing during swing! 🎵');
                document.body.classList.add('music-playing');
                document.body.classList.add('dancing'); // Add bouncing effect
            }).catch((error) => {
                console.error('Failed to play audio:', error);
            });
        }
        
        this.currentIntroIndex++;
    }
    
    finishIntro() {
        this.isPlayingIntro = false;
        
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
        }
        
        console.log('🎬 Intro complete! Switching to main dance animation...');
        
        // Clean up intro state
        this.isFalling = false;
        this.fallingStarted = false;
        
        // Ensure DK is in final dance position
        this.dkImage.classList.remove('swinging', 'falling');
        this.dkImage.classList.add('dancing-final');
        this.dkImage.style.transform = ''; // Clear any inline styles
        
        // Switch to dance animation
        this.currentFrame = 1;
        this.currentMove = 'handsOut'; // Start with hands out move
        this.fingerPointDirection = 'forward'; // Initialize finger point direction
        this.moveStartTime = Date.now(); // Initialize move timing
        this.dkImage.src = `sprite_sheet/dk_dance/dkc_dk_dance_sheet_01.png`;
        
        // Start the dance frame cycling (music should already be playing)
        if (this.musicStarted) {
            // Music already started at frame 40, just start dance frame cycling
            this.startDancing();
        } else {
            // Fallback: start music if it somehow didn't start
            this.audio.play().then(() => {
                console.log('🎵 DK Rap is playing! 🎵');
                document.body.classList.add('music-playing');
                document.body.classList.add('dancing');
                this.startDancing();
            }).catch((error) => {
                console.error('Failed to play audio:', error);
                this.resetButtons();
            });
        }
    }
    
    init() {
        // Set up event listeners
        this.playButton.addEventListener('click', () => this.startDanceParty());
        this.pauseButton.addEventListener('click', () => this.pauseMusic());
        this.resumeButton.addEventListener('click', () => this.resumeMusic());
        
        // Debug slider setup
        this.setupDebugSlider();
        
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
    
    setupDebugSlider() {
        this.speedSlider = document.getElementById('dance-speed-slider');
        this.speedDisplay = document.getElementById('speed-display');
        
        if (this.speedSlider && this.speedDisplay) {
            // Update display and frame rate when slider changes
            this.speedSlider.addEventListener('input', (e) => {
                this.updateDanceSpeed(parseInt(e.target.value));
            });
            
            console.log('🎚️ Debug slider initialized! Current speed: ' + this.frameRate + 'ms');
        }
    }
    
    updateDanceSpeed(newFrameRate) {
        this.frameRate = newFrameRate;
        this.speedDisplay.textContent = newFrameRate + 'ms';
        
        // If currently dancing, restart the animation with new speed
        if (this.isAnimating && !this.isPlayingIntro) {
            if (this.animationInterval) {
                clearInterval(this.animationInterval);
                this.animationInterval = null;
            }
            
            // Restart with new frame rate
            this.animationInterval = setInterval(() => {
                this.nextFrame();
            }, this.frameRate);
        }
        
        console.log('🎚️ Dance speed updated to: ' + newFrameRate + 'ms');
    }
    
    startDanceParty() {
        this.playButton.style.display = 'none';
        this.pauseButton.style.display = 'inline-block';
        this.resumeButton.style.display = 'none';
        
        // Start with intro animation instead of going directly to dance
        this.playIntroAnimation();
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
        this.isPlayingIntro = false;
        this.isFalling = false;
        this.fallingStarted = false;
        
        document.body.classList.remove('dancing', 'music-playing');
        
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
        }
        
        // Clean up all DK positioning classes
        this.dkImage.classList.remove('swinging', 'falling', 'dancing-final', 'visible');
        this.dkImage.style.transform = ''; // Clear any inline styles
        
        this.resetButtons();
        console.log('Dance party over!');
    }
    
    nextFrame() {
        const currentTime = Date.now();
        const timeSinceLastSwitch = currentTime - this.moveStartTime;
        const canSwitch = timeSinceLastSwitch >= this.minMoveDuration;
        const mustSwitch = timeSinceLastSwitch >= this.maxMoveDuration;
        
        // Handle move switching logic
        if (this.currentMove === 'handsOut' || this.currentMove === 'handsOutFlipped') {
            this.currentFrame++;
            
            // If we reach the end of hands out move, decide what to do
            if (this.currentFrame > this.handsOutRange.end) {
                if (mustSwitch || (canSwitch && Math.random() < 0.3)) {
                    // Time to switch moves
                    const random = Math.random();
                    if (random < 0.5) { // Switch to finger point
                        this.switchToMove('fingerPoint');
                        this.fingerPointDirection = 'forward';
                        this.currentFrame = this.fingerPointRange.start; // Start at frame 11
                    } else if (this.currentMove === 'handsOut') { // Flip hands out
                        this.switchToMove('handsOutFlipped');
                        this.currentFrame = this.handsOutRange.start; // Loop back to frame 1
                    } else { // Unflip hands out
                        this.switchToMove('handsOut');
                        this.currentFrame = this.handsOutRange.start; // Loop back to frame 1
                    }
                } else {
                    // Continue current move
                    this.currentFrame = this.handsOutRange.start; // Loop back to frame 1
                }
            }
        } 
        else if (this.currentMove === 'fingerPoint') {
            // Handle forward/reverse finger point animation
            if (this.fingerPointDirection === 'forward') {
                this.currentFrame++;
                if (this.currentFrame > this.fingerPointRange.end) {
                    // Switch to reverse
                    this.fingerPointDirection = 'reverse';
                    this.currentFrame = this.fingerPointRange.end; // Start reverse from end
                }
            } else { // reverse
                this.currentFrame--;
                if (this.currentFrame < this.fingerPointRange.start) {
                    // Completed full forward+reverse cycle
                    if (mustSwitch || (canSwitch && Math.random() < 0.3)) {
                        // Switch to hands out move
                        const random = Math.random();
                        if (random < 0.5) {
                            this.switchToMove('handsOut');
                        } else {
                            this.switchToMove('handsOutFlipped');
                        }
                        this.currentFrame = this.handsOutRange.start; // Start at frame 1
                    } else {
                        // Continue finger point - start forward again
                        this.fingerPointDirection = 'forward';
                        this.currentFrame = this.fingerPointRange.start;
                    }
                }
            }
        }
        
        // Update flip styling
        this.updateFlipStyling();
        
        // Update the image source with zero-padded frame number
        const frameNumber = this.currentFrame.toString().padStart(2, '0');
        this.dkImage.src = `sprite_sheet/dk_dance/dkc_dk_dance_sheet_${frameNumber}.png`;
    }
    
    switchToMove(newMove) {
        const oldMove = this.currentMove;
        this.currentMove = newMove;
        this.moveStartTime = Date.now();
        console.log(`🕺 Switching from ${oldMove} to ${newMove}!`);
        
        // Immediately update flip styling when switching moves
        this.updateFlipStyling();
    }
    
    updateFlipStyling() {
        if (this.currentMove === 'handsOutFlipped') {
            this.dkImage.classList.add('flipped');
            console.log('🔄 DK is now flipped (facing left)!');
        } else {
            this.dkImage.classList.remove('flipped');
            if (this.currentMove === 'handsOut') {
                console.log('🔄 DK is now facing right!');
            }
        }
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
        
        // Pause all creatures and bananas
        this.beaver.pauseAll();
        this.bee.pauseAll();
        window.BananaAnimation.pauseBananaAnimation();
        console.log('🎵 All animations paused!');
    }
    
    resumeMusic() {
        this.audio.play();
        this.pauseButton.style.display = 'inline-block';
        this.resumeButton.style.display = 'none';
        this.startDancing();
        
        // Resume all creatures and bananas
        this.beaver.resumeAll();
        this.bee.resumeAll();
        window.BananaAnimation.resumeBananaAnimation();
        console.log('🎵 All animations resumed!');
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
