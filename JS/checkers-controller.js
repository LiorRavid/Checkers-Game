'use strict'

function onNewGame(){
    setIsStartGame(true);
    renderHTML();
}

function renderHTML() {
    let strHtml = '';
    strHtml = `<header class="header">
               <aside class="side-bar"></aside>
               <div class="text-header">Checkers Game</div>
               <aside class="side-bar"></aside>
               </header>`;
    if(getIsStartGame()){
        strHtml += boardToHtmlString();
    }
    else{
        strHtml += `<section class="main-section">
                    <aside class="side-bar">
                    <div class="btn" onClick="onNewGame()"><div>New Game</div></div>
                    <div class="btn"><div id="draw">Draw</div></div>
                    <div class="btn"><div id="end-game">End Game</div></div>
                    </aside>
                    <main class="main-content"></main>
                    <aside class="side-bar"><div class="btn"><span id="playerTurn"></span></div></aside>
                    </section>`;
    }
    const body = document.querySelector("body");
    body.innerHTML = strHtml;
    const playerTurn = getIsWhiteTurn()? "White Turn":"Black Turn"; 
    document.getElementById('playerTurn').innerHTML = playerTurn;
    createModal();
    const askForDraw = document.getElementById('draw');
    askForDraw.addEventListener('click', (event) => {
        onOpenModal(event);
    });
    const endGame = document.getElementById('end-game');
    endGame.addEventListener('click', (event) => {
        onOpenModal(event);
    });
    if(getIsStartGame()){
        addOnClickListener();
    }
}

function boardToHtmlString() {
    let strHtml = '';
    strHtml +=`<section class="main-section">
               <aside class="side-bar">
               <div class="btn" onClick="onNewGame()"><div>New Game</div></div>
               <div class="btn"><div id="draw">Draw</div></div>
               <div class="btn"><div id="end-game">End Game</div></div>
               </aside>
               <main class="main-content">
               <article class="checkers-board">`;
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            let cell = getCellForDisplay(i, j);
            strHtml += `<div id="${i}${j}" class=" cell ${cell===null ? 'white-cell':'black-cell'}">`;
            if(cell){
                if(cell.color)
                    strHtml;
                else{
                    strHtml += `<div class=" piece ${(cell.isWhite)?'white':'black'}-piece ${(cell.isKing)?'crown-img':''}" onclick="onChoosePiece(event,${i},${j})"></div>`;
                }    
            }
            strHtml+=`</div>`
        }
    }
    strHtml += `</article>
                </main>
                <aside class="side-bar"><div class="btn"><span id="playerTurn"></span></div></aside>
                </section>`;
    return strHtml;
}

function onChoosePiece(event,i,j){
    event.stopPropagation();
    const piece = event.target;
    if(choosePiece(i,j)){
        setIsFirstClick();
        setChoosenPieceCell(i,j);
        let prevCheckedPiece = document.querySelector('.picked-piece')
        if(prevCheckedPiece !== null){
            setIsFirstClick();
            prevCheckedPiece.classList.remove('picked-piece'); 
        }
        piece.classList.add('picked-piece');
    }
    else 
        return; 
}

function onChooseMoveToCell(moveTo){
    if(getIsFirstClick()){
        return;
    }
    else{
        const moveFrom = getChoosenPieceCell();
        if(isLegalMove(moveFrom,moveTo)){
            movePiece(moveFrom,moveTo);
            setIsWhiteTurn();
            setIsFirstClick();
            renderHTML();
            if(isWin()){
                onWin(true);
            }
            else if(isStaleMate()){
                onWin(false);
            }
        }
    }
}

function addOnClickListener(){
    const blackCells = document.querySelectorAll('.black-cell');
    blackCells.forEach((cell)=>{
        cell.addEventListener('click', (event)=>{
            const cell = event.target.attributes.id.value;
            const i = parseInt(cell[0]);
            const j = parseInt(cell[1]);
            const moveTo = {row:i,column:j};
            onChooseMoveToCell(moveTo)});
    })
}

function onWin(bool){
    const modal = document.getElementById('modal');
    const modalBox = document.getElementById('modalBox');
    const playerTurn = getIsWhiteTurn()? "Black":"White"; 
    document.getElementById('playerTurn').innerHTML = playerTurn;
    const modalHeader = document.getElementById('modalHeader');
    const btnAccept = document.getElementById('btnAccept');
    const btnCloseModal = document.getElementById('btnCloseModal');
    modal.addEventListener('click', () => {
        modal.className = 'none';
    });
    btnCloseModal.addEventListener('click', () => {
        setIsStartGame(false);
        init();
        modal.className = 'none';
    });
    btnAccept.addEventListener('click', () => {
        setIsStartGame(false);
        init();
        modal.className = 'none';
    });
    modalBox.addEventListener('click', (event) => {
        event.stopPropagation();
    });
    if(bool){
        modalHeader.innerHTML=`${playerTurn} player Win`;
    }
    else if(!bool){
        modalHeader.innerHTML="StaleMate"; 
    }
    btnAccept.innerHTML = "Accept";
    btnCloseModal.innerHTML = "Close";
    modal.className = 'modal';
}


function onOpenModal(event){
    const modal = document.getElementById('modal');
    const modalBox = document.getElementById('modalBox');
    const modalHeader = document.getElementById('modalHeader');
    const btnAccept = document.getElementById('btnAccept');
    const btnCloseModal = document.getElementById('btnCloseModal');
    if(event.target.attributes.id.value === 'draw'){
        onAskDraw();
    }
    if(event.target.attributes.id.value === 'end-game'){
        onEndGame();
    }
    modal.className = 'modal';
    modal.addEventListener('click', () => {
        modal.className = 'none';
    });
    btnCloseModal.addEventListener('click', () => {
        modal.className = 'none';
    });
    modalBox.addEventListener('click', (event) => {
        event.stopPropagation();
    });
    btnAccept.addEventListener('click', () => {
        setIsStartGame(false);
        init();
        modal.className = 'none';
    });
}

function onAskDraw(){
    const modalHeader = document.getElementById('modalHeader');
    const btnAccept = document.getElementById('btnAccept');
    const btnCloseModal = document.getElementById('btnCloseModal');
    modalHeader.innerHTML="Ask for a draw";
    btnAccept.innerHTML = "Accept";
    btnCloseModal.innerHTML = "Close";
}

function onEndGame(){
    const modalHeader = document.getElementById('modalHeader');
    const btnAccept = document.getElementById('btnAccept');
    const btnCloseModal = document.getElementById('btnCloseModal');
    modalHeader.innerHTML="Are you sure?";
    btnAccept.innerHTML = "End";
    btnCloseModal.innerHTML = "Close";
}

function createModal(){
    let strHtml;
    strHtml = `<div id="modal" class="none">
               <div id="modalBox" class="modal__box">
               <header id="modalHeader" class="modalHeader"></header>
               <div class="modalBtns">
               <div id="btnCloseModal" class="btnModal"></div>
               <div id="btnAccept" class="btnModal"></div>
               </div></div></div>`
    const body = document.querySelector("body");
    body.innerHTML += strHtml;
}
