// Dados do localStorage
var localCarrinho = localStorage.getItem("cart-items");
var valorFrete = 0;

// Inicializar carrinho
var carrinho = localCarrinho ? JSON.parse(localCarrinho) : [];

if (carrinho.length > 0) {
  atualizarTotais();
} else {
  carrinhoVazio();
}

// Renderiza os itens do carrinho
function gerarItemHTML(itemCarrinho, index, totalFormatado) {
  const nomes = definirOsNomesDosIngredientes(itemCarrinho.extrasNoPedido);
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

function renderizarCarrinho() {
  const $lista = $("#lista-carrinho");
  $lista.empty();

  carrinho.forEach((itemCarrinho, index) => {
    const totalFormatado = itemCarrinho.total.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    const itemHTML = gerarItemHTML(itemCarrinho, index, totalFormatado);

    $lista.append(itemHTML);
  });

  configurarEventosCarrinho();
}

function configurarEventosCarrinho() {
  $(".delete-item").off("click").on("click", function () {
    const index = parseInt($(this).data("index"));
    app.dialog.confirm("Tem certeza que deseja excluir este item?", "Excluir", function () {
      carrinho.splice(index, 1);
      atualizarTotais();
      if (carrinho.length == 0) {
        carrinhoVazio();
      }
    });
  });

  $(".menos").off("click").on("click", function () {
    const index = parseInt($(this).data("index"));
    if (carrinho[index].quantidade > 1) {
      carrinho[index].quantidade--;
      atualizarTotais();
    } else {
      app.dialog.confirm("Deseja excluir este item?", "Excluir", function () {
        carrinho.splice(index, 1);
        atualizarTotais();
        if (carrinho.length == 0) {
          carrinhoVazio();
        }
      });
    }
  });

  $(".mais").off("click").on("click", function () {
    const index = parseInt($(this).data("index"));
    carrinho[index].quantidade++;
    atualizarTotais();
  });

  $(".redirecionar-pizza").on("click", function () {
    const index = parseInt($(this).data("index"));
    localStorage.setItem("actual-id-pizza", carrinho[index].id);
    localStorage.setItem("actual-index-pizza", carrinho[index].index);
    app.views.main.router.navigate("/detalhes-pizza/");
  });

  $(".redirecionar-prod").on("click", function () {
    const index = parseInt($(this).data("index"));
    localStorage.setItem("actual-id-pizza", carrinho[index].id);
    app.views.main.router.navigate("/detalhes-produto/");
  });
}


function atualizarTotais() {
  localStorage.setItem("cart-items", JSON.stringify(carrinho));
  renderizarCarrinho();
  calcularSubtotal();
  buscaFrete();
}

function calcularSubtotal() {
  let subtotal = 0;
  carrinho.forEach((carrinho) => {
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

function buscaFrete() {
  totalCarrinho(calcularSubtotal(), 10);
}

function totalCarrinho(subtotal, frete) {
  const total = subtotal + frete;
  $("#total-geral").html(
    total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
  );
  $("#valor-frete").html(
    frete.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
  );
}

function carrinhoVazio() {
  $("#lista-carrinho").empty().html(`
    <div class="text-align-center">
      <img width="300" src="img/empty.png">
      <br><span style="color:#1d3375;font-size:15px;">Nada por Enquanto</span></br>
    </div>`);
  $(".toolbar-cart").addClass("display-none");
}

function definirOsNomesDosIngredientes(listaExtras) {
  if (!listaExtras || listaExtras.length === 0) return "Nenhum";
  const nomes = listaExtras.map((i) => i.acrecimo.nome);
  return nomes.length === 1
    ? nomes[0]
    : nomes.slice(0, -1).join(", ") + " e " + nomes[nomes.length - 1];
}

$("#esvaziar").on("click", function () {
  app.dialog.confirm(
    "Tem certeza que quer esvaziar o carrinho?",
    "Esvaziar Carrinho",
    function () {
      localStorage.removeItem("cart-items");
      app.views.main.router.refreshPage();
    }
  );
});
