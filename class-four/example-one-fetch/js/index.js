fetch("https://jsonplaceholder.typicode.com/users")
    .then(response => response.json())
    .then(usuario => {
        const todosUsuarios = document.getElementById("listaUsuarios")

        usuario.forEach(user => {
            const cadaUsuario = document.createElement("li")
            cadaUsuario.textContent = user.name + " (" + user.email + ") "
            todosUsuarios.appendChild(cadaUsuario)
        })
    })
.catch(error => {
    document.getElementById('listaUsuarios').textContent = 
        "Erro ao buscar os usuarios"
})