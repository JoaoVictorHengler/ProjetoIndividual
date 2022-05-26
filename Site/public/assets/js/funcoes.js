function showMenu() {
    document.getElementById('perfil-menu').style.width = '20vw';
    document.getElementsByClassName('user-info')[0].classList.add('user-info-show');
    search.style.left = '40px';
    home.classList.add('nav-bar-name-opacity');
    mapa.classList.add('nav-bar-name-opacity');
    ranking.classList.add('nav-bar-name-opacity');
    ultimos.classList.add('nav-bar-name-opacity');
    login.classList.add('nav-bar-name-opacity');
    cadastro.classList.add('nav-bar-name-opacity');
    user.style.display = 'block';
    setTimeout(() => {
        document.getElementById('search-user').placeholder = 'Pesquisar...';
    }, 500)
}

function hideMenu() {
    document.getElementById('perfil-menu').style.width = '2vw';
    document.getElementsByClassName('user-info')[0].classList.remove('user-info-show');
    search.style.left = '15px';
    home.classList.remove('nav-bar-name-opacity');
    mapa.classList.remove('nav-bar-name-opacity');
    ranking.classList.remove('nav-bar-name-opacity');
    ultimos.classList.remove('nav-bar-name-opacity');
    login.classList.remove('nav-bar-name-opacity');
    cadastro.classList.remove('nav-bar-name-opacity');
    user.style.display = 'none';
    setTimeout(() => {
        document.getElementById('search-user').placeholder = '...';
    }, 500)
}