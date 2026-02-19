const elementoTexto = document.getElementById("titulo")
const elementoBotao = document.getElementById("botao")

elementoBotao.addEventListener("click", () => {
    elementoTexto.textContent = `O texto foi alterado com o JavaScript`
})