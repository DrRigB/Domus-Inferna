class SVGCardDeck {
    constructor() {
        this.cards = [];
        this.suits = ['heart', 'diamond', 'club', 'spade'];
        this.values = ['Ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King'];
        this.initializeDeck();
    }

    initializeDeck() {
        this.cards = [];
        for (const suit of this.suits) {
            for (const value of this.values) {
                this.cards.push({
                    suit,
                    value,
                    element: null
                });
            }
        }
    }

    shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    drawCard() {
        return this.cards.pop();
    }

    drawCards(numCards) {
        const cards = [];
        for (let i = 0; i < numCards; i++) {
            cards.push(this.drawCard());
        }
        return cards;
    }

    reset() {
        this.initializeDeck();
        this.shuffle();
    }

    getRemainingCards() {
        return this.cards.length;
    }

    createCardElement(card) {
        const cardContainer = document.createElement('div');
        cardContainer.className = 'card';
        cardContainer.dataset.suit = card.suit;
        cardContainer.dataset.value = card.value;
        
        // Create card front
        const front = document.createElement('div');
        front.className = 'card-front';
        
        // Create card back
        const back = document.createElement('div');
        back.className = 'card-back';

        // SVG filename format is suit + value (e.g., spadeAce.svg, heart10.svg)
        const svgFilename = `${card.suit}${card.value}.svg`;
        console.log(`Loading card: ${svgFilename}`);
        
        // Fetch SVG content from the correct directory
        fetch(`/static/games/images/Vertical4/svgs/${svgFilename}`)
            .then(response => response.text())
            .then(svgContent => {
                front.innerHTML = svgContent;
                // Add infernal effects to SVG
                const svgElement = front.querySelector('svg');
                if (svgElement) {
                    // Add base effects to all cards
                    svgElement.style.filter = 'saturate(1.8) contrast(1.4)';
                    
                    // Add glow effect to red suits
                    if (card.suit === 'heart' || card.suit === 'diamond') {
                        svgElement.style.filter = 'saturate(1.8) contrast(1.4) drop-shadow(0 0 12px rgba(255, 0, 0, 0.9))';
                        svgElement.querySelectorAll('path').forEach(path => {
                            path.style.filter = 'drop-shadow(0 0 8px #ff0000)';
                            // Add subtle animation to red suits
                            path.style.animation = 'pulse 3s infinite alternate';
                        });
                    }
                    // Add glow effect to black suits
                    else {
                        svgElement.style.filter = 'saturate(1.8) contrast(1.4) drop-shadow(0 0 12px rgba(0, 0, 255, 0.7))';
                        svgElement.querySelectorAll('path').forEach(path => {
                            path.style.filter = 'drop-shadow(0 0 8px #ffffff)';
                        });
                    }
                    
                    // Special effects for face cards and aces
                    if (card.value === 'Ace' || card.value === 'King' || card.value === 'Queen' || card.value === 'Jack') {
                        svgElement.style.filter += ' brightness(1.4)';
                        // Add more dramatic glow to face cards
                        const color = card.suit === 'heart' || card.suit === 'diamond' ? 
                            'rgba(255, 0, 0, 0.9)' : 'rgba(50, 50, 255, 0.9)';
                        svgElement.style.boxShadow = `0 0 20px ${color}`;
                    }
                    
                    // Add a dark background behind the card value to make it more visible
                    const cardValue = card.value;
                    const cardSuit = card.suit;
                    
                    // Create a background element for the card value
                    const valueBackground = document.createElement('div');
                    valueBackground.className = 'card-value-background';
                    valueBackground.style.position = 'absolute';
                    valueBackground.style.top = '10px';
                    valueBackground.style.left = '10px';
                    valueBackground.style.width = '30px';
                    valueBackground.style.height = '30px';
                    valueBackground.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
                    valueBackground.style.borderRadius = '5px';
                    valueBackground.style.border = `1px solid ${card.suit === 'heart' || card.suit === 'diamond' ? '#ff0000' : '#ffffff'}`;
                    valueBackground.style.zIndex = '1';
                    
                    // Create a text element for the card value
                    const valueText = document.createElement('div');
                    valueText.className = 'card-value-text';
                    valueText.textContent = cardValue;
                    valueText.style.position = 'absolute';
                    valueText.style.top = '15px';
                    valueText.style.left = '15px';
                    valueText.style.color = card.suit === 'heart' || card.suit === 'diamond' ? '#ff0000' : '#ffffff';
                    valueText.style.fontSize = '16px';
                    valueText.style.fontWeight = 'bold';
                    valueText.style.textShadow = `0 0 10px ${card.suit === 'heart' || card.suit === 'diamond' ? '#ff0000' : '#ffffff'}`;
                    valueText.style.zIndex = '2';
                    
                    // Add the elements to the card
                    cardContainer.appendChild(valueBackground);
                    cardContainer.appendChild(valueText);
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
        
        // Add card back design - completely simplified
        back.innerHTML = `
            <svg viewBox="0 0 100 140">
                <rect width="100" height="140" rx="10" fill="#1a0000" stroke="#ff0000" stroke-width="2"/>
            </svg>
        `;

        cardContainer.appendChild(front);
        cardContainer.appendChild(back);
        card.element = cardContainer;
        return cardContainer;
    }
}

// Export for use in other files
window.SVGCardDeck = SVGCardDeck; 