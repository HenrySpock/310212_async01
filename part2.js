console.log('Howdy from Async 1 Part 2!')

let deckId;
let remainingCards;
const drawnCards = [];

function getCards() {
    fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
      .then(response1 => response1.json())
      .then(data1 => {
        deckId = data1.deck_id;
        return fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`);
      })
      .then(response2 => response2.json())
      .then(data2 => {
        if (data2.cards && data2.cards.length > 0) {
          const card = data2.cards[0];
          console.log(`Card is: ${card.value} of ${card.suit}`);
        } else {
          console.log('No cards remaining in deck.');
        }
      })
      .catch(error => console.error(error));
}

getCards();

// ---------------

function getTwoCards() {
    fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
      .then(shuffleResponse => shuffleResponse.json())
      .then(shuffleData => {
        deckId = shuffleData.deck_id;
        return fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`);
      })
      .then(drawResponse => drawResponse.json())
      .then(drawData => {
        const cards = drawData.cards;
        if (cards && cards.length > 0) {
          console.log(`First card is: ${cards[0].value} of ${cards[0].suit}`);
          console.log(`Second card is: ${cards[1].value} of ${cards[1].suit}`);
        } else {
          console.log('No cards drawn from deck');
        }
      })
      .catch(error => console.error(error));
}

getTwoCards(); 

// ---------------

function getCardFromDeck() {
    if (remainingCards > 0) {
      fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`)
        .then(response => response.json())
        .then(data => {
          remainingCards = data.remaining;
          const card = data.cards[0];
          console.log(`Card is: ${card.value} of ${card.suit}`);
          console.log(`${remainingCards} cards remaining in deck.`); 

          drawnCards.push(card.code);
          displayCard(card.image);

          if (remainingCards === 0) {
            console.log('All cards have been drawn.');
            document.getElementById('hit-me-btn').disabled = true;
          }
        })
        .catch(error => console.error(error));
    } else {
      console.log('No more cards in deck.');
      document.getElementById('hit-me-btn').disabled = true;
    }
} 

function getNewDeck() {
    clearCards();
    document.getElementById('hit-me-btn').disabled = false;
    fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
      .then(response => response.json())
      .then(data => {
        deckId = data.deck_id;
        remainingCards = data.remaining;
        console.log(`New deck created with ID ${deckId} and ${remainingCards} cards remaining.`);
      })
      .catch(error => console.error(error));
}

function displayCard(imageUrl) {
  const cardDisplay = document.getElementById('card-display');
  const cardContainer = document.createElement('div');
  const card = document.createElement('img');
  card.src = imageUrl;
  card.alt = 'card';

  // rotate the card randomly between -20 and 20 degrees
  const rotateDeg = Math.floor(Math.random() * 361); // random degree between 0 and 360
  card.style.transform = `rotate(${rotateDeg}deg)`;

  cardContainer.style.position = 'absolute';
  cardContainer.style.left = '50%';
  cardContainer.style.top = '50%';
  cardContainer.style.transform = 'translate(-50%, -50%)';

  cardContainer.appendChild(card);
  cardDisplay.appendChild(cardContainer);
}

getNewDeck();  

document.getElementById('hit-me-btn').addEventListener('click', getCardFromDeck);
document.getElementById('new-deck-btn').addEventListener('click', getNewDeck);

function clearCards() {
    const cardDisplay = document.getElementById('card-display');
    cardDisplay.innerHTML = '';
}