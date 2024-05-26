const lista_sustenido = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 
                         'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const lista_bemol = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B', 
                     'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

const lista_modos = ['Jônio (maior)', 'Dórico', 'Frígio', 'Lídio', 'Mixolídio', 'Eólio (menor)', 'Lócrio'];
const base_tom = [1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1];
const posicoes_inicio = [0, 2, 4, 5, 7, 9, 11] // posicao dos primeiros 1s (notas) da lista de cima
const base_acordes = ['', 'm', 'm', '', '', 'm', 'dim', '', 'm', 'm', '', '', 'm', 'dim'];
const base_setimas = ['7M', '7', '7', '7M', '7', '7', 'Ø', '7M', '7', '7', '7M', '7', '7', 'Ø'];
const audio_notas = {} 

//adiciona as infos de audio de cada nota no dicionario "audio_notas"
lista_1a3 = lista_bemol.concat(lista_bemol.slice(0, 12))
for (c in lista_1a3){
    let nota = lista_1a3[c];
    if (c < 12){
        audio_notas[nota] = new Audio(`Sons/${nota}.mp3`);
    } else if (c < 24) {
        audio_notas[`${nota}2`] = new Audio(`Sons/${nota}2.mp3`);
    } else {
        audio_notas[`${nota}3`] = new Audio(`Sons/${nota}3.mp3`);
    }
}

// cria as options com cada modo no select com ids de 0 a 6
for (cont in lista_modos){               
    var option = document.createElement('option');
    option.id = `${cont}`;
    option.text = lista_modos[cont];
    let modos = document.getElementById('select');
    modos.appendChild(option);
}

// cria os botoes com ids e textos de cada nota
let div = document.getElementById('notas');
criar_botoes()
function criar_botoes(){
    div.innerHTML = ''
    if (document.getElementById('switch').checked){
        lista_notas = lista_sustenido
    } else { lista_notas = lista_bemol }
    lista_notas.forEach(function(nota){                  
        if (div.querySelectorAll('button').length < 12){
            var botao = document.createElement('button');
            botao.id = nota;
            botao.innerText = nota;
            botao.classList.add('botoes_padrao');
            div.appendChild(botao);
        }
    })
    //cria o botão de limpar
    let botao_limpar = document.createElement('button');
    botao_limpar.id = 'limpar';
    botao_limpar.innerText = 'Limpar';
    div.appendChild(botao_limpar);
    botao_limpar = document.getElementById('limpar');
    botao_limpar.onclick = function run(){cores(null, 'limpar')}

}


// cria recortes e executa as funções se algum botão for clicado
document.body.addEventListener("click", event => {
    if (event.target.nodeName == "BUTTON") {
        let id_clicado = event.target.id;
        const select = document.getElementById('select');
        var options = select.options;
        var id_modo = parseInt(options[options.selectedIndex].id);

        var modo_escolhido = base_tom.slice(posicoes_inicio[id_modo], (posicoes_inicio[id_modo] + 12));
        var lista_acordes = base_acordes.slice(id_modo, (id_modo + 7));
        var lista_setimas = base_setimas.slice(id_modo, (id_modo + 7));

        finalizacao(id_clicado, modo_escolhido, lista_acordes, lista_setimas, id_modo, nota(id_clicado));
    }
})

// cria uma lista (recorte da lista 'lista_notas') a partir da nota escolhida
var nota_escolhida_sons;
function nota(id_clicado){
    var nota_escolhida = [];
    let posicao_nota = lista_notas.indexOf(String(id_clicado));
    nota_escolhida = lista_notas.slice(posicao_nota, (posicao_nota + 12));
    nota_escolhida_sons = lista_bemol.slice(posicao_nota, (posicao_nota + 12));
    return nota_escolhida;
}

// roda as funções de cor e texto dependendo da nota clicada e do modo escolhido
function finalizacao(id_clicado, modo_escolhido, lista_acordes, lista_setimas, id_modo, nota_escolhida){    
    var contagem = 0; 
    var notas_para_tocar = [];    
    for (var cont in nota_escolhida){ 
        let nota_atual = nota_escolhida[cont];
        let nota_atual_sons = nota_escolhida_sons[cont];
        let botao_atual = document.getElementById(nota_atual);
        
        if (modo_escolhido[cont] == 1){ 
            if (nota_escolhida.indexOf(nota_atual) <= nota_escolhida.indexOf('B')){
                notas_para_tocar.push(nota_atual_sons);
            } else {notas_para_tocar.push(nota_atual_sons + '2')}

            so_notas_box = document.getElementById('acordes'); 
            setimas_box = document.getElementById('setimas');

            if (botao_atual.id == id_clicado){
                cores(botao_atual, 'clicado');
            } else {
                cores(botao_atual, 'na_escala');} 

            if (so_notas_box.checked == false){  
                if ((id_modo == 0 && contagem == 5) || (id_modo == 5 && contagem == 2)){
                    cores(botao_atual, 'relativa');
                }
                botao_atual.innerText += lista_acordes[0];
                lista_acordes.shift();
                if (setimas_box.checked){    
                    botao_atual.innerText += lista_setimas[0];
                    botao_atual.innerText = botao_atual.innerText.replace('dim', '');
                    lista_setimas.shift();} 
        
            } else if (setimas_box.checked){ 
                setimas_box.checked = false;} 
            contagem ++;
        } else {
            cores(botao_atual, 'ignorado');
        }
    }
    tocar_sons(notas_para_tocar, id_modo);    
}

//função das mudanças de cores e voltar textos ao padrão nos botões
function cores(botao_atual = null, comando) {
    comando = String(comando).toLowerCase();
    if (comando === 'limpar' || botao_atual == null) {
        lista_notas.forEach(function(nota) {
            botao = document.getElementById(nota);
            cores(botao, 'ignorado');
        });
    } else {
        botao_atual.classList.remove('botao_ignorado');
        botao_atual.classList.remove(`'botao_clicado'`);
        botao_atual.classList.remove('botao_na_escala');
        botao_atual.classList.remove('botao_relativa');
        botao_atual.innerText = botao_atual.id
        botao_atual.classList.add(`botao_${comando}`);
    } 
}

//função de tocar as notas/acordes da escala selecionada, com intervalos
function tocar_sons(escala, id_modo){
    console.log(escala, id_modo)
    if (so_notas_box.checked){tempo=350} else {tempo=700}
    let comando = setInterval(tocar, tempo);
    escala.push(`${escala[0]}2`);

    var contagem = 0;
    function tocar(){
        if (document.getElementById('sem_som').checked == false){
            try {
                let acorde = escala[contagem];
                let pos = parseInt(escala.indexOf(acorde));
                if (so_notas_box.checked == false){
                    if (pos+2 < 7){
                        terca = escala[pos+2];
                    }else{
                        terca = escala[pos+2-7] + '2';}
                        terca = terca.replace('22', '3');

                    if (pos+4 < 7){
                        quinta = escala[pos+4];
                    }else{
                        quinta = escala[pos+4-7] + '2';}
                        quinta = quinta.replace('22', '3');

                    extra = (acorde+'2').replace('22', '3')
                    a_tocar = [acorde, terca, quinta, extra];
                } else {
                    a_tocar = [acorde]
                }
                for (n in a_tocar){   
                    audio_notas[a_tocar[n]].pause();
                    audio_notas[a_tocar[n]].currentTime = 0;
                    audio_notas[a_tocar[n]].play();}

                contagem += 1;
                if (contagem > escala.length){
                    clearInterval(comando);
                }
            } catch(x){
                clearInterval(comando);
            }
        }
    }
}
