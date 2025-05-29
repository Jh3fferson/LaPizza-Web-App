fetch("js/backend.json")
  .then((response) => {
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  })
  .then((pizzaData) => {
    if (!pizzaData.pizzas || !pizzaData.ingredientes) {
      throw new Error("JSON inválido: faltam 'pizzas' ou 'ingredientes'");
    }

    pizzaData.pizzas.forEach((pizza) => {
      if (!Array.isArray(pizza.ingredientes)) {
        console.warn(`Ingredientes inválidos para pizza id ${pizza.id}`);
        pizza.ingredientes = [];
      }

      pizza.ingredientes = pizza.ingredientes.map((ingredienteId) => {
        const ingrediente = pizzaData.ingredientes.find(i => i.id === ingredienteId);
        if (!ingrediente) {
          console.warn(`Ingrediente id ${ingredienteId} não encontrado para pizza id ${pizza.id}`);
        }
        return ingrediente;
      });

      // Soma o preço dos ingredientes
      pizza.preco += pizza.ingredientes.reduce(
        (total, ingrediente) => total + (ingrediente?.preco || 0),
        0
      );

    });
    localStorage.setItem("pizzaData", JSON.stringify(pizzaData));
    renderizarProdutos();
    console.log("Dados do produto salvo no localStorage.");
  })
  .catch((error) => console.error("Erro ao fazer o fetch dos dados:", error));

function definirOsNomesDosIngredientes(pizza) {
  const nomes = pizza.ingredientes.map((i) => i.nome);

  if (nomes.length === 0) return "";
  if (nomes.length === 1) return nomes[0];
  return nomes.slice(0, -1).join(", ") + " e " + nomes[nomes.length - 1];
}

$(".categorias").on("click", ".filter-btn", function () {
  let categoria_numero = $(this).data("id");
  renderizarProdutos(categoria_numero);
});

function renderizarProdutos(categoria_numero = 0) {
  $("#produtos").empty();
  var pizzas = JSON.parse(localStorage.getItem("pizzaData")).pizzas;
  var extras = JSON.parse(localStorage.getItem("pizzaData")).extras;
  pizzas.forEach((pizza) => {
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
                          <i class="preco">${pizza.preco.toLocaleString(
        "pt-BR",
        { style: "currency", currency: "BRL" }
      )} </i>
                        </span>
                      </div>
                      <div class="descricao">
                        <span>
                         ${definirOsNomesDosIngredientes(pizza)}
                        </span>
                      </div>
                    </a>
                  </div>
        `;
      $("#produtos").append(productHtml);
    }
  });

  $(".item-pizza").on("click", function () {
    var id = $(this).attr("data-id");
    localStorage.setItem("actual-id-pizza", id);
    app.views.main.router.navigate("/detalhes-pizza/");
  });

  extras.forEach((extra) => {
    var productHtml = `
                  <div class="item-card">
                    <a data-id="${extra.id}" href="#" class="item item-extra">
                      <div class="img-container">
                        <img
                          src="${extra.img}"
                        />
                      </div>
                      <div class="nome-preco">
                        <span>${extra.nome}</span>
                        <span class="bold margin-right">
                          <i class="preco">${extra.preco.toLocaleString(
      "pt-BR",
      { style: "currency", currency: "BRL" }
    )} </i>
                        </span>
                      </div>
                      <div class="descricao">
                        <span>
                         ${extra.tamanho}, 
                        </span>
                        <span>Teor Aolcólico: 
                        ${extra.teor_alcoolico}
                        </span>
                      </div>
                    </a>
                  </div>
        `;
    $("#produtos").append(productHtml);
  });

  $(".item-extra").on("click", function () {
    var id = $(this).attr("data-id");
    localStorage.setItem("actual-id-produto", id);
    app.views.main.router.navigate("/detalhes-produto/");
  });
}
