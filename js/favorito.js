// Recuperar dados do localStorage
var dadosArmazenados = {
  produtos: JSON.parse(localStorage.getItem("produtos")),
  favoritos: JSON.parse(localStorage.getItem("favoritos")) || [],
  pedidosGuardadosLocal: JSON.parse(localStorage.getItem("pedidos-guardados")) || [],
};

// Coloca os itens chamados do localStorage em um map
var mapeamentos = {
  pizzas: new Map(dadosArmazenados.produtos.pizzas.map(piz => [piz.id, piz])),
  ingredientes: new Map(dadosArmazenados.produtos.ingredientes.map(ing => [ing.id, ing])),
  extras: new Map(dadosArmazenados.produtos.extras.map(ext => [ext.id, ext])),
  favoritos: new Map(dadosArmazenados.favoritos.map(f => [`${f.id}-${f.index}`, f])),
  pedidosGuardados: new Map(dadosArmazenados.pedidosGuardadosLocal.map(pgl => [pgl.id, pgl])),
};

// Inicia a página
renderizarTela();

// Cria os eventos de cada elemento da lista
function configurarEventosDoFavoritado() {

  // Redireciona para a página de detalhes da pizza
  $(".nome-pizza").off("click").on("click", function () {
    var index = $(this).attr("data-index");
    const indexFavorito = index.split('-');
    localStorage.setItem("actual-id-pizza", indexFavorito[0]);
    localStorage.setItem("actual-cart", false);
    pizzaDetalhes(index);
  });

  // Redireciona para a página de detalhes do produto
  $(".nome-produto").off("click").on("click", function () {
    var index = $(this).attr("data-index");
    const indexFavorito = index.split('-');
    localStorage.setItem("actual-id-produto", indexFavorito[0]);
    localStorage.setItem("actual-cart", false);
    app.views.main.router.navigate("/detalhes-produto/");
  });

  // Delata o item da lista
  $(".delete-favorito").off("click").on("click", function () {
    var index = $(this).data("index");
    app.dialog.confirm(
      "Tem certeza que deseja excluir este item?",
      "Excluir",
      function () {
        mapeamentos.favoritos.delete(index);
        const favoritos = Array.from(mapeamentos.favoritos.values());
        localStorage.setItem("favoritos", JSON.stringify(favoritos));
        renderizarTela();
      }
    );
  });
}

// Evento do DOM, para esvaziar lista
$("#esvaziar-favoritos").on("click", function () {
  app.dialog.confirm(
    "Tem certeza que quer esvaziar o favoritos?",
    "Esvaziar Favoritos",
    function () {
      localStorage.removeItem("favoritos");
      app.views.main.router.refreshPage();
    }
  );
});

// Função para modificar o coração, para avisar o usúario se ele tem itens favoritados ou não
function updateCoracao() {
  var favorito = JSON.parse(localStorage.getItem("favoritos")) || [];
  if (favorito.length > 0) {
    $(".favorito-toolbar").css("color", "red");
  } else {
    $(".favorito-toolbar").css("color", "black");
  }
}

// Função pra listar nomes dos extras da pizza
function definirOsNomesDosExtras(listaExtras) {
  var nomes = [];
  listaExtras.forEach(ext => {
    const extra = mapeamentos.extras.get(ext.id);
    if (extra) {
      nomes.push(extra.nome);
    }
  });
  if (nomes.length === 0) return "Nenhum";
  if (nomes.length === 1) return nomes[0];
  return nomes.slice(0, -1).join(", ") + " e " + nomes[nomes.length - 1];
}

// Adiciona ao localStorage de pedidos-guardadis o item que o úsuario deseja ver
function pizzaDetalhes(index) {
  var favorito = mapeamentos.favoritos.get(index);
  const id = favorito.id;
  var item = mapeamentos.pizzas.get(id);
  const novoPedido = {
    id: id,
    pizza: [...favorito.ingredientes],
    extrasNoPedido: [...favorito.extrasNoPedido],
    tamanho: favorito.tamanho,
    total_base: item.total,
    total: favorito.total,
    img: favorito.img,
    nome: favorito.nome,
    quantidade: 1,
    verificaPizza: true
  };

  mapeamentos.pedidosGuardados.set(id, novoPedido);
  const pedidosGuardados = Array.from(mapeamentos.pedidosGuardados.values());
  localStorage.setItem("pedidos-guardados", JSON.stringify(pedidosGuardados));
  app.views.main.router.navigate("/detalhes-pizza/");
}

// Modificam o DOM --------------------------------------------------------------------------------------------------------------- Inicio

// Renderiza os itens no DOM
function renderizarTela() {
  $("#favoritos").empty();
  updateCoracao();
  if (mapeamentos.favoritos) {
    mapeamentos.favoritos.forEach((favorito, index) => {
      const nomes = (favorito.verificaPizza) ? definirOsNomesDosExtras(favorito.extrasNoPedido) : "Nenhum";
      var produtoHtml = `
            <div class="item-favorito">
                <a class="img-favorito">
                    <img src="${favorito.img}">
                </a>
                <div class="area-favorito">
                    <div class="sup-fav">
                         <span class="${favorito.verificaPizza ? "nome-pizza" : "nome-produto"}" data-index="${index}">${favorito.nome}</span>
                         <a class="delete-favorito" data-index="${index}" href="#">
                            <i class='bx bxs-x-square'></i>
                        </a>
                    </div>
                    <div class="middle text-muted" style="margin: 6px 0;${favorito.verificaPizza ? "" : "visibility:hidden;"}">
                      <span class="extras" style="${nomes == "Nenhum" ? "display:none;" : ""}">Extras: ${nomes}</span>
                      <span>${(favorito.personalizada) ? "Personalizada" : ""}</span>
                  </div>
                </div>
            </div>
`;

      $("#favoritos").append(produtoHtml);
    });

    configurarEventosDoFavoritado();

  }
}

// Modificam o DOM --------------------------------------------------------------------------------------------------------------- Fim