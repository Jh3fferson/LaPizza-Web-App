// Recuperar dados do localStorage
var dadosArmazenados = {
  produtos: JSON.parse(localStorage.getItem("produtos")),
  localCarrinho: JSON.parse(localStorage.getItem("cart-items")),
};

// Coloca os itens chamados do localStorage em um map
var mapeamentos = {
  pizzas: new Map(dadosArmazenados.produtos.pizzas.map(piz => [piz.id, piz])),
  ingredientes: new Map(dadosArmazenados.produtos.ingredientes.map(ing => [ing.id, ing])),
  extras: new Map(dadosArmazenados.produtos.extras.map(ext => [ext.id, ext])),
  carrinho: new Map(dadosArmazenados.localCarrinho.map(c => [`${c.id}-${c.index}`, c])),
};

// Deveria retirar de algum lugar também, mas ele não existe
var valorFrete = 0;

// Inicia apenas se existir itens no carrinho
if (mapeamentos.carrinho) {
  atualizarCarrinho();
} else {
  carrinhoVazio();
}

function buscaFrete() {
  totalCarrinho(calcularSubtotal(), 10);
}

// Chama cada item do carrinho para renderizar ele
function renderizarCarrinho() {
  const $lista = $("#lista-carrinho");
  $lista.empty();

  mapeamentos.carrinho.forEach((itemCarrinho, index) => {
    const totalFormatado = itemCarrinho.total.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    const itemHTML = gerarItemHTML(itemCarrinho, index, totalFormatado);

    $lista.append(itemHTML);
  });

  configurarEventosCarrinho();
}

// Cria os eventos de cada elemento da lista
function configurarEventosCarrinho() {
  $(".delete-item").off("click").on("click", function () {
    const index = parseInt($(this).data("index"));
    app.dialog.confirm("Tem certeza que deseja excluir este item?", "Excluir", function () {
      mapeamentos.carrinho.delete(index);
      atualizarCarrinho();
      if (mapeamentos.carrinho.length == 0) {
        carrinhoVazio();
      }
    });
  });

  $(".menos").off("click").on("click", function () {
    const index = $(this).data("index");
    var car = mapeamentos.carrinho.get(index);
    if (car.quantidade > 1) {
      car.quantidade -= 1;
      mapeamentos.carrinho.set(index, car);
      atualizarCarrinho();
    } else {
      app.dialog.confirm("Deseja excluir este item?", "Excluir", function () {
        mapeamentos.carrinho.delete(index);
        atualizarCarrinho();
        if (mapeamentos.carrinho) {
          carrinhoVazio();
        }
      });
    }
  });

  $(".mais").off("click").on("click", function () {
    const index = $(this).data("index");
    var car = mapeamentos.carrinho.get(index);
    car.quantidade += 1;
    mapeamentos.carrinho.set(index, car);
    atualizarCarrinho();
  });

  $(".redirecionar-pizza").on("click", function () {
    const index = $(this).data("index");
    pizzaDetalhes(index);
    app.views.main.router.navigate("/detalhes-pizza/");
  });

  $(".redirecionar-prod").on("click", function () {
    const index = $(this).data("index");
    const indexCarrinho = index.split('-');
    localStorage.setItem("actual-id-produto", indexCarrinho[0]);
    app.views.main.router.navigate("/detalhes-produto/");
  });
}

// Inicia todas as funções para atualizar a página
function atualizarCarrinho() {
  const carrinhoAtualizado = Array.from(mapeamentos.carrinho.values());
  localStorage.setItem("cart-items", JSON.stringify(carrinhoAtualizado));
  renderizarCarrinho();
  calcularSubtotal();
  buscaFrete();
}

// Função para definir os nomes dos extras
function definirOsNomesDosExtras(listaExtras) {
  var nomes = [];
  listaExtras.forEach(ext => {
    const extra = mapeamentos.extras.get(ext.id);
    if (extra) {
      nomes.push(extra.nome);
    }
  });
  if (nomes.length === 0) return "";
  if (nomes.length === 1) return nomes[0];
  return nomes.slice(0, -1).join(", ") + " e " + nomes[nomes.length - 1];
}


