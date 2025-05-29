var favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

renderizarTela();

function renderizarTela() {
  $("#favoritos").empty();
  updateCoracao();
  if (favoritos.length > 0) {
    $.each(favoritos, function (index, favorito) {
      var item = favorito.item;
      var produtoHtml = `
            <div class="item-favorito">
                <a class="img-favorito" data-id="${item.id}">
                    <img src="${item.imagem}">
                </a>
                <div class="area-favorito">
                    <div class="sup-fav">
                         <span class="nome-favorito">${item.nome}</span>
                         <a class="delete-favorito" data-index="${index}" href="#">
                            <i class='bx bxs-x-square'></i>
                        </a>
                    </div>
                    <div class="middle-fav">
                        <a class="add-favorito-cart" data-index="${index}">Adicionar ao carrinho</a>
                    </div>
                </div>
            </div>
`;

      $("#favoritos").append(produtoHtml);
    });
    $(".img-favorito").on("click", function () {
      var id = $(this).attr("data-id");
      localStorage.setItem("detalhes", id);
      app.views.main.router.navigate("/detalhes/");
    });

    $("#favoritos").on("click", ".add-favorito-cart", function () {
        var index = $(this).data("index");
        var item = favoritos[index].item;
        adicionarCarrinho(item, 1);
  
        var toastCenter = app.toast.create({
          text: `${item.nome} adicionado ao carrinho`,
          position: "center",
          closeTimeout: 2000,
        });
  
        toastCenter.open();
      });

    $(".delete-favorito").on("click", function () {
      var indice = $(this).data("index");
      app.dialog.confirm(
        "Tem certeza que deseja excluir este item?",
        "Excluir",
        function () {
          favoritos.splice(indice, 1);
          localStorage.setItem("favoritos", JSON.stringify(favoritos));
          renderizarTela();
        }
      );
    });
  }
}

$("#esvaziar").on("click", function () {
  app.dialog.confirm(
    "Tem certeza que quer esvaziar o favoritos?",
    "Esvaziar Favoritos",
    function () {
      localStorage.removeItem("favoritos");
      app.views.main.router.refreshPage();
    }
  );
});

function updateCoracao() {
  var favorito = JSON.parse(localStorage.getItem("favoritos")) || [];
  if (favorito.length > 0) {
    $(".favorito-toolbar").css("color", "red");
  } else {
    $(".favorito-toolbar").css("color", "black");
  }
}

var carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
//FUNÇÂO PARA ADICIONAR AO CARRINHO
function adicionarCarrinho(item, quantidade) {
  var itemCarrinho = carrinho.find((c) => c.item.id === item.id);
  if (itemCarrinho) {
    itemCarrinho.quantidade += quantidade;
    itemCarrinho.total_item = itemCarrinho.quantidade * item.preco_promocional;
  } else {
    carrinho.push({
      item: item,
      quantidade: quantidade,
      total_item: quantidade * item.preco_promocional,
    });
  }
  //ATUALIZAR O LOCALSTORAGE DE CARRINHO
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
}
