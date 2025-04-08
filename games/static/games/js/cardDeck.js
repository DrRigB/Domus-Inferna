class Card {
    constructor(suit, value) {
        this.suit = suit;
        this.value = value;
        this.element = null;
        this.faceUp = false;
    }

    getSuitSymbol() {
        const symbols = {
            'heart': '♥',
            'diamond': '♦',
            'club': '♣',
            'spade': '♠'
        };
        return symbols[this.suit];
    }

    getDisplayValue() {
        const values = {
            'Ace': 'A',
            'King': 'K',
            'Queen': 'Q',
            'Jack': 'J'
        };
        return values[this.value] || this.value;
    }

    getColor() {
        return (this.suit === 'heart' || this.suit === 'diamond') ? 'red' : 'black';
    }

    createCardElement() {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.suit = this.suit;
        card.dataset.value = this.value;
        
        // Create card front
        const front = document.createElement('div');
        front.className = 'card-front';
        
        // Create card back
        const back = document.createElement('div');
        back.className = 'card-back';
        
        // Add card content
        front.innerHTML = `
            <div class="card-corner top-left">
                <div class="card-value">${this.getDisplayValue()}</div>
                <div class="card-suit">${this.getSuitSymbol()}</div>
            </div>
            <div class="card-center">${this.getSuitSymbol()}</div>
            <div class="card-corner bottom-right">
                <div class="card-value">${this.getDisplayValue()}</div>
                <div class="card-suit">${this.getSuitSymbol()}</div>
            </div>
        `;
        
        card.appendChild(front);
        card.appendChild(back);
        
        this.element = card;
        return card;
    }

    flip() {
        this.faceUp = !this.faceUp;
        if (this.element) {
            this.element.classList.toggle('flipped');
        }
    }
}

class CardDeck {
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
                this.cards.push(new Card(suit, value));
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
}

// Export for use in other files
window.CardDeck = CardDeck;
window.Card = Card; 