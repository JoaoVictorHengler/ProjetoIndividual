create database bssc;
use bssc;

create table Jogador (
					  idJogador int primary key auto_increment,
                      nome varchar(90) NOT NULL,
                      email varchar(180) UNIQUE NOT NULL,
                      senha char(128) NOT NULL,
                      rankGlobal int,
                      ranknacional int,
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
                    artistaMusica varchar(90),
                    hashMapa char(40),
                    bpmMapa decimal(5,2),
                    duracaoMapa int,
                    dataUploadMapa datetime
);

create table Dificuldade (
						  idDificuldade int primary key auto_increment,
                          nomeDificuldade varchar(45),
                          tipoDificuldade enum('easy', 'normal', 'hard', 'expert', 'expertPlus'),
                          njs decimal(4,2),
                          offset decimal(4,2),
                          notas int,
                          bombas int,
                          obstaculos int,
                          notasPSegundo decimal(5,2),
                          maxScore int,
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
                    pontuacao int,
                    dataScore datetime,
                    scoreFavorito bool
);

