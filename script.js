// Unicode chess pieces
const PIECES = {
  r: '♜', n: '♞', b: '♝', q: '♛', k: '♚', p: '♟',
  R: '♖', N: '♘', B: '♗', Q: '♕', K: '♔', P: '♙',
};

// Starting position in FEN notation simplified for initialization
const START_POSITION = [
  'r','n','b','q','k','b','n','r',
  'p','p','p','p','p','p','p','p',
  '','','','','','','','',
  '','','','','','','','',
  '','','','','','','','',
  '','','','','','','','',
  'P','P','P','P','P','P','P','P',
  'R','N','B','Q','K','B','N','R'
];

const boardElement = document.getElementById('chessboard');
let selectedSquare = null;
let board = [...START_POSITION];  // current board state

function renderBoard() {
  boardElement.innerHTML = '';
  for(let i = 0; i < 64; i++) {
    const square = document.createElement('div');
    square.classList.add('square');
    // color squares like a chessboard
    const row = Math.floor(i / 8);
    const col = i % 8;
    if ((row + col) % 2 === 0) {
      square.classList.add('light');
    } else {
      square.classList.add('dark');
    }

    // set piece symbol if present
    const piece = board[i];
    if (piece) {
      square.textContent = PIECES[piece];
    }

    square.dataset.index = i;

    // click event for moving pieces
    square.addEventListener('click', onSquareClick);

    boardElement.appendChild(square);
  }
}

function onSquareClick(e) {
  const index = parseInt(e.currentTarget.dataset.index);

  // If no piece selected yet, select piece if present
  if (selectedSquare === null) {
    if (board[index] === '') return; // empty square, do nothing
    selectedSquare = index;
    e.currentTarget.classList.add('selected');
  } else {
    // Move piece from selectedSquare to clicked square
    board[index] = board[selectedSquare];
    board[selectedSquare] = '';
    selectedSquare = null;
    renderBoard();
  }
}

renderBoard();
