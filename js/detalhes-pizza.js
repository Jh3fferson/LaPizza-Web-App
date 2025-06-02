// Recuperar dados do localStorage
var dadosArmazenados = {
  idAtual: parseInt(localStorage.getItem("actual-id-pizza")),
  actualCart: JSON.parse(localStorage.getItem("actual-cart")) || false,
  produtos: JSON.parse(localStorage.getItem("produtos")),
  pedidosGuardadosLocal: JSON.parse(localStorage.getItem("pedidos-guardados")) || [],
  cart: JSON.parse(localStorage.getItem("cart-items")) || [],
  favoritos: (JSON.parse(localStorage.getItem("favoritos")) || []).filter(item => item.verificaPizza)
};

// Coloca os itens chamados do localStorage em um map
var mapeamentos = {
  pizzas: new Map(dadosArmazenados.produtos.pizzas.map(piz => [piz.id, piz])),
  ingredientes: new Map(dadosArmazenados.produtos.ingredientes.map(ing => [ing.id, ing])),
  extras: new Map(dadosArmazenados.produtos.extras.map(ext => [ext.id, ext])),
  pedidosGuardados: new Map(dadosArmazenados.pedidosGuardadosLocal.map(pgl => [pgl.id, pgl])),
  carrinho: new Map(dadosArmazenados.cart.map(c => [`${c.id}-${c.index}`, c])),
  favoritos: new Map(dadosArmazenados.favoritos.map(f => [`${f.id}-${f.index}`, f]))
};

// Variáveis do pedido atual
var item = mapeamentos.pizzas.get(dadosArmazenados.idAtual);
var multiplicadorTamanho = 1;
var idpizza;
var pizza = []; //id dos ingredientes
var extrasNoPedido = []; // id dos extras, com a quantidade
var total_base = 0;
var total = 0;
var tamanho;

var resultado = prepararPedidoGuardado(dadosArmazenados.idAtual, item, mapeamentos.pedidosGuardados);
idpizza = resultado.idpizza;
pizza = resultado.pizza;
extrasNoPedido = resultado.extrasNoPedido;
total = resultado.total;
total_base = resultado.total_base;
tamanho = resultado.tamanho;

// Renderizar as duas listas no HTML
if (item) {
  // Dados da pizza
  $("#imagem-produto").attr("src", item.img);
  $("#nome-pizza").html(item.nome);
  $("#preco").html(item.total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }));
  $("#descricao-produto").html(definirOsNomesDosIngredientes(item.ingredientes));
  atualizarTamanhoAtual();

  // Separa ingredientes, em um ingrediente por loop e repassa para cria-lo no DOM
  mapeamentos.ingredientes.forEach((ingrediente, id) => {
    renderLista(ingrediente, "#lista-ingredientes", true, true); // Renderiza os ingredientes de acordo com os parametros da pizza ou de pedidosGuardados
    atualizarBotaoSubIngredientes(id);
  });

  // Extras (bebidas, etc)
  mapeamentos.extras.forEach((extra, id) => {
    extraInfo = obterInfoExtra(id);
    renderLista(extra, "#lista-extras", !extraInfo.extras);
    atualizarBotaoSubExtras(id);
  });

  // Atualizar total
  adicionarTotal();
  if (dadosArmazenados.actualCart) {
    $('button').prop('disabled', true);
    $('.dots-detalhes').hide();
    $('.toolbar-detalhes').hide();
  }

} else {
  console.log("Produto não encontrado!");
}


// Funções da lista de Ingredientes -------------------------------------------------------------------------------------------------------- Inicio

// Eventos para ingredientes : adicionar na pizza
$("#lista-ingredientes").on("click", ".add", function () {
  var dataId = parseInt($(this).closest("tr").data("id"));
  criarIngrediente(dataId);
  atualizarPrecos();
});

// Eventos para ingredientes : retirar da pizza
$("#lista-ingredientes").on("click", ".sub", function () {
  var dataId = parseInt($(this).closest("tr").data("id"));
  retirarIngrediente(dataId);
  atualizarPrecos();
});


// Responsavel por analisar se o ingrediente, já existe na pizza e se existe descobre se é um original ou um personalizado
function testarIngrediente(id) {
  var itemIngredientesSet = new Set(item.ingredientes);
  var pizzaIngredientesSet = new Set(pizza);
  return { existe: pizzaIngredientesSet.has(id), original: itemIngredientesSet.has(id) };
}

// Cria o ingrediente dentro da pizza
function criarIngrediente(id) {
  var SituacaoIngrediente = testarIngrediente(id);
  if (!SituacaoIngrediente.existe) {
    var ingrediente = mapeamentos.ingredientes.get(id);
    if (ingrediente) {
      pizza.push(id);
    }
  }
  atualizarBotaoSubIngredientes(id);
  return 1;
}

// Retira o ingrediente da pizza
function retirarIngrediente(id) {
  pizza = pizza.filter((idIng) => idIng !== id);
  atualizarBotaoSubIngredientes(id);
  return 0;
}

// Função pra listar nomes dos ingredientes
function definirOsNomesDosIngredientes(ingredientesId) {
  var nomes = [];
  ingredientesId.forEach(id => {
    const ingrediente = mapeamentos.ingredientes.get(id);
    if (ingrediente) {
      nomes.push(ingrediente.nome);
    }
  });
  if (nomes.length === 0) return "";
  if (nomes.length === 1) return nomes[0];
  return nomes.slice(0, -1).join(", ") + " e " + nomes[nomes.length - 1];
}

// Atualizar estado do botão de subtração (-)
function atualizarBotaoSubIngredientes(id) {
  var SituacaoIngrediente = testarIngrediente(id);
  var botaoSub = $(`#lista-ingredientes tr[data-id="${id}"] .sub`);
  var indicador = $(
    `#lista-ingredientes tr[data-id="${id}"] .status-indicador`
  );

  // Se não existe no pedido atual, botão desativado e X
  if (!SituacaoIngrediente.existe) {
    botaoSub.prop("disabled", true);
    indicador.html('<i class="bx bx-x" style="color:red; font-size: 24px;"></i>');
  } else {
    botaoSub.prop("disabled", SituacaoIngrediente.original ? true : false);
    indicador.html('<i class="bx bx-check" style="color:green; font-size: 24px;"></i>');
  }
}

// Funções da lista de Ingredientes -------------------------------------------------------------------------------------------------------- Fim



// Funções da lista de Extras --------------------------------------------------------------------------------------------------------------- Inicio

// Eventos para extras: Adiciona mais um ao pedido
$("#lista-extras").on("click", ".add", function () {
  var dataId = parseInt($(this).closest("tr").data("id"));
  var novaQuantidade = criarExtra(dataId, 1);
  $(this).closest("tr").find("input").val(novaQuantidade);
  atualizarPrecos();
});

// Eventos para extras: Retira 1 ou apaga do pedido
$("#lista-extras").on("click", ".sub", function () {
  var dataId = parseInt($(this).closest("tr").data("id"));
  var novaQuantidade = retirarExtra(dataId);
  $(this).closest("tr").find("input").val(novaQuantidade);
  atualizarPrecos();
});

function obterInfoExtra(id) {
  const extrasMap = new Map(extrasNoPedido.map(e => [e.id, e.quantidade]));
  const quantidade = extrasMap.get(id) || 0;
  return { extras: quantidade > 0, quantidade };
}

// Função para atualizar inputs da lista de extras
function atualizarInputsExtras() {
  extrasNoPedido.forEach((ext) => {
    $(`#lista-extras tr[data-id="${ext.id}"] input`).val(ext.quantidade);
  });
}

// Criar/acrescentar extra (bebida, etc)
function criarExtra(id, quantidade = 1) {
  const index = extrasNoPedido.findIndex(extra => extra.id === id);
  if (index !== -1) {
    extrasNoPedido[index].quantidade += quantidade;
  } else {
    const extra = mapeamentos.extras.get(id);
    if (extra) {
      extrasNoPedido.push({ id: extra.id, quantidade });
    }
  }
  atualizarBotaoSubExtras(id);
  return (index !== -1) ? extrasNoPedido[index].quantidade : quantidade;
}


// Retirar extra (diminuir quantidade)
function retirarExtra(id) {
  const index = extrasNoPedido.findIndex(extra => extra.id === id);
  if (index !== -1) {
    extrasNoPedido[index].quantidade--;
    if (extrasNoPedido[index].quantidade < 1) {
      $(`#lista-extras tr[data-id="${id}"] input`).val(0);
      extrasNoPedido.splice(index, 1);
      atualizarBotaoSubExtras(id);
      return 0;
    }
  }
  atualizarBotaoSubExtras(id);
  return (index !== -1) ? extrasNoPedido[index].quantidade : 0;
}

