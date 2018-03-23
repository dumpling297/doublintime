import { zip, reverse, unzip, isEqual } from 'lodash';

const BOARD_DISPLAY=[
  [0,0,0,0],
  [0,0,0,0],
  [0,0,0,0],
  [0,0,0,0]
];


class Board{
  constructor(size = 4){
    this.size = size;
    this.grid = this.makeGrid(size);
    this.potScore = 0;
    this.score = 0;
    this.DIRS = ['up', 'down', 'left', 'right'];
    // this.addRandomCell();
    // this.addRandomCell();
    this.addFixedCell();
  }

  makeGrid(size){
    const grid = [];
    for(let row = 0; row < size; row++){

      const newRow = [];
      for(let col = 0; col < size; col++){
        newRow.push(0);
      }
      grid.push(newRow);
    }
    return grid;
  }
  addRandomCell(){
    let row = Math.floor(Math.random() * this.size);
    let col = Math.floor(Math.random() * this.size);
    while(this.grid[row][col]){
      row = Math.floor(Math.random() * this.size);
      col = Math.floor(Math.random() * this.size);
    }
    let val;
    if(this.score < 2000){
      val = 2;
    }else{
      val = ((Math.floor(Math.random() * 2) * 2) + 2);
    }
    this.grid[row][col] = val;
  }
  addFixedCell(){
    this.grid[0][0] = 0;
    this.grid[0][1] = 2;
    this.grid[0][2] = 4;
    this.grid[0][3] = 8;
    this.grid[1][0] = 16;
    this.grid[1][1] = 32;
    this.grid[1][2] = 64;
    this.grid[1][3] = 128;
    this.grid[2][0] = 256;
    this.grid[2][1] = 512;
    this.grid[2][2] = 1024;
    this.grid[2][3] = 2048;
    this.grid[3][0] = 0;
    this.grid[3][1] = 2;
    this.grid[3][2] = 4;
    this.grid[3][3] = 8;

  }


  collapse(arr){
    let newArr = [];
    const resultArr = [];
    arr.forEach(el => {
      if (el) {newArr.push(el);}
    });
    for(let i = 0; i < newArr.length; i++){
      if (newArr[i] === newArr[i + 1]){
        resultArr.push(newArr[i] * 2);
        this.potScore += (newArr[i] * 2);
        i++;
      } else{
        resultArr.push(newArr[i]);
      }
    }
    while(resultArr.length < this.size){ resultArr.push(0);}
    return resultArr;
  }

  potMove(dir){
    let modArr;
    let collArr;
    switch (dir) {
      case 'up':
        modArr = zip(...this.grid);
        collArr = modArr.map(tRow => this.collapse(tRow));
        collArr = unzip(collArr);
        break;
      case 'down':
      modArr = zip(...this.grid);
      modArr = modArr.map(row => reverse(row));
      collArr = modArr.map(tRow => this.collapse(tRow));
      collArr = collArr.map(row => reverse(row));
      collArr = unzip(collArr);
        break;
      case 'right':
        modArr = this.grid.map(row => reverse(row));
        collArr = modArr.map(tRow => this.collapse(tRow));
        collArr = collArr.map(row =>reverse(row));
        break;
      case 'left':
        collArr = this.grid.map(row => this.collapse(row));
        break;
      default:
        collArr = this.grid;
    }
    return collArr;
  }

  makeMove(dir){
    const postMove = this.potMove(dir);
    if(!isEqual(postMove, this.grid)){
      this.score += this.potScore;
      this.potScore = 0;
      this.grid = postMove;
      this.addRandomCell();
    }

  }
  emptySpaces(){
    for(let row = 0; row < this.size; row++){
      for(let col = 0; col < this.size; col++){
        if(this.grid[row][col] === 0){
          return true;
        }
      }
    }
    return false;
  }
  isOver(){
    if(this.emptySpaces()){
      return false;
    }
    for(let i = 0; i < this.DIRS.length; i++){
       if(!isEqual(this.potMoves(this.DIRS[i]), this.grid)){
         this.potScore = 0;
         return false;
       }
    }
    this.potScore = 0;
    return true;
  }
  draw(ctx){
    const colors ={
      0:'#CBC1B5',
      2:'#EDE4DB',
      4:'#EBE0CB',
      8:'#EAB381',
      16:'#E9996C',
      32:'#E88266',
      64:'#E66747',
      128:'#ECD590',
      256:'#EACA74',
      512:'#EAC568',
      1024:'#E8C15A',
      2048:'#EABF51',
    };
    for(let i = 0; i < this.size; i++){
      for(let j = 0; j < this.size; j++){
        const val =this.grid[i][j];
        ctx.fillStyle = colors[val];
        ctx.fillRect( (120) * j, (120) * i, 100, 100 );
        ctx.fillStyle = '#000000';
        ctx.fillText(val, ((120) * j) + 50, ((120) * i) + 50);

      }
    }
  }

}

export default Board;
