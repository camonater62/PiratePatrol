/** @type {import("../typings/phaser")} */

/*
Cameron West, Pirate Patrol
4/17/2022
Total time: ~10 hours

Point Breakdown:

Total Points: 115
#  Starting Tier
- [X]    Track a high score that persists across scenes and display it in the UI (5)
- [X]    Add your own (copyright-free) background music to the Play scene (5)
- [X]    Implement the speed increase that happens after 30 seconds in the original game (5)
- [X]    Create a new scrolling tile sprite for the background (5)
- [X]    Allow the player to control the Rocket after it's fired (5)
# Novice Tier
- [X]    Display the time remaining (in seconds) on the screen (10)
- [X]    Create a new title screen (e.g., new artwork, typography, layout) (10) (Covered by higher tier)
# Intermediate Tier
- [X]    Create new artwork for all of the in-game assets (rocket, spaceships, explosion) (20) (Covered by higher tier)
- [X]    Implement a new timing/scoring mechanism that adds time to the clock for successful hits (20)
# S(hrek) Tier
- [X]    Redesign the game's artwork, UI, and sound to change its theme/aesthetic (to something other than sci-fi) (60)
*/

let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    scene: [Menu, Play],
    fps: 60,
};

let highScore = localStorage.getItem('highScore');
if (highScore === null) {
    highScore = 0;
}

let game = new Phaser.Game(config);

// set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

// reserve keyboard vars
let keyF, keyR, keyLEFT, keyRIGHT;