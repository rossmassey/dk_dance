// Lyrics Display Controller
window.LyricsDisplay = class LyricsDisplay {
    constructor() {
        this.lyricsContainer = document.getElementById('lyrics-container');
        this.lyricsContent = document.getElementById('lyrics-content');
        this.isVisible = false;
        this.isScrolling = false;
        this.isPaused = false;
        
        this.loadLyrics();
    }
    
    loadLyrics() {
        console.log('📜 Loading lyrics...');
        
        // Embedded lyrics content
        const lyricsText = `
Here, here, here we go!

So they're finally here, performing for you
If you know the words, you can join in too
Put your hands together, if you want to clap
As we take you through this monkey rap!
Huh!

DK! Donkey Kong!

He's the leader of the bunch, you know him well
He's finally back to kick some tail
His Coconut Gun can fire in spurts
If he shoots ya, it's gonna hurt!
He's bigger, faster, and stronger too
He's the first member of the D.K. crew!
Huh!

DK! Donkey Kong!
DK! Donkey Kong is here!

(Here we go)
This Kong's got style, so listen up, dudes
She can shrink in size, to suit her mood
She's quick and nimble when she needs to be
She can float through the air and climb up trees!
If you choose her, you'll not choose wrong
With a skip and a hop, she's one cool Kong!
Huh!

DK! Donkey Kong!

He has no style, he has no grace
This Kong has a funny face
He can handstand when he needs to
And stretch his arms out, just for you
Inflate himself just like a balloon
This crazy Kong just digs this tune!
Huh!

DK! Donkey Kong!
DK! Donkey Kong is here!

He's back again and about time too
And this time he's in the mood
He can fly real high with his jetpack on
With his pistols out, he's one tough Kong!
He'll make you smile when he plays his tune
But Kremlings beware 'cause he's after you!
Huh!

DK! Donkey Kong!
Huh!

Finally, he's here for you
It's the last member of the D.K. crew!
This Kong's so strong, it isn't funny
Can make a Kremling cry out for mummy
Can pick up a boulder with relative ease
Makes crushing rocks seem such a breeze
He may move slow, he can't jump high
But this Kong's one hell* of a guy!

Huh!

Come on, Cranky, take it to the fridge!

Walnuts, peanuts, pineapple smells,
grapes, melons, oranges, and coconut shells!
(Ahh, yeah!)

Walnuts, peanuts, pineapple smells,
Grapes, melons, oranges, and coconut shells!
(Ahh, yeah!)`;

        this.lyricsContent.textContent = lyricsText;
        console.log('📜 Lyrics loaded successfully!');
    }
    
    startScrolling() {
        if (this.isScrolling) return;
        
        console.log('📜 Starting lyrics scroll...');
        this.isScrolling = true;
        this.isPaused = false;
        
        // Show the lyrics container
        this.lyricsContainer.classList.add('visible');
        this.isVisible = true;
        
        // Reset position and start scrolling
        this.lyricsContent.classList.remove('paused');
        this.lyricsContent.style.top = '85vh'; // Start higher up to simulate 15 seconds already elapsed
        
        // Small delay to ensure position is reset before starting animation
        setTimeout(() => {
            this.lyricsContent.classList.add('scrolling');
        }, 50);
    }
    
    pauseScrolling() {
        if (!this.isScrolling) return;
        
        console.log('📜 Pausing lyrics scroll...');
        this.isPaused = true;
        this.lyricsContent.classList.add('paused');
    }
    
    resumeScrolling() {
        if (!this.isScrolling || !this.isPaused) return;
        
        console.log('📜 Resuming lyrics scroll...');
        this.isPaused = false;
        this.lyricsContent.classList.remove('paused');
    }
    
    stopScrolling() {
        console.log('📜 Stopping lyrics scroll...');
        this.isScrolling = false;
        this.isPaused = false;
        
        // Hide the lyrics container
        this.lyricsContainer.classList.remove('visible');
        this.isVisible = false;
        
        // Reset the animation
        this.lyricsContent.classList.remove('scrolling', 'paused');
        this.lyricsContent.style.top = '85vh'; // Reset to new starting position
    }
    
    reset() {
        this.stopScrolling();
    }
}