function atualizarBotaoSubExtras(id) {
  var botaoSub = $(`#lista-extras tr[data-id="${id}"] .sub`);
  var extraInfo = obterInfoExtra(id);

  if (!extraInfo.extras) {
    botaoSub.prop("disabled", true);
    return;
  } else {
    // Extras podem zerar
    botaoSub.prop("disabled", extraInfo.quantidade <= 0);
  }
  atualizarInputsExtras();
}

// Funções da lista de Extras --------------------------------------------------------------------------------------------------------------- Fim

function atualizarPrecos() {
  var novoPreco = 0;
  // calcula preço dos ingredientes
  pizza.forEach(id => {
    const ingrediente = mapeamentos.ingredientes.get(id);
    if (ingrediente) {
      novoPreco += ingrediente.preco;
    }
  });
  var totalExtras = 0;
  extrasNoPedido.forEach((ext) => {
    const extra = mapeamentos.extras.get(ext.id);
    if (extra) {
      totalExtras += extra.preco * ext.quantidade;
    }
  });

  // aplica preço da pizza junto com o multiplicador do tamanho, caso ele não seja undefined
  total = (typeof multiplicadorTamanho !== "undefined") ? novoPreco * multiplicadorTamanho : novoPreco;
  total += totalExtras + item.preco_base;
  guardarpizza();
  adicionarTotal();
}


// Salvar pedido no localStorage
function guardarpizza() {
  const novoPedido = {
    id: dadosArmazenados.idAtual,
    pizza: [...pizza],
    extrasNoPedido: [...extrasNoPedido],
    tamanho: tamanho,
    total_base: total_base,
    total: total,
    img: item.img,
    nome: item.nome,
    quantidade: 1,
    verificaPizza: true
  };

  mapeamentos.pedidosGuardados.set(idpizza, novoPedido);
  const pedidosGuardados = Array.from(mapeamentos.pedidosGuardados.values());
  localStorage.setItem("pedidos-guardados", JSON.stringify(pedidosGuardados));
}


// Adiciona ao localStorage o item guardado, podendo ser no favoritos ou cart-items
function addItem(local) {
  // Atualiza pedidoGuardado se necessário
  guardarpizza();
  // Cria o novo item, para determinar se já existe outro igual
  var novoItem = {
    id: dadosArmazenados.idAtual,
    index: 1,
    nome: item.nome,
    img: item.img,
    ingredientes: [...pizza],
    extrasNoPedido: [...extrasNoPedido], // faz uma cópia (evita mutação acidental)
    quantidade: 1,
    tamanho: tamanho,
    total: total,
    personalizada: verificarPersonalizacao(),
    verificaPizza: true
  };
  // Define qual é o item a ser guardado
  var itemModificado = (local === "favoritos") ? mapeamentos.favoritos : mapeamentos.carrinho;
  var itemLocal = itemModificado.get(`${dadosArmazenados.idAtual}-1`);
  // Garante que ele existe
  if (itemLocal) {
    var ultimoIndexNoCarrinho = 1;
    var itemTeste = { existe: false, index: 1 };
    // Verifica se existe outro e igual e senão, descobre qual index da sequência está livre
    while (itemModificado.has(`${dadosArmazenados.idAtual}-${ultimoIndexNoCarrinho}`)) {
      if (itensSaoIguais(novoItem, itemModificado.get(`${dadosArmazenados.idAtual}-${ultimoIndexNoCarrinho}`))) {
        itemTeste.existe = true;
        itemTeste.index = ultimoIndexNoCarrinho;
        break;
      }
      ultimoIndexNoCarrinho++;
    }
    novoItem.index = ultimoIndexNoCarrinho;
    itemModificado.set(`${dadosArmazenados.idAtual}-${ultimoIndexNoCarrinho}`, novoItem);
    const novoItemAtualizado = Array.from(itemModificado.values());
    localStorage.setItem(local, JSON.stringify(novoItemAtualizado));

  } else {
    // Adiciona o pedido sem alterar nada
    itemModificado.set(`${dadosArmazenados.idAtual}-${ultimoIndexNoCarrinho}`, novoItem);
    const novoItemCart = Array.from(itemModificado.values());
    localStorage.setItem(local, JSON.stringify(novoItemCart));
  }
}

// Ações da página --------------------------------------------------------------------------------------------------------------- Início

$(".tamanhos").on("click", ".tamanho-btn", function () {
  $(".tamanhos .tamanho-btn").removeClass("selected");
  $(this).addClass("selected");

  tamanho = $(this).data("tamanho");

  const multiplicadores = {
    Pequena: 1,
    Media: 1.4,
    Grande: 1.7,
    Gigante: 2
  };

  multiplicadorTamanho = multiplicadores[tamanho] || 2.5;

  atualizarPrecos();
});

