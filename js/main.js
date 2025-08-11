// Main initialization module
// Initialize when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Initialize banana styles first
    window.BananaAnimation.initializeBananaStyles();
    
    // Create instances of all controllers
    const beaver = new window.BeaverWalker();
    const bee = new window.BeeFlyer();
    const dancer = new window.DKDancer(beaver, bee); // Pass creature controllers to dancer
    
    // Start banana dropping interval
    window.BananaAnimation.startBananaAnimation();
    
    // Add some fun console messages
    console.log('🍌 Welcome to DK\'s Dance Party! 🍌');
    console.log('🎮 Controls:');
    console.log('   • Click the button or press SPACEBAR to start/pause');
    console.log('   • Arrow UP/DOWN to change dance speed');
    console.log('   • Get ready to rap with DK! 🎤');
    console.log('🦫 Watch for beavers occasionally walking by!');
    console.log('🐝 And bees buzzing overhead in sine waves!');
});
