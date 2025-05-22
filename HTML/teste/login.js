function login() {
    const username = document.getElementById("username").value;
    // Simulação de verificação de login
    if (username === "usuario1") {
        window.location.href = "perfil.html?usuario=usuario1";
    } else if (username === "usuario2") {
        window.location.href = "perfil.html?usuario=usuario2";
    } else {
        alert("Usuário ou senha incorretos.");
    }
}