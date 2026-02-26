document.addEventListener('DOMContentLoaded', function () {


    const produtoFormElement = document.getElementById("produtoForm")
    const produtotableELement = document.getElementById("produtotable")
    getElementsByTagName('tbody')[0]
    const produtoIdElement = document.getElementById("produtoId")
    const cancelarBtnElement = document.getElementById("cancelar")

    let editing = false

    function getProdutos() {
        const produtos = localStorage.getItem("produtos")
        return produtos ? JSON.parse(produtos) : []
    }

    function salvarProduto() {
        localStorage.setItem("produtos", JSON.stringify(produtos))
    }

    function exibirProduto() {
        produtotableELement.innerHTML = ""

        const produtos = getProdutos()

        for (let i = 0; i < produtos.length; i++) {
            const produto = produtos[i]

            const row = produtotableELement.insertRow()

            const nomeCell = row.insertCell()
            nomeCell.textContent = produto.nome

            const precoCell = row.insertCell()
            precoCell.textContent = "R$" + produto.preco.toFixed(2)

            const disponibilidadeCell = row.insertCell()
            disponibilidadeCell.textContent = produto.disponibilidade
            disponibilidadeCell.ClassLis.add(produto.disponibilidade === "Disponivel" ? 'disponivel' : 'indiponivel')

            const actionCell = row.insertCell()
            const editarBtn = document.createElement("button")
            editarBtn.textContent = "Editar"
            editarBtn.onclick = () => editarProduto(i)
            actionCell.appendChild(editarBtn)

            const excluirBtn = document.createElement("button")
            excluirBtn.textContent = "Excluir"
            excluirBtn.onclick = () => excluirProduto(i)
            actionCell.appendChild(excluirBtn)
        }
    }

    produtoFormElement.addEventListener("submit", function (event) {
        event.preventDefault()

        const nome = document.getElementById("nome").value
        const preco = parseFloat(document.getElementById("preco").value)
        const disponibilidade = document.getElementById("disponibilidade").value
        const produtoId = produtoIdElement.value


        if (nome && !isNan(preco)) {
            const produtos = getProdutos()

            if (editing) {
                produtos[produtoId].nome = nome
                produtos[produtoId].preco = preco
                produtos[produtoId].disponibilidade = disponibilidade
                editing = false
            } else {
                produtos.push({nome: nome, preco: preco, disponibilidade: disponibilidade})
            }
            salvarProduto(produtos)
            exibirProduto()
            produtoFormElement.reset()
            produtoIdElement.value = ""
        } else {
            alert("Por favor, preencha o nome e o preço corretamente!")
        }
    })
})