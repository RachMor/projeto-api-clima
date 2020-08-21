// Selecionar intens a serem ativos
const carregar = document.querySelector("[data-animacao='caixa']");
const cards = document.querySelectorAll("[data-temperatura='card']");
const erro = document.querySelector("[data-temperatura='erro']");
// Selecionar select para controle
const select = document.querySelector("#cidades");
// Selecionar o body
const body = document.body;
// Selecionar o titulo principal
const titulo = document.querySelector("header h1");

// Ativa um item
function ativarItem(item, classe = "ativo") {
    item.classList.add(classe); 
}

// Ativa uma lista de itens
function ativarItens(itens, classe) {
    for (let i = 0; i < itens.length; i++){
        ativarItem(itens[i], classe);
    }
}


// Desativa um item
function desativarItem(item, classe = "ativo") {
    item.classList.remove(classe); 
}

// Desativa uma lista de itens
function desativarItens(itens, classe) {
    for (let i = 0; i < itens.length; i++){
        desativarItem(itens[i], classe);
    }
}

// Troca o fundo da página
function trocarFundo(temp) {
    const valor = Number(temp.replace(/\D/g,""));
    
    if (valor) { 
        const classe = (valor <= 20) ? "frio" : "quente";
        
        body.className = "";
        ativarItem(body, classe );
    }
}

// Formata adata
function formatarData(acrescimo = 0) {
    // Define a data atual e dos dias seguintes
    const data = new Date();
    data.setDate(data.getDate() + Number(acrescimo));
    
    // Pega o dia e o mês
    const dia = data.getDate();
    const mes = data.getMonth() + 1;
    
    // Retorna a data formatada
    return `${(dia < 10)? "0" + dia : dia}/${(mes < 10)? "0" + mes : mes}`;
}

function definirCLima(descri) {
    const imgCard = document.querySelector("[data-temperatura='clima'] img");
    imgCard.style.visibility = "visible";

    switch (descri) {
        case "Light drizzle, mist":
        case "Light rain":
            imgCard.setAttribute("src", "img/climas/Chuva-fraca.png");
            imgCard.setAttribute("alt", "Chuva fraca");
        return "Chuva fraca";
        case "Rain":
            imgCard.setAttribute("src", "img/climas/Chuva-forte.png");
            imgCard.setAttribute("alt", "Chuva forte");
        return "Chuva forte";
        case "Sunny":
            imgCard.setAttribute("src", "img/climas/Sol.png");
            imgCard.setAttribute("alt", "Sol");
        return "Sol";
        case "Clear":
            imgCard.setAttribute("src", "img/climas/sol-praia.png");
            imgCard.setAttribute("alt", "Limpo");
        return "Limpo";
        case "Patchy light rain with thunder":
        case "Rain with thunderstorm":
            imgCard.setAttribute("src", "img/climas/Sol-com-pancada-de-chuva-forte.png");
            imgCard.setAttribute("alt", "Chuva forte com sol");
        return "Chuva forte com sol";
        case "Partly cloudy":
            imgCard.setAttribute("src", "img/climas/Pouco-nublado.png");
            imgCard.setAttribute("alt", "Parcialmente nublado");
        return "Parcialmente nublado";
        case "Thunderstorm in vicinity, rain with thunderstorm":
            imgCard.setAttribute("src", "img/climas/Sol-com-trovoadas.png");
            imgCard.setAttribute("alt", "Sol com trovoada");
        return "Sol com trovoada";
        default: 
            console.log(descri);
            imgCard.style.visibility = "hidden";
        return "Sem previsão";
    }
}

// Preenche os dados
function preencherDados(elementos,dados) {
    // Organiza os dados
    const {temperature: temp, wind: vento, description: descri, forecast: previsao} = dados;
    
    for (let i = 0; i < elementos.length; i++) {
        // Seleciona os dados dentro do card
        const cardData = elementos[i].querySelector("[data-temperatura='data']");
        const cardTemp =elementos[i].querySelector("[data-temperatura='temp']");
        const cardVento =elementos[i].querySelector("[data-temperatura='vento']");
        const cardDescri =elementos[i].querySelector("[data-temperatura='descri']");
        
        if (elementos[i].dataset.prev) {
            // Card de privisões futuras
            const indice =elementos[i].dataset.prev;
            const {temperature: temp, wind: vento, day: dia} = previsao[indice];
            
            // Preenchendo os campos
            cardData.innerText = formatarData(dia);
            cardTemp.innerText = temp;
            cardVento.innerText = `Vento: ${vento}`;
        } else {
            //Card da previsão de hoje
            //Prenchendo os campos
            cardData.innerText = formatarData();
            cardTemp.innerText = temp;
            cardVento.innerText = `Vento: ${vento}`;
            cardDescri.innerText = definirCLima(descri);
        }
    }
}

// Busca os dados na API
function buscarDados(evento) {
    const current = evento.currentTarget;
    const cidade = current.value;
    
    if (cidade !== "padrao") {
        // Inicia a animação de busca e limpa e os dados
        desativarItem(erro);
        desativarItens(cards);
        ativarItem(carregar);

        // Faz a requisição
        const requisicao = fetch(`https://goweather.herokuapp.com/weather/${cidade}`);
        requisicao.then( (resposta) => resposta.json())
        .then((json) => {
            // Retorno da requisição
            titulo.innerText = current.querySelector(`option[value="${cidade}"]`).innerText;
            preencherDados(cards, json);
            
            trocarFundo(json["temperature"]);
            
            ativarItens(cards);
        })
        .catch((e) => {
            // Erros na busca
            titulo.innerText = "Clima-Capital";
            body.className = "";
            ativarItem(erro);
        })
        .finally((r) => {
            // Encerramento da busca
            desativarItem(carregar);
        });
    } else {
        desativarItens(cards);
        titulo.innerText = "Clima-Capital";
        body.className = "";
    }
}

// Adicionar o evento para manipular dados
select.addEventListener("change", buscarDados);
