// arquivo que estará no servidor, criado com nodeJS

const express = require('express'); // usa o express(do node_modules) para começar o servidor
const server = express(); // objeto de servidor para poder usar várias coisas

// pegar o banco de dados
const db = require("./database/db");

// configurar pasta publica
server.use(express.static('public'));

// habilitar o uso do req.body na aplicação
server.use(express.urlencoded({ extended: true }));

// utilizando template engine
const nunjucks = require('nunjucks'); // pede uma dependencia já instalada.
// configura o nunjucks com a pasta que tem os HTMLs. 
// Cache é quando ele guarda algumas coisas na memória, enquanto está desenvolvendo podemos deixar noCache:true.
nunjucks.configure('src/views', {
  express: server,
  noCache: true
})

// configurar caminhos da minha aplicação

// pagina inicial
// req: Requisição
// res: Resposta
server.get('/', (req, res) => {
  return res.render("index.html") // função que envia para o servidor o nome do diretorio mais o arquivo para o servidor.
})

server.get('/create-point', (req, res) => {

  // req.query: Query Strings da URL
  // console.log(req.query)

  return res.render("create-point.html");
});

server.post('/savepoint', (req, res) => {

  // req.body: corpo do nosso formulário
  // console.log(req.body)

  // inserir dados no banco de dados 
  const query = `
  INSERT INTO places (
    image,
    name,
    address,
    address2,
    state,
    city,
    items
    ) VALUES (?,?,?,?,?,?,?);
   `
  const values = [
    req.body.image,
    req.body.name,
    req.body.address,
    req.body.address2,
    req.body.state,
    req.body.city,
    req.body.items
  ]

  function afterInsertData(err) {
    if (err) {
      console.log(err);
      return res.send("Erro no cadastro!");
    }
    console.log("Cadastrado com sucesso")
    console.log(this)
    return res.render('create-point.html', { saved: true });
  }

  db.run(query, values, afterInsertData);

})

server.get('/search', (req, res) => {
  // fazer pesquisa por cidade
  const search = req.query.search;

  if(search == "") {
    // pesquisa vazia
    return res.render("search-results.html", { total: 0 })

  }

  // pegar os dados do banco de dados
  db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function (err, rows) {
    if (err) {
      return console.log(err)
    }

    const total = rows.length;
    // mostrar a página HTML com os dados do banco de dados
    return res.render("search-results.html", { places: rows, total })
  })
});

// ligar o servidor (obs, por padrão, toda vez que alterar o servidor teria que ligar novamente ele. Entretanto, instalamos um pacote nodemon que resolve isto.)
server.listen(3000);
