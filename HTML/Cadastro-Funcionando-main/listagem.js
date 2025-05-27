// Atualiza a lista de livros ao digitar no campo de busca
document.getElementById('buscaLivro').addEventListener('input', listarLivros)

// Adiciona um novo livro ao localStorage
function adicionarLivro() {
  const titulo = document.getElementById('tituloLivro').value.trim()
  const autor = document.getElementById('autorLivro').value.trim()

  if (titulo === '' || autor === '') {
    alert('Preencha os campos de título e autor.')
    return
  }

  // Recupera a lista de livros existente ou inicializa como array vazio
  const livros = JSON.parse(localStorage.getItem('livros') ||'[]')

  const novoLivro = {
    id: Date.now(), // ID único
    titulo,
    autor
  }

  livros.push(novoLivro) 
  localStorage.setItem('livros', JSON.stringify(livros))

  // Limpa os campos e atualiza a tabela
  document.getElementById('tituloLivro').value = ''
  document.getElementById('autorLivro').value = ''
  listarLivros()
}

// Lista os livros filtrados na tabela
function listarLivros() {
  const tabela = document.getElementById('tabelaLivros')
  const filtro = document.getElementById('buscaLivro').value.toLowerCase()
  const livros = JSON.parse(localStorage.getItem('livros') || '[]') 

  const livrosFiltrados = livros.filter(livro => livro.titulo.toLowerCase().includes(filtro) || livro.autor.toLowerCase().includes(filtro))

  // Exibe os livros na tabela
  tabela.innerHTML = livrosFiltrados.map(livro => `<tr>
      <td>${livro.titulo}</td>
      <td>${livro.autor}</td>
      <td>
        <button onclick="editarLivro(${livro.id})">Editar</button>
        <button onclick="excluirLivro(${livro.id})">Excluir</button>
      </td>
    </tr>
  `).join('')
}

// Edita um livro existente
function editarLivro(id) {
  const livros  = JSON.parse(localStorage.getItem('livros') || [])
  const indice = livros.findIndex(livro => livro.id === id)

  if (indice !== -1) {
    const novoTitulo = prompt('Editar título:', livros[indice].titulo)
    const novoAutor = prompt('Editar autor:', livros[indice].autor)

    if(novoTitulo && novoAutor) {
      livros[indice].titulo = novoTitulo
      livros[indice].autor = novoAutor
      localStorage.setItem('livros', JSON.stringify(livros))
      listarLivros()
    }
  } 
}

// Exclui um livro
function excluirLivro(id) {
  const livros = JSON.parse(localStorage.getItem('livros') || '[]') 
  const livro = livros.find(l => l.id === id)

  if (confirm(`Deseja excluir o livro "${livro.titulo}"?`)) {
    const novaLista = livros.filter(livro => livro.id !== id)
    localStorage.setItem('livros', JSON.stringify(novaLista))
    listarLivros()
  }
}


// ========== USUÁRIOS ==========

//Atualiza a lista de usuários ao digitar no campo de busca
document.getElementById('buscaUsuario').addEventListener('input', listarUsuarios)

// Adiciona um novo usuário ao localStorage
function adicionarUsuario() {
  const nomeInput = document.getElementById('nomeUsuario');
  const emailInput = document.getElementById('emailUsuario');
  const nome = nomeInput.value.trim();
  const email = emailInput.value.trim();

  if (nome === '' || email === '') {
    alert('Preencha os campos de nome e email do usuário.');
    return;
  }

  // Validação de formato de email mais rigorosa
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert('Por favor, insira um formato de email válido.');
    return;
  }

  const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');

  // Verifica se já existe um usuário com o mesmo email para evitar duplicidade
  const emailExistente = usuarios.some(usuario => usuario.email === email);
  if (emailExistente) {
    alert('Já existe um usuário cadastrado com este e-mail.');
    return;
  }
  // Gera um ID mais robusto usando timestamp e um valor aleatório
  const novoUsuario = {
    id: Date.now().toString() + Math.random().toString(36).substring(2, 9), // ID único
    nome,
    email
  };

  usuarios.push(novoUsuario);
  localStorage.setItem('usuarios', JSON.stringify(usuarios));

  // Limpa os campos e atualiza a tabela
  nomeInput.value = '';
  emailInput.value = '';
  listarUsuarios();
}
// Lista os usuários na tabela
function listarUsuarios() {
  const tabela = document.getElementById('tabelaUsuarios');
  const filtro = document.getElementById('buscaUsuario').value.toLowerCase();
  const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');

  // Filtra os usuários com base no nome ou email
  const usuariosFiltrados = usuarios.filter(usuario =>
    usuario.nome.toLowerCase().includes(filtro) || usuario.email.toLowerCase().includes(filtro)
  );

  // Exibe os usuários na tabela
  tabela.innerHTML = usuariosFiltrados.map(usuario => `
    <tr>
      <td>${usuario.nome}</td>
      <td>${usuario.email}</td>
      <td>
        <button onclick="editarUsuario('${usuario.id}')">Editar</button>
        <button onclick="excluirUsuario('${usuario.id}')">Excluir</button>
      </td>
    </tr>
  `).join('');
}
// Edita um usuário existente
function editarUsuario(id) {
  const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
  const indice = usuarios.findIndex(usuario => usuario.id === id);

  if (indice !== -1) {
    const usuarioAtual = usuarios[indice];
    const novoNome = prompt("Editar nome:", usuarioAtual.nome);
    const novoEmail = prompt("Editar email:", usuarioAtual.email);

    if (novoNome !== null && novoNome.trim() !== '' && novoEmail !== null && novoEmail.trim() !== '') {
      // Verifica se o novo email já existe para outro usuário (excluindo o usuário atual)
      const emailExistenteParaOutro = usuarios.some((usuario, idx) => 
        idx !== indice && usuario.email === novoEmail.trim()
      );

      if (emailExistenteParaOutro) {
        alert('Este e-mail já está em uso por outro usuário.');
        return;
      }

      usuarios[indice].nome = novoNome.trim();
      usuarios[indice].email = novoEmail.trim();
      localStorage.setItem('usuarios', JSON.stringify(usuarios));
      listarUsuarios();
    } else if (novoNome === null || novoEmail === null) {
      alert('Edição cancelada.');
    } else {
      alert('Nome e email não podem ser vazios.');
    }
  }
}
// Exclui um usuário
function excluirUsuario(id) {
  const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]'); // Corrigido aqui
  const usuario = usuarios.find(u => u.id === id);

  if (usuario && confirm(`Deseja excluir o usuário "${usuario.nome}"?`)) {
    const usuariosAtualizados = usuarios.filter(u => u.id !== id);
    localStorage.setItem('usuarios', JSON.stringify(usuariosAtualizados));
    listarUsuarios();
  }
}

// Chamada inicial ao carregar a página
listarLivros()
listarUsuarios()