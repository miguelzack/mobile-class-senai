const elementoBotao = document.getElementById("alterarBotao")
const elementoDiv = document.getElementById("mensagem")

elementoBotao.addEventListener("click", () => {
    // if(elementoDiv.classList.contains("oculto")) {
    //     elementoDiv.classList.remove("oculto")
    // } else {
    // elementoDiv.classList.add("oculto")
    // }
    
    if (elementoDiv.className === "oculto") {
        elementoDiv.className = ""
        return
    }
   elementoDiv.className = "oculto"
})