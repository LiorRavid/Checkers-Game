'use strict'

let chekersGame;

function setChekersGame(){
    return chekersGame = {isStartGame:false,isWhiteTurn:true,isFirstClick:true,choosenPieceCell:{row:null,column:null},blackPieceCount:12,whitePieceCount:12};
}

function setChekersBoard(moveFrom,moveTo){
    const emptyCell = {color:'emptyBlackCell'}
    let rowDiff,columnDiff,direction,isMainDiagonal=true;
    rowDiff = moveTo.row - moveFrom.row;
    columnDiff = moveTo.column - moveFrom.column;
    if(columnDiff === -rowDiff)
        isMainDiagonal = false;
    if(chekersGame.isWhiteTurn){
        direction= isMainDiagonal ? -1 : 1;
    }
    else if(!chekersGame.isWhiteTurn){
        direction= isMainDiagonal ? 1 : -1;
    }
    if(Math.abs(rowDiff) === 1){
            const burnedPieces = getBurnedPieces();
            if(((moveTo.row === 0 && chekersGame.isWhiteTurn)|| (moveTo.row === 7 && !chekersGame.isWhiteTurn)) && !gBoard[moveFrom.row][moveFrom.column].isKing){
                piecePromotion(gBoard[moveFrom.row][moveFrom.column]);
            }
            const length = burnedPieces.length;``
            if(length>0){
                for(let i=0;i<length;i++){
                    if(gBoard[burnedPieces[i].row][burnedPieces[i].column].isWhite){
                        chekersGame.whitePieceCount--;
                    }
                    else if(!gBoard[burnedPieces[i].row][burnedPieces[i].column].isWhite){
                        chekersGame.blackPieceCount--;
                    }
                    gBoard[burnedPieces[i].row][burnedPieces[i].column] = emptyCell;
                }  
            }
            gBoard[moveTo.row][moveTo.column] = gBoard[moveFrom.row][moveFrom.column];
            gBoard[moveFrom.row][moveFrom.column] = emptyCell;
    }
    if(Math.abs(rowDiff) === 2){
        gBoard[moveTo.row][moveTo.column] = gBoard[moveFrom.row][moveFrom.column];
        gBoard[moveFrom.row][moveFrom.column] = emptyCell;
        if(chekersGame.isWhiteTurn){
            chekersGame.blackPieceCount--;
            if( gBoard[moveTo.row][moveTo.column].isKing){
                if(rowDiff<0){
                    gBoard[moveFrom.row - 1][moveFrom.column + direction] = emptyCell;
                }
                else if(rowDiff>0){
                    gBoard[moveFrom.row +1][moveFrom.column - direction] = emptyCell;
                }
            }
            else{
                gBoard[moveFrom.row -1][moveFrom.column + direction] = emptyCell;
            }
        }
        else if(!chekersGame.isWhiteTurn){
            chekersGame.whitePieceCount--;
            if( gBoard[moveTo.row][moveTo.column].isKing){
                if(rowDiff<0){
                    gBoard[moveFrom.row - 1][moveFrom.column - direction] = emptyCell;
                }
                else if(rowDiff>0){
                    gBoard[moveFrom.row +1][moveFrom.column + direction] = emptyCell;
                }
            }
            else{
                gBoard[moveFrom.row +1][moveFrom.column + direction] = emptyCell;
            }
        }
    }
}

function choosePiece(i,j){
    if(chekersGame.isWhiteTurn){
        if(gBoard[i][j].isWhite){
            return true; 
        }
    }
    else{
        if(!gBoard[i][j].isWhite){
            return true;
        }
    }
}

function setChoosenPieceCell(i,j){
    chekersGame.choosenPieceCell.row = i;
    chekersGame.choosenPieceCell.column = j;
}

function getChoosenPieceCell(){
    return chekersGame.choosenPieceCell;
}

function getIsStartGame(){
    return chekersGame.isStartGame;
}

function setIsStartGame(bool){
    chekersGame.isStartGame = bool;
}

function setIsWhiteTurn(){
    chekersGame.isWhiteTurn = !chekersGame.isWhiteTurn;
}

function getIsWhiteTurn(){
    return chekersGame.isWhiteTurn;
}

function setIsFirstClick(){
    chekersGame.isFirstClick = !chekersGame.isFirstClick;
}

function getIsFirstClick(){
    return chekersGame.isFirstClick;
}

function movePiece(moveFrom,moveTo){
    setChekersBoard(moveFrom,moveTo);
}

function isLegalMove(moveFrom,moveTo){
    let rowDiff,columnDiff;
    rowDiff = moveTo.row - moveFrom.row;
    columnDiff = moveTo.column - moveFrom.column;
    if((Math.abs(rowDiff)<=2) && (Math.abs(rowDiff) === Math.abs(columnDiff))){
        if(gBoard[moveFrom.row][moveFrom.column].isKing){
            if(isKingFreeToMove(moveFrom,moveTo,rowDiff,columnDiff)){
                return true;
            }
            else{
                return false;
            }
        }
        if(isPieceFreeToMove(moveFrom,moveTo,rowDiff,columnDiff))
            return true;
    }
    return false;
}

