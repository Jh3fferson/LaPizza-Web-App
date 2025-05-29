// Recuperar dados do localStorage
var idAtual = parseInt(localStorage.getItem("actual-id-pizza"));
var pizzaData = JSON.parse(localStorage.getItem("pizzaData"));
var ingredientes = pizzaData.ingredientes; // todos ingredientes possíveis
var extras = pizzaData.extras; // todos extras possíveis (bebidas, etc)
var pizzas = pizzaData.pizzas;
var item = pizzas.find((p) => p.id === idAtual);
var pedidosGuardados =
  JSON.parse(localStorage.getItem("pedidos-guardados")) || [];
var multiplicadorTamanho = 1;

// Variáveis do pedido atual
var idpizza;
var pizza = []; // ingredientes com quantidade
var extrasNoPedido = []; // extras com quantidade
var total_base = 0;
var total = 0;
var tamanho;

var pedidoGuardado = pedidosGuardados.find((pedido) => pedido.id === idAtual);

if (pedidoGuardado) {
  idpizza = pedidoGuardado.id;
  pizza = pedidoGuardado.pizza || [];
  extrasNoPedido = pedidoGuardado.extrasNoPedido || [];
  total = pedidoGuardado.total;
  total_base = pedidoGuardado.total_base;
  tamanho = pedidoGuardado.tamanho;
} else {
  idpizza = idAtual;
  total_base = item.preco;
  total = item.preco;
  // inicializar pizza com os ingredientes originais, cada um com quantidade 1
  pizza = item.ingredientes.map((ing) => ({ acrecimo: ing, quantidade: 1 }));
  extrasNoPedido = [];
  tamanho = "pequeno";
}

// Função para atualizar os inputs da lista de ingredientes
function atualizarInputsIngredientes() {
  pizza.forEach((p) => {
    let dataId = p.acrecimo.id;
    $(`#lista-ingredientes tr[data-id="${dataId}"] input`).val(p.quantidade);
  });
}

// Função para atualizar inputs da lista de extras
function atualizarInputsExtras() {
  extrasNoPedido.forEach((e) => {
    let dataId = e.acrecimo.id;
    $(`#lista-extras tr[data-id="${dataId}"] input`).val(e.quantidade);
  });
}

function criarIngrediente(id) {
  var pizzaItem = pizza.find((p) => p.acrecimo.id === id);
  if (!pizzaItem) {
    var ingrediente = ingredientes.find((i) => i.id === id);
    if (ingrediente) {
      pizzaItem = { acrecimo: ingrediente };
      pizza.push(pizzaItem);
    }
  }
  atualizarBotaoSubIngredientes(id, pizzaItem, true);
  return pizzaItem ? 1 : 0;
}

function retirarIngrediente(id) {
  pizza = pizza.filter((p) => p.acrecimo.id !== id);
  atualizarBotaoSubIngredientes(id, null, true);
  return 0;
}

// Criar/acrescentar extra (bebida, etc)
function criarExtra(id, quantidade = 1) {
  var extraItem = extrasNoPedido.find((e) => e.acrecimo.id === id);
  if (extraItem) {
    extraItem.quantidade += quantidade;
  } else {
    var extra = extras.find((ex) => ex.id === id);
    if (extra) {
      extraItem = { acrecimo: extra, quantidade };
      extrasNoPedido.push(extraItem);
    }
  }
  extrasNoPedido = extrasNoPedido.filter((e) => e.quantidade > 0);
  atualizarBotaoSubExtras(id, extraItem, false); // false = extra
  return extraItem ? extraItem.quantidade : 0;
}

// Retirar extra (diminuir quantidade)
function retirarExtra(id) {
  var extraItem = extrasNoPedido.find((e) => e.acrecimo.id === id);
  if (extraItem) {
    extraItem.quantidade--;
    extrasNoPedido = extrasNoPedido.filter((e) => e.quantidade > 0);
  }
  atualizarBotaoSubExtras(id, extraItem, false);
  return extraItem ? extraItem.quantidade : 0;
}

// Atualizar estado do botão de subtração (-)
function atualizarBotaoSubIngredientes(id) {
  let pizzaItem = pizza.find((p) => p.acrecimo.id === id);
  let botaoSub = $(`#lista-ingredientes tr[data-id="${id}"] .sub`);
  let indicador = $(
    `#lista-ingredientes tr[data-id="${id}"] .status-indicador`
  );

  let isOriginal = item.ingredientes.some((ing) => ing.id === id);

  if (!pizzaItem) {
    // Se não existe no pedido atual, botão desativado e X
    botaoSub.prop("disabled", true);
    indicador.html(
      '<i class="bx bx-x" style="color:red; font-size: 24px;"></i>'
    );
  } else {
    // Se é original, só desativa se quantidade for 1 (mínimo)
    if (isOriginal) {
      botaoSub.prop("disabled", pizzaItem.quantidade <= 1);
    } else {
      // Se é extra, pode remover até zero
      botaoSub.prop("disabled", pizzaItem.quantidade <= 0);
    }

    // Indicador visual
    indicador.html(
      '<i class="bx bx-check" style="color:green; font-size: 24px;"></i>'
    );
  }
}

