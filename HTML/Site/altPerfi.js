      // --- Função para Carregar os Dados do Perfil do Local Storage ---
        function carregarDados() {
            // Define o valor do campo 'nome' com o valor armazenado em localStorage ou com uma string vazia se não houver valor
            document.getElementById('nome').value = localStorage.getItem('nome') || '';
            // Define o valor do campo 'pais' com o valor armazenado em localStorage ou com uma string vazia se não houver valor
            document.getElementById('pais').value = localStorage.getItem('pais') || '';
            // Define o valor do campo 'estado' com o valor armazenado em localStorage ou com uma string vazia se não houver valor
            document.getElementById('estado').value = localStorage.getItem('estado') || '';
        }

        // --- Função para Salvar os Dados do Perfil no Local Storage ---
        function salvarPerfil() {
            // Salva o valor do campo 'nome' no localStorage com a chave 'nome'
            localStorage.setItem('nome', document.getElementById('nome').value);
            // Salva o valor do campo 'pais' no localStorage com a chave 'pais'
            localStorage.setItem('pais', document.getElementById('pais').value);
            // Salva o valor do campo 'estado' no localStorage com a chave 'estado'
            localStorage.setItem('estado', document.getElementById('estado').value);
            // Exibe um alerta informando que o perfil foi atualizado
            alert('Perfil atualizado!');
            // Redireciona o usuário para a página 'perfil.html'
            window.location.href = 'perfil.html';
        }

        // --- Chamada da Função para Carregar os Dados ao Carregar a Página ---
        carregarDados(); // Executa a função carregarDados assim que o script é interpretado, preenchendo os campos do formulário
   


        document.addEventListener('DOMContentLoaded', () => {
    const inputPais = document.getElementById('pais');
    const listaSugestoes = document.getElementById('sugestoes-paises');

    inputPais.addEventListener('input', async () => {
        const query = inputPais.value.trim();
        listaSugestoes.innerHTML = '';

        if (query.length < 2) return; // só busca com 2 ou mais letras

        try {
            const response = await fetch(`https://restcountries.com/v3.1/name/${query}`);
            const data = await response.json();

            const paises = data.map(p => p.name.common).slice(0, 10); // limita a 10 sugestões

            paises.forEach(pais => {
                const li = document.createElement('li');
                li.textContent = pais;
                li.onclick = () => {
                    inputPais.value = pais;
                    listaSugestoes.innerHTML = '';
                };
                listaSugestoes.appendChild(li);
            });
        } catch (error) {
            console.error('Erro ao buscar países:', error);
        }
    });

    // Esconde as sugestões se clicar fora
    document.addEventListener('click', (e) => {
        if (e.target !== inputPais) {
            listaSugestoes.innerHTML = '';
        }
    });
});
