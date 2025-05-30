//INICIALIZAÇÃO DO F7 QUANDO DISPOSITIVO ESTÁ PRONTO
document.addEventListener("deviceready", onDeviceReady, false);
var app = new Framework7({
  // App root element
  el: "#app",
  // App Name
  name: "LaPizza",
  // App id
  id: "com.myapp.test",
  // Enable swipe panel
  panel: {
    swipe: true,
  },
  dialog: {
    buttonOk: "Sim",
    buttonCancel: "Cancelar",
  },
  // Add default routes
  routes: [
    {
      path: "/criar-conta/",
      url: "criar-conta.html",
      animate: false,
      on: {
        pageBeforeIn: function (event, page) {
          // fazer algo antes da página ser exibida
        },
        pageAfterIn: function (event, page) {
          // fazer algo depois da página ser exibida
        },
        pageInit: function (event, page) {
          // fazer algo quando a página for inicializada
          $.getScript("js/criar-conta.js");
        },
        pageBeforeRemove: function (event, page) {
          // fazer algo antes da página ser removida do DOM
        },
      },
    },
    {
      path: "/login/",
      url: "login.html",
      animate: false,
      on: {
        pageBeforeIn: function (event, page) {
          // fazer algo antes da página ser exibida
        },
        pageAfterIn: function (event, page) {
          // fazer algo depois da página ser exibida
        },
        pageInit: function (event, page) {
          // fazer algo quando a página for inicializada
          $.getScript("js/login.js");
        },
        pageBeforeRemove: function (event, page) {
          // fazer algo antes da página ser removida do DOM
        },
      },
    },
    {

      path: "/index/",
      url: "index.html",
      animate: false,
      beforeEnter: function (to) {
        let pass = localStorage.getItem("usuario-atual");
        pass = pass ? JSON.parse(pass).pass : false;
        if (pass === true) {
          to.resolve();
        } else {
          to.reject();
          app.views.main.router.navigate('/login/');
        }
      },

      on: {
        pageBeforeIn: function (event, page) {
          // fazer algo antes da página ser exibida
          $("#menuprincipal").show("fast");
          app.views.main.router.navigate('/login/');
        },
        pageAfterIn: function (event, page) {
          // fazer algo depois da página ser exibida
        },
        pageInit: function (event, page) {
          // fazer algo quando a página for inicializada
          // app.views.main.router.navigate("/login/");
          $.getScript("js/script.js");

          var swiper = new Swiper(".mySwiper", {
            spaceBetween: 30,
            centeredSlides: true,
            autoplay: {
              delay: 2500,
              disableOnInteraction: false,
            },
            pagination: {
              el: ".swiper-pagination",
              clickable: true,
            },
            navigation: {
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            },
          });
          var swiper2 = new Swiper(".categorias", {
            slidesPerView: 3,
            spaceBetween: 30,
            freeMode: true,
          });
        },

        pageBeforeRemove: function (event, page) {
          // fazer algo antes da página ser removida do DOM
        },
      },
    },
    {
      path: "/sobre/",
      url: "sobre.html",
      animate: false,
      beforeEnter: function (to) {
        let pass = localStorage.getItem("usuario-atual");
        pass = pass ? JSON.parse(pass).pass : false;
        if (pass === true) {
          to.resolve();
        } else {
          to.reject();
          app.views.main.router.navigate('/login/');
        }
      },

      on: {
        pageBeforeIn: function (event, page) {
          // fazer algo antes da página ser exibida
        },
        pageAfterIn: function (event, page) {
          // fazer algo depois da página ser exibida
        },
        pageInit: function (event, page) {
          // fazer algo quando a página for inicializada
        },
        pageBeforeRemove: function (event, page) {
          // fazer algo antes da página ser removida do DOM
        },
      },
    },

    {
      path: "/favoritos/",
      url: "favoritos.html",
      animate: false,
      beforeEnter: function (to) {
        let pass = localStorage.getItem("usuario-atual");
        pass = pass ? JSON.parse(pass).pass : false;
        if (pass === true) {
          to.resolve();
        } else {
          to.reject();
          app.views.main.router.navigate('/login/');
        }
      },

      on: {
        pageBeforeIn: function (event, page) {
          // fazer algo antes da página ser exibida
        },
        pageAfterIn: function (event, page) {
          // fazer algo depois da página ser exibida
        },
        pageInit: function (event, page) {
          // fazer algo quando a página for inicializada
          $.getScript("js/favorito.js");
        },
        pageBeforeRemove: function (event, page) {
          // fazer algo antes da página ser removida do DOM
        },
      },
    },

    {
      path: "/detalhes-pizza/",
      url: "detalhes-pizza.html",
      animate: false,
      beforeEnter: function (to) {
        let pass = localStorage.getItem("usuario-atual");
        pass = pass ? JSON.parse(pass).pass : false;
        if (pass === true) {
          to.resolve();
        } else {
          to.reject();
          app.views.main.router.navigate('/login/');
        }
      },

      on: {
        pageBeforeIn: function (event, page) {
          // fazer algo antes da página ser exibida
          $("#menuprincipal").hide("fast");
        },
        pageAfterIn: function (event, page) {
          // fazer algo depois da página ser exibida
        },
        pageInit: function (event, page) {
          // fazer algo quando a página for inicializada
          $.getScript("js/detalhes-pizza.js");
        },
        pageBeforeRemove: function (event, page) {
          // fazer algo antes da página ser removida do DOM
        },
      },
    },
    {
      path: "/detalhes-produto/",
      url: "detalhes-produto.html",
      animate: false,
      beforeEnter: function (to) {
        let pass = localStorage.getItem("usuario-atual");
        pass = pass ? JSON.parse(pass).pass : false;
        if (pass === true) {
          to.resolve();
        } else {
          to.reject();
          app.views.main.router.navigate('/login/');
        }
      },

      on: {
        pageBeforeIn: function (event, page) {
          // fazer algo antes da página ser exibida
          $("#menuprincipal").hide("fast");
        },
        pageAfterIn: function (event, page) {
          // fazer algo depois da página ser exibida
        },
        pageInit: function (event, page) {
          // fazer algo quando a página for inicializada
          $.getScript("js/detalhes-produto.js");
        },
        pageBeforeRemove: function (event, page) {
          // fazer algo antes da página ser removida do DOM
        },
      },
    },

    {
      path: "/carrinho/",
      url: "carrinho.html",
      options: {
        transition: "f7-push",
      },
      beforeEnter: function (to) {
        let pass = localStorage.getItem("usuario-atual");
        pass = pass ? JSON.parse(pass).pass : false;
        if (pass === true) {
          to.resolve();
        } else {
          to.reject();
          app.views.main.router.navigate('/login/');
        }
      },

      on: {
        pageBeforeIn: function (event, page) {
          // fazer algo antes da página ser exibida
          $("#menuprincipal").hide("fast");
        },
        pageAfterIn: function (event, page) {
          // fazer algo depois da página ser exibida
        },
        pageInit: function (event, page) {
          // fazer algo quando a página for inicializada
          $.getScript("js/carrinho.js");
        },
        pageBeforeRemove: function (event, page) {
          // fazer algo antes da página ser removida do DOM
        },
      },
    },

    {
      path: "/comprar/",
      url: "comprar.html",
      animate: false,
      beforeEnter: function (to) {
        let pass = localStorage.getItem("usuario-atual");
        pass = pass ? JSON.parse(pass).pass : false;
        if (pass === true) {
          to.resolve();
        } else {
          to.reject();
          app.views.main.router.navigate('/login/');
        }
      },

      on: {
        pageBeforeIn: function (event, page) {
          // fazer algo antes da página ser exibida
          $("#menuprincipal").hide("fast");
        },
        pageAfterIn: function (event, page) {
          // fazer algo depois da página ser exibida
        },
        pageInit: function (event, page) {
          // fazer algo quando a página for inicializada
          $.getScript("js/comprar.js");
        },
        pageBeforeRemove: function (event, page) {
          // fazer algo antes da página ser removida do DOM
        },
      },
    },
  ],
  // ... other parameters
});

//Para testes direto no navegador
var mainView = app.views.create(".view-main", { url: "/index/" });

//EVENTO PARA SABER O ITEM DO MEU ATUAL
app.on("routeChange", function (route) {
  var currentRoute = route.url;
  console.log(currentRoute);

  document.querySelectorAll(".tab-link").forEach(function (el) {
    el.classList.remove("active");
  });

  var targetEl = document.querySelector(
    '.tab-link[href="' + currentRoute + '"]'
  );
  if (targetEl) {
    targetEl.classList.add("active");
  }
});

function onDeviceReady() {
  //Quando estiver rodando no celular
  var mainView = app.views.create(".view-main", { url: "/index/" });

  //COMANDO PARA "OUVIR" O BOTAO VOLTAR NATIVO DO ANDROID
  document.addEventListener(
    "backbutton",
    function (e) {
      if (mainView.router.currentRoute.path === "/index/") {
        e.preventDefault();
        app.dialog.confirm("Deseja sair do aplicativo?", function () {
          navigator.app.exitApp();
        });
      } else {
        e.preventDefault();
        mainView.router.back({ force: true });
      }
    },
    false
  );
}
