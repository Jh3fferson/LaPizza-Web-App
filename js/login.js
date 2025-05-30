$(document).ready(function () {
  var pass = JSON.parse(localStorage.getItem("pass"));
  if (pass) {
    app.views.main.router.navigate("/index/");
  }
});

$("form").on("submit", function (event) {
  event.preventDefault(); // impede que a página recarregue
  var senha = $("#senha").val()
  var nome = $("#nome").val()
  var pass = JSON.parse(localStorage.getItem("pass"));

  if (nome == "admin" && senha == "admin") {
    var toastCenter = app.toast.create({
      text: `Login Efetuado com sucesso`,
      position: "center",
      closeTimeout: 2000,
    });

    toastCenter.open();
    pass = true;
    localStorage.setItem("pass", pass);
    app.views.main.router.navigate("/index/");
    $(".erroNS").hide();

  }
  else {
    alert("Nome ou senha estão incorreta")
    $(".erroNS").show();
    pass = false;
    localStorage.setItem("pass", pass);
  }


  // seu código de envio/validação aqui
  console.log("Formulário enviado sem recarregar a página!");
});