function isPieceFreeToMove(moveFrom,moveTo,rowDiff,columnDiff){
    let direction,isMainDiagonal=true;
    if(columnDiff === -rowDiff)
        isMainDiagonal = false;
    if(chekersGame.isWhiteTurn){
        direction= isMainDiagonal ? -1 : 1;
    }
    else if(!chekersGame.isWhiteTurn){
        direction= isMainDiagonal ? 1 : -1;
    }
    if(gBoard[moveTo.row][moveTo.column].color === 'emptyBlackCell'){
        if(rowDiff === -1 && chekersGame.isWhiteTurn){
                return true;
        }
        else if(rowDiff === 1 &&!chekersGame.isWhiteTurn){
                return true;
        }
        if(rowDiff === -2 && chekersGame.isWhiteTurn){
                const cellValue = gBoard[moveFrom.row -1][moveFrom.column + direction].isWhite;
                if(!cellValue && !gBoard[moveFrom.row -1][moveFrom.column + direction].color)
                    return true;
        }
        else if(rowDiff === 2 && !chekersGame.isWhiteTurn){
            const cellValue = gBoard[moveFrom.row +1][moveFrom.column + direction].isWhite;
            if(cellValue && !gBoard[moveFrom.row +1][moveFrom.column + direction].color)
                return true;
        }
    }
    return false;
}

function isKingFreeToMove(moveFrom,moveTo,rowDiff,columnDiff){
    let rowDirection,columnDirection,isMainDiagonal=true;
    if(columnDiff === -rowDiff)
        isMainDiagonal = false;
    if(rowDiff<0){
        rowDirection= -1;
        columnDirection = isMainDiagonal ? -1 : 1;
    }
    else if(rowDiff > 0 ){
        rowDirection= 1;
        columnDirection = isMainDiagonal ? 1 : -1;
    }
    if(gBoard[moveTo.row][moveTo.column].color === 'emptyBlackCell'){
        if(Math.abs(rowDiff) === 1){
                return true;
        }
        const cellValue = gBoard[moveFrom.row + rowDirection][moveFrom.column + columnDirection].isWhite;
        if(Math.abs(rowDiff) === 2){
            if(gBoard[moveFrom.row][moveFrom.column].isWhite){
                if(!cellValue && !gBoard[moveFrom.row + rowDirection][moveFrom.column + columnDirection].color)
                    return true;
            }
            else if(!gBoard[moveFrom.row][moveFrom.column].isWhite){
                if(cellValue && !gBoard[moveFrom.row + rowDirection][moveFrom.column + columnDirection].color)
                    return true;
            }
        }
    }
    return false;
}

function getBurnedPieces(){
    const isWhiteTurn = chekersGame.isWhiteTurn;
    let rowDiff,columnDiff,burnedPieces=[];
    for(let i=0;i<8;i++){
        for(let j=0;j<8;j++){
            if(!gBoard[i][j] || gBoard[i][j].color || gBoard[i][j].isWhite !== isWhiteTurn){
                continue;
            }
            else{
                for(let z=0;z<8;z++){
                    for(let w=0;w<8;w++){
                        if(!gBoard[z][w]){
                            continue;
                        }
                        const moveFrom = {row:i,column:j};
                        const moveTo = {row:z,column:w};
                        rowDiff = moveTo.row - moveFrom.row;
                        columnDiff = moveTo.column - moveFrom.column;
                        if(Math.abs(rowDiff) === 2 && (Math.abs(rowDiff) === Math.abs(columnDiff))){
                            if(gBoard[moveFrom.row][moveFrom.column].isKing){
                                if(isKingFreeToMove(moveFrom,moveTo,rowDiff,columnDiff)){
                                    burnedPieces.push({row:moveFrom.row, column:moveFrom.column});
                                }
                            }
                            else if(isPieceFreeToMove(moveFrom,moveTo,rowDiff,columnDiff)){
                                burnedPieces.push({row:moveFrom.row, column:moveFrom.column});
                            }  
                        }
                    }
                }
            }
        }
    }
    return burnedPieces;
}

function isWin(){
    if(chekersGame.blackPieceCount === 0 || chekersGame.whitePieceCount === 0)
        return true;
    return false;
}

function isStaleMate(){
    const isWhiteTurn = chekersGame.isWhiteTurn;
    for(let i=0;i<8;i++){
        for(let j=0;j<8;j++){
            if(!gBoard[i][j] || gBoard[i][j].color || gBoard[i][j].isWhite !== isWhiteTurn){
                continue;
            }
            else{
                for(let z=0;z<8;z++){
                    for(let w=0;w<8;w++){
                        if(!gBoard[z][w]){
                            continue;
                        }
                        const moveFrom = {row:i,column:j};
                        const moveTo = {row:z,column:w};
                        if(isLegalMove(moveFrom,moveTo)){
                            return false;
                        }
                        else{
                            continue;
                        }
                    }
                }
            }
        }
    }
    return true;
}

function piecePromotion(piece){
    piece.isKing = true;
}


