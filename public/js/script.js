const blockCount = 50;
const canvas = document.getElementById('canvas'),

elemLeft = canvas.offsetLeft,
elemTop = canvas.offsetTop;

const context = canvas.getContext('2d');
const blocks = [];


window.addEventListener('load', () => {
    resize();
    drawBoard();
})


canvas.addEventListener('click', function(event) {
    var xVal = event.pageX - elemLeft,
    yVal = event.pageY - elemTop;

    blocks.forEach(function(ele) {
       if (yVal > ele.y && yVal < ele.y + ele.height && xVal > ele.x && xVal < ele.x + ele.width) {
           ele.color = "#000";
          updateBlock(ele);
       }
    });

 }, false);



function drawBoard() {
    var width = window.innerWidth/blockCount;
    var height = width;
    console.log(window.innerWidth);
   
    var y = 0;
    for(var j = 0; j <= window.innerHeight; j++) {
        var x = 0;
        for(var i = 0; i < blockCount; i++) {
            createBlocks(x, y, width, height, j, i);
            //drawBlock();
            x = x + width;
        }

        y = y + width;
        j = j + width;
    }
    drawBlocks();
    
    //context.fillRect(100, 50, 200, 200);
}

function createBlocks(x, y, width, height, row, col) {
    var block = {
        x : x,
        y: y,
        width: width,
        height: height,
        row: row,
        col: col,
        color: '#fff'
    }
    blocks.push(block);
    //context.strokeRect(x, y, width, height);
}

function updateBlock(block) {
    for(var i = 0; i < blocks.length;i++) {
        if(block.row == blocks[i].row && block.col == blocks[i].col) {
            block.color = '#000';
            drawBlocks();
        }    
    }
    //context.clearRect(block.x, block.y, block.width, block.height);
}

function drawBlocks() {
    blocks.forEach(function(block) {
        context.strokeRect(block.x, block.y, block.width, block.height);
        context.fillStyle= block.color;    // color of fill
        context.fillRect(block.x, block.y, block.width, block.height);
    })
}

function resize() {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    drawBoard();
}

window.addEventListener('resize', ()=> {
    resize();
} )