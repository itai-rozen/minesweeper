console.log('Mine Sweeper - Here we go!');
let BEGINNER = {
    rows: 4,
    mines: 2
};
let MEDIUM = {
    rows: 6,
    mines: 5
};
let EXPERT = {
    rows: 8,
    mines: 15
};
let difficulties = [BEGINNER, MEDIUM, EXPERT];
// let gSizeLevel;
// let gMinesLevel;
let gChosenDifficulty;
let MINE = "💣";
let FLAG = "🏳️";
let EMPTY = ' ';
let gIsFirstClick = false
let gBoard = 0;
let gTimeInterval = 0;
let gTimeCount = 0;
let gIsOn = false;
let gIshint = false;
let gHintsCount = 3;
let gMines = 0

function chooseDifficulty(input) {
    gChosenDifficulty = difficulties[input]
    console.log('chosen diff ',gChosenDifficulty)
    gMines = gChosenDifficulty.mines
    init();
    gBoard = buildBoard(input)
    renderBoard(gBoard);
}

function init() {
    gIsFirstClick = false;
    gIsOn = true;
    gIshint = false;
    stopTimer();
    gTimeCount = 0;
    gTimeInterval = 0;
    gHintsCount = 3;
    let elTimeClass = document.querySelector('.time');
    elTimeClass.innerText = gTimeCount.toFixed(0);
    renderMines()
    //  add snmiley
    renderSmiley('<img src="img/smiley.png">');
}


function buildBoard(userInput) {
    let board = [];
    let boardSize = difficulties[userInput].rows;
    for (let i = 0; i < boardSize; i++) {
        board.push([]);
        for (let j = 0; j < boardSize; j++) {
            board[i][j] = " ";
        }
    }
    console.table(gBoard);
    return board;
}

function renderBoard(board) {
    let strHTML = '';
    for (let i = 0; i < board.length; i++) {
        strHTML += '<tr>';
        for (let j = 0; j < board[0].length; j++) {
            let item = gBoard[i][j];
            strHTML +=
                `<td class = "cell s-${i}-${j}
                 unchecked hvr-bob" onclick="cellClicked(this)" oncontextmenu="flagCell(this)">
            
                 ${item}
            </td>`;
        }
        strHTML += '</tr>';
    }
    let elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
    buildHints(gHintsCount);
}

function renderMines() {
    let elMines = document.querySelector('.mine-num')
    elMines.innerHTML = gMines}


function updateBoard() {
    for (let i = 0; i < gBoard.length; i++) {
        for (let j = 0; j < gBoard.length; j++) {
            gBoard[i][j] = checkNeighbors(i, j, MINE);
        }
    }
    console.table(gBoard)
}

function cellClicked(elCell) {
    let cellCoords = getCellCoords(elCell);
    let elCellI = +cellCoords[0];
    let elCellJ = +cellCoords[1];
    console.log('cell coords: ', cellCoords);
    if (!gIsOn) return;
    if (!gIsFirstClick) {
        //revealing the cell
        let cell = gBoard[elCellI][elCellJ];
        // only after ffirst click
        fillMines(elCellI, elCellJ);
        updateBoard()
        cell = checkNeighbors(elCellI, elCellJ, MINE);
        cell = (cell === 0) ? EMPTY : cell;
        if (cell === EMPTY) {
            expandCells(elCellI, elCellJ);
        }
        renderCell(elCellI, elCellJ, cell);
        removeClass(elCellI, elCellJ, 'unchecked');
        // start timer
        if (!gTimeInterval) {
         startTimer()
        }
        gIsFirstClick = true;
    }
    if (!gIshint) {
        if (elCell.classList.contains('flagged')) return;
        else if (elCell.classList.contains('unchecked')) elCell.classList.remove('unchecked');
        else return;
        // check neighbors & update model
        cell = checkNeighbors(elCellI, elCellJ, MINE);
        cell = (cell === 0) ? EMPTY : cell;
        // stepped on a mine
        if (cell === MINE) {
            revealAllElements(MINE);
            setTimeout(endGame, 500);
        }
        // function for expanding
        else if (cell === EMPTY) {
            expandCells(elCellI, elCellJ);
        }
        console.log('cell after model updating:', gBoard[elCellI][elCellJ]);
        //update DOM
        renderCell(elCellI, elCellJ, cell);
        // did i win?
        checkGame();
        console.table(gBoard);
        // clicked hint!
    } else if (gIshint) {
        revealNeighbors(elCellI, elCellJ);
        gHintsCount--;
        buildHints(gHintsCount);
    } else return;
}



// fill board with  mines - called once a game
function fillMines(cellI, cellJ) {
    // let mineCount =gMinesLevel;
    let mineCount = gChosenDifficulty.mines;
    while (mineCount > 0){
        let size = gChosenDifficulty.rows
        let rand1 = getRandomNumWithinRange(0, size - 1);
        let rand2 = getRandomNumWithinRange(0, size - 1);
        if  (
            ((rand1 !== cellI || rand2 !== cellJ) &&
            (gBoard[rand1][rand2] !== MINE))
            )
        {
            gBoard[rand1][rand2] = MINE;
            mineCount--
        }
    }

    console.table(gBoard);
}

function flagCell(cell) {
    if (!gIsOn) return;
    console.log('right click pressed');
    if (cell.classList.contains('unchecked') === false) return;
    let cellCoords = getCellCoords(cell);
    let cellCoordI = +cellCoords[0];
    let cellCoordJ = +cellCoords[1];
    cell.classList.toggle('flagged')
    if (cell.classList.contains('flagged')) {
        gMines--
        renderCell(cellCoordI, cellCoordJ, FLAG);
    } else {
        renderCell(cellCoordI, cellCoordJ, EMPTY);
        gMines++
    }
    console.log('cell coords et flagcell func:', cellCoords);
    renderMines()
    checkGame();
}



function checkNeighbors(cellI, cellJ, item) {
    let itemCount = 0;
    //if clicked cell is on the edge, update loop 
    if (gBoard[cellI][cellJ] === item) return item;
    let startingCellI = (cellI === 0) ? cellI : (cellI - 1);
    let startingCellJ = (cellJ === 0) ? cellJ : (cellJ - 1);
    let endingCellI = (cellI === gBoard.length - 1) ? cellI : (cellI + 1);
    let endingCellJ = (cellJ === gBoard[0].length - 1) ? cellJ : (cellJ + 1);

    for (let i = startingCellI; i <= endingCellI; i++) {
        for (let j = startingCellJ; j <= endingCellJ; j++) {
            //counting neighbor mines
            if (gBoard[i][j] === item) itemCount++;
        }
    }
    if (itemCount === 0) return EMPTY;
    else return itemCount;
    // function to expand empty cellxs

}
function expandCells(iCell, jCell) {
    console.log('entered expansion func');
    let startingCellI = (iCell === 0) ? iCell : (iCell - 1);
    let startingCellJ = (jCell === 0) ? jCell : (jCell - 1);
    let endingCellI = (iCell === gBoard.length - 1) ? iCell : (iCell + 1);
    let endingCellJ = (jCell === gBoard.length - 1) ? jCell : (jCell + 1);
    for (let i = startingCellI; i <= endingCellI; i++) {
        for (let j = startingCellJ; j <= endingCellJ; j++) {
            if (i === iCell && j === jCell) continue;
            let cellClass = document.querySelector(getClassName(i, j));
            if (cellClass.classList.contains('flagged') ||
                cellClass.classList.contains('unchecked') === false) continue;
            else {
                removeClass(i, j, 'unchecked');
                renderCell(i, j, gBoard[i][j]);
            }
            // if neighbor cells are empty, run the function again on those cells
            if (gBoard[i][j] === EMPTY) expandCells(i, j);
        }
    }

}
function revealAllElements() {
    for (let i = 0; i < gBoard.length; i++) {
        for (let j = 0; j < gBoard.length; j++) {
            if (gBoard[i][j] === MINE) {
                removeClass(i, j, "unchecked");
                removeClass(i, j, "flagged");
                console.log(document.querySelector(".s-" + i + "-" + j + "").classList);
                console.log('reveal all elements');
                renderCell(i, j, gBoard[i][j]);
            }
        }
    }
}

// add a function to end game and stop timer
// TODO add restart option

function endGame() {
    gIsOn = false;
    stopTimer();
    renderSmiley('<img  src="img/dead-smiley.png">');
    //  add a dead smiley :(
}

function checkGame() {

    let flagCount = document.querySelectorAll('.flagged').length;
    let unchekedCount = document.querySelectorAll('.unchecked').length;
    if (flagCount === gChosenDifficulty.mines && unchekedCount === gChosenDifficulty.mines) {
        console.log('you win!');
        setTimeout(stopTimer,500)
        gIsOn = false
        renderSmiley('<img  src="img/smiley-sunglasses.png">');
    }
}

function stopTimer() {
    clearInterval(gTimeInterval);
}

function startTimer() {
    gTimeInterval = setInterval(function () {
        gTimeCount += 1;
        let elTimeClass = document.querySelector('.time');
        elTimeClass.innerText = gTimeCount.toFixed(0);
        // if (!gIsOn) stopTimer();
    }, 1000)
}

function buildHints(numberOfhints) {
    let strHTML = '';
    let elHints = document.querySelector('.hints');
    console.log('hints class:', elHints);
    for (let i = 0; i < numberOfhints; i++) {
        strHTML += `<img onclick=useHint() src="img/hint.png">`
    }
    elHints.innerHTML = strHTML;
}
function useHint() {
    let elBoard = document.querySelector('body')
    if (!gIshint){
        gIshint = true;
        elBoard.classList.add('hint-mode')
    } else {
        gIshint = false;
        elBoard.classList.remove('hint-mode')
    }
}

function revealNeighbors(iCell, jCell) {
    let startingCellI = (iCell === 0) ? iCell : (iCell - 1);
    let startingCellJ = (jCell === 0) ? jCell : (jCell - 1);
    let endingCellI = (iCell === gBoard.length - 1) ? iCell : (iCell + 1);
    let endingCellJ = (jCell === gBoard.length - 1) ? jCell : (jCell + 1);
    for (let i = startingCellI; i <= endingCellI; i++) {
        for (let j = startingCellJ; j <= endingCellJ; j++) {
            let elCellClass = getClassName(i, j);
            let elCell = document.querySelector(elCellClass)
            if (elCell.classList.contains('unchecked')) {
                elCell.classList.add('hinted');
                elCell.classList.remove('unchecked');
                renderCell(i,j,gBoard[i][j])
            }
        }
    }
    setTimeout(unrevealCells, 1000);
}

function unrevealCells() {
    for (i = 0; i < gBoard.length; i++) {
        for (j = 0; j < gBoard.length; j++) {
            let elCellClass = getClassName(i, j);
            let elCell = document.querySelector(elCellClass)
            if (elCell.classList.contains('hinted')) {
                elCell.classList.remove('mine');
                elCell.classList.add('unchecked');
                elCell.classList.remove('hinted');
                renderCell(i, j, " ");
            }
        }
    }
    let elBoard = document.querySelector('body')
    elBoard.classList.remove('hint-mode')
    gIshint = false;
}
function renderSmiley(face) {
    document.querySelector('.smiley').innerHTML = face;
}

