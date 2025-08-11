// Lyrics Display Controller
window.LyricsDisplay = class LyricsDisplay {
    constructor() {
        this.lyricsContainer = document.getElementById('lyrics-container');
        this.lyricsContent = document.getElementById('lyrics-content');
        this.lyricsSlider = null; // Will be created
        this.lyricsToggle = null; // Will be created
        
        this.isVisible = false;
        this.isAutoScrolling = false;
        this.isPaused = false;
        
        // Scroll position tracking (0-1 range)
        this.scrollPosition = 0;
        this.autoScrollSpeed = 0.00005; // Half the speed - even slower auto-scroll
        this.animationFrame = null;
        
        this.createLyricsControls();
        this.loadLyrics();
        this.setupEventListeners();
    }
    
    createLyricsControls() {
        console.log('📜 Creating lyrics controls...');
        
        // Create controls container
        const controlsContainer = document.createElement('div');
        controlsContainer.id = 'lyrics-controls';
        controlsContainer.className = 'lyrics-controls';
        
        // Create toggle button
        this.lyricsToggle = document.createElement('button');
        this.lyricsToggle.id = 'lyrics-toggle';
        this.lyricsToggle.className = 'lyrics-toggle';
        this.lyricsToggle.innerHTML = '📜';
        this.lyricsToggle.title = 'Toggle Lyrics';
        
        // Create slider container
        const sliderContainer = document.createElement('div');
        sliderContainer.className = 'lyrics-slider-container';
        
        // Create scroll slider
        this.lyricsSlider = document.createElement('input');
        this.lyricsSlider.type = 'range';
        this.lyricsSlider.id = 'lyrics-slider';
        this.lyricsSlider.className = 'lyrics-slider';
        this.lyricsSlider.min = '0';
        this.lyricsSlider.max = '100';
        this.lyricsSlider.value = '0';
        this.lyricsSlider.title = 'Scroll through lyrics';
        
        // Create auto-scroll toggle
        const autoScrollToggle = document.createElement('button');
        autoScrollToggle.id = 'auto-scroll-toggle';
        autoScrollToggle.className = 'auto-scroll-toggle';
        autoScrollToggle.innerHTML = 'PAUSE';
        autoScrollToggle.title = 'Toggle auto-scroll';
        
        // Assemble controls
        sliderContainer.appendChild(this.lyricsSlider);
        sliderContainer.appendChild(autoScrollToggle);
        controlsContainer.appendChild(this.lyricsToggle);
        controlsContainer.appendChild(sliderContainer);
        
        // Add to page
        document.querySelector('.container').appendChild(controlsContainer);
        
        // Store auto-scroll toggle for later use
        this.autoScrollToggle = autoScrollToggle;
    }
    
    setupEventListeners() {
        // Toggle lyrics visibility
        this.lyricsToggle.addEventListener('click', () => {
            this.toggleVisibility();
        });
        
        // Manual scroll slider
        this.lyricsSlider.addEventListener('input', (e) => {
            this.scrollPosition = parseInt(e.target.value) / 100;
            this.updateLyricsPosition();
        });
        
        // Auto-scroll toggle
        this.autoScrollToggle.addEventListener('click', () => {
            this.toggleAutoScroll();
        });
        
        // Handle orientation change - preserve scroll position
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.updateLyricsPosition();
            }, 100);
        });
        
        // Handle resize - preserve scroll position
        window.addEventListener('resize', () => {
            this.updateLyricsPosition();
        });
    }
    
    loadLyrics() {
        console.log('📜 Loading lyrics...');
        
        // Use the lyrics from the external file for better formatting
        const lyricsText = `[Intro]
He-he-here we go!

So they're finally here, performing for you
If you know the words, you can join in too
Put your hands together, if you want to clap
As we take you through this monkey rap!
Huh!

[Chorus]
DK
Donkey Kong!

[Verse 1]
He's the leader of the bunch, you know him well
He's finally back to kick some tail
His coconut gun can fire in spurts
If he shoots ya, it's gonna hurt!
He's bigger, faster, and stronger too
He's the first member of the DK crew!
Huh!

[Chorus]
DK
Donkey Kong!
DK
Donkey Kong is here!

[Verse 2]
This Kong's got style, so listen up dudes
She can shrink in size, to suit her mood
She's quick and nimble when she needs to be
She can float through the air and climb up trees!
If you choose her, you'll not choose wrong
With a skip and a hop, she's one cool Kong!
Huh!

[Chorus]
DK
Donkey Kong!

[Verse 3]
He has no style, he has no grace
Th-this Kong has a funny face
He can handstand when he needs to
And stretch his arms out, just for you
Inflate himself just like a balloon
This crazy Kong just digs this tune!
Huh!

[Chorus]
DK
Donkey Kong!
DK
Donkey Kong is here!

[Verse 4]
He's back again and about time too
And this time he's in the mood
He can fly real high with his jetpack on
With his pistols out, he's one tough Kong!
He'll make you smile when he plays his tune
But Kremlings beware 'cause he's after you!
Huh!

[Chorus]
DK
Donkey Kong!
Huh!

[Verse 5]
Finally, he's here for you
It's the last member of the DK crew!
This Kong's so strong, it isn't funny
Can make a Kremling cry out for mummy
Can pick up a boulder with relative ease
Makes crushing rocks seem such a breeze
He may move slow, he can't jump high
But this Kong's one hell of a guy!

[Skit]
C'mon Cranky, take it to the fridge!

[Outro]
Walnuts, peanuts, pineapple smells
Grapes, melons, oranges and coconut shells
Aww yeah!
Walnuts, peanuts, pineapple smells
Grapes, melons, oranges and coconut shells
Aww yeah!`;

        this.lyricsContent.textContent = lyricsText;
        console.log('📜 Lyrics loaded successfully!');
    }
    
    updateLyricsPosition() {
        // Calculate the scroll position based on content height and viewport
        const containerHeight = this.lyricsContainer.offsetHeight;
        const contentHeight = this.lyricsContent.offsetHeight;
        const totalScrollDistance = contentHeight + containerHeight;
        
        // Calculate top position: start below viewport, end above viewport
        const startPosition = containerHeight;
        const endPosition = -contentHeight;
        const currentPosition = startPosition + (endPosition - startPosition) * this.scrollPosition;
        
        this.lyricsContent.style.top = `${currentPosition}px`;
        
        // Update slider if not currently being dragged
        if (document.activeElement !== this.lyricsSlider) {
            this.lyricsSlider.value = Math.round(this.scrollPosition * 100);
        }
    }
    
    toggleVisibility() {
        this.isVisible = !this.isVisible;
        
        if (this.isVisible) {
            this.lyricsContainer.classList.add('visible');
            this.lyricsToggle.innerHTML = '❌';
            this.lyricsToggle.title = 'Hide Lyrics';
            console.log('📜 Lyrics shown');
        } else {
            this.lyricsContainer.classList.remove('visible');
            this.lyricsToggle.innerHTML = '📜';
            this.lyricsToggle.title = 'Show Lyrics';
            console.log('📜 Lyrics hidden');
        }
    }
    
    toggleAutoScroll() {
        this.isAutoScrolling = !this.isAutoScrolling;
        
        if (this.isAutoScrolling) {
            this.autoScrollToggle.innerHTML = 'PAUSE';
            this.autoScrollToggle.title = 'Pause auto-scroll';
            this.startAutoScroll();
            console.log('📜 Auto-scroll started');
        } else {
            this.autoScrollToggle.innerHTML = 'PLAY';
            this.autoScrollToggle.title = 'Start auto-scroll';
            this.stopAutoScroll();
            console.log('📜 Auto-scroll paused');
        }
    }
    
    startAutoScroll() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        
        const animate = () => {
            if (this.isAutoScrolling && this.scrollPosition < 1) {
                this.scrollPosition += this.autoScrollSpeed;
                if (this.scrollPosition > 1) this.scrollPosition = 1;
                this.updateLyricsPosition();
            }
            
            if (this.isAutoScrolling) {
                this.animationFrame = requestAnimationFrame(animate);
            }
        };
        
        this.animationFrame = requestAnimationFrame(animate);
    }
    
    stopAutoScroll() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
    }
    
    // Legacy methods for compatibility with existing code
    startScrolling() {
        console.log('📜 Starting lyrics with auto-scroll...');
        if (!this.isVisible) {
            this.toggleVisibility();
        }
        if (!this.isAutoScrolling) {
            this.toggleAutoScroll();
        }
    }
    
    pauseScrolling() {
        console.log('📜 Pausing auto-scroll...');
        if (this.isAutoScrolling) {
            this.toggleAutoScroll();
        }
    }
    
    resumeScrolling() {
        console.log('📜 Resuming auto-scroll...');
        if (!this.isAutoScrolling) {
            this.toggleAutoScroll();
        }
    }
    
    stopScrolling() {
        console.log('📜 Stopping lyrics...');
        this.stopAutoScroll();
        if (this.isVisible) {
            this.toggleVisibility();
        }
        this.scrollPosition = 0;
        this.updateLyricsPosition();
    }
    
    reset() {
        this.stopScrolling();
    }
}
