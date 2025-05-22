  // Inicializa um Set para armazenar os IDs dos livros favoritos, recuperando-os do localStorage se existirem.
    let favorites = new Set(JSON.parse(localStorage.getItem('favorites')) || []);
    // Inicializa um objeto para armazenar as resenhas dos livros, recuperando-as do localStorage se existirem.
    const reviews = JSON.parse(localStorage.getItem('reviews')) || {};

    // Função assíncrona para buscar livros na API do Google Books com base na pesquisa do usuário.
    async function searchBooks() {
        const query = document.getElementById("searchInput").value;
        // Se a pesquisa estiver vazia, não faz nada.
        if (!query) return;

        // Faz uma requisição para a API do Google Books com o termo de pesquisa codificado na URL.
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`);
        // Converte a resposta da API para formato JSON.
        const data = await response.json();

        // Se a API não retornar nenhum item, exibe uma mensagem informando.
        if (!data.items) {
            document.getElementById("bookList").innerHTML = "<p>Nenhum resultado encontrado.</p>";
            return;
        }

        // Chama a função para renderizar os livros encontrados na tela.
        renderBooks(data.items);
    }

    // Função para renderizar a lista de livros na interface do usuário.
    function renderBooks(books) {
        const list = document.getElementById("bookList");
        // Limpa qualquer conteúdo anterior na lista de livros.
        list.innerHTML = "";

        // Itera sobre cada livro na lista de livros recebida.
        books.forEach(bookItem => {
            const info = bookItem.volumeInfo;
            const bookId = bookItem.id;
            // Obtém o título do livro ou define como "Sem título" se não houver.
            const title = info.title || "Sem título";
            // Obtém os autores do livro ou define como "Autor desconhecido" se não houver.
            const authors = info.authors ? info.authors.join(", ") : "Autor desconhecido";
            // Obtém o link da miniatura da capa do livro ou usa um placeholder se não houver.
            const thumbnail = info.imageLinks ? info.imageLinks.thumbnail : "https://via.placeholder.com/128x200?text=Sem+Capa";

            // Cria um novo elemento div para representar o card do livro.
            const card = document.createElement("div");
            card.className = "book-card";
            // Define o conteúdo HTML do card do livro, incluindo imagem, título, autor, botão de favorito e área de resenha.
            card.innerHTML = `
                <img src="${thumbnail}" alt="Capa do livro ${title}" />
                <h3>${title}</h3>
                <p><strong>Autor:</strong> ${authors}</p>
                <button class="favorite-btn" onclick="toggleFavorite('${bookId}')">
                    ${favorites.has(bookId) ? "★ Favoritado" : "☆ Favoritar"}
                </button>
                <div class="review-box">
                    <textarea id="review-${bookId}" placeholder="Escreva sua resenha...">${reviews[bookId] || ""}</textarea>
                    <button class="submit-review" onclick="submitReview('${bookId}')">Salvar Resenha</button>
                </div>
            `;
            // Adiciona o card do livro à lista de livros na página.
            list.appendChild(card);
        });
    }

    // Função para adicionar ou remover um livro da lista de favoritos.
    function toggleFavorite(id) {
        // Verifica se o livro já está nos favoritos.
        if (favorites.has(id)) {
            // Se estiver, remove o ID do Set de favoritos.
            favorites.delete(id);
        } else {
            // Se não estiver, adiciona o ID ao Set de favoritos.
            favorites.add(id);
        }
        // Atualiza o localStorage com a nova lista de IDs favoritos.
        localStorage.setItem('favorites', JSON.stringify(Array.from(favorites)));
        // Re-renderiza os botões de favorito sem fazer uma nova busca na API.
        const bookCards = document.querySelectorAll('.book-card');
        bookCards.forEach(card => {
            // Encontra o ID do livro associado ao card.
            const bookId = card.querySelector('.review-box textarea')?.id.split('-')[1];
            // Se o ID do card corresponder ao ID do livro que foi favoritado/desfavoritado.
            if (bookId === id) {
                const favButton = card.querySelector('.favorite-btn');
                // Atualiza o texto do botão de favorito com base no estado atual nos favoritos.
                favButton.textContent = favorites.has(id) ? "★ Favoritado" : "☆ Favoritar";
            }
        });
    }

    // Função para salvar a resenha de um livro no localStorage.
    function submitReview(id) {
        // Obtém a referência da textarea da resenha para o livro específico.
        const textarea = document.getElementById(`review-${id}`);
        // Armazena o valor da resenha no objeto de resenhas usando o ID do livro como chave.
        reviews[id] = textarea.value;
        // Salva o objeto de resenhas atualizado no localStorage.
        localStorage.setItem('reviews', JSON.stringify(reviews));
        // Exibe um alerta para informar ao usuário que a resenha foi salva.
        alert("Resenha salva!");
    }

async function searchBooks() {
    const query = document.getElementById("searchInput").value;
    if (!query) return;

    try {
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`);

        // Verifica se a resposta da rede foi bem-sucedida (status 200-299)
        if (!response.ok) {
            throw new Error(`Erro HTTP! Status: ${response.status}`);
        }

        const data = await response.json();

        if (!data.items) {
            document.getElementById("bookList").innerHTML = "<p>Nenhum resultado encontrado.</p>";
            return;
        }

        renderBooks(data.items);
    } catch (error) {
        // Exibe uma mensagem de erro amigável para o usuário
        console.error("Erro ao buscar livros:", error);
        document.getElementById("bookList").innerHTML = "<p>Ocorreu um erro ao buscar os livros. Tente novamente mais tarde.</p>";
    }
}



