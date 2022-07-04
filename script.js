const restart = document.getElementById('restart'); //Reiniciar
let label = document.getElementById('player'); //Label de anuncio do vencedor
const game = new Game();
game.start();

function Game(){
    //Instancia o tabuleiro e os jogadores
    const board = new Board();
    const player = new Player(board);
    const computer = new Computer(board);
    let turnCount = 0;

    this.start = function(){

        //Define as configurações para a observação de DOM nodes pelo MutationObserver
        const config = {childList: true};

        //Instancia MutationObserver(), afim de monitorar alterações no DOM da página,
        //em específico nos campos 'input' (as casas do tabuleiro)
        const observer = new MutationObserver(() => turn());
        board.positions.forEach((house) => observer.observe(house, config));
        turn();
    }

    //Função do turno de jogo
    function turn(){

        //Verifica se há um vencedor
        if(board.winnerCheck()){return;}

        //Turnos pares são do jogador(0 incluso), ímpares são do computador
        if(turnCount % 2 === 0){
            player.turn();
        }else{
            computer.turn();
        }

        //Próximo turno
        turnCount++;
    }; //<<<<<<<<<<<<<<<<<<<<

    //Reiniciando todas as variáveis de jogo
    restart.addEventListener('click', (event) => {
        for(let i = 0; i < 9; i++){
            board.positions[i].innerText = ''; //Desocupa todas as casas
            board.positions[i].classList.replace('winner', 'house'); //Deixa as casas cinzas novamente
        }
        winner = false;
        label.innerText = 'Jogo da Velha';
        turnCount = 0;
        player.turn();
    });
}

//Função que define o tabuleiro de jogo
function Board(){

    //'positions' é o array de 'input's que representa o tabuleiro
    this.positions = Array.from(document.querySelectorAll('.house')); //Tabuleiro do jogo

    //Função que determina o vencedor da partida
    this.winnerCheck = function(){
        let winner = false;

        //Combinações no array que configuram vitória
        const winCondition = [
            [0,1,2],
            [0,3,6],
            [0,4,8],
            [2,4,6],
            [2,5,8],
            [1,4,7],
            [3,4,5],
            [6,7,8]
        ]; //<<<<<<<<<<<<<<<<<<<<<<<<<

        //Instancia as posições do tabuleiro para uso na verificação da condição de vitória
        const positions = this.positions;

        //Verifica cada combinação de vitória possível em winCondition com o uso das variáveis auxiliares house0, house1 e house2
        winCondition.forEach((winCondition) => {
            const house0 = positions[winCondition[0]].innerText;
            const house1 = positions[winCondition[1]].innerText;
            const house2 = positions[winCondition[2]].innerText;

            //Instancia a variável win para registrar se alguma condição de vitória foi alcançada
            const win = (house0 !== '') && (house0 === house1) && (house1 === house2);

            //Se a condição de vitória for satisfeita, exibe o nome do vencedor
            if(win){
                winner = true;
                winCondition.forEach((i) => {
                    positions[i].classList.replace('house', 'winner'); //Deixa as casas vencedoras verdes
                    label.innerText = positions[i].innerText + ' é o vencedor!';
                }) 
            }
        }); //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

        return winner;
    }
}

//Função do turno do jogador(X), recebe o tabuleiro como parametro
function Player(board){

    this.turn = function(){
        //Quando o usuário clicar em uma casa chama nextTurn
        board.positions.forEach(house => house.addEventListener('click', nextTurn));
    }

    //Marca a casa clicada e remove o eventListener do clique
    function nextTurn(event){
        //Se a casa estiver vazia e não houver vencedor marca a casa para o jogador
        if((event.target.innerText === '')){
            event.target.innerText = 'X';
            event.target.style.color = '#F60';
            board.positions.forEach(house => house.removeEventListener('click', nextTurn));
        }
    }
}

//Função do turno do computador(O), recebe o tabuleiro como parametro
function Computer(board){
    this.turn = function(){
        //Filtra as posições vagas no tabuleiro e atribui à variável openPos
        let openPos = board.positions.filter((p) => p.innerText === '');
        //Ocupa uma posição disponível no tabuleiro de forma aleatória
        const move = Math.floor(Math.random() * (openPos.length - 0));
        openPos[move].innerText = 'O';
        openPos[move].style.color = '#06F';
    }
}