// Evento do DOM, para esvaziar lesta
$("#esvaziar-carrinho").on("click", function () {
  app.dialog.confirm(
    "Tem certeza que quer esvaziar o carrinho?",
    "Esvaziar Carrinho",
    function () {
      localStorage.removeItem("cart-items");
      app.views.main.router.refreshPage();
    }
  );
});

// Modificam o DOM --------------------------------------------------------------------------------------------------------------- Inicio

function carrinhoVazio() {
  $("#lista-carrinho").empty().html(`
    <div class="text-align-center">
      <img width="300" src="img/empty.png">
      <br><span style="color:#1d3375;font-size:15px;">Nada por Enquanto</span></br>
    </div>`);
  $(".toolbar-cart").addClass("display-none");
}

function calcularSubtotal() {
  let subtotal = 0;
  mapeamentos.carrinho.forEach((carrinho) => {
    subtotal += carrinho.total * carrinho.quantidade;
  });

  $("#total-itens").html(
    subtotal.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })
  );

  return subtotal;
}

// Calcula o total do carrinho
function totalCarrinho(subtotal, frete) {
  const total = subtotal + frete;
  $("#total-geral").html(
    total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
  );
  $("#valor-frete").html(
    frete.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
  );
}

// Renderiza os itens do carrinho
function gerarItemHTML(itemCarrinho, index, totalFormatado) {
  const nomes = (itemCarrinho.verificaPizza) ? definirOsNomesDosExtras(itemCarrinho.extrasNoPedido) : "Nenhum";
  return `
    <div class="item-carrinho" data-index="${index}">
        <div class="area-img" style="flex-shrink:0;">
          <img src="${itemCarrinho.img}" alt="${itemCarrinho.nome}" style="width:80px; border-radius:6px;" />
        </div>
        <div class="area-detalhes" style="flex:1; margin-left:15px;">
          <div class="sup display-flex justify-content-space-between align-items-center">
            <span class="${itemCarrinho.verificaPizza ? "redirecionar-pizza" : "redirecionar-prod"} nome-prod font-strong" data-index="${index}">${itemCarrinho.nome} (${itemCarrinho.tamanho})</span>
            <a class="delete-item link icon-only" data-index="${index}">
              <i class="bx bx-x-circle"></i>
            </a>
          </div>
          <div class="middle text-muted" style="margin: 6px 0;${itemCarrinho.verificaPizza ? "" : "visibility:hidden;"}">
            <span class="extras" style="${nomes == "Nenhum" ? "display:none;" : ""}">Extras: ${nomes}</span>
            <span>${(itemCarrinho.personalizada) ? "Personalizada" : ""}</span>
          </div>
          <div class="preco-qtd display-flex justify-content-space-between align-items-center">
            <span class="preco font-strong">${totalFormatado}</span>
            <div class="count display-flex align-items-center">
              <a class="menos button button-small button-outline" data-index="${index}" href="#">-</a>
              <input readonly class="qtd-item input" type="text" value="${itemCarrinho.quantidade}" />
              <a class="mais button button-small button-outline" data-index="${index}" href="#">+</a>
            </div>
          </div>
      </div>
    </div>`;
}

// Modificam o DOM --------------------------------------------------------------------------------------------------------------- Fim

// Adiciona ao localStorage de pedidos-guardadis o item que o úsuario deseja ver
function pizzaDetalhes(index) {
  var pedidosGuardadosLocal = JSON.parse(localStorage.getItem("pedidos-guardados")) || [];
  var pedidosGuardados = new Map(pedidosGuardadosLocal.map(pgl => [pgl.id, pgl]));
  var carrinho = mapeamentos.carrinho.get(index);
  const id = carrinho.id;
  var item = mapeamentos.pizzas.get(id);
  const novoPedido = {
    id: id,
    pizza: [...carrinho.ingredientes],
    extrasNoPedido: [...carrinho.extrasNoPedido],
    tamanho: carrinho.tamanho,
    total_base: item.total,
    total: carrinho.total,
    img: carrinho.img,
    nome: carrinho.nome,
    quantidade: 1,
    verificaPizza: true
  };

  pedidosGuardados.set(id, novoPedido);
  const novosPedidosGuardados = Array.from(pedidosGuardados.values());
  localStorage.setItem("pedidos-guardados", JSON.stringify(novosPedidosGuardados));
  localStorage.setItem("actual-cart", true);
  app.views.main.router.navigate("/detalhes-pizza/");
}