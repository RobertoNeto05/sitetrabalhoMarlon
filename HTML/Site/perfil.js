// BOTÃO DE EDIÇÃO PERFIL 


// --- Lógica para o Botão de Edição de Perfil ---
document.addEventListener('DOMContentLoaded', function() {
    const editButton = document.querySelector('.profile-details button'); // Seleciona o botão de edição mais robustamente

    if (editButton) {
        editButton.addEventListener('click', function() {
            const editPageUrl = 'altPerfil.html';
            window.location.href = editPageUrl;
        });
    } else {
        console.warn('Botão "Editar Perfil" não encontrado. Verifique o HTML.');
    }
});

// --- Função para Carregar e Exibir os Dados do Perfil ---
function carregarPerfil() {
    const nome = localStorage.getItem('nome') || 'Nome não definido';
    const dataRegistro = localStorage.getItem('dataRegistro') || new Date().toLocaleDateString('pt-BR'); // Formato BR
    const pais = localStorage.getItem('pais') || 'Desconhecido';
    const estado = localStorage.getItem('estado') || 'Desconhecido';

    document.getElementById('nome').textContent = nome;
    document.getElementById('dataRegistro').textContent = dataRegistro;
    document.getElementById('pais').textContent = pais;
    document.getElementById('estado').textContent = estado;

    // Salva a Data de Registro se Ainda Não Existir (apenas na primeira vez)
    if (!localStorage.getItem('dataRegistro')) {
        localStorage.setItem('dataRegistro', dataRegistro);
    }
}

// --- Lógica para os Livros Favoritos ---

// Recupera os IDs dos livros favoritos do localStorage.
const favoriteIds = new Set(JSON.parse(localStorage.getItem('favorites')) || []);
const favoriteListDiv = document.getElementById('favoriteList');

// ... (seu código JavaScript existente até a definição de favoriteListDiv) ...

// Função para remover um livro dos favoritos
function removeFromFavorites(bookId) {
    // 1. Remove o ID do livro do Set de favoritos
    favoriteIds.delete(bookId);

    // 2. Atualiza o localStorage com a nova lista de favoritos
    localStorage.setItem('favorites', JSON.stringify(Array.from(favoriteIds)));

    // 3. Encontra e remove o elemento HTML do livro do DOM
    // Seleciona o card do livro pelo seu ID (ou algum atributo que o identifique)
    const bookCardToRemove = document.getElementById(`book-card-${bookId}`);
    if (bookCardToRemove) {
        bookCardToRemove.remove(); // Remove o elemento do DOM

        // Opcional: Se a lista ficar vazia após a remoção, exibe a mensagem "sem favoritos"
        if (favoriteIds.size === 0) {
            favoriteListDiv.innerHTML = '<p class="no-favorites">Você ainda não adicionou nenhum livro aos seus favoritos.</p>';
        }
    } else {
        console.warn(`Card do livro com ID 'book-card-${bookId}' não encontrado para remoção.`);
    }

    // NÃO CHAME fetchFavoriteBooks() AQUI, pois ela recarregaria tudo.
    // fetchFavoriteBooks(); // <-- Remova ou comente esta linha
}

// ... (o restante do seu código JavaScript, incluindo fetchFavoriteBooks e renderFavoriteBooks) ...

// Função assíncrona para buscar os detalhes dos livros favoritos.
async function fetchFavoriteBooks() {
    favoriteListDiv.innerHTML = ""; // Limpa o conteúdo atual

    if (favoriteIds.size === 0) {
        favoriteListDiv.innerHTML = '<p class="no-favorites">Você ainda não adicionou nenhum livro aos seus favoritos.</p>';
        return;
    }

    const bookDetailsPromises = Array.from(favoriteIds).map(id =>
        fetch(`https://www.googleapis.com/books/v1/volumes/${id}`)
            .then(response => {
                if (!response.ok) {
                    console.error(`Erro HTTP ao buscar detalhes do livro ${id}: ${response.status}`);
                    return null; // Retorna null para filtrar depois
                }
                return response.json();
            })
            .catch(error => {
                console.error(`Erro de rede ou JSON ao buscar detalhes do livro ${id}:`, error);
                return null;
            })
    );

    const favoriteBooksData = await Promise.all(bookDetailsPromises);
    // Filtra livros que não foram encontrados ou tiveram erro na busca
    const validFavoriteBooks = favoriteBooksData.filter(book => book && book.volumeInfo); // Garante que volumeInfo existe

    if (validFavoriteBooks.length > 0) {
        renderFavoriteBooks(validFavoriteBooks);
    } else {
        favoriteListDiv.innerHTML = '<p class="no-favorites">Não foi possível carregar os detalhes de seus livros favoritos.</p>';
    }
}

// Função para renderizar os detalhes dos livros favoritos na página.
function renderFavoriteBooks(books) {
    books.forEach(bookItem => {
        const info = bookItem.volumeInfo;
        const bookId = bookItem.id; // O ID do livro da API
        const title = info.title || "Sem título";
        const authors = info.authors ? info.authors.join(", ") : "Autor desconhecido";

        let thumbnailUrl = "https://via.placeholder.com/150x225?text=Sem+Capa";
        if (info.imageLinks) {
            if (info.imageLinks.thumbnail) {
                thumbnailUrl = info.imageLinks.thumbnail;
            } else if (info.imageLinks.smallThumbnail) {
                thumbnailUrl = info.imageLinks.smallThumbnail;
            } else if (info.imageLinks.medium) {
                thumbnailUrl = info.imageLinks.medium;
            } else if (info.imageLinks.small) {
                thumbnailUrl = info.imageLinks.small;
            } else if (info.imageLinks.large) {
                thumbnailUrl = info.imageLinks.large;
            }
            thumbnailUrl = thumbnailUrl.replace('http://', 'https://');
        }

        const card = document.createElement("div");
        card.className = "book-card";
        // Adicione um ID único ao card do livro, usando o ID do livro da API
        card.id = `book-card-${bookId}`; // <--- ADIÇÃO AQUI: ID para o card
        card.innerHTML = `
            <img src="${thumbnailUrl}" alt="Capa do livro ${title}" onerror="this.onerror=null;this.src='https://via.placeholder.com/150x225?text=Capa+Indispon%C3%ADvel';"/>
            <h3>${title}</h3>
            <p><strong>Autor:</strong> ${authors}</p>
            <button class="remove-button" onclick="removeFromFavorites('${bookId}')">Remover</button>
        `;
        favoriteListDiv.appendChild(card);
    });
}

// --- Chamadas Iniciais ao carregar a página ---
// Garante que estas funções sejam chamadas apenas uma vez e na ordem correta
document.addEventListener('DOMContentLoaded', () => {
    carregarPerfil(); // Carrega os dados do perfil
    fetchFavoriteBooks(); // Carrega e exibe os livros favoritos
});