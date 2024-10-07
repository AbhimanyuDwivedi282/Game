const suits = ['♥', '♦', '♠', '♣'];
const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
let selectedCards = [];
let playerGuesses = [];
let cardPool = [];
let level = 2; // Start with 2 cards to identify

const gameArea = document.getElementById('game-area');
const statusDiv = document.getElementById('status');
const tryAgainBtn = document.getElementById('try-again');

// Helper function to get a random card
function getRandomCard() {
    const suit = suits[Math.floor(Math.random() * suits.length)];
    const rank = ranks[Math.floor(Math.random() * ranks.length)];
    return `${rank}${suit}`;
}

// Generate random unique cards
function generateUniqueCards(num, exclude = []) {
    const cards = new Set(exclude);
    while (cards.size < num + exclude.length) {
        cards.add(getRandomCard());
    }
    return Array.from(cards);
}

// Show selected cards for the player to remember
function showSelectedCards() {
    selectedCards = generateUniqueCards(level);
    statusDiv.innerText = `Memorize these cards!`;
    gameArea.innerHTML = '';
    selectedCards.forEach(card => {
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('card');
        cardDiv.innerText = card;
        gameArea.appendChild(cardDiv);
    });
    setTimeout(startGuessingPhase, 10000); // Show for 10 seconds
}

// Start the guessing phase
function startGuessingPhase() {
    statusDiv.innerText = `Now identify the cards you saw!`;
    
    // Generate random cards, ensuring the initially selected cards are included
    const randomCards = generateUniqueCards(10 - selectedCards.length, selectedCards);
    cardPool = shuffleArray(selectedCards.concat(randomCards)); // Shuffle the pool with selected cards included

    gameArea.innerHTML = '';
    cardPool.forEach(card => {
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('card');
        cardDiv.innerText = card;
        cardDiv.addEventListener('click', () => makeGuess(card, cardDiv));
        gameArea.appendChild(cardDiv);
    });
}

// Handle player guess
function makeGuess(card, cardDiv) {
    if (playerGuesses.includes(card)) return; // Avoid duplicate guesses

    if (selectedCards.includes(card)) {
        cardDiv.style.backgroundColor = 'lightgreen';
        playerGuesses.push(card);
        if (playerGuesses.length === selectedCards.length) {
            levelUp();
        }
    } else {
        cardDiv.style.backgroundColor = 'lightcoral';
        endGame(false);
    }
}

// Increase difficulty by adding more cards to identify
function levelUp() {
    statusDiv.innerText = `You identified all the cards! Next level!`;
    setTimeout(() => {
        playerGuesses = [];
        level += 1;
        showSelectedCards();
    }, 2000);
}

// End the game
function endGame(won) {
    statusDiv.innerText = won ? 'You Won!' : 'You Lost!';
    tryAgainBtn.style.display = 'block';
}

// Shuffle an array (Fisher-Yates Shuffle)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Restart the game
function restartGame() {
    playerGuesses = [];
    level = 2;
    tryAgainBtn.style.display = 'none';
    showSelectedCards();
}

// Event listeners
tryAgainBtn.addEventListener('click', restartGame);

// Start the game
showSelectedCards();
