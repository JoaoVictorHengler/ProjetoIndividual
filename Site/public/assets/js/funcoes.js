function showMenu() {
    document.getElementById('perfil-menu').style.width = '19vw';
    document.getElementById('search-user').style.width = '100%';
    document.getElementsByClassName('user-info')[0].classList.add('user-info-show');
    search.style.left = '40px';
    home.classList.add('nav-bar-name-opacity');
    mapa.classList.add('nav-bar-name-opacity');
    ranking.classList.add('nav-bar-name-opacity');
    ultimos.classList.add('nav-bar-name-opacity');
    login.classList.add('nav-bar-name-opacity');
    cadastro.classList.add('nav-bar-name-opacity');
    document.getElementById('user').style.display = 'block';
    setTimeout(() => {
        document.getElementById('search-user').placeholder = 'Pesquisar...';
    }, 500)
}

function hideMenu() {
    document.getElementById('perfil-menu').style.width = '5vw';
    document.getElementById('search-user').style.width = '90%';
    document.getElementsByClassName('user-info')[0].classList.remove('user-info-show');
    search.style.left = '15px';
    home.classList.remove('nav-bar-name-opacity');
    mapa.classList.remove('nav-bar-name-opacity');
    ranking.classList.remove('nav-bar-name-opacity');
    ultimos.classList.remove('nav-bar-name-opacity');
    login.classList.remove('nav-bar-name-opacity');
    cadastro.classList.remove('nav-bar-name-opacity');
    document.getElementById('user').style.display = 'none';
    setTimeout(() => {
        document.getElementById('search-user').placeholder = '...';
    }, 500)
}

function showPassword() {
    let cadeadoElement = document.getElementById('cadeado');
    let senhaElement = document.getElementById('senha');
    if ((document.getElementsByClassName("senha")).length == 0) {
        cadeadoElement.classList.add("fa-lock");
        cadeadoElement.classList.remove("fa-unlock");
        cadeadoElement.classList.add("senha");
        senhaElement.type = "password";
    } else {
        cadeadoElement.classList.add("fa-unlock");
        cadeadoElement.classList.remove("fa-lock");
        cadeadoElement.classList.remove("senha");
        senhaElement.type = "text";
    }
}

function showRewritePassword() {
    let cadeadoReescreverElement = document.getElementById('cadeadoReescrever');
    let reescreverSenhaElement = document.getElementById('reescreverSenha');
    if ((document.getElementsByClassName("reescrever")).length == 0) {
        cadeadoReescreverElement.classList.add("fa-lock");
        cadeadoReescreverElement.classList.remove("fa-unlock");
        cadeadoReescreverElement.classList.add("reescrever");
        reescreverSenhaElement.type = "password";
    } else {
        cadeadoReescreverElement.classList.add("fa-unlock");
        cadeadoReescreverElement.classList.remove("fa-lock");
        cadeadoReescreverElement.classList.remove("reescrever");
        reescreverSenhaElement.type = "text";
    }
}

function goToLoginOrSingUp(type) {
    if (type == 'login') {
        window.location.href= "./login.html"
    } else {
        window.location.href= "./cadastro.html"
    }
}

function startBackgroundVideo() {
    document.getElementsByClassName('background-gif')[0].play;
}