// Variáveis
let tituloTrabalho = document.getElementById('trabalho');
let tituloDescanso = document.getElementById('descanso');

let tempoTrabalho = 1; // 25 minutos
let tempoDescanso = 1; // 5 minutos

let temporizador; // Para gerenciar intervalos
let trabalhando = true; // Para rastrear sessões de trabalho vs descanso
let quantTrabalho = 0; // Contagem de sessões de trabalho
let tempoRestante = tempoTrabalho * 60; // Converter para segundos

// Exibição
window.onload = () => {
    atualizarDisplay();
    tituloTrabalho.classList.add('active');
    carregarMateriaisEstudo(); // Carregar materiais ao iniciar a página
}

// Função de atualização de exibição
function atualizarDisplay() {
    const minutos = Math.floor(tempoRestante / 60);
    const segundos = tempoRestante % 60;
    document.getElementById('minutos').innerHTML = String(minutos).padStart(2, '0');
    document.getElementById('segundos').innerHTML = String(segundos).padStart(2, '0');

    // Atualizar títulos com base no estado
    tituloTrabalho.classList.toggle('active', trabalhando);
    tituloDescanso.classList.toggle('active', !trabalhando);
}

// Carregar materiais de estudo do localStorage
function carregarMateriaisEstudo() {
    const historicoEstudos = document.getElementById('historicoEstudos');
    const materiais = JSON.parse(localStorage.getItem('materiaisEstudo')) || [];
    historicoEstudos.innerHTML = materiais.map(material => `<p>${material}</p>`).join('');
}

// Iniciar timer
function iniciar() {
    document.getElementById('start').style.display = "none";
    document.getElementById('reset').style.display = "block";

    if (!temporizador) {
        temporizador = setInterval(() => {
            tempoRestante--;
            atualizarDisplay();

            if (tempoRestante <= 0) {
                clearInterval(temporizador);
                temporizador = null;

                if (trabalhando) {
                    quantTrabalho++;
                    if (quantTrabalho >= 4) {
                        tempoRestante = (tempoDescanso + 1) * 60; // Longa pausa
                        quantTrabalho = 0; // Reiniciar contagem de sessões
                        alert("Hora da pausa de 15 minutos!");
                    } else {
                        tempoRestante = 1 * 60; // Curta pausa
                        alert("Hora de pausar!");
                    }
                } else {
                    tempoRestante = tempoTrabalho * 60; // Reiniciar para tempo de trabalho
                }
                trabalhando = !trabalhando;
                iniciar(); // Iniciar próximo ciclo
            }
        }, 1000);
    }
}

// Reiniciar timer
function reiniciarTimer() {
    clearInterval(temporizador);
    temporizador = null;
    trabalhando = true;
    quantTrabalho = 0; // Reiniciar contagem de sessões
    tempoRestante = tempoTrabalho * 60; // Reiniciar para tempo de trabalho
    atualizarDisplay();

    // Mostrar o botão de iniciar e esconder o botão de reiniciar
    document.getElementById('start').style.display = "block";
    document.getElementById('reset').style.display = "none";
}

// Adicionar material de estudo ao localStorage
document.getElementById('adicionarMaterial').addEventListener('click', () => {
    const inputMaterial = document.getElementById('materialEstudo');
    const material = inputMaterial.value.trim();
    if (material) {
        const materiais = JSON.parse(localStorage.getItem('materiaisEstudo')) || [];
        materiais.push(material);
        localStorage.setItem('materiaisEstudo', JSON.stringify(materiais));
        carregarMateriaisEstudo(); // Recarregar materiais para exibir

        inputMaterial.value = ""; // Limpar input
    }
});

// Limpar todo o histórico de estudos
document.getElementById('limparHistorico').addEventListener('click', () => {
    localStorage.removeItem('materiaisEstudo');
    carregarMateriaisEstudo(); // Recarregar para limpar materiais exibidos
});

// Limpar último material de estudo
document.getElementById('limparUltimo').addEventListener('click', () => {
    let materiais = JSON.parse(localStorage.getItem('materiaisEstudo')) || [];
    materiais.pop(); // Remover último item
    localStorage.setItem('materiaisEstudo', JSON.stringify(materiais));
    carregarMateriaisEstudo(); // Recarregar materiais para exibir
});

// Alternar cor de fundo
document.getElementById('toggleTema').addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    document.querySelector('.temporizador').classList.toggle('light-theme');
});

// Inicializar exibição
atualizarDisplay();



