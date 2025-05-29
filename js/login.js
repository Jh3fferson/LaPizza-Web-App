$("form").on("submit", function(event) {
    event.preventDefault(); // impede que a página recarregue
    var senha=$("#senha").val()
    var nome=$("#nome").val()

  if(nome=="admin" && senha=="admin"){
      alert("Login realizado com sucesso!")
      app.views.main.router.navigate("/index/");
      $(".erroNS").hide();


  }
  else{
    alert("Nome ou senha estão incorreta")
      $(".erroNS").show();

  }


  // seu código de envio/validação aqui
  console.log("Formulário enviado sem recarregar a página!");
});