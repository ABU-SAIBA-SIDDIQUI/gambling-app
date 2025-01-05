const grid = document.getElementById('grid');
const betSizeInput = document.getElementById('betSize');
const minesInput = document.getElementById('mines');
let cells = [];
let gameOver = false;

function generateGrid() {
    grid.innerHTML = '';
    cells = [];
    gameOver = false;
    for (let i = 0; i < 25; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.addEventListener('click', () => revealCell(cell, i));
        grid.appendChild(cell);
        cells.push({ element: cell, isMine: false });
    }
    placeMines();
}

function placeMines() {
    const totalMines = parseInt(minesInput.value);
    let count = 0;
    while (count < totalMines) {
        const index = Math.floor(Math.random() * cells.length);
        if (!cells[index].isMine) {
            cells[index].isMine = true;
            count++;
        }
    }
}

function revealCell(cell, index) {
    if (gameOver || cell.classList.contains('flipped')) return;
    cell.classList.add('flipped');

    const difficulty = document.getElementById('difficulty').value;
    let redProbability;

    if (cells[index].isMine) {
        cell.classList.add('red');
        endGame();
    } else {
        let flippedGreenCount = document.querySelectorAll('.flipped.green').length;

        // Apply different initial guaranteed green box logic based on difficulty
        if (difficulty === 'easy' && flippedGreenCount < 18) {
            cell.classList.add('green'); // At least 18 green guaranteed in easy mode
        } else if (difficulty === 'medium' && flippedGreenCount < 6) {
            cell.classList.add('green'); // At least 6 green guaranteed in medium mode
        } else {
            // Probability-based red reveal after minimum guaranteed green boxes
            if (difficulty === 'easy') {
                redProbability = 0.2;  // 20% chance for red
            } else if (difficulty === 'medium') {
                redProbability = 0.5;  // 50% chance for red
            } else if (difficulty === 'hard') {
                redProbability = 0.8;  // 80% chance for red
            }

            if (Math.random() < redProbability) {
                cell.classList.add('red');
                endGame();
            } else {
                cell.classList.add('green');
            }
        }
    }
}

function endGame() {
    gameOver = true;
    cells.forEach(({ element, isMine }) => {
        if (!element.classList.contains('flipped')) {
            element.classList.add('flipped', isMine ? 'red' : 'green');
        }
    });
}

function resetGame() {
    generateGrid();
}

function adjustBet(action) {
    let bet = parseFloat(betSizeInput.value);
    if (action === 'half') bet /= 2;
    if (action === 'double') bet *= 2;
    betSizeInput.value = bet.toFixed(5);
}

window.onload = generateGrid;