function atualizarBotaoSubExtras(id, isExtra = false) {
  let botaoSub;
  let itemArray;

  if (isExtra) {
    itemArray = extrasNoPedido;
    botaoSub = $(`#lista-extras tr[data-id="${id}"] .sub`);
  } else {
    itemArray = pizza;
    botaoSub = $(`#lista-ingredientes tr[data-id="${id}"] .sub`);
  }

  let item = itemArray.find((p) => p.acrecimo.id === id);

  if (!item) {
    botaoSub.prop("disabled", true);
    return;
  }

  if (!isExtra) {
    // Ingrediente original não pode ser reduzido abaixo de 1
    botaoSub.prop("disabled", item.quantidade <= 1);
  } else {
    // Extras podem zerar
    botaoSub.prop("disabled", item.quantidade <= 0);
  }
}

function renderLista(
  item,
  localHTML,
  subButtonDisabled,
  isIngrediente = false
) {
  let itemHTML = `
    <tr class="linha-adicionar" data-id="${item.id}">
      <td style="width: 20%; text-align: center; font-size:">
        <button class="sub" ${subButtonDisabled}>-</button>
      </td>
      <td style="width: 60%;">
        <div class="display-flex justify-content-space-between">
          <span>${item.nome}</span>
          ${isIngrediente
      ? '<span class="status-indicador"></span>'
      : `<input readonly style="width: 40px; text-align: center;" value="0">`
    }
        </div>
      </td>
      <td style="width: 20%; text-align: center;">
        <button class="add">+</button>
      </td>
    </tr>`;
  $(localHTML).append(itemHTML);
}

// Renderizar as duas listas no HTML
if (item) {
  // Dados da pizza
  $("#imagem-pizza").attr("src", item.img);
  $("#nome-pizza").html(item.nome);
  $("#promotional-price-details").html(
    item.preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
  );
  $("#description-details").html(definirOsNomesDosIngredientes(item));

  // Ingredientes (originais + acréscimos)
  ingredientes.forEach((ingrediente) => {
    let ingredienteExistente = item.ingredientes.find(
      (ing) => ing.id === ingrediente.id
    );
    let ingredienteNopizza = pizza.find(
      (pizzaItem) => pizzaItem.acrecimo.id === ingrediente.id
    );
    let quantidadeIngrediente = ingredienteNopizza
      ? ingredienteNopizza.quantidade
      : 0;
    let subButtonDisabled =
      ingredienteExistente && quantidadeIngrediente <= 1 ? "disabled" : "";

    renderLista(ingrediente, "#lista-ingredientes", subButtonDisabled, true);
    atualizarBotaoSubIngredientes(ingrediente.id);
  });

  // Extras (bebidas, etc)
  extras.forEach((extra) => {
    let extraNoPedido = extrasNoPedido.find(
      (ex) => ex.acrecimo.id === extra.id
    );
    let quantidadeExtra = extraNoPedido ? extraNoPedido.quantidade : 0;
    let subButtonDisabled = quantidadeExtra <= 0 ? "disabled" : "";

    renderLista(extra, "#lista-extras", subButtonDisabled);
  });

  // Atualizar inputs e total
  atualizarInputsIngredientes();
  atualizarInputsExtras();
  adicionarTotal();
} else {
  console.log("Produto não encontrado!");
}

// Eventos para ingredientes
$("#lista-ingredientes").on("click", ".add", function () {
  let dataId = parseInt($(this).closest("tr").data("id"));
  criarIngrediente(dataId);
  alterarTotal();
});

$("#lista-ingredientes").on("click", ".sub", function () {
  let dataId = parseInt($(this).closest("tr").data("id"));
  retirarIngrediente(dataId);
  alterarTotal();
});

// Eventos para extras
$("#lista-extras").on("click", ".add", function () {
  let dataId = parseInt($(this).closest("tr").data("id"));
  let novaQuantidade = criarExtra(dataId, 1);
  $(this).closest("tr").find("input").val(novaQuantidade);
  alterarTotal();
});

$("#lista-extras").on("click", ".sub", function () {
  let dataId = parseInt($(this).closest("tr").data("id"));
  let novaQuantidade = retirarExtra(dataId);
  $(this).closest("tr").find("input").val(novaQuantidade);
  alterarTotal();
});

// Função para adicionar total no HTML
function adicionarTotal() {
  $("#promotional-price-details").html(
    total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
  );
}

