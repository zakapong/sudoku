var data = [
    [8, 5, 6, 0, 1, 4, 7, 3, 0],
    [0, 9, 0, 0, 0, 0, 0, 0, 0],
    [2, 4, 0, 0, 0, 0, 1, 6, 0],
    [0, 6, 2, 0, 5, 9, 3, 0, 0],
    [0, 3, 1, 8, 0, 2, 4, 5, 0],
    [0, 0, 5, 3, 4, 0, 9, 2, 0],
    [0, 2, 4, 0, 0, 0, 0, 7, 3],
    [0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 1, 8, 6, 3, 0, 2, 9, 4]
];


/*var data=[
[4, 0, 0, 0, 0, 0, 8, 0, 5],
[0, 3, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 7, 0, 0, 0, 0, 0],
[0, 2, 0, 0, 0, 0, 0, 6, 0],
[0, 0, 0, 0, 8, 0, 4, 0, 0],
[0, 0, 0, 0, 1, 0, 0, 0, 0],
[0, 0, 0, 6, 0, 3, 0, 7, 0],
[5, 0, 0, 2, 0, 0, 0, 0, 0],
[1, 0, 4, 0, 0, 0, 0, 0, 0]
 ]; */

var populateHtmlData = [];


$(document).ready(function(event) {

    // Script start
    createQuestionTable();
    createSolveButton();
    createAnswerTable();


    convert2DToOneDArray();

    // Populate  1st grid with Data.
    $('table[class^="sudoku"]').each(function(index, grid) {
        var isDataAvailable = true;
        insertDataIntoTable($(grid), populateHtmlData, isDataAvailable);
    });

    // Populate  2nd grid with populateHtmlData.
    $('table[class^="sudoku2"]').each(function(index, grid) {
        var isDataAvailable = false;
        insertDataIntoTable($(grid), populateHtmlData, isDataAvailable);
    });

    $("#columnTwo").append($('<button id="btnSolve" onclick="solve()">Solve</button>'));
});




function createQuestionTable() {
    $('#wrapper').append($('<div>')
        .addClass('col')
        .attr('id', 'columnOne')
        .append(generateSudokuGrid().attr('id', 'tableQuestion')))
}


function createSolveButton() {
    $('#columnOne').after($('<div>').addClass('colButton').attr('id', 'columnTwo'))
}


function createAnswerTable() {
    $('#columnTwo').after($('<div>').addClass('col').attr('id', 'columnThree')
        .append(generateSudokuGrid2().attr('id', 'tableAnswer')));
}


function convert2DToOneDArray() {
    for (var i = 0; i < data.length; i++) {
        populateHtmlData = populateHtmlData.concat(data[i]);
    }
}

function insertDataIntoTable(grid, populateHtmlData, isDataAvailable) {
    grid.find('td').each(function(index, td) {
        if (isDataAvailable) {
            $(td).text(populateHtmlData[index] || '');

        } else {
            $(td).text('');
        }
    });
}

function generateSudokuGrid() {
    return $('<table>').append(multiPush(9, function() {
        return $('<tr>').append(multiPush(9, function() {
            return $('<td>');
        }));
    })).addClass('sudoku');
}

function generateSudokuGrid2() {
    return $('<table>').append(multiPush(9, function() {
        return $('<tr>').append(multiPush(9, function() {
            return $('<td>');
        }));
    })).addClass('sudoku2');

}


function multiPush(count, func) {
    var arr = [];
    for (var i = 0; i < count; i++) {
        arr.push(func.call(i));

    }

    return arr;

}

//------------------------------Solver ----------------------------------------------------

function solve() {
    for (var row = 0; row < 9; row++) {
        for (var column = 0; column < 9; column++) {
            //  console.log('before solve');
            solveSudoku(data, row, column);
            //    console.log('after solve');
        }
    }
    printGrid(data);
    insertAnswerToHtmlTable(data);

}



function solveSudoku(grid, row, col) {
    console.log('1st');
    var cell = findAnEmptyCell(grid, row, col);
    console.log(cell);
    row = cell[0];
    col = cell[1];


    if (row == -1) {
        //  console.log("solved");
        return true;
    }
    console.log('loop');
    //we are searching for possible answer
    for (var possibleAnswer = 1; possibleAnswer <= 9; possibleAnswer++) {

        if (isValid(grid, row, col, possibleAnswer)) {
            grid[row][col] = possibleAnswer;
            console.log('RECUR')
            if (solveSudoku(grid, row, col)) {


                return true;
            }

            grid[row][col] = 0;
        }

    }
    console.log('backtrack');
    // no valid choice found between 1-9, trigger backtracking
    return false;

}

function findAnEmptyCell(grid, row, col) {
    for (row = 0; row < 9; row++)
        for (col = 0; col < 9; col++)
            if (grid[row][col] == 0)
                return [row, col];
    return [-1, -1]; // means grid is full
}




function isValid(grid, row, col, possibleAnswer) { //return true if 3 is valid
    return isRowValid(grid, row, possibleAnswer) && isColumnValid(grid, col, possibleAnswer) && isBoxValid(grid, row, col, possibleAnswer);
}

// check if possibleAnswer not in particular box
function isBoxValid(grid, row, col, possibleAnswer) {
    row = Math.floor(row / 3) * 3;
    col = Math.floor(col / 3) * 3;

    for (var r = 0; r < 3; r++)
        for (var c = 0; c < 3; c++)
            if (grid[row + r][col + c] == possibleAnswer)
                return false;

    return true;
}



// check if possibleAnswer not in particular column
function isColumnValid(grid, col, possibleAnswer) {
    for (var row = 0; row < 9; row++)
        if (grid[row][col] == possibleAnswer)
            return false;

    return true;
}

// check if possibleAnswer not in particular row
function isRowValid(grid, row, possibleAnswer) {
    for (var col = 0; col < 9; col++)
        if (grid[row][col] == possibleAnswer)
            return false;

    return true;
}

// Insert dynamically the answer to html table.
function insertAnswerToHtmlTable(solution) {
    var result = "<table class=\"sudoku\">";
    for (var i = 0; i < solution.length; i++) {
        result += "<tr>";
        for (var j = 0; j < solution[i].length; j++) {
            result += "<td>" + solution[i][j] + "</td>";
        }
        result += "</tr>";
    }
    result += "</table>";
    $('#columnThree').remove();
    $('#columnTwo').after($('<div>').attr('id', 'columnThree')
        .append(result).addClass('col'));
}

function printGrid(grid) {
    var res = "";
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            res += grid[i][j];
        }
        res += "\n";
    }
    //console.log(res);
}
