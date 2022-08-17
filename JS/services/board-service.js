'use strict'

let gBoard = [];

function createBoard(){
    let board = [];
    let isWhite = true;
    for(let i=0;i<8;i++){
        board.push([]);
        for(let j=0;j<8;j++){
            if((i%2 === 0 && j%2 !== 0) || (i%2 !== 0 && j%2 === 0))
            {
                if(i===3 || i===4)
                    board[i][j] = blackCell();//this represent an empty black cell
                else{
                    let type = (i>4) ? isWhite:!isWhite;
                    board[i][j] = createPiece(type);//this represent a black cell with checker piece
                }
            }
            else
                board[i][j]=null;//this represent a white cell
        }
    }
    return board;
}

function createPiece(type){
    return {isWhite:type,isKing:false};
}

function blackCell(){
    return {color:'emptyBlackCell'};
}

function getCellForDisplay(i,j){
    return gBoard[i][j];
}




