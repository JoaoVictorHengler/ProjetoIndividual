create database bssc;
use bssc;

create table Jogador (
					  idJogador int primary key auto_increment,
                      nome varchar(90) NOT NULL,
                      email varchar(180) UNIQUE NOT NULL,
                      senha char(128) NOT NULL,
                      rankGlobal int,
                      ranknacional int,
                      pontosDePerformace decimal(7,2),
                      mediaPrecisao decimal(5,2),
                      OculosDeVrUsado varchar(45),
                      youtubeLink varchar(90),
                      twitchLink varchar(90),
                      twitterLink varchar(90)
);

create table Mapa (
					idMapa int primary key auto_increment,
                    nomeMusica varchar(90),
                    subNomeMusica varchar(90),
                    criadorMapa varchar(90),
                    artistaMusica varchar(90)
);

create table Dificuldade (
						  idDificuldade int primary key auto_increment,
                          nomeDificuldade varchar(45),
                          tipoDificuldade enum('easy', 'normal', 'hard', 'expert', 'expertPlus'),
						  fkMapa int,
                          foreign key (fkMapa) references Mapa(idMapa)
);

create table Score (
					fkJogador int,
                    foreign key (fkJogador) references Jogador(idJogador),
                    fkDificuldade int,
                    foreign key (fkDificuldade) references Dificuldade(idDificuldade),
                    fkMapa int,
                    foreign key (fkMapa) references Mapa(idMapa),
                    precisao decimal(5,2),
                    pontuacao int,
                    dataScore datetime,
                    scoreFavorito bool
);

create table Idioma (
					idIdioma int primary key auto_increment,
                    nome varchar(45),
                    fkMapa int,
					foreign key (fkMapa) references Mapa(idMapa)
);

