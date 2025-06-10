// Unicode chess pieces
const PIECES = {
  r: '♜', n: '♞', b: '♝', q: '♛', k: '♚', p: '♟',
  R: '♖', N: '♘', B: '♗', Q: '♕', K: '♔', P: '♙',
};

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

let board = [...START_POSITION];
let selectedSquare = null;
let possibleMoves = [];
let whiteToMove = true;

// Helpers to determine piece color
function isWhite(piece) {
  return piece && piece === piece.toUpperCase();
}

function isBlack(piece) {
  return piece && piece === piece.toLowerCase();
}

// Directions for sliding pieces
const directions = {
  bishop: [[1,1],[1,-1],[-1,1],[-1,-1]],
  rook: [[1,0],[-1,0],[0,1],[0,-1]],
  queen: [[1,1],[1,-1],[-1,1],[-1,-1],[1,0],[-1,0],[0,1],[0,-1]]
};

// Convert index (0-63) to row,col
function idxToRC(idx) {
  return [Math.floor(idx / 8), idx % 8];
}

// Convert row,col to index
function rcToIdx(row, col) {
  return row * 8 + col;
}

// Check if row,col is on board
function onBoard(row, col) {
  return row >= 0 && row < 8 && col >=0 && col < 8;
}

// Generate possible moves for a piece at index
function generateMoves(idx) {
  const piece = board[idx];
  if (!piece) return [];

  const moves = [];
  const [row, col] = idxToRC(idx);
  const white = isWhite(piece);

  // Pawn moves
  if (piece.toLowerCase() === 'p') {
    const dir = white ? -1 : 1; // white moves up (-1), black down (+1)
    const startRow = white ? 6 : 1;

    // Move forward 1 square
    const oneForward = [row + dir, col];
    if (onBoard(...oneForward) && board[rcToIdx(...oneForward)] === '') {
      moves.push(rcToIdx(...oneForward));

      // Move forward 2 squares from start
      const twoForward = [row + 2*dir, col];
      if (row === startRow && board[rcToIdx(...twoForward)] === '') {
        moves.push(rcToIdx(...twoForward));
      }
    }

    // Captures diagonally
    for (let dc of [-1,1]) {
      const capPos = [row + dir, col + dc];
      if (onBoard(...capPos)) {
        const target = board[rcToIdx(...capPos)];
        if (target !== '' && isWhite(target) !== white) {
          moves.push(rcToIdx(...capPos));
        }
      }
    }
  }
  // Knight moves
  else if (piece.toLowerCase() === 'n') {
    const knightMoves = [
      [row-2, col-1], [row-2, col+1],
      [row-1, col-2], [row-1, col+2],
      [row+1, col-2], [row+1, col+2],
      [row+2, col-1], [row+2, col+1]
    ];
    for (const [r,c] of knightMoves) {
      if (onBoard(r,c)) {
        const target = board[rcToIdx(r,c)];
        if (target === '' || isWhite(target) !== white) {
          moves.push(rcToIdx(r,c));
        }
      }
    }
  }
  // Bishop, Rook, Queen (sliding pieces)
  else if ('bqr'.includes(piece.toLowerCase())) {
    let pieceDirs;
    if (piece.toLowerCase() === 'b') pieceDirs = directions.bishop;
    else if (piece.toLowerCase() === 'r') pieceDirs = directions.rook;
    else pieceDirs = directions.queen;

    for (const [dr, dc] of pieceDirs) {
      let r = row + dr;
      let c = col + dc;
      while (onBoard(r,c)) {
        const target = board[rcToIdx(r,c)];
        if (target === '') {
          moves.push(rcToIdx(r,c));
        } else {
          if (isWhite(target) !== white) {
            moves.push(rcToIdx(r,c));
          }
          break; // blocked
        }
        r += dr;
        c += dc;
      }
    }
  }
  // King moves (one square all directions)
  else if (piece.toLowerCase() === 'k') {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const r = row + dr;
        const c = col + dc;
        if (onBoard(r,c)) {
          const target = board[rcToIdx(r,c)];
          if (target === '' || isWhite(target) !== white) {
            moves.push(rcToIdx(r,c));
          }
        }
      }
    }
  }

  return moves;
}

function renderBoard() {
  boardElement.innerHTML = '';
  for(let i = 0; i < 64; i++) {
    const square = document.createElement('div');
    square.classList.add('square');

    const [row, col] = idxToRC(i);
    if ((row + col) % 2 === 0) {
      square.classList.add('light');
    } else {
      square.classList.add('dark');
    }

    if (board[i]) {
      square.textContent = PIECES[board[i]];
    }

    // highlight selected
    if (i === selectedSquare) {
      square.classList.add('selected');
    }

    // highlight possible moves
    if (possibleMoves.includes(i)) {
      square.classList.add('highlight');
    }

    square.dataset.index = i;
    square.addEventListener('click', onSquareClick);

    boardElement.appendChild(square);
  }
}

function onSquareClick(e) {
  const index = parseInt(e.currentTarget.dataset.index);

  if (selectedSquare === null) {
    // select piece if player's turn
    if (board[index] && ((whiteToMove && isWhite(board[index])) || (!whiteToMove && isBlack(board[index])))) {
      selectedSquare = index;
      possibleMoves = generateMoves(index);
      renderBoard();
    }
  } else {
    // If clicking one of the possible moves, move piece
    if (possibleMoves.includes(index)) {
      board[index] = board[selectedSquare];
      board[selectedSquare] = '';
      whiteToMove = !whiteToMove;  // switch turns
    }
    // Deselect otherwise
    selectedSquare = null;
    possibleMoves = [];
    renderBoard();
  }
}

renderBoard();
