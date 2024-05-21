const lista_notas = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B',
 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const lista_modos = ['Jônio (maior)', 'Dórico', 'Frígio', 'Lídio', 'Mixolídio', 'Eólio (menor)', 'Lócrio'];
const base_tom = [1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1];
const posicoes_inicio = [0, 2, 4, 5, 7, 9, 11] // posicao dos primeiros 1s (notas) da lista de cima
const base_acordes = ['', 'm', 'm', '', '', 'm', 'dim', '', 'm', 'm', '', '', 'm', 'dim'];
const base_setimas = ['7M', '7', '7', '7M', '7', '7', 'Ø', '7M', '7', '7', '7M', '7', '7', 'Ø'];

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
lista_notas.forEach(function(nota){                  
    if (div.querySelectorAll('button').length < 12){
        var botao = document.createElement('button');
        botao.id = nota;
        botao.classList.add('botoes_padrao');
        botao.innerText = nota;
        div.appendChild(botao);
    }
})

//cria o botão de limpar
let botao_limpar = document.createElement('button');
botao_limpar.id = 'limpar';
botao_limpar.innerText = 'Limpar';
div.appendChild(botao_limpar);
botao_limpar = document.getElementById('limpar');
botao_limpar.onclick = function run_cores(){cores(null, 'limpar')}

// executa as funções se algum botão for clicado
document.body.addEventListener("click", event => {
    if (event.target.nodeName == "BUTTON") {
        let id_clicado = event.target.id;
        let listas = listagens();
        let nota_escolhida = nota(id_clicado);
        finalizacao(id_clicado, listas, nota_escolhida);
    }
})

// cria recortes das listas a partir do modo escolhido
function listagens(){
    const select = document.getElementById('select');
    var options = select.options;
    var id_modo = parseInt(options[options.selectedIndex].id);
    var modo_escolhido = base_tom.slice(posicoes_inicio[id_modo], (posicoes_inicio[id_modo] + 12));
    var lista_acordes = base_acordes.slice(id_modo, (id_modo + 7));
    var lista_setimas = base_setimas.slice(id_modo, (id_modo + 7));
    return [modo_escolhido, lista_acordes, lista_setimas, id_modo];

}

// cria uma lista (recorte da lista 'lista_notas') a partir da nota escolhida
function nota(id_clicado){
    var nota_escolhida = [];
    let posicao_nota = lista_notas.indexOf(String(id_clicado));
    nota_escolhida = lista_notas.slice(posicao_nota, (posicao_nota + 12));
    return nota_escolhida;
}

// roda as funções de cor e texto dependendo da nota clicada e do modo escolhido
function finalizacao(id_clicado, listas, nota_escolhida){    
    let modo_escolhido = listas[0];
    let lista_acordes = listas[1];
    let lista_setimas = listas[2]; 
    let id_modo = listas[3]; 
    var contagem = 0; 
    var notas_para_tocar = [];            
    for (var cont in nota_escolhida){ 
        let nota_atual = nota_escolhida[cont];
        let botao_atual = document.getElementById(`${nota_atual}`);
        
        if (modo_escolhido[cont] == 1){ 
            notas_para_tocar.push(botao_atual.id)
            acordes_box = document.getElementById('acordes'); 
            setimas_box = document.getElementById('setimas');

            if (botao_atual.id == id_clicado){
                cores(botao_atual, 'clicado');
            } else {
                cores(botao_atual, 'na_escala');
            }
            
            if (acordes_box.checked){  
                if ((id_modo == 0 && contagem === 5) || (id_modo == 5 && contagem === 2)){
                    cores(botao_atual, 'relativa');
                }
                botao_atual.innerText += lista_acordes[0];
                lista_acordes.shift();
                if (setimas_box.checked){    
                    botao_atual.innerText += lista_setimas[0];
                    botao_atual.innerText = botao_atual.innerText.replace('dim', '')
                    lista_setimas.shift();
                } 
        
            } else if (setimas_box.checked){ 
                setimas_box.checked = false;
            } 
            contagem ++;
        } else {
            cores(botao_atual, 'ignorado');
        }
    }
    tocar_sons(notas_para_tocar)
}


//função das mudanças de cores e voltar textos ao padrão nos botões
function cores(botao_atual = null, comando) {
    comando = String(comando).toLowerCase();
    if (comando === 'limpar') {
        lista_notas.forEach(function(nota) {
            botao = document.getElementById(`${nota}`);
            cores(botao, 'ignorado');
        });
    } else {
        botao_atual.classList.remove(`botao_ignorado`);
        botao_atual.classList.remove(`botao_clicado`);
        botao_atual.classList.remove(`botao_na_escala`);
        botao_atual.classList.remove(`botao_relativa`);
        botao_atual.innerText = botao_atual.id;
        botao_atual.classList.add(`botao_${comando}`);
    } 
}

function tocar_sons(escala){
    if (contagem > escala.length){
        clearInterval(comando);
    }
    let comando = setInterval(tocar, 350);
    escala.push(`${escala[0]}5`);
    var contagem = 0;
    function tocar(){
        let nota = escala[contagem]
        if (nota.length == 2){
            nota = nota[0]+'sus';
        }
        som = new Audio(`Sons/${nota}.mp3`);
        som.play();
        contagem += 1;
    }
}
