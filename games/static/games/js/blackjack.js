document.addEventListener('DOMContentLoaded', function() {
    // Game state
    let deck;
    let playerHand = [];
    let dealerHand = [];
    let currentBet = 0;
    let playerScore = 0;
    let dealerScore = 0;
    let playerSouls = parseInt(localStorage.getItem('souls') || 1000);
    let gameInProgress = false;
    let playerStood = false;
    let playerBusted = false;
    let dealerBusted = false;

    // DOM elements
    const playerCardsElement = document.querySelector('.player-cards');
    const dealerCardsElement = document.querySelector('.dealer-cards');
    const statusMessageElement = document.querySelector('.status-message');
    const betButtons = document.querySelectorAll('.bet-btn');
    const hitButton = document.querySelector('.hit-btn');
    const standButton = document.querySelector('.stand-btn');
    const dealButton = document.querySelector('.deal-btn');
    const betControls = document.querySelector('.bet-controls');
    
    // Update souls display
    function updateSoulsDisplay() {
        document.querySelector('.souls-count').textContent = playerSouls;
        
        // Disable bet buttons if player doesn't have enough souls
        betButtons.forEach(button => {
            const betAmount = parseInt(button.dataset.amount);
            button.disabled = betAmount > playerSouls;
        });
    }
    
    // Add score displays
    const playerScoreDisplay = document.createElement('div');
    playerScoreDisplay.className = 'score-display player-score';
    playerScoreDisplay.textContent = '0';
    
    const dealerScoreDisplay = document.createElement('div');
    dealerScoreDisplay.className = 'score-display dealer-score';
    dealerScoreDisplay.textContent = '?';
    
    // Add score displays to the game
    document.querySelector('.player-area').prepend(playerScoreDisplay);
    document.querySelector('.dealer-area').prepend(dealerScoreDisplay);
    
    // Initialize the game
    function initGame() {
        // Create a new deck and shuffle it
        createNewDeck();
        
        // Set initial button states
        hitButton.disabled = true;
        standButton.disabled = true;
        dealButton.disabled = true;
        
        updateSoulsDisplay();
        
        // Add event listeners
        hitButton.addEventListener('click', handleHit);
        standButton.addEventListener('click', handleStand);
        dealButton.addEventListener('click', startNewHand);
        
        betButtons.forEach(button => {
            button.addEventListener('click', function() {
                const betAmount = parseInt(this.dataset.amount);
                placeBet(betAmount);
            });
        });
    }

    // Create a proper deck of cards that works like a real deck
    function createNewDeck() {
        console.log("Creating new deck");
        deck = [];
        // Use lowercase for suits to match SVG filenames
        const suits = ['heart', 'diamond', 'club', 'spade'];
        // These values match the SVG filenames (e.g., 'Ace', not 'ace')
        const values = ['Ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King'];
        
        // Create a complete deck of 52 cards
        for (const suit of suits) {
            for (const value of values) {
                deck.push({
                    suit: suit,
                    value: value
                });
            }
        }
        
        // Shuffle the deck
        shuffleDeck();
    }

    // Fisher-Yates shuffle algorithm for better randomization
    function shuffleDeck() {
        console.log("Shuffling deck");
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
    }

    // Draw a card from the deck
    function drawCard() {
        // If deck is empty, create and shuffle a new one
        if (deck.length === 0) {
            createNewDeck();
        }
        return deck.pop();
    }
    
    function placeBet(amount) {
        if (amount > playerSouls) {
            statusMessageElement.textContent = "You don't have enough souls to place that bet.";
            return;
        }
        
        currentBet = amount;
        playerSouls -= amount;
        updateSoulsDisplay();
        
        statusMessageElement.textContent = `Bet placed: ${amount} souls`;
        
        // Hide bet controls and enable deal button
        betControls.style.display = 'none';
        dealButton.disabled = false;
    }
    
    function startNewHand() {
        // Reset game state
        playerHand = [];
        dealerHand = [];
        playerScore = 0;
        dealerScore = 0;
        gameInProgress = true;
        playerStood = false;
        playerBusted = false;
        dealerBusted = false;
        
        // Clear cards
        playerCardsElement.innerHTML = '';
        dealerCardsElement.innerHTML = '';
        
        // Deal initial cards
        dealInitialCards();
        
        // Update UI
        updateScores();
        
        // Set button states
        hitButton.disabled = false;
        standButton.disabled = false;
        dealButton.disabled = true;
        
        // Check for blackjack on the initial deal
        checkForNaturalBlackjack();
    }
    
    function dealInitialCards() {
        // Deal cards in the correct order like a real blackjack game
        // First card to player (face up)
        const playerCard1 = drawCard();
        playerHand.push(playerCard1);
        displayCard(playerCard1, playerCardsElement);
        
        // First card to dealer (face up)
        const dealerCard1 = drawCard();
        dealerHand.push(dealerCard1);
        displayCard(dealerCard1, dealerCardsElement);
        
        // Second card to player (face up)
        const playerCard2 = drawCard();
        playerHand.push(playerCard2);
        displayCard(playerCard2, playerCardsElement);
        
        // Second card to dealer (face down)
        const dealerCard2 = drawCard();
        dealerHand.push(dealerCard2);
        displayCard(dealerCard2, dealerCardsElement, true);
    }
    
    function displayCard(card, container, faceDown = false) {
        // Create card element
        const cardElement = document.createElement('div');
        cardElement.className = 'card dealing';
        cardElement.style.display = 'inline-block'; // Force horizontal layout
        cardElement.style.float = 'none';           // Prevent vertical stacking
        
        // Add special animation delay based on card number to create a cascade effect
        const delay = container.children.length * 0.1;
        cardElement.style.animationDelay = `${delay}s`;
        
        if (!faceDown) {
            cardElement.dataset.suit = card.suit;
            cardElement.dataset.value = card.value;
            
            // Red cards (hearts and diamonds) get a subtle pulse effect
            if (card.suit === 'heart' || card.suit === 'diamond') {
                setTimeout(() => {
                    cardElement.style.animation = 'pulse 3s infinite';
                }, 500);
            }
            
            // Face cards (Jack, Queen, King) and Ace get a special glow
            if (card.value === 'Ace' || card.value === 'King' || card.value === 'Queen' || card.value === 'Jack') {
                setTimeout(() => {
                    cardElement.style.boxShadow = '0 0 10px rgba(255, 0, 0, 0.8)';
                }, 500);
            }
        }
        
        // For face-down cards, don't set data attributes to truly hide the value
        if (faceDown) {
            cardElement.classList.add('face-down');
            
            // Create a simple card back
            const back = document.createElement('div');
            back.className = 'card-back';
            cardElement.appendChild(back);
            
            container.appendChild(cardElement);
            return;
        }
        
        // Create front face (the actual card)
        const front = document.createElement('div');
        front.className = 'card-front';
        
        // Add SVG content to front
        // Convert the suit and value to match the SVG filename format
        // The filenames use format like spadeAce, heart10, etc.
        const svgFilename = `${card.suit}${card.value}.svg`;
        console.log(`Loading card: ${svgFilename}`);
        
        fetch(`/static/games/images/Vertical4/svgs/${svgFilename}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load SVG: ${response.statusText}`);
                }
                return response.text();
            })
            .then(svgContent => {
                front.innerHTML = svgContent;
                // Add infernal effects to SVG
                const svgElement = front.querySelector('svg');
                if (svgElement) {
                    // Add demonic effects to all cards
                    svgElement.style.filter = 'saturate(1.5) contrast(1.2)';
                    
                    // Add appropriate glow effects based on suit
                    if (card.suit === 'heart' || card.suit === 'diamond') {
                        // Red suits get a fiery effect
                        svgElement.style.filter = 'saturate(1.5) contrast(1.2) drop-shadow(0 0 10px rgba(255, 0, 0, 0.9))';
                        svgElement.querySelectorAll('path').forEach(path => {
                            path.style.filter = 'drop-shadow(0 0 6px #ff0000)';
                            path.style.animation = 'pulse 3s infinite alternate';
                        });
                    } else {
                        // Black suits get an ominous blue glow
                        svgElement.style.filter = 'saturate(1.5) contrast(1.3) drop-shadow(0 0 10px rgba(0, 0, 255, 0.6))';
                        svgElement.querySelectorAll('path').forEach(path => {
                            path.style.filter = 'drop-shadow(0 0 6px #ffffff)';
                        });
                    }
                    
                    // Special effects for face cards and aces (royal cards)
                    if (card.value === 'Ace' || card.value === 'King' || card.value === 'Queen' || card.value === 'Jack') {
                        svgElement.style.filter += ' brightness(1.3)';
                        
                        // Add an outer glow to the SVG
                        const royalColor = card.suit === 'heart' || card.suit === 'diamond' ? 
                            'rgba(255, 0, 0, 0.9)' : 'rgba(50, 50, 255, 0.9)';
                        cardElement.style.boxShadow = `0 0 20px ${royalColor}`;
                        
                        // Add subtle animation for royal cards
                        if (card.value === 'Ace') {
                            // Aces pulse with a stronger effect
                            cardElement.style.animation = 'pulse 2s infinite alternate';
                        }
                    }
                }
            })
            .catch(error => {
                console.error(`Error loading SVG ${svgFilename}:`, error);
                // Add a text fallback if the SVG fails to load
                front.innerHTML = `
                    <svg viewBox="0 0 100 140">
                        <rect width="100" height="140" rx="10" fill="#1a0000" stroke="#800000" stroke-width="2"/>
                        <text x="50" y="70" font-size="30" fill="${card.suit === 'heart' || card.suit === 'diamond' ? '#ff0000' : '#ffffff'}" 
                            text-anchor="middle" dominant-baseline="middle">
                            ${card.value}${card.suit === 'heart' ? '♥' : card.suit === 'diamond' ? '♦' : card.suit === 'club' ? '♣' : '♠'}
                        </text>
                    </svg>
                `;
            });
        
        cardElement.appendChild(front);
        container.appendChild(cardElement);
        
        // Force a reflow for animation to work
        void cardElement.offsetWidth;
        
        // Add glow effect to player's blackjack
        if (playerHand.length === 2 && calculateHandValue(playerHand) === 21) {
            cardElement.classList.add('blackjack-glow');
        }
    }
    
    function checkForNaturalBlackjack() {
        const playerValue = calculateHandValue(playerHand);
        const dealerValue = calculateHandValue(dealerHand);
        
        // Check if player has blackjack
        if (playerValue === 21 && playerHand.length === 2) {
            // Reveal dealer's hole card to check for push
            revealDealerCard();
            
            // If dealer also has blackjack, it's a push
            if (dealerValue === 21 && dealerHand.length === 2) {
                statusMessageElement.textContent = "Both have Blackjack! Push!";
                playerSouls += currentBet; // Return bet
            } else {
                // Player wins with blackjack (pays 3:2)
                statusMessageElement.textContent = "Blackjack! You win 1.5x your bet!";
                playerSouls += Math.floor(currentBet * 2.5); // Return bet + 1.5x winnings
            }
            
            endGame();
        }
        // Check if dealer has blackjack with Ace showing
        else if (dealerHand[0].value === 'Ace') {
            // Offer insurance? (Not implemented here but could be added)
        }
    }
    
    function calculateHandValue(hand) {
        let value = 0;
        let aces = 0;
        
        for (const card of hand) {
            if (card.value === 'Ace') {
                aces++;
                value += 11;
            } else if (card.value === 'King' || card.value === 'Queen' || card.value === 'Jack') {
                value += 10;
            } else {
                value += parseInt(card.value);
            }
        }
        
        // Adjust for aces
        while (value > 21 && aces > 0) {
            value -= 10;
            aces--;
        }
        
        return value;
    }
    
    function updateScores() {
        playerScore = calculateHandValue(playerHand);
        
        // For dealer, calculate full score only after player stands
        if (playerStood) {
            dealerScore = calculateHandValue(dealerHand);
            dealerScoreDisplay.textContent = dealerScore;
        } else {
            // Before player stands, only show score of the first visible card
            const firstCard = dealerHand[0];
            let visibleScore = 0;
            
            if (firstCard.value === 'Ace') {
                visibleScore = 11;
            } else if (firstCard.value === 'King' || firstCard.value === 'Queen' || firstCard.value === 'Jack') {
                visibleScore = 10;
            } else {
                visibleScore = parseInt(firstCard.value);
            }
            
            dealerScoreDisplay.textContent = visibleScore + ' + ?';
            
            // But internally, we need the actual score for checking blackjack
            dealerScore = calculateHandValue(dealerHand);
        }
        
        // Update player score display
        playerScoreDisplay.textContent = playerScore;
        
        // Check for player bust
        if (playerScore > 21) {
            handlePlayerBust();
        }
    }
    
    function handleHit() {
        if (!gameInProgress || playerStood) return;
        
        const card = drawCard();
        playerHand.push(card);
        displayCard(card, playerCardsElement);
        
        updateScores();
    }
    
    function revealDealerCard() {
        // Get the face-down card element
        const faceDownCard = dealerCardsElement.querySelector('.face-down');
        if (faceDownCard) {
            // Remove the face-down card entirely
            faceDownCard.remove();
            
            // Get the dealer's second card data
            const dealerSecondCard = dealerHand[1];
            
            // Display the actual card
            displayCard(dealerSecondCard, dealerCardsElement);
        }
    }
    
    function handleStand() {
        if (!gameInProgress) return;
        
        playerStood = true;
        hitButton.disabled = true;
        standButton.disabled = true;
        
        // Reveal dealer's face-down card
        revealDealerCard();
        
        // Update scores to show dealer's full score
        updateScores();
        
        // Dealer draws until they have at least 17
        setTimeout(dealerTurn, 500);
    }
    
    function dealerTurn() {
        // Calculate current dealer score
        dealerScore = calculateHandValue(dealerHand);
        
        // Update dealer score display each time
        dealerScoreDisplay.textContent = dealerScore;
        
        // If dealer has less than 17, they must draw
        if (dealerScore < 17) {
            setTimeout(() => {
                const card = drawCard();
                dealerHand.push(card);
                displayCard(card, dealerCardsElement);
                
                // Recalculate score and check for bust
                const oldScore = dealerScore;
                dealerScore = calculateHandValue(dealerHand);
                
                // Update the dealer score display with animation
                dealerScoreDisplay.textContent = dealerScore;
                
                // Add animation class if score changed
                if (oldScore !== dealerScore) {
                    dealerScoreDisplay.classList.remove('score-change');
                    // Force a reflow so the animation can be re-triggered
                    void dealerScoreDisplay.offsetWidth;
                    dealerScoreDisplay.classList.add('score-change');
                }
                
                if (dealerScore > 21) {
                    dealerBusted = true;
                    endGame();
                } else {
                    // Continue dealer's turn if still under 17
                    dealerTurn();
                }
            }, 600); // Add delay for dramatic effect
        } else {
            // Dealer is done drawing cards
            endGame();
        }
    }
    
    function handlePlayerBust() {
        playerBusted = true;
        statusMessageElement.textContent = "Bust! You lose your bet.";
        endGame();
    }
    
    function endGame() {
        gameInProgress = false;
        hitButton.disabled = true;
        standButton.disabled = true;
        dealButton.disabled = false;
        betControls.style.display = 'flex';
        
        // Reveal dealer's face-down card if not already revealed
        if (!playerStood) {
            revealDealerCard();
            updateScores(); // Update scores after revealing card
        }
        
        // Determine winner if not already determined (bust or blackjack)
        if (!playerBusted && !dealerBusted) {
            if (playerScore > dealerScore) {
                statusMessageElement.textContent = `You win ${currentBet} souls!`;
                playerSouls += currentBet * 2; // Return bet + winnings
            } else if (playerScore < dealerScore) {
                statusMessageElement.textContent = "Dealer wins. You lose your bet.";
            } else {
                statusMessageElement.textContent = "Push! Your bet is returned.";
                playerSouls += currentBet; // Return bet
            }
        } else if (dealerBusted) {
            statusMessageElement.textContent = `Dealer busts! You win ${currentBet} souls!`;
            playerSouls += currentBet * 2; // Return bet + winnings
        }
        
        // Update souls in localStorage
        localStorage.setItem('souls', playerSouls);
        updateSoulsDisplay();
        
        // If deck is running low, create a new one
        if (deck.length < 10) {
            createNewDeck();
        }
    }
    
    // Initialize the game
    initGame();
}); 