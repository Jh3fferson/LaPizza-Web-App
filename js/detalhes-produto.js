var dadosArmazenados = {
  idAtual: parseInt(localStorage.getItem("actual-id-pizza")),
  actualCart: JSON.parse(localStorage.getItem("actual-cart")) || false,
  produtos: JSON.parse(localStorage.getItem("produtos")),
  carrinho: JSON.parse(localStorage.getItem("cart-items")) || [],
  favoritos: JSON.parse(localStorage.getItem("favoritos")) || []
};
var mapeamentos = {
  produtos: new Map(dadosArmazenados.produtos.extras.map(ext => [ext.id, ext])),
  carrinho: new Map(dadosArmazenados.carrinho.map(c => [`${c.id}-${c.index}`, c])),
  favoritos: new Map(dadosArmazenados.favoritos.map(f => [`${f.id}-${f.index}`, f]))
};

var id = dadosArmazenados.idAtual;
var item = mapeamentos.produtos.get(id);

if (item) {
  //ALIMENTAR VALORES ITENS
  $("#imagem-produto").attr("src", item.img);
  $("#nome-produto").html(item.nome);
  $("#rating-produto").html(item.avaliacao);
  $("#categoria-produto").html(item.categoria);
  $("#descricao-produto").html(item.descricao);
  $("#origem").html(item.pais_origem);
  $("#teor").html(item.teor_alcoolico);
  $("#tamanho").html(item.tamanho);


  $("#preco-produto").html(
    item.preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
  );
  if (dadosArmazenados.actualCart) {
    $('button').prop('disabled', true);
    $('.dots-detalhes').hide();
    $('.toolbar-detalhes').hide();
  }
  else {
    $('button').prop('disabled', false);
    $('.dots-detalhes').show();
    $('.toolbar-detalhes').show();
  }
} else {
  console.log("Produto não encontrado");
}
// mudar
//FUNÇÂO PARA ADICIONAR AO CARRINHO
// mudar e juntar com o adicionarFavorito
function adicionarItem(local, quantidade) {
  var itemLocal = (local === "favoritos") ? mapeamentos.favoritos : mapeamentos.carrinho;
  var novoItem = itemLocal.get(`${id}-0`);

  if (novoItem) {
    novoItem.quantidade += quantidade;
    novoItem.total_item = novoItem.quantidade * item.preco;
    itemLocal.set(`${id}-0`, novoItem);
  } else {
    var novoItemCriado = {
      id: item.id,
      index: 0,
      nome: item.nome,
      img: item.img,
      quantidade: quantidade,
      tamanho: item.tamanho,
      total: quantidade * item.preco,
      verificaPizza: false,
    };
    itemLocal.set(`${id}-0`, novoItemCriado);
  }
  //ATUALIZAR O LOCALSTORAGE DE CARRINHO
  const novosItens = Array.from(itemLocal.values());
  localStorage.setItem(local, JSON.stringify(novosItens));

}

//BOTÃO DE ADICIONAR AO CARRINHO
$(".add-cart").on("click", function () {
  adicionarItem("cart-items", 1);
  var toastCenter = app.toast.create({
    text: `${item.nome} adiocionado ao carrinho`,
    position: "center",
    closeTimeout: 2000,
  });

  toastCenter.open();
});

$("#favorito-btn").on("click", function () {
  adicionarItem("favoritos", 1);
  var toastCenter = app.toast.create({
    text: `${item.nome} adiocionado aos favoritos`,
    position: "center",
    closeTimeout: 2000,
  });

  toastCenter.open();
});
