function getRandomNumWithinRange(min, max) {
    var rand = parseInt(Math.random() * (max - min) + min);
    return rand;
}

function getClassName(i, j) {
    return (".s-" + i + "-" + j + "");
}


function renderCell(i, j, value) {
    
    var cellSelector = getClassName(i,j)
    var elCell = document.querySelector(cellSelector);
    if (value === '💣') elCell.classList.add('mine')
    elCell.innerHTML = value;
}

function getCellCoords(cell) {
    var coords = cell.classList[1].split('-');
    console.log('coords in getCellCoords ', coords);
    coords.splice(0, 1);
    return coords;
}

function printValue(ev) {
    console.log(ev);
}

function removeClass(iCell, jCell, className) {
    document.querySelector(".s-" + iCell + "-" + jCell + "").classList.remove(className);
}

