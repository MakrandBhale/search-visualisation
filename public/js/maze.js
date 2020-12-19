const Orientation = Object.freeze({"HORIZONTAL":0, "VERTICAL":1});
const Direction = Object.freeze({"SOUTH":0, "EAST":1});

async function createMaze() {
    // maze creation using recursive division method.
    let grid = getMatrix();
    //await makeBorder(grid);
    let width = grid[0].length-1;
    let height = grid.length-1;
    //await divide(grid, 1, width,1, height, chooseOrientation(width, height))
}

async function divide(grid, startX, endX, startY,  endY, orientation) {
    let width = (endX - startX);
    let height = (endY - startY);

    if(height < 2 || width < 2) return;
    let isHorizontal = orientation === Orientation.HORIZONTAL;
    let dx, dy, length, wx, wy;
    let gap;
    if(isHorizontal) {
        dx = 1; dy = 0;
        length = width;
        wy = getOddRandom(startY, height);
        gap = getRandom(startY+1, height-1);
        wx = startX;
    } else {
        dx = 0; dy = 1;
        length = height;
        wx = getOddRandom(startX, width);
        gap = getRandom(startX+1, width-1);
        wy = startY;
    }

    console.log({wx, wy, dx, dy, gap})
    for(let i = 0; i <= length; i++) {
        let node = grid[wy][wx];
        if(gap !== wx && gap !== wy) {
            makeWall(node, true);
        }
        wx = wx + dx;
        wy = wy + dy;
    }

    if(isHorizontal) {
        await divide(grid, startX, endX, startY, wy, chooseOrientation(width, height));
        await divide(grid, startX, endX, wy, endY, chooseOrientation(width, height));
    } else {
        await divide(grid, startX, wx, startY, endY, chooseOrientation(width, height));
        await divide(grid, wx, endX, startY, endY, chooseOrientation(width, height));
    }

}

function chooseOrientation(width, height) {
    if(width > height)
        return Orientation.VERTICAL;
    else
        return Orientation.HORIZONTAL;
}

function getRandom(min, max){
    return Math.floor(Math.random() * (max - min) + min);
}

function getEvenRandom(min, max) {
    return Math.floor(( Math.random() * max / 2 ) + min) * 2;
}

function getOddRandom(min, max) {
    let randNum = getRandom(min, max);
    if(randNum %2 === 0){//generated number is even
        if(randNum === max){
            randNum  = randNum -1 ;
        }else{
            randNum  = randNum +1 ;
        }
    }
    return randNum;
}

async function makeBorder(grid) {
    await sleep(10);
    for(let i = 0; i < grid[0].length; i++) {
        let node = grid[0][i];
        let bottomNode = grid[grid.length - 1][i];
        makeWall(node, true);
        makeWall(bottomNode, true);
    }

    for(let i = 0; i < grid.length; i++) {
        let  node = grid[i][0];
        makeWall(node, true);
        let rightNode = grid[i][grid[0].length - 1];
        makeWall(rightNode, true);
    }
}