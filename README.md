# Portal-Noticias
 
### Sobre

Este projeto foi desenvolvido para aprimorar os meus conhecimentos na utilização de um banco de dados não relacional.

Apesar de não ser um prejoto esteticamente dos mais bonitos, está totalmente funcional, com a área do admin, para poder excluir ou cadastrar uma nova notícia. 

#### Foi usado

1. **Nodejs**
   - Para criação de rotas
   - Para manipulação de dados
   - Para criar session
1. **Express**
   - Como framework para o Nodejs
2. **MongoDB**
   - Para persistência de dados
1. **Mongoose**
   - Para conexão com o MongoDB, e modelagem dos dados
2. **Sass**
   - Para potencializar o **CSS**
3. **EJS**
   - Para transportar dados do back-end para o front-end facilmente.

#

### Como funciona

No front-end do projeto foram feitas várias páginas, no total 6 (seis), uma para a home, uma para a notícia sozinha, uma para a página de busca, uma 404 caso tente acessar uma área que não exista, uma de login para acessar a área do admin, e a última que é a área do admin. E foram criados 2 (dois) partials, o do header junto com o head, e, o do footer.

No back-end criei 2 (dois) arquivos, um para o Schema do banco de dados, e, o outro foi o index.js, que executa todas as funções presentes **(FUTURAMENTE FAREI O ENCAPSULAMENTO)**. 

Após me conectar com o banco de dados pelo **mongoose**, apliquei um get na URL primária, e apliquei um if nela para pegar dados da query de busca, se a retornar um valor nulo, ou seja, nada foi pesquisado, eu pego os documentos do **MongoDB** e coloco um filtro para ordernar de maneira decrescente, e uma outra área com o filtro de quantidade de visualizações, e coloco essas informações para renderizar na home do projeto. Agora caso a query de busca não seja nula, ou seja, foi inserido alguma informação, será renderizada outra página com base na pesquisa, com os critérios de titulo e categoria da notícia.

Quando o botão ***Ler mais*** for clicado, você será redirecionado para a página da notícia sozinha, com todas as informações (título, autor, categoria, conteudo e imagem local), quando redirecionado para esta página o slug também será mudado de acordo a notícia clicada, e será incrementado a esta mesma notícia 1 view; nesta mesma página também tem a área de notícias ordenadas por quantidade de visualização. Caso tente alterar a URL para um endereço que não exista, será renderizado uma página simples de erro. 

Clicando no botão ***Admin*** no menu, será renderizada a página de login, onde será inserida as credenciais, se estiverem correta com base no array de objetos que defini, será redirecionado para a página do admin. Dentro da área do admin você poderá criar uma notícia com os dados da notícia incluindo slug personalizado e imagem local. Logo abaixo tem a área de listagem das notícias por ordem decrescente, com o botão para você poder excluir qualquer notícia.

## PS: foi definido em um array e não no banco de dados pois, pra quem quiser baixar o projeto não precisar criar outra Collection com os dados para entrar na área de admin

### *Ideias*

Caso tenha alguma ideia que eu possa melhorar nesse projeto ou qualquer outra ideia, manda uma **Issues** para eu conseguir ver suas ideias!!!
