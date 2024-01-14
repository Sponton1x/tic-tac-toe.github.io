const board = document.getElementById('board');
const outputBoard = document.getElementById('output-board');
const summaryTable = document.getElementById('summaryTable').getElementsByTagName('tbody')[0];
const resultsTable = document.getElementById('resultsTable').getElementsByTagName('tbody')[0];

let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let winCircle = 0;
let winCross = 0;
let draws = 0;

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
    const currentPlayerText = document.getElementById("currentPlayer-text");
    currentPlayerText.textContent = `Teraz gracz ${currentPlayer}`;
}

function handleCellClick(index) {
    if (gameBoard[index] || checkWinner() || checkDraw()) return;

    gameBoard[index] = currentPlayer;
    renderBoard();
    updateCurrentPlayerText();

    const winner = checkWinner();
    const draw = checkDraw();

    if (winner) {
        alert(`Gracz ${winner} wygrał!`);
        addResult(`Gracz ${winner}`);
        handleGameEnd();
    } else if (draw) {
        alert('Jest remis!');
        addResult('Remis');
        handleGameEnd();
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        updateCurrentPlayerText();
    }
}

function renderBoard() {
    board.innerHTML = '';
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
    renderBoard();
    updateCurrentPlayerText();
}

function addResult(result) {
    // Results Table
    const resultsRow = resultsTable.insertRow();
    const resultCell = resultsRow.insertCell(0);
    resultCell.textContent = result;

    // Summary Table
    const summaryRow = summaryTable.insertRow();
    const summaryCellCross = summaryRow.insertCell(0);
    const summaryCellCircle = summaryRow.insertCell(1);
    const summaryCellDraw = summaryRow.insertCell(2);
    summaryCellCross.textContent = winCross;
    summaryCellCircle.textContent = winCircle;
    summaryCellDraw.textContent = draws;

    // Save data to localStorage
    saveResultsToLocalStorage();
}

function updateSummaryTable() {
    // Summary Table
    summaryTable.innerHTML = '';

    const summaryRow = summaryTable.insertRow();
    const summaryCellCross = summaryRow.insertCell(0);
    const summaryCellCircle = summaryRow.insertCell(1);
    const summaryCellDraw = summaryRow.insertCell(2);
    summaryCellCross.textContent = winCross;
    summaryCellCircle.textContent = winCircle;
    summaryCellDraw.textContent = draws;

    // Save data to localStorage
    saveResultsToLocalStorage();
}

function saveResultsToLocalStorage() {
    const summaryData = {
        cross: winCross,
        circle: winCircle,
        draw: draws
    };

    const resultsData = [];

    for (let i = 0; i < resultsTable.rows.length; i++) {
        const result = resultsTable.rows[i].cells[0].textContent;
        resultsData.push({ result });
    }

    localStorage.setItem('summaryData', JSON.stringify(summaryData));
    localStorage.setItem('resultsData', JSON.stringify(resultsData));
}

function loadResultsFromLocalStorage() {
    const summaryDataString = localStorage.getItem('summaryData');
    if (summaryDataString) {
        const summaryData = JSON.parse(summaryDataString);

        if (
            summaryData &&
            typeof summaryData.cross === 'number' &&
            typeof summaryData.circle === 'number' &&
            typeof summaryData.draw === 'number'
        ) {
            winCross = summaryData.cross;
            winCircle = summaryData.circle;
            draws = summaryData.draw;

            updateSummaryTable();
        } else {
            console.error('Incorrect type data in LocalStorage.');
        }
    }

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

function handleGameEnd() {
    if (checkWinner() === 'O') {
        winCircle++;
    } else if (checkWinner() === 'X') {
        winCross++;
    } else if (checkDraw()) {
        draws++;
    }
    updateSummaryTable();
    resetGame();
}

function resetTable() {
    localStorage.clear();
    summaryTable.innerHTML = '';
    resultsTable.innerHTML = '';
    winCircle = 0;
    winCross = 0;
    draws = 0;
    updateSummaryTable();
}

window.onload = function () {
    renderBoard();
    loadResultsFromLocalStorage();
    updateCurrentPlayerText();
}
