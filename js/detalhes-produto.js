//RECUPERAR ID LOCALSTORAGE

var id = parseInt(localStorage.getItem("actual-id-produto"));
var produtos = JSON.parse(localStorage.getItem("pizzaData")).extras;
var item = produtos.find((produto) => produto.id === id);

if (item) {
  console.log("Produto encontrado:", item);
  //ALIMENTAR VALORES ITENS
  $("#imagem-produto").attr("src", item.img);
  $("#nome-produto").html(item.nome);
  $("#rating-produto").html(item.avaliacao);
  $("#categoria-produto").html(item.categoria);
  $("#descricao-produto").html(item.descricao);
  updateColor(item.id);

  var tabelaDetalhes = $("#lista-caracteristicas");

  var linha = `
        <tr>
            <td><span>Origem: </span> </td>
            <td> <span> ${item.pais_origem}</span></td>
        </tr>
               <tr>
            <td><span>Teor Alcoolico: </span> </td>
            <td> <span> ${item.teor_alcoolico}</span></td>
        </tr>
               <tr>
            <td><span>Tamanho: </span> </td>
            <td> <span> ${item.tamanho}</span></td>
        </tr>
    `;
  tabelaDetalhes.append(linha);


  $("#preco-produto").html(
    item.preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
  );
} else {
  console.log("Produto não encontrado");
}

var carrinho = JSON.parse(localStorage.getItem("cart-items")) || [];
//FUNÇÂO PARA ADICIONAR AO CARRINHO
function adicionarCarrinho(item, quantidade) {
  var itemCarrinho;
  if (!item.verificaPizza) {
    itemCarrinho = carrinho.find((c) => !c.verificaPizza && c.item.id === item.id);
  } else {
    // Para pizzas, pode comparar pelo id e também por personalização, se quiser
    itemCarrinho = carrinho.find(
      (c) =>
        c.verificaPizza &&
        c.id === item.id &&
        JSON.stringify(c.pizza) === JSON.stringify(item.pizza) &&
        c.tamanho === item.tamanho
    );
  }

  if (itemCarrinho) {
    itemCarrinho.quantidade += quantidade;
    itemCarrinho.total_item = itemCarrinho.quantidade * item.preco;
  } else {
    carrinho.push({
      id: item.id,
      nome: item.nome,
      img: item.img,
      quantidade: quantidade,
      tamanho: item.tamanho,
      total: quantidade * item.preco,
      verificaPizza: false,
    });
  }
  //ATUALIZAR O LOCALSTORAGE DE CARRINHO
  localStorage.setItem("cart-items", JSON.stringify(carrinho));

}

//BOTÃO DE ADICIONAR AO CARRINHO
$(".add-cart").on("click", function () {
  adicionarCarrinho(item, 1);
  var toastCenter = app.toast.create({
    text: `${item.nome} adiocionado ao carrinho`,
    position: "center",
    closeTimeout: 2000,
  });

  toastCenter.open();
});

$(".favorito-btn").on("click", function () {
  adicionarFavorito(item);
});

function adicionarFavorito(itemF) {
  var favorito = JSON.parse(localStorage.getItem("favoritos")) || [];
  var itemFavorito = favorito.find((f) => f.item.id === itemF.id);
  var texto;
  if (!itemFavorito) {
    favorito.push({
      item: item,
    });
    texto = "adicionado aos favoritos";

  } else {
    favorito = favorito.filter(f => f.item.id !== itemF.id);
    texto = "retirado dos favoritos";
  }

  var toastCenter = app.toast.create({
    text: `${item.nome} ${texto}`,
    position: "center",
    closeTimeout: 2000,
  });
  toastCenter.open();
  //ATUALIZAR O LOCALSTORAGE DE FAVORITO
  app.views.main.router.refreshPage();
  localStorage.setItem("favoritos", JSON.stringify(favorito));
}

function updateColor(id) {
  console.log(id)
  var favorito = JSON.parse(localStorage.getItem("favoritos")) || [];
  var itemFavorito = favorito.find((f) => f.item.id === id);
  if (itemFavorito) {
    $('.favorito').css("color", "red");
  }
  else {
    $('.favorito').css("color", "#547aec");
  }

}