// Função para alterar total somando ingredientes + extras
function alterarTotal() {
  // calcula preço dos ingredientes extras (além dos originais)
  let totalIngredientesExtras = 0;
  pizza.forEach((p) => {
    const isOriginal = item.ingredientes.some(
      (ing) => ing.id === p.acrecimo.id
    );
    if (!isOriginal) {
      totalIngredientesExtras += p.acrecimo.preco || 0;
    }
  });

  // preço base da pizza + ingredientes extras
  let precoPizza = total_base + totalIngredientesExtras;

  // aplica multiplicador do tamanho só na pizza
  if (typeof multiplicadorTamanho !== "undefined") {
    precoPizza = precoPizza * multiplicadorTamanho;
  }

  // soma o preço dos extras (bebidas, etc) sem multiplicador
  let totalExtras = 0;
  extrasNoPedido.forEach((e) => {
    totalExtras += (e.acrecimo.preco || 0) * e.quantidade;
  });

  // total final = pizza com multiplicador + extras sem multiplicador
  total = precoPizza + totalExtras;

  guardarpizza();
  adicionarTotal();
}

// Salvar pedido no localStorage
function guardarpizza() {
  let index = pedidosGuardados.findIndex((pedido) => pedido.id === idAtual);
  if (index !== -1) {
    pedidosGuardados[index].pizza = pizza;
    pedidosGuardados[index].extrasNoPedido = extrasNoPedido;
    pedidosGuardados[index].total_base = total_base;
    pedidosGuardados[index].total = total;
    pedidosGuardados[index].tamanho = tamanho;
    pedidosGuardados[index].img = item.img;
    pedidosGuardados[index].nome = item.nome;
    pedidoGuardado = pedidosGuardados[index];
  } else {
    pedidoGuardado = {
      id: idAtual,
      pizza: pizza,
      extrasNoPedido: extrasNoPedido,
      tamanho: tamanho,
      total_base: total_base,
      total: total,
      img: item.img,
      nome: item.nome,
      quantidade: 1,
      verificaPizza: true
    };
    pedidosGuardados.push(pedidoGuardado);
  }
  localStorage.setItem("pedidos-guardados", JSON.stringify(pedidosGuardados));
}

// Função pra listar nomes dos ingredientes originais (para descrição)
function definirOsNomesDosIngredientes(pizza) {
  const nomes = pizza.ingredientes.map((i) => i.nome);
  if (nomes.length === 0) return "";
  if (nomes.length === 1) return nomes[0];
  return nomes.slice(0, -1).join(", ") + " e " + nomes[nomes.length - 1];
}

// Botão adicionar ao carrinho
function addItemNoCarrinho() {
  // Atualiza pedidoGuardado com guardarpizza se necessário
  guardarpizza();

  // Pega o carrinho do localStorage ou inicia um array vazio
  var cart = JSON.parse(localStorage.getItem("cart-items")) || [];

  // Procura se já existe o item no carrinho
  var indexNoCarrinho = cart.findIndex((c) => c.id === idAtual);

  if (indexNoCarrinho !== -1) {
    // Atualiza o item no carrinho (substitui o objeto todo)
    cart[indexNoCarrinho] = pedidoGuardado;
  } else {
    // Adiciona o pedido no carrinho
    cart.push(pedidoGuardado);
  }

  // Salva o carrinho atualizado
  localStorage.setItem("cart-items", JSON.stringify(cart));

  // Se desejar, remova o pedido dos pedidosGuardados
  if (Array.isArray(pedidosGuardados)) {
    let index = pedidosGuardados.findIndex((pedido) => pedido.id === idAtual);
    if (index !== -1) {
      pedidosGuardados.splice(index, 1);
    }
  }

  // Salva pedidosGuardados atualizados, se for necessário
  localStorage.setItem("pedidos-guardados", JSON.stringify(pedidosGuardados));
}

$(".add-cart").on("click", function () {
  addItemNoCarrinho();
  var toastCenter = app.toast.create({
    text: `${item.nome} adiocionada ao carrinho`,
    position: "center",
    closeTimeout: 2000,
  });

  toastCenter.open();
});

$(".tamanhos").on("click", ".tamanho-btn", function () {
  $(".tamanhos .tamanho-btn").removeClass("selected");
  $(this).addClass("selected");
  tamanho = $(this).data("tamanho");

  switch (tamanho) {
    case "Pequena":
      multiplicadorTamanho = 1;
      break;
    case "Media":
      multiplicadorTamanho = 1.4;
      break;
    case "Grande":
      multiplicadorTamanho = 1.7;
      break;
    case "Gigante":
      multiplicadorTamanho = 2;
      break;
    default:
      multiplicadorTamanho = 2.5;
      break;
  }

  alterarTotal();
});
