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
        window.location.href = "./login.html"
    } else {
        window.location.href = "./cadastro.html"
    }
}

function startBackgroundVideo() {
    document.getElementsByClassName('background-gif')[0].play;
}

function setPlayerCountry(elementFlag, showName = false, countryName = 'BR', countryFlags) {
    let countryFlagUnicode = (countryFlags.filter(country => { return country.code == countryName }))[0].unicode;
    countryFlagUnicode = countryFlagUnicode.split(' ');

    countryFlagUnicode.forEach((unicode) => {
        let convert = twemoji.convert.fromCodePoint(unicode.substring(2));
        elementFlag.textContent += convert;
    })
    twemoji.parse(elementFlag);
    if (showName != false) {
        let spanElement = document.createElement('span');
        spanElement.innerHTML = showName;
        spanElement.classList.add('contry-name');
        elementFlag.appendChild(spanElement);
    }


}
