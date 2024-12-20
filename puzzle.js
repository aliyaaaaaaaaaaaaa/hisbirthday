const startButton = document.getElementById("startButton");
const resetButton = document.getElementById("resetButton");
const heartLink = document.getElementById("heartLink"); // Reference to the heart link
const puzzle = document.getElementById("puzzle");
const tiles = Array.from(puzzle.getElementsByClassName("tile"));
const gameArea = document.getElementById("gameArea");
const intro = document.getElementById("intro");
const message = document.getElementById("message");
let emptyIndex = 8; // The empty space index (start at the last tile)

// Swipe gesture variables
let touchStartX = 0;
let touchStartY = 0;

startButton.addEventListener("click", startGame);
resetButton.addEventListener("click", resetGame);

// Listen for 'y' key press for cheat code
document.addEventListener("keydown", function (event) {
    if (event.key === 'y') {
        solvePuzzle(); // Call the function to solve the puzzle
        message.textContent = "You Win! (Cheat Code)";
        resetButton.style.display = "block";
        // Heart link remains visible even after cheat code
    }
});

// Function to start the game
function startGame() {
    intro.style.display = "none";
    gameArea.style.display = "block";
    heartLink.style.display = "block";
    shufflePuzzle(); // Start the game by shuffling the tiles
}

// Function to reset the game
function resetGame() {
    shufflePuzzle();
    message.textContent = "";
    resetButton.style.display = "none";
    heartLink.style.display = "block";
    // Heart link remains visible, no change in its visibility
}

// Function to shuffle the puzzle tiles
function shufflePuzzle() {
    let shuffledTiles = Array.from({ length: 9 }, (_, i) => i);

    // Randomly shuffle tiles using Fisher-Yates shuffle algorithm
    for (let i = 8; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));
        [shuffledTiles[i], shuffledTiles[randomIndex]] = [shuffledTiles[randomIndex], shuffledTiles[i]];
    }

    // Apply shuffled values to tiles
    shuffledTiles.forEach((index, i) => {
        tiles[i].innerText = index === 8 ? "" : (index + 1).toString(); // Make last tile empty
        tiles[i].classList.toggle("empty", index === 8); // Apply empty class for the empty tile
    });

    // Update the empty index
    emptyIndex = shuffledTiles.indexOf(8);

    // Log the empty index to ensure it's correctly set
    console.log("Empty index after shuffle:", emptyIndex);

    // Update click listeners for tiles after shuffle
    tiles.forEach((tile, index) => {
        if (tile.classList.contains("empty")) return; // Skip the empty tile
        tile.removeEventListener("click", tileClickListener); // Remove old listener if any
        tile.addEventListener("click", tileClickListener(index)); // Add new listener
    });
}

// Tile click listener function
function tileClickListener(tileIndex) {
    return () => {
        moveTile(tileIndex);
    };
}

// Function to move a tile
function moveTile(tileIndex) {
    const tile = tiles[tileIndex];

    // Log the move attempt
    console.log(`Tile clicked: ${tileIndex}, Empty index: ${emptyIndex}`);

    // Check if the tile is adjacent to the empty space
    if (isAdjacentToEmpty(tileIndex)) {
        // Move the tile into the empty space
        tiles[emptyIndex].classList.remove("empty");
        tile.classList.add("empty");

        // Swap their positions
        tiles[emptyIndex].innerText = tile.innerText;
        tile.innerText = "";

        // Update empty space index
        emptyIndex = tileIndex;

        // Check if the puzzle is solved
        if (isSolved()) {
            setTimeout(() => {
                message.textContent = "You Win!";
                message.style.display = "block"; // Make the win message visible
                resetButton.style.display = "block";
                // Heart link stays visible after winning
            }, 200);
        }
    } else {
        console.log(`Tile at index ${tileIndex} is not adjacent to empty space.`);
    }
}

// Check if a tile is adjacent to the empty space
function isAdjacentToEmpty(index) {
    const rowIndex = Math.floor(index / 3);
    const colIndex = index % 3;
    const emptyRowIndex = Math.floor(emptyIndex / 3);
    const emptyColIndex = emptyIndex % 3;

    // Check if the tile is adjacent to the empty space (in the same row or column)
    if (Math.abs(rowIndex - emptyRowIndex) + Math.abs(colIndex - emptyColIndex) === 1) {
        return true;
    }

    return false;
}

// Check if the puzzle is solved (tiles in order 1-8, last one empty)
function isSolved() {
    return tiles.every((tile, index) => {
        if (index === 8) return tile.innerText === ""; // The last spot should be empty
        return tile.innerText === (index + 1).toString(); // Tiles should be in order from 1 to 8
    });
}

// Function to solve the puzzle (for cheat code)
function solvePuzzle() {
    tiles.forEach((tile, index) => {
        if (index !== 8) {
            tile.innerText = (index + 1).toString(); // Set tiles to be in order
            tile.classList.remove("empty");
        } else {
            tile.innerText = ""; // Empty the last tile
            tile.classList.add("empty");
        }
    });

    emptyIndex = 8; // Reset the empty tile index
    message.textContent = "You Win!";
    resetButton.style.display = "block";
    // Heart link remains visible after cheat code is triggered
}

// Touch event listeners for swipe movements (for iPad and other touch devices)
puzzle.addEventListener("touchstart", handleTouchStart, false);
puzzle.addEventListener("touchmove", handleTouchMove, false);
puzzle.addEventListener("touchend", handleTouchEnd, false);

// Function to handle the touch start event
function handleTouchStart(event) {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
}

// Function to handle the touch move event
function handleTouchMove(event) {
    touchEndX = event.touches[0].clientX;
    touchEndY = event.touches[0].clientY;
}

// Function to handle the touch end event
function handleTouchEnd(event) {
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    // If the swipe is significant enough
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
            // Swipe right
            moveTileRight();
        } else {
            // Swipe left
            moveTileLeft();
        }
    } else if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 50) {
        if (deltaY > 0) {
            // Swipe down
            moveTileDown();
        } else {
            // Swipe up
            moveTileUp();
        }
    }
}

// Function to move the tile right
function moveTileRight() {
    const targetIndex = emptyIndex - 1;
    if (emptyIndex % 3 !== 0 && isAdjacentToEmpty(targetIndex)) {
        moveTile(targetIndex);
    }
}

// Function to move the tile left
function moveTileLeft() {
    const targetIndex = emptyIndex + 1;
    if (emptyIndex % 3 !== 2 && isAdjacentToEmpty(targetIndex)) {
        moveTile(targetIndex);
    }
}

// Function to move the tile up
function moveTileUp() {
    const targetIndex = emptyIndex + 3;
    if (emptyIndex < 6 && isAdjacentToEmpty(targetIndex)) {
        moveTile(targetIndex);
    }
}

// Function to move the tile down
function moveTileDown() {
    const targetIndex = emptyIndex - 3;
    if (emptyIndex >= 3 && isAdjacentToEmpty(targetIndex)) {
        moveTile(targetIndex);
    }
}
