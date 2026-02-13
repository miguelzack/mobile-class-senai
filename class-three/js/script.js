let produtos = [];

async function CarregarProdutos() {
    try {
        const resposta = await fetch('produtos.json');
        produtos = await resposta.json();
        exibirProdutos();
    } catch (error) {
        console.error('Erro ao carregar produtos', error);
        alert('Erro ao carregar os produtos'); 
    }
}

function adicionarProdutos() {
    const nome = document.getElementById('nome').value;
    const preco = parseFloat(document.getElementById('preco').value);
    const disponivel = document.getElementById('disponivel').value === 'true';

    if (nome && !isNaN(preco)) {
        const novoProduto = {
            nome: nome,
            preco: preco,
            disponivel: disponivel,
        };

        produtos.push(novoProduto);

        // Limpar campos
        document.getElementById('nome').value = '';
        document.getElementById('preco').value = '';
        document.getElementById('disponivel').value = 'true';

        exibirProdutos();
    } else {
        alert('Por favor preencha corretamente o nome e o preço do produto');
    }
}


function exibirProdutos() {
    const listaProdutosDiv = document.getElementById('listar-produto');

    listaProdutosDiv.innerHTML = '';

    produtos.forEach((produto) => {

        const produtoDiv = document.createElement('div'); 
        produtoDiv.classList.add('produto');

        const nomeH3 = document.createElement('h3');
        nomeH3.textContent = produto.nome;

        const precoP = document.createElement('p');
        precoP.textContent = `Preço: R$ ${produto.preco.toFixed(2)}`;

        const disponibilidadeP = document.createElement('p');
        disponibilidadeP.textContent = 'Disponibilidade: ';

        const spanDisponibilidade = document.createElement('span');
        

        const isDisponivel = produto.disponivel; 
        
        spanDisponibilidade.textContent = isDisponivel ? 'Disponível' : 'Indisponível';
        spanDisponibilidade.classList.add(isDisponivel ? 'disponivel' : 'indisponivel');

        disponibilidadeP.appendChild(spanDisponibilidade);

        produtoDiv.appendChild(nomeH3);
        produtoDiv.appendChild(precoP);
        produtoDiv.appendChild(disponibilidadeP);

        listaProdutosDiv.appendChild(produtoDiv);
    });
}

CarregarProdutos();