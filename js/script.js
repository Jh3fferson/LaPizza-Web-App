fetch("js/backend.json")
  .then((response) => {
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  })
  .then((produtos) => {
    if (!produtos.pizzas || !produtos.ingredientes) {
      throw new Error("JSON inválido: faltam 'pizzas' ou 'ingredientes'");
    }
    localStorage.setItem("produtos", JSON.stringify(produtos));
    iniciarIndex();
    console.log("Dados do produto salvo no localStorage.");
  })
  .catch((error) => console.error("Erro ao fazer o fetch dos dados:", error));

var produtos = JSON.parse(localStorage.getItem("produtos")) || [];

//Começa a página index
function iniciarIndex(categoria_numero = 0) {
  let ingredientesMap = new Map();
  produtos.ingredientes.forEach(ing => ingredientesMap.set(ing.id, ing));
  atualizarPrecos(produtos, ingredientesMap);
  renderizarProdutos(categoria_numero, produtos, ingredientesMap);
}

// Função pra listar nomes dos ingredientes
function definirOsNomesDosIngredientes(pizza, ingredientesMap) {
  var nomes = [];
  pizza.ingredientes.forEach(id => {
    const ingrediente = ingredientesMap.get(id);
    if (ingrediente) {
      nomes.push(ingrediente.nome);
    }
  });
  if (nomes.length === 0) return "";
  if (nomes.length === 1) return nomes[0];
  return nomes.slice(0, -1).join(", ") + " e " + nomes[nomes.length - 1];

}

// Atualiza os preços de cada pizza, acrescentando o valor dos ingredientes
function atualizarPrecos(produtos, ingredientesMap) {
  produtos.pizzas.forEach((pizza) => {
    pizza.total = pizza.preco_base;
    pizza.ingredientes.forEach(id => {
      const ingrediente = ingredientesMap.get(id);
      if (ingrediente) {
        pizza.total += ingrediente.preco;
      }
    });
  });
  localStorage.setItem("produtos", JSON.stringify(produtos));
}

// seleciona a categoria dos produtos
$(".categorias").on("click", ".filter-btn", function () {
  let categoria_numero = $(this).data("id");
  iniciarIndex(categoria_numero);

});

// Modificam o DOM --------------------------------------------------------------------------------------------------------------- Inicio

// renderiza os produtos que serão mostrados no index
function renderizarProdutos(categoria_numero = 0, produtos, ingredientesMap) {
  $("#produtos").empty();
  // Inicia as pizzas e as filtra
  produtos.pizzas.forEach((pizza) => {
    if (pizza.categoria_numero == categoria_numero || categoria_numero == 0) {
      var productHtml = `
                  <div class="item-card">
                    <a data-id="${pizza.id}" href="#" class="item item-pizza">
                      <div class="img-container">
                        <img
                          src="${pizza.img}"
                        />
                      </div>
                      <div class="nome-preco">
                        <span>${pizza.nome}</span>
                        <span class="bold margin-right">
                          <i class="preco">${pizza.total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} </i>
                        </span>
                      </div>
                      <div class="descricao">
                        <span>
                         ${definirOsNomesDosIngredientes(pizza, ingredientesMap)}
                        </span>
                      </div>
                    </a>
                  </div>
        `;
      $("#produtos").append(productHtml);
    }
  });
  // Permite ver os detalhes da pizza
  $(".item-pizza").on("click", function () {
    var id = $(this).attr("data-id");
    localStorage.setItem("actual-id-pizza", id);
    localStorage.setItem("actual-cart", false);
    app.views.main.router.navigate("/detalhes-pizza/");
  });

  produtos.extras.forEach((produto) => {
    // Inicia os produtos e os filtra
    if (produto.categoria_numero == categoria_numero || categoria_numero == 0) {
      var productHtml = `
                  <div class="item-card">
                    <a data-id="${produto.id}" href="#" class="item item-produto">
                      <div class="img-container">
                        <img
                          src="${produto.img}"
                        />
                      </div>
                      <div class="nome-preco">
                        <span>${produto.nome}</span>
                        <span class="bold margin-right">
                          <i class="preco">${produto.preco.toLocaleString(
        "pt-BR",
        { style: "currency", currency: "BRL" }
      )} </i>
                        </span>
                      </div>
                      <div class="descricao">
                        <span>
                         ${produto.tamanho}, 
                        </span>
                        <span>Teor Aolcólico: 
                        ${produto.teor_alcoolico}
                        </span>
                      </div>
                    </a>
                  </div>
        `;
      $("#produtos").append(productHtml);
    }
  });
  // Permite ver os detalhes do produto
  $(".item-produto").on("click", function () {
    var id = $(this).attr("data-id");
    localStorage.setItem("actual-id-produto", id);
    localStorage.setItem("actual-cart", false);
    app.views.main.router.navigate("/detalhes-produto/");
  });
}

// Modificam o DOM --------------------------------------------------------------------------------------------------------------- Fim