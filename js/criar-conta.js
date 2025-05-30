
$("form").on("submit", function (event) {
  event.preventDefault(); // impede que a página recarregue
  var nome = $("#criar-nome").val();
  var email = $("#criar-email").val();
  var senha = $("#criar-senha").val();

  var usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  var usuarioNome = usuarios.find(u => u.nome === nome);
  var usuarioEmail = usuarios.find(u => u.email === email);
  if (!usuarioNome && !usuarioEmail) {
    usuarios.push({
      nome: nome,
      email: email,
      senha: senha,
    })
    var usuarioAtual = {
      nome: nome,
      pass: true
    }
    localStorage.setItem("usuario-atual", JSON.stringify(usuarioAtual));
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    app.views.main.router.navigate("/index/");
  }
  else {
    var toastCenter = app.toast.create({
      text: `Usuario existente`,
      position: "center",
      closeTimeout: 2000,
    });

    toastCenter.open();
  }
});
