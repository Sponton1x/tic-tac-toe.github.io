// HTML element references
const board = document.getElementById('board');
const resultsTable = document.getElementById('resultsTable').getElementsByTagName('tbody')[0];
const summaryTable = document.getElementById('summaryTable').getElementsByTagName('tbody')[0];

let GameLevel = document.cookie.split('; ').find(row => row.startsWith('GameLevel='));
GameLevel = GameLevel ? GameLevel.split('=')[1] : null;

let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameOver = false;
let winCross = 0;
let winCircle = 0;
let draws = 0;

function checkWinner(board) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }

    return null;
}

function checkDraw(board) {
    return !board.includes('');
}

function updateCurrentPlayerText() {
    const currentPlayerText = document.getElementById("currentPlayer-text");
    currentPlayerText.textContent = `Teraz gracz ${currentPlayer}`;
}

function handleCellClick(index) {
    if (gameBoard[index] || gameOver) return;

    gameBoard[index] = currentPlayer;
    renderBoard();
    const winner = checkWinner(gameBoard);
    const draw = checkDraw(gameBoard);

    if (winner) {
        alert(`Gracz ${winner} wygrał!`);
        gameOver = true;
        addResult(`Gracz ${winner}`);
        handleGameEnd();
    } else if (draw) {
        alert('Jest remis!');
        gameOver = true;
        addResult('Remis');
        handleGameEnd();
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        updateCurrentPlayerText();

        if (currentPlayer === 'O' && !gameOver) {
            if (GameLevel === 'mode: hard') {
                const bestMove = minimax(gameBoard, true).move;
                gameBoard[bestMove] = currentPlayer;
                renderBoard();
                const winner = checkWinner(gameBoard);
                const draw = checkDraw(gameBoard);

                if (winner) {
                    alert(`Gracz ${winner} wygrał!`);
                    gameOver = true;
                    addResult(`Gracz ${winner}`);
                    handleGameEnd();
                } else if (draw) {
                    alert('Jest remis!');
                    gameOver = true;
                    addResult('Remis');
                    handleGameEnd();
                } else {
                    currentPlayer = 'X';
                    updateCurrentPlayerText();
                }
            } else {
                makeComputerMove();
            }
        }
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
    updateCurrentPlayerText();
}

function makeComputerMove() {
    const availableMoves = gameBoard.reduce((acc, cell, index) => {
        if (cell === '') acc.push(index);
        return acc;
    }, []);

    if (availableMoves.length === 0) return;

    const randomIndex = Math.floor(Math.random() * availableMoves.length);
    const computerMove = availableMoves[randomIndex];

    setTimeout(() => {
        gameBoard[computerMove] = currentPlayer;
        renderBoard();
        const winner = checkWinner(gameBoard);
        const draw = checkDraw(gameBoard);

        if (winner) {
            alert(`Gracz ${winner} wygrał!`);
            gameOver = true;
            addResult(`Gracz ${winner}`);
            handleGameEnd();
        } else if (draw) {
            alert('Jest remis!');
            gameOver = true;
            addResult('Remis');
            handleGameEnd();
        } else {
            currentPlayer = 'X';
            updateCurrentPlayerText();
        }
    }, 300);
}

function minimax(board, maxPlayer) {
    const winner = checkWinner(board);
    if (winner === 'O') return { score: 1 };
    if (winner === 'X') return { score: -1 };
    if (checkDraw(board)) return { score: 0 };

    const currentPlayer = maxPlayer ? 'O' : 'X';
    const availableMoves = [];
    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') availableMoves.push(i);
    }

    const moves = availableMoves.map(move => {
        const newBoard = [...board];
        newBoard[move] = currentPlayer;
        const result = minimax(newBoard, !maxPlayer);
        return { move, score: result.score };
    });

    if (maxPlayer) {
        const maxScore = Math.max(...moves.map(m => m.score));
        return moves.find(m => m.score === maxScore);
    } else {
        const minScore = Math.min(...moves.map(m => m.score));
        return moves.find(m => m.score === minScore);
    }
}

function resetGame() {
    currentPlayer = 'X';
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameOver = false;
    renderBoard();
}

function addResult(result) {
    const resultsRow = resultsTable.insertRow();
    const resultCell = resultsRow.insertCell(0);
    resultCell.textContent = result;
    saveResultsToLocalStorage();
}

function saveResultsToLocalStorage() {
    const summaryData = { cross: winCross, circle: winCircle, draw: draws };
    const resultsData = [];
    for (let i = 0; i < resultsTable.rows.length; i++) {
        resultsData.push({ result: resultsTable.rows[i].cells[0].textContent });
    }
    localStorage.setItem('summaryData', JSON.stringify(summaryData));
    localStorage.setItem('resultsData', JSON.stringify(resultsData));
}

function loadResultsFromLocalStorage() {
    const summaryDataString = localStorage.getItem('summaryData');
    if (summaryDataString) {
        const summaryData = JSON.parse(summaryDataString);
        winCross = summaryData.cross;
        winCircle = summaryData.circle;
        draws = summaryData.draw;
        updateSummaryTable();
    }

    const resultsDataString = localStorage.getItem('resultsData');
    if (resultsDataString) {
        const resultsData = JSON.parse(resultsDataString);
        resultsTable.innerHTML = '';
        resultsData.forEach(({ result }) => {
            const newRow = resultsTable.insertRow();
            const cell1 = newRow.insertCell(0);
            cell1.textContent = result;
        });
    }
}

function updateSummaryTable() {
    summaryTable.innerHTML = '';
    const summaryRow = summaryTable.insertRow();
    const summaryCellCross = summaryRow.insertCell(0);
    const summaryCellCircle = summaryRow.insertCell(1);
    const summaryCellDraw = summaryRow.insertCell(2);
    summaryCellCross.textContent = winCross;
    summaryCellCircle.textContent = winCircle;
    summaryCellDraw.textContent = draws;
    saveResultsToLocalStorage();
}

function handleGameEnd() {
    const winner = checkWinner(gameBoard);
    if (winner === 'O') winCircle++;
    if (winner === 'X') winCross++;
    if (checkDraw(gameBoard)) draws++;
    updateSummaryTable();
    resetGame();
}

function choiceGameLevel(level) {
    if (level !== "selector") {
        GameLevel = `mode: ${level}`;
        document.cookie = `GameLevel=${GameLevel};path=/`;
        alert(`Wybrano poziom trudności: ${level}`);
        board.hidden = false; // Show the board
        renderBoard();
    }
}

function resetTable() {
    localStorage.clear();
    resultsTable.innerHTML = '';
    summaryTable.innerHTML = '';
    winCircle = 0;
    winCross = 0;
    draws = 0;
    updateSummaryTable();
}

window.onload = function () {
    resetTable();
    resetGame();
    if (GameLevel && GameLevel !== 'mode: selector') {
        board.hidden = false;
        renderBoard();
    }
    loadResultsFromLocalStorage();
    updateCurrentPlayerText();

    const gameLevelSelect = document.getElementById('gameLevel');
    if (GameLevel.includes('easy')) {
        gameLevelSelect.value = 'easy';
    } else if (GameLevel.includes('hard')) {
        gameLevelSelect.value = 'hard';
    }
}
