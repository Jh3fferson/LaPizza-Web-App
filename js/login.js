$(document).ready(function () {
  var pass = JSON.parse(localStorage.getItem("usuario-atual")).pass || [];
  if (pass) {
    app.views.main.router.navigate("/index/");
  }
});

$("form").on("submit", function (event) {
  event.preventDefault(); // impede que a página recarregue
  var senha = $("#senha").val()
  var nome = $("#nome").val()
  var usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  var usuarioNome = usuarios.find(uN => uN.nome === nome);
  var usuarioSenha = usuarios.find(uS => uS.senha === senha);

  if (usuarioNome && usuarioSenha) {
    var toastCenter = app.toast.create({
      text: `Login Efetuado com sucesso`,
      position: "center",
      closeTimeout: 2000,
    });

    toastCenter.open();
    var usuarioAtual = {
      nome: nome,
      pass: true
    };
    localStorage.setItem("usuario-atual", JSON.stringify(usuarioAtual));
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