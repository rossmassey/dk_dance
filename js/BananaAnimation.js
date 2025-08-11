// Banana Animation Module
window.BananaAnimation = (function() {
    let bananaInterval = null;

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

    // Initialize the falling animation styles
    function initializeBananaStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fall {
            to {
                transform: translateY(calc(100vh + 50px)) rotate(360deg);
            }
        }
    `;
    document.head.appendChild(style);
}

    // Banana animation control functions
    function startBananaAnimation() {
    if (bananaInterval) return; // Already running
    
    bananaInterval = setInterval(() => {
        if (document.body.classList.contains('music-playing') && Math.random() < 0.3) {
            createBanana();
        }
    }, 1000);
}

    function pauseBananaAnimation() {
    if (bananaInterval) {
        clearInterval(bananaInterval);
        bananaInterval = null;
        console.log('🍌 Banana animation paused!');
    }
}

    function resumeBananaAnimation() {
        startBananaAnimation();
        console.log('🍌 Banana animation resumed!');
    }

    // Return public API
    return {
        createBanana,
        initializeBananaStyles,
        startBananaAnimation,
        pauseBananaAnimation,
        resumeBananaAnimation
    };
})();
