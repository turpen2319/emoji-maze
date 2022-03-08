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
    depthFirstSearch(node = 0, searchedNode, pathList = [], visitedNodes = []) {
        //Go as far as possible down one path. Don't go to nodes we've already visited unless we have to backtrack.
        //If dead end, we have to revisit nodes, checking their adjacentList, until you find a node you haven't visited.
        //Don't include those dead-end nodes in the path.
        let currentAdjacentList = this.adjacentList[node];
        if (currentAdjacentList) { //only seach through available nodes

            if (node === searchedNode) { //base case
                pathList.push(node);
                return;
            }

            
            
            visitedNodes.push(node);
            //pathList.push(node)

            let nextUnseenNode = null;
            
            for(let adjacentNode of currentAdjacentList) {
                if (!visitedNodes.includes(adjacentNode)) {
                    nextUnseenNode = adjacentNode;
                    break;
                }
            }

            //console.log(pathList)
            //console.log({node, nextUnseenNode, visitedNodes})

            if (!nextUnseenNode) {
                //backtrack
                nextUnseenNode = this.backtrack(node, currentAdjacentList, visitedNodes, pathList);
                //console.log({backtrack: nextUnseenNode})
            } else {
                pathList.push(node);
            }
            
            this.depthFirstSearch(nextUnseenNode, searchedNode, pathList, visitedNodes)
        }
        return pathList;
    }
    
    //This should stop once it reaches a node that is adjacent to an unseen node.
    //...then it returns that unseen node, not the current node
    backtrack(currentNode, backtrackAdjacentList, visitedNodes, pathList) { 
        //console.log({backtrackAdjacentList})
        
        pathList.pop();

        for (let i of backtrackAdjacentList) { //looks through nodes adjacent to current node
            for (let j of this.adjacentList[i]) { //checks if there are unseen nodes adjacent to those nodes
                if (!visitedNodes.includes(j)) {
                    //pathList.pop();
                    return j;
                }
            }
        }
        
        const previousNode = pathList[pathList.length - 1]
        
    
        return this.backtrack(previousNode, this.adjacentList[previousNode], visitedNodes, pathList) //run the same check on the previous node
    }
}
const squaresGraph = new Graph();

const numSquares = 160; //10x16 board...must change css to change numSquares
const numColumns = 16;
const startID = 0;
const goalIDs = [159, 117, 128, 15, 32];
const initialTime = 20;

/*----- cached element references -----*/
const $board = $('#board');

const $startSquare = $('#' + startID);

const $player = $(`<div id="player" >🤠</div>`);
//$('#0').append($player); //starting position

const $goalEmoji = $('<div id="goal" >🐄</div>')
//$('#159').append($goalEmoji);

const $startButton = $('#start')

const $playAgainButton = $('<button id="play-again">Play Again</button>')
const $subHeading = $('.subheading')
const $timer = $('<p id="timer"></p>')

/*----- app's state (variables) -----*/
let $currentSquare //= $player.parent();
let $goalSquare //= $(`#${setGoalPosition()}`);

let solved = null;
let timeLeft = null;

/*----- dynamically building board -----*/

function fillBoardWithSquares() {
    for (let i = 0; i < numSquares; i++) {
        const $newSquareEl = $(`<div id="${i}" class="square">${i}</div>`)
        console.log({$newSquareEl})
        $board.append($newSquareEl);
    }
}

/*----- Maze Solver (computer player) -----*/


function buildGraph() {
    //for each square on the board, SquaresGraph.addVertex(square's id)
    for (let i = 0; i < numSquares; i++) {
        squaresGraph.addVertex(i);
    }

    //add edges between adjacent, available squares
    for (let j = 0; j < squaresGraph.numberOfNodes; j++) {
        const currentAvailable = $(`#${j}`).hasClass('available');

        if (currentAvailable) {
            const aboveAvailable = $(`#${j-numColumns}`).hasClass('available');
            const belowAvailable = $(`#${j+numColumns}`).hasClass('available');
            const leftAvailable = $(`#${j-1}`).hasClass('available');
            const rightAvailable = $(`#${j+1}`).hasClass('available');
    
            if ( aboveAvailable && !squaresGraph.adjacentList[j].includes(j-numColumns) ) {
                squaresGraph.addEdge(j, j-numColumns);
            }
    
            if ( belowAvailable && !squaresGraph.adjacentList[j].includes(j+numColumns) ) {
                squaresGraph.addEdge(j, j+numColumns);
            }
    
            if ( j % numColumns !== 0 && leftAvailable && !squaresGraph.adjacentList[j].includes(j-1) ) {
                squaresGraph.addEdge(j, j-1);
            }
    
            if ( (j+1) % numColumns !== 0 && rightAvailable && !squaresGraph.adjacentList[j].includes(j+1) ) {
                squaresGraph.addEdge(j, (j+1))
            }
        }
    }
    //check square by square if current & surrounding squares are 'available'
    //if an adjacent square is available, and if an edge doesn't
    //already exist, then add an edge between both of their adjacency lists

}
buildGraph();

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

$('.arrows').on('click', '.arrow', function(evt) {
    $player.removeClass("frustrated"); //clears 'frustrated' class if there is one
    console.log(this)

    if (this.id === 'left') {
        moveLeft();
    } else if (this.id === 'right') {
        moveRight();
    } else  if (this.id === 'up') {
        moveUp();
    } else if (this.id === 'down') {
        moveDown();
    } else {
        console.log("This key was clicked: " + this)
    }

    render();
})

$($startButton).click(init)
$($subHeading).on('click', '#play-again', function() {
    console.log(this)
    init()
});

/*----- functions -----*/

function setPlayerEmoji() {

}

function setGoalEmoji() {
    
}

function init() {
    solved = false;
    timeLeft = initialTime;

    $goalSquare = setGoalPosition();
    $goalSquare.append($goalEmoji);
    $startSquare.append($player);
    startTimer(timeLeft);
    
    render();
}


function render() {
    
    $currentSquare = $player.parent(); //update currentSquare upon init & after each arrowkey down

    if(solved !== true && timeLeft > 0) checkSolved(); //this conditional check allows player to freeroam after they've already won (or lost) without updating the status of 'solved'


    if (solved) {
        $('h1').text(`🎉 You solved it in ${initialTime - timeLeft} seconds! 🎉 `)
        $timer.remove();
        $subHeading.append($playAgainButton);
        $player.css('z-index', '1');
        $goalEmoji.css('z-index', '1');
        $goalSquare.text
    } else if (timeLeft === 0) {
        $timer.remove();
        $subHeading.append($playAgainButton);
        $('h1').text(`⏰ Time's up! 😥`);

    } else {
        $('h1').text(`Emoji Maze`);
        $startButton.remove();
        $playAgainButton.remove();
        $subHeading.append($timer);
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
    timeLeft = seconds;
    $timer.text(timeLeft);

    if(seconds === 0) { //base case(s)
        $timer.remove();
        $subHeading.append($playAgainButton);
        $('h1').text(`⏰ Time's up! 😥`);

        return seconds;
    } else if (solved) {
        return seconds;
    }

    seconds--;

    setTimeout(() => {
        return startTimer(seconds); //return case
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
//init();