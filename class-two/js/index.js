const exemploArrayLiteralDiv = document.getElementById('exemplo-array-literal')

const frutas = ["maçã", "uva", "banana"]

exemploArrayLiteralDiv.innerHTML = `
<h2>Exemplo de array com literal</h2>
<p>Array: [${frutas}]</p>
`


const exemploArrayAcessoDiv = document.getElementById('exemplo-array-acesso')

const numeros = [1, 2, 3, 4, 5]

// exemploArrayAcessoDiv.innerHTML = `
//     <h2>Exemplo de aceso aos elementos do array</h2>
//     <p>Primeiro elemento: ${numeros[0]}</p>
//     <p>Segundo elemento: ${numeros[1]}</p>
//     <p>Terceiro elemento: ${numeros[2]}</p>
//     <p>Quarto elemento: ${numeros[3]}</p>
//     <p>Quinto elemento: ${numeros[4]}</p>
//     `

numeros.forEach((numeros) => console.log(numeros))




const exemploArrayModificadoDiv = document.getElementById('exemplo-array-modificado')

const cores = ["azul", "amarelo", "vermelho"]

cores[0] = "preto"


exemploArrayModificadoDiv.innerHTML = `
<h2>Exemplo de array modificado</h2>
<p>Array: [${cores}]</p>
`