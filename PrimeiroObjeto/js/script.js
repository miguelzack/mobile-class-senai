const produtos = {
    produto1: {
        nome: "Camiseta de algodão premium",
        preco: 59.90,
        diponivel: true,
    },
    produto2: {
        nome: "Calça Jeans Slim Fit",
        preco: 89.90,
        diponivel: false,
    },
    produto3: {
        nome: "Tênis esportivo Nike",
        preco: 400.00,
        diponivel: true,
    },
}

const listaProdutosDiv = document.getElementById('lista-produtos')


for (const key in produtos) {
    if (produtos.hasOwnProperty(key)) {
        const produto = produtos[key]

        const produtoDiv = document.createElement("div")
        produtoDiv.classList.add('produto')

        const nomeH3 = document.createElement("h3")
        nomeH3.textContent = produto.nome
        // nomeH3.textContent = produto.produto1.nome

        const precoP = document.createElement("p")
        precoP.textContent = `Preço: R$${produto.preco.toFixed(2)}`

        const disponibilidadeP = document.createElement("p")
        disponibilidadeP.textContent = `Disponibilidade: `

        const spanDisponibilidade = document.createElement("span")
        spanDisponibilidade.textContent = produto.diponivel ? "Disponível" : "Indisponível"

        spanDisponibilidade.classList.add(produto.diponivel ? 'disponivel' : "indisponivel")

        disponibilidadeP.appendChild(spanDisponibilidade)

        produtoDiv.appendChild(nomeH3)
        produtoDiv.appendChild(precoP)
        produtoDiv.appendChild(disponibilidadeP)

        listaProdutosDiv.appendChild(produtoDiv)
    }
}