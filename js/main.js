/*----- ?'s to answer -----*/
//*How to structure html grid so it works with graph? 
//  -> id's should be ints 0~however many squares
//  -> squareEls should also have and 'available' class 

/*----- constants -----*/
class Graph { 
    constructor() { 
      this.numberOfNodes = 0;
      this.adjacentList = {}; 
    } 
    addVertex(node) {
      this.adjacentList[node] = [];
      this.numberOfNodes++;
    } 
    addEdge(node1, node2) { 
      this.adjacentList[node1].push(node2);
      this.adjacentList[node2].push(node1);  
    } 
    showConnections() { 
      const allNodes = Object.keys(this.adjacentList); 
      for (let node of allNodes) { 
        let nodeConnections = this.adjacentList[node]; 
        let connections = ""; 
        // let vertex;
        for (let vertex of nodeConnections) {
          connections += vertex + " ";
        } 
        console.log(node + "-->" + connections); 
      } 
    } 
}
const SquaresGraph = new Graph();


/*----- cached element references -----*/
const $board = $('#board');  //div containing square divs...player can occupy one square at a time if the square is available
fillBoardWithSquares(80);

const $player = $(`<div id="player" >🤠</div>`);
$('#0').append($player); //starting position

const $goal = $('<div id="goal" >🐄</div>')
$('#79').append($goal);

/*----- app's state (variables) -----*/
let $currentSquare = $player.parent();
let $goalSquare = setGoalPosition();
let $startSquare = setStartPosition();
let solved = false;
let time = startTimer();

// const $leftOfCurrent = $(`#${Number($currentSquare.attr('id')) - 1}`);
// const $rightOfCurrent = $(`#${Number($currentSquare.attr('id')) + 1}`);
// const $aboveCurrent = $(`#${Number($currentSquare.attr('id')) - 10}`); //the 10s for above & below only works on boards where there are rows of 10...just add/subtract numColumns to/from current to make it dynamic
// const $belowCurrent = $(`#${Number($currentSquare.attr('id')) + 10}`);

/*----- dynamically building board -----*/

function fillBoardWithSquares(numSquares) {
    for (let i = 0; i < numSquares; i++) {
        const $newSquareEl = $(`<div id="${i}" class="square available">${i}</div>`)
        console.log({$newSquareEl})
        $board.append($newSquareEl);
    }
}


$board.on('click', '.square', function(evt) { //disable this event listener once I've built the maze
    //toggle 'available' class
    console.log(evt.target); 
    $(this).toggleClass("available");
})


 

/*----- event listeners -----*/
$(document).keydown(function(evt) {
    $player.removeClass("frustrated"); //clears 'frustrated' class if there is one

    const key = evt.which; //gives code for which key was pressed

    if (key === 37) {
        moveLeft();
    } else if (key === 39) {
        moveRight();
    } else  if (key === 38) {
        moveUp();
    } else if (key === 40) {
        moveDown();
    } else {
        console.log("This key was pressed: " + key)
    }
})


/*----- functions -----*/

function setPlayerEmoji() {

}

function setGoalEmoji() {
    
}

function init() {

}

function buildGraph() {
    //for each square on the board, SquaresGraph.addVertex(square's id)

    //check square by square if surrounding squares are 'available'
    //if an adjacent square is available, and an edje doesn't
    //already exist, then add an edge between the two 
    //in an
    

}

function render() {

    //if time === 0, you lose
    //if $goalSquare === $current, you win
}

function setStartPosition() {

}

function setGoalPosition() {
    //randomly chooses goal from an array of 5(?) predetermined positions
}

function startTimer(minutes = 2) {
    //starts the countdown
}

// function movePlayer($desiredSquare) {
//     console.log($desiredSquare);
//     if ($desiredSquare.hasClass('available')) {
//         $currentSquare = $desiredSquare;
//         $currentSquare.append($player);
//     } else {
//         console.log("Can't move there")
//         //shakes the character
//         $player.addClass('frustrated')
//         setTimeout(() => {
//             $player.removeClass('frustrated')
//         }, 100);
//     }
// }

function moveLeft() {
    const $leftOfCurrent = $(`#${Number($currentSquare.attr('id')) - 1}`);

    if ($leftOfCurrent.hasClass('available')) {
        $currentSquare = $leftOfCurrent;
        $currentSquare.append($player);
    } else {
        console.log("Can't move left.")
        $player.addClass('frustrated')
        setTimeout(() => { 
            $player.removeClass('frustrated') 
        }, 100); //time relates to the length of my 'frustrated' animation
    }   
}

function moveRight() {
    const $rightOfCurrent = $(`#${Number($currentSquare.attr('id')) + 1}`);

    console.log($rightOfCurrent)
    if ($rightOfCurrent.hasClass('available')) {
        $currentSquare = $rightOfCurrent;
        $currentSquare.append($player);
    } else {
        $player.toggleClass('frustrated');
        console.log("Can't move right.")
        $player.addClass('frustrated')
        setTimeout(() => {
            $player.removeClass('frustrated')
        }, 100);
    }
}

function moveUp() {
    const $aboveCurrent = $(`#${Number($currentSquare.attr('id')) - 10}`);

    console.log($aboveCurrent)
    if ($aboveCurrent.hasClass('available')) {
        $currentSquare = $aboveCurrent;
        $currentSquare.append($player);
    } else {
        console.log("Can't move above.")
        $player.addClass('frustrated')
        setTimeout(() => {
            $player.removeClass('frustrated')
        }, 100);
    }
}

function moveDown() {
    const $belowCurrent = $(`#${Number($currentSquare.attr('id')) + 10}`);

    console.log($belowCurrent)
    if ($belowCurrent.hasClass('available')) {
        $currentSquare = $belowCurrent;
        $currentSquare.append($player);
    } else {
        console.log("Can't move down.")
        $player.addClass('frustrated')
        setTimeout(() => {
            $player.removeClass('frustrated')
        }, 100);
    }   
}

function resetGame() {
    
}

function checkWin() {
    if
    
}

function promptRotateMobileDevice () {

}