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

const startID = 0;
const goalIDs = [159, 117, 128, 15, 32];

/*----- cached element references -----*/
const $board = $('#board');

const $startSquare = $('#' + startID);

const $player = $(`<div id="player" >🤠</div>`);
//$('#0').append($player); //starting position

const $goalEmoji = $('<div id="goal" >🐄</div>')
//$('#159').append($goalEmoji);

/*----- app's state (variables) -----*/
let $currentSquare //= $player.parent();
let $goalSquare //= $(`#${setGoalPosition()}`);

let solved = null;
let timeLeft = 60;

/*----- dynamically building board -----*/

function fillBoardWithSquares(numSquares) {
    for (let i = 0; i < numSquares; i++) {
        const $newSquareEl = $(`<div id="${i}" class="square">${i}</div>`)
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

    render();
})


/*----- functions -----*/

function setPlayerEmoji() {

}

function setGoalEmoji() {
    
}

function init() {
    solved = false;
    //seconds = 60;

    $goalSquare = setGoalPosition();
    $goalSquare.append($goalEmoji);
    $startSquare.append($player);

    render();

    startTimer(timeLeft);
}

function buildGraph() {
    //for each square on the board, SquaresGraph.addVertex(square's id)

    //check square by square if surrounding squares are 'available'
    //if an adjacent square is available, and an edge doesn't
    //already exist, then add an edge between the two 
    //in an
    

}

function render() {
    
    $currentSquare = $player.parent(); //update currentSquare upon init & after each arrowkey down

    checkSolved();


    if (solved) {
        console.log(`You solved it with ${timeLeft} seconds to spare!`)
    } else {
        console.log('blah')
    }
    //if time === 0, you lose
    //if $goalSquare === $current, you win
}

function setStartPosition() {

}

function setGoalPosition(squareID) {
    if (squareID) {
        return squareID;
    }
   
    return $("#" + goalIDs[[Math.floor(Math.random()*goalIDs.length)]])
}

function startTimer(seconds = 60) {
    if(seconds === 0) {
        //disable keydown listener
        console.log("You lose!")
        return seconds;
    } else if (solved) {
        return seconds;
    }

    timeLeft = seconds;
    console.log(seconds);
    seconds--;

    setTimeout(() => {
        return startTimer(seconds);
    }, 1000);

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
    const currentID = Number($currentSquare.attr('id'));
    const $leftOfCurrent = $(`#${currentID - 1}`);

    if (currentID % 16 !== 0 && $leftOfCurrent.hasClass('available')) {
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
    const currentID = Number($currentSquare.attr('id'));
    const $rightOfCurrent = $(`#${currentID + 1}`);

    console.log($rightOfCurrent)
    if ((currentID + 1) % 16 !== 0 && $rightOfCurrent.hasClass('available')) {
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
    const $aboveCurrent = $(`#${Number($currentSquare.attr('id')) - 16}`);

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
    const $belowCurrent = $(`#${Number($currentSquare.attr('id')) + 16}`);

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

function checkSolved() {
    if ($currentSquare.attr('id') === $goalSquare.attr('id')) {
        solved = true;
    } else {
        solved = false;
    }
    
}

function promptRotateMobileDevice () {

}


//Starts the game
init();