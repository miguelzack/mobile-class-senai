const elementoLista = document.getElementById("lista")
const elementoInput = document.getElementById("novoItem")
const elementoBotao = document.getElementById("botaoAdicionar")

elementoBotao.addEventListener("click", () => {
    const novoProduto = elementoInput.value.trim()
    
    if (novoProduto  == "") {
        alert("Caixa de inserção vazia. Tente novamente")
        elementoInput.value = ""
        return
    }
    
    let novo = document.createElement("li")
    novo.textContent = elementoInput.value
    elementoLista.appendChild(novo)
    elementoInput.value = ""
})