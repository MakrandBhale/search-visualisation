const universe = document.getElementById('universe');
let paper = new Raphael(universe, window.innerWidth, window.innerHeight); //option (b)
const BLOCK_DIMEN = 50;
let blocks = paper.set();
let mouseDown = false;
let pickingSourceNode = false;
let pickingDestNode = false;
const BlockType = Object.freeze({"SOURCE":1, "DEST":2, "NORMAL":3, "WALL": 4, "WEIGHTED": 5});
let blockMatrix = [];
const CUSTOM_WEIGHT = 15;
const STOCK_WEIGHT = 1;



window.onload = function() {
    // let paper = new Raphael(document.getElementById('canvas_container'), 500, 500);
    //let circle = paper.circle(100, 100, 80);
    drawBoard();

}

function drawBoard() {
    let totalCols = window.innerWidth/BLOCK_DIMEN;
    let totalRows = window.innerHeight/BLOCK_DIMEN;

    let centerRow = parseInt(totalRows / 2);
    

    let sourceIndex = [centerRow, 3];
    let destIndex = [centerRow, parseInt(totalCols - 3)];

    let row = 0;
    for(let i = 0; i < totalRows; i++) {
        let col = 0;
        let rowArray = new Array();
        for(let j = 0; j < totalCols; j++) {
            let block = makeNormalBlock(row, col, j, i);
            rowArray.push(block);
            col = col + BLOCK_DIMEN;
        }
        blockMatrix.push(rowArray);
        row = row + BLOCK_DIMEN;
    }

    setSourceDest(sourceIndex, destIndex);
}

function setSourceDest(sourceIndex, destIndex) {

    let sourceNode = blockMatrix[sourceIndex[0]][sourceIndex[1]];
    let destNode = blockMatrix[destIndex[0]][destIndex[1]];
    //console.log(destIndex);
    makeSourceNode(sourceNode);
    makeDestNode(destNode);
}

function makeSourceNode(ref) {
    //if (!pickingSourceNode) return;
    ref.meta.setBlockType(BlockType.SOURCE);
    let anim = getScaleAnimation(PRIMARY_COLOR, PRIMARY_COLOR);
    ref.toFront();
    ref.animate(anim);
}

function makeDestNode(ref) {
    //if (!pickingDestNode) return;
    ref.meta.setBlockType(BlockType.DEST);
    let anim = getScaleAnimation(ACCENT_COLOR, ACCENT_COLOR);
    ref.toFront();
    ref.animate(anim);
}

function makeNormalAgain(ref) {
    ref.meta.setBlockType(BlockType.NORMAL);
    ref.meta.customWeight = 1;

    let anim = getScaleAnimation(WHITE, WHITE);
    ref.toFront();
    ref.animate(anim);

    ref.attr({
        stroke: "#000",
        "stroke-width": 1,
        "stroke-opacity": 0.2
    })
}


function makeWeightedNode(ref) {

    ref.meta.setBlockType(BlockType.WEIGHTED);
    ref.meta.customWeight = CUSTOM_WEIGHT;
    let anim = getScaleAnimation(BLUE, BLUE);
    ref.toFront();
    ref.animate(anim);
    ref.attr({
        stroke: DARK_BLUE,
        "stroke-width": 5,
    })
}


function makeWall(ref, isMazeCreating) {

    if(ref.meta.isSpecialBlock) return;
    if(mouseDown || isMazeCreating){
        ref.meta.setBlockType(BlockType.WALL);

        let anim = getScaleAnimation(GRAY, GRAY);
        ref.toFront();
        ref.animate(anim);
    }
}

class MetaInfo {
    constructor(blockType, col, row) {
        this.blockType = blockType;
        this.col = col;
        this.row = row;

        this.isSpecialBlock = blockType !== BlockType.NORMAL;
    }

    setBlockType(blockType) {
        this.blockType = blockType;
        if(blockType !== BlockType.NORMAL) {
            this.isSpecialBlock = true;
        } else {
            this.isSpecialBlock = false;
        }
    }
}

function makeNormalBlock(row, col, x, y) {
    let block = paper.rect(col, row, BLOCK_DIMEN, BLOCK_DIMEN).attr({
        fill: WHITE, 
        stroke: "#000",
        "stroke-width": 1,
        "stroke-opacity": 0.2
    });
    
    let meta = new MetaInfo(BlockType.NORMAL, x, y);

    block.meta = meta;
    block.meta.customWeight = STOCK_WEIGHT;
    let hoverIn = function(ele){
        if (!mouseDown) return;
        if (block.meta.blockType !== BlockType.NORMAL) return; // dont override wall blocks
        
        if (pickingSourceNode) {
            
            makeSourceNode(this);
        } else if (pickingDestNode) {
            makeDestNode(this);
        } else {
            makeWall(this);
        }
    };

    let hoverOut = function (ele) {
        if (block.meta.blockType === BlockType.SOURCE && pickingSourceNode) {
            makeNormalAgain(this);
        }

        if (block.meta.blockType === BlockType.DEST && pickingDestNode) {
            makeNormalAgain(this);
        }
    }

    block.hover(hoverIn, hoverOut);
    block.mousedown(function (event) {
        mouseDown = true;
        
        if (block.meta.isSpecialBlock) {
            
            if (block.meta.blockType === BlockType.SOURCE) {
                pickingSourceNode = true;
            } else if (block.meta.blockType === BlockType.DEST) {
                pickingDestNode = true;
            }
            
            makeNormalAgain(this);
            return;
        }
        if (pickingSourceNode) {
            makeSourceNode(this);
        } else if (pickingDestNode) {
            makeDestNode(this);

        } else if(isAddingWeight()) {
            makeWeightedNode(this);
        } else {
            makeWall(this);
        }        
    });

    block.mouseup(function (event) {
        mouseDown = false;
        if (pickingSourceNode) {
            makeSourceNode(this);
            pickingSourceNode = false;
        }

        if (pickingDestNode) {
            makeDestNode(this);
            pickingDestNode = false;
        }
         //console.log(mouseDown)
    });

    blocks.push(block);
    return block;
}



function pickSourceNode() {
    console.log("hello")
    pickingSourceNode = true;
}


function resize() {
    paper.setSize(window.innerHeight, window.innerWidth);
    drawBoard();
}

window.addEventListener('resize', ()=> {
    resize();
} )

function pickDestNode() {
    pickingDestNode = true;
}

function getMatrix() {
    return blockMatrix;
}

function redraw() {
    blockMatrix = [];
    drawBoard();
    resetTouchedNode();
}

function getScaleAnimation (lightColor, darkColor) {
    return Raphael.animation( { 
        0.25: {transform: "s1.2", fill: darkColor}, 
        0.5: { transform: "s1.15", fill: lightColor }, 
        0.75: { transform: 's1.1', fill: lightColor  }, 
        1: { transform: 's1'} 
      }, 300 );

    
}


function start() {
    createGraph();

    let touchedNodes = getTouchedNodes();
    if (touchedNodes != null && touchedNodes.length > 0) {
        for (let i = 0; i < touchedNodes.length; i++) {
            if (touchedNodes[i].visualBlock.meta.blockType === BlockType.NORMAL || touchedNodes[i].visualBlock.meta.blockType === BlockType.WEIGHTED) {
                if (touchedNodes[i].visualBlock.meta.blockType === BlockType.WEIGHTED) {
                    makeWeightedNode(touchedNodes[i].visualBlock);
                } else {
                    makeNormalAgain(touchedNodes[i].visualBlock);
                }                
                //  deleting properties injected by search algorithms.
                delete touchedNodes[i].visited;
                delete touchedNodes[i].parent;
                delete touchedNodes[i].cost; // 
            } 
                
        }
    }

    
    resetTouchedNode();
    const SearchAlgoType = Object.freeze({ "BFS": 0, "A_STAR": 1, "DIJKSTRA": 2, "DFS": 3 });
    
    const selectedVal = document.getElementById("algos").selectedIndex;
   
    switch (parseInt(selectedVal)) {
        case SearchAlgoType.BFS:
            console.log("in case");
            BFSSearch();
            break;
        case SearchAlgoType.A_STAR:
            aStarSearch();
            break;
        case SearchAlgoType.DIJKSTRA:
            dijkstraSearch();
            break;
        case SearchAlgoType.DFS:
            dfsSearch();
            break;
        default:
            console.log(selectedVal === SearchAlgoType.BFS);

            break;
    }

}

function isAddingWeight() {
    return document.getElementById("add_weight_checkbox").checked;
}