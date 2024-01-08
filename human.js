const board = document.getElementById('board');
const outputBoard = document.getElementById('output-board');
const resultsTable = document.getElementById('resultsTable').getElementsByTagName('tbody')[0];
const summraryTable = document.getElementById('summraryTable').getElementsByTagName('tbody')[0];
const rows = resultsTable.getElementsByTagName('tr');

let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameOver = false;
let roundCounter = document.getElementById('reset-btn');

function checkWinner() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            return gameBoard[a];
        }
    }

    return null;
}

function checkDraw() {
    return !gameBoard.includes('');
}

function updateCurrentPlayerText() {
    const currentPlayerText = document.getElementById("currentPlayer-text")
    currentPlayerText.textContent = `Teraz gracz ${currentPlayer}`
}

function handleCellClick(index) {
    if (gameBoard[index] || gameOver) return;

    gameBoard[index] = currentPlayer;
    renderBoard();
    updateCurrentPlayerText();

    const winner = checkWinner();
    const draw = checkDraw();

    if (winner) {
        alert(`Gracz ${winner} wygrał!`);
        gameOver = true;
        updateCurrentPlayerText();
        addResult(`Gracz ${winner}`);
        handleGameEnd();
    } else if (draw) {
        alert('Jest remis!');
        gameOver = true;
        updateCurrentPlayerText();
        addResult("Remis");
        handleGameEnd();
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        updateCurrentPlayerText();
    }
}

function renderBoard() {
    board.innerHTML = '';
    board.getElementById
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('button');
        cell.textContent = gameBoard[i];
        cell.addEventListener('click', () => handleCellClick(i));
        board.appendChild(cell);
    }
}

function resetGame() {
    currentPlayer = 'X';
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameOver = false;
    renderBoard();
    updateCurrentPlayerText();
}

function winCounter() {
    let winCircle = 0;
    let winCross = 0;
    let draws = 0;


    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        if (cells.length === 1) {
            const result = cells[0].textContent;
            if (result === 'Gracz O') {
                winCircle++;
            } else if (result === 'Gracz X') {
                winCross++;
            } else if (result === 'Remis') {
                draws++;
            }
        }
    }
}


function addResult(result) {
    // Results Table
    const resultsRow = resultsTable.insertRow();
    const resultCell = resultsRow.insertCell(0);
    resultCell.textContent = result;

    // Summrary Table
    const summraryRow = summraryTable.insertRow();
    const summraryCellCross = summraryRow.insertCell(0);
    const summraryCellCircle = summraryRow.insertCell(1);
    const summraryCellDraw = summraryRow.insertCell(1);
    summraryCellCross.textContent = winCross;
    summraryCellCircle.textContent = winCircle;
    summraryCellDraw.textContent = draws;


    // Save data to localStorage
    saveResultsToLocalStorage();

    // Add data to tabelę HTML
    updateResultsTableInHTML();
}


function saveResultsToLocalStorage() {
    const resultsData = [];
    const summraryData = [];
    for (let i = 0; i < resultsTable.rows.length; i++) {
        const result = resultsTable.rows[i].cells[0].textContent;
        resultsData.push({ result });
    }
    localStorage.setItem('resultsData', JSON.stringify(resultsData));
}

function loadResultsFromLocalStorage() {
    const resultsDataString = localStorage.getItem('resultsData');
    if (resultsDataString) {
        const resultsData = JSON.parse(resultsDataString);
        resultsTable.innerHTML = '';

        for (const { result } of resultsData) {
            const newRow = resultsTable.insertRow();
            const cell1 = newRow.insertCell(0);
            cell1.textContent = result;
        }
    }
}

function updateResultsTableInHTML() {
    console.log('Updating results table...');
    const resultsData = getResultsFromLocalStorage();
    resultsTable.innerHTML = '';

    for (const { result } of resultsData) {
        const newRow = resultsTable.insertRow();
        const cell1 = newRow.insertCell(0);
        cell1.textContent = result;
    }
    console.log('Results table updated.');
}

function getResultsFromLocalStorage() {
    const resultsDataString = localStorage.getItem('resultsData');
    return resultsDataString ? JSON.parse(resultsDataString) : [];
}

function handleGameEnd() {
    saveResultsToLocalStorage();
    updateResultsTableInHTML();
}

function resetTable() {
    localStorage.clear();
    resultsTable.innerHTML = '';
}

window.onload = function () {
    loadResultsFromLocalStorage();
    renderBoard();
    updateCurrentPlayerText();
}
