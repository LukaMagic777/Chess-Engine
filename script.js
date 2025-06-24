// script.js
const board = document.getElementById("chessboard");

const pieces = {
  r: "♜", n: "♞", b: "♝", q: "♛", k: "♚", p: "♟",
  R: "♖", N: "♘", B: "♗", Q: "♕", K: "♔", P: "♙"
};

const startPosition = [
  "rnbqkbnr",
  "pppppppp",
  "        ",
  "        ",
  "        ",
  "        ",
  "PPPPPPPP",
  "RNBQKBNR"
];

const files = ['a','b','c','d','e','f','g','h'];
const ranks = ['8','7','6','5','4','3','2','1'];

for(let row = 0; row < 10; row++) {
  for(let col = 0; col < 10; col++) {
    const cell = document.createElement('div');

    // Corners are empty
    if((row === 0 && col === 0) || (row === 0 && col === 9) || (row === 9 && col === 0) || (row === 9 && col === 9)) {
      cell.classList.add('label-cell');
      cell.textContent = '';
    }
    // Top labels (files a-h)
    else if(row === 0 && col > 0 && col < 9) {
      cell.classList.add('label-cell');
      cell.textContent = "";
      cell.style.textAlign = 'center';
      cell.style.fontWeight = 'bold';
      cell.style.color = '#fff';
      cell.style.backgroundColor = '#333';
    }
    // Bottom labels (files a-h)
    else if(row === 9 && col > 0 && col < 9) {
      cell.classList.add('label-cell');
      cell.textContent = files[col-1];
      cell.style.textAlign = 'center';
      cell.style.fontWeight = 'bold';
      cell.style.color = '#fff';
      cell.style.backgroundColor = '#333';
    }
    // Left labels (ranks 8-1)
    else if(col === 0 && row > 0 && row < 9) {
      cell.classList.add('label-cell');
      cell.textContent = ranks[row-1];
      cell.style.textAlign = 'center';
      cell.style.fontWeight = 'bold';
      cell.style.color = '#fff';
      cell.style.backgroundColor = '#333';
    }
    // Right labels (ranks 8-1)
    else if(col === 9 && row > 0 && row < 9) {
      cell.classList.add('label-cell');
      cell.textContent = "";
      cell.style.textAlign = 'center';
      cell.style.fontWeight = 'bold';
      cell.style.color = '#fff';
      cell.style.backgroundColor = '#333';
    }
    else {
      // Chess squares
      const boardRow = row -1;
      const boardCol = col -1;

      cell.classList.add('square');
      cell.classList.add((boardRow + boardCol) % 2 === 0 ? 'light' : 'dark');
      cell.dataset.row = boardRow;
      cell.dataset.col = boardCol;

      const piece = startPosition[boardRow][boardCol];
      if(piece !== ' ') {
        cell.textContent = pieces[piece];
      }

      cell.addEventListener('click', () => handleClick(cell));
    }

    board.appendChild(cell);
  }
}