$(".add-cart").on("click", function () {
  addItem("cart-items");
  mapeamentos.pedidosGuardados.delete(idpizza);
  var toastCenter = app.toast.create({
    text: `${item.nome} adiocionada ao carrinho`,
    position: "center",
    closeTimeout: 2000,
  });

  toastCenter.open();
});

$("#favorito").on("click", function () {
  addItem("favoritos");
  var toastCenter = app.toast.create({
    text: `${item.nome} adiocionada aos favoritos`,
    position: "center",
    closeTimeout: 2000,
  });

  toastCenter.open();
})

$("#reiniciar").on("click", function () {
  console.log(idpizza)
  app.dialog.confirm(
    "Tem certeza que quer reiniciar a pizza?",
    "Reiniciar Pizza",
    function () {
      mapeamentos.pedidosGuardados.delete(idpizza);
      const pedidosGuardados = Array.from(mapeamentos.pedidosGuardados.values());
      localStorage.setItem("pedidos-guardados", JSON.stringify(pedidosGuardados));
      app.views.main.router.refreshPage();
    }
  );
});

// Ações da página --------------------------------------------------------------------------------------------------------------- Fim

// Modificam o DOM --------------------------------------------------------------------------------------------------------------- Inicio

function atualizarTamanhoAtual() {
  $(".tamanhos .tamanho-btn").removeClass("selected");
  $(`.${tamanho}`).addClass("selected");
}

// Função para adicionar total no HTML
function adicionarTotal() {
  $("#preco").html(total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }));
}

// Cria um item na lista, seja um ingrediente ou um extra
function renderLista(item, localHTML, subButtonDisabled, isIngrediente = false) {
  var itemHTML = `
    <tr class="ingrediente-item" data-id="${item.id}">
    <td class="ingrediente-nome">
    <button class="text-bold" disabled>${item.nome}: </button>
    </td>
    <td class="linha"></td>
      <td class="td-adições" style="width: 20%; text-align: center; font-size:">
        <button class="sub" ${subButtonDisabled}>-</button>
        <div class="display-flex justify-content-space-between">
          ${isIngrediente
      ? '<span class="status-indicador"></span>'
      : `<input class="inp-extras" readonly value="0">`
    }
        </div>
        <button class="add">+</button>
      </td>
    </tr>`;
  $(localHTML).append(itemHTML);
}

// Modificam o DOM --------------------------------------------------------------------------------------------------------------- Fim


// Verificações --------------------------------------------------------------------------------------------------------------- Inicio

// Função pra comparar se dois itens são iguais só nos campos modificáveis pelo usúario
function itensSaoIguais(itemA, itemB) {
  // Comparar tamanho
  if (itemA.tamanho !== itemB.tamanho) return false;

  // Comparar ingredientes (arrays)
  if (itemA.ingredientes.length !== itemB.ingredientes.length) return false;
  for (let i = 0; i < itemA.ingredientes.length; i++) {
    if (itemA.ingredientes[i] !== itemB.ingredientes[i]) return false;
  }

  // Comparar extras (arrays)
  if (itemA.extrasNoPedido.length !== itemB.extrasNoPedido.length) return false;
  for (let i = 0; i < itemA.extrasNoPedido.length; i++) {
    if (itemA.extrasNoPedido[i] !== itemB.extrasNoPedido[i]) return false;
  }

  return true;
}

function verificarPersonalizacao() {
  if (total - (total_base * multiplicadorTamanho) === 0) {
    return false;
  }
  else {
    return true;
  }
}

// Verificações --------------------------------------------------------------------------------------------------------------- Fim


// Função para iniciar um pedido já existente ou um novo
function prepararPedidoGuardado(idAtual, item, pedidosGuardados) {
  const pedidoGuardado = pedidosGuardados.get(idAtual);
  if (pedidoGuardado) {
    return {
      idpizza: pedidoGuardado.id,
      pizza: [...(pedidoGuardado.pizza || [])],
      extrasNoPedido: [...(pedidoGuardado.extrasNoPedido || [])],
      total: pedidoGuardado.total,
      total_base: pedidoGuardado.total_base,
      tamanho: pedidoGuardado.tamanho
    };
  } else {
    return {
      idpizza: idAtual,
      pizza: [...item.ingredientes],
      extrasNoPedido: [],
      total: item.total,
      total_base: item.total,
      tamanho: "Pequena"
    };
  }
}