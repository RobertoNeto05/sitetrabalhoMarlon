// BOTÃO DE EDIÇÃO PERFIL 


// Adiciona um ouvinte de evento para o evento 'DOMContentLoaded', que ocorre quando o HTML da página é totalmente carregado e o DOM está pronto.
        document.addEventListener('DOMContentLoaded', function() {

            // Seleciona o primeiro elemento com a classe CSS 'editar-perfil' (o botão de editar perfil).
            const editButton = document.querySelector('.editar-perfil');

            // Verifica se o botão de editar perfil foi encontrado no DOM.
            if (editButton) {

                // Adiciona um ouvinte de evento de clique ao botão de editar perfil.
                editButton.addEventListener('click', function() {

                    // Define a URL da página de edição de perfil.
                    const editPageUrl = 'altPerfil.html';

                    // Redireciona a janela do navegador para a URL da página de edição.
                    window.location.href = editPageUrl;

                    // Alternativa (comentada): Abre a página de edição em uma nova aba do navegador.
                    // window.open(editPageUrl, '_blank');
                });
            } else {
                // Se o botão de editar perfil não for encontrado, exibe uma mensagem de erro no console.
                console.error('Botão de editar perfil com a classe ".editar-perfil" não encontrado.');
            }
        });


        // --- Função para Carregar e Exibir os Dados do Perfil ---
        function carregarPerfil() {
            // Tenta obter o nome do usuário do localStorage. Se não existir, usa 'Nome não definido' como padrão.
            const nome = localStorage.getItem('nome') || 'Nome não definido';
            // Tenta obter a data de registro do localStorage. Se não existir, usa a data atual formatada.
            const dataRegistro = localStorage.getItem('dataRegistro') || new Date().toLocaleDateString();
            // Tenta obter o país do localStorage. Se não existir, usa 'Desconhecido' como padrão.
            const pais = localStorage.getItem('pais') || 'Desconhecido';
            // Tenta obter o estado do localStorage. Se não existir, usa 'Desconhecido' como padrão.
            const estado = localStorage.getItem('estado') || 'Desconhecido';

            // Define o conteúdo de texto dos elementos HTML com os dados do perfil.
            document.getElementById('nome').textContent = nome;
            document.getElementById('dataRegistro').textContent = dataRegistro;
            document.getElementById('pais').textContent = pais;
            document.getElementById('estado').textContent = estado;

            // --- Salva a Data de Registro se Ainda Não Existir ---
            // Verifica se a chave 'dataRegistro' não existe no localStorage.
            if (!localStorage.getItem('dataRegistro')) {
                // Se não existir, salva a data de registro atual no localStorage.
                localStorage.setItem('dataRegistro', dataRegistro);
            }
        }

        // --- Chamada da Função para Carregar o Perfil ao Carregar a Página ---
        carregarPerfil(); // Executa a função carregarPerfil assim que o script é interpretado, exibindo os dados do perfil.








// Recupera os IDs dos livros favoritos do localStorage.
    // Se não houver nada, inicializa um novo Set vazio.
    const favoriteIds = new Set(JSON.parse(localStorage.getItem('favorites')) || []);
    // Obtém a referência para a div onde a lista de livros favoritos será renderizada.
    const favoriteListDiv = document.getElementById('favoriteList');

    // Função para remover um livro dos favoritos
    function removeFromFavorites(bookId) {
        favoriteIds.delete(bookId);
        localStorage.setItem('favorites', JSON.stringify(Array.from(favoriteIds)));
        // Recarrega os livros favoritos após a remoção
        fetchFavoriteBooks();
    }

    // Função assíncrona para buscar os detalhes dos livros favoritos.
    async function fetchFavoriteBooks() {
        // Limpa o conteúdo atual da div da lista de favoritos.
        favoriteListDiv.innerHTML = "";

        // Verifica se há algum livro favorito. Se não houver, exibe uma mensagem.
        if (favoriteIds.size === 0) {
            favoriteListDiv.innerHTML = '<p class="no-favorites">Você ainda não adicionou nenhum livro aos seus favoritos.</p>';
            return;
        }

        // Cria um array de promessas para buscar os detalhes de cada livro favorito usando a API do Google Books.
        const bookDetailsPromises = Array.from(favoriteIds).map(id =>
            fetch(`https://www.googleapis.com/books/v1/volumes/${id}`)
                .then(response => response.json())
                .catch(error => {
                    console.error(`Erro ao buscar detalhes do livro ${id}:`, error);
                    return null; // Retorna null em caso de erro para filtrar depois.
                })
        );

        // Aguarda que todas as promessas sejam resolvidas para obter os dados de todos os livros favoritos.
        const favoriteBooksData = await Promise.all(bookDetailsPromises);
        // Filtra os resultados para remover quaisquer buscas que falharam (retornaram null).
        const validFavoriteBooks = favoriteBooksData.filter(book => book);

        // Se houver livros favoritos válidos, chama a função para renderizá-los na tela.
        if (validFavoriteBooks.length > 0) {
            renderFavoriteBooks(validFavoriteBooks);
        } else {
            // Se houve um erro ao carregar os livros favoritos, exibe uma mensagem de erro.
            favoriteListDiv.innerHTML = '<p class="no-favorites">Erro ao carregar seus livros favoritos.</p>';
        }
    }

    // Função para renderizar os detalhes dos livros favoritos na página.
    function renderFavoriteBooks(books) {
        // Itera sobre cada livro na lista de livros favoritos.
        books.forEach(bookItem => {
            // Extrai as informações do volume do livro.
            const info = bookItem.volumeInfo;
            // Obtém o ID do livro.
            const bookId = bookItem.id;
            // Obtém o título do livro ou define como "Sem título" se não houver.
            const title = info.title || "Sem título";
            // Obtém os autores do livro e os junta em uma string, ou define como "Autor desconhecido" se não houver.
            const authors = info.authors ? info.authors.join(", ") : "Autor desconhecido";
            // Obtém o link da miniatura da capa do livro ou usa um placeholder se não houver.
            const thumbnail = info.imageLinks ? info.imageLinks.thumbnail : "https://via.placeholder.com/128x200?text=Sem+Capa";

            // Cria um novo elemento div para representar o card do livro.
            const card = document.createElement("div");
            // Define a classe CSS do card do livro.
            card.className = "book-card";
            // Define o conteúdo HTML do card do livro, incluindo a imagem, título e autor.
            card.innerHTML = `
                <img src="${thumbnail}" alt="Capa do livro ${title}" />
                <h3>${title}</h3>
                <p><strong>Autor:</strong> ${authors}</p>
                <button class="remove-button" onclick="removeFromFavorites('${bookId}')">Remover</button>
            `;
            // Adiciona o card do livro à div da lista de favoritos.
            favoriteListDiv.appendChild(card);
        });
    }

    // Chama a função para carregar os livros favoritos quando a página é carregada.
    fetchFavoriteBooks();



