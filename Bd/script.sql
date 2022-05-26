drop database bssc;

create database bssc;
use bssc;

-- dificuldade.tipoDificuldade+0

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
                      twitterLink varchar(90),
                      idScoresaber varchar(20),
                      pais varchar(30)
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
						  idDificuldade int,
                          nomeDificuldade varchar(45),
                          tipoDificuldade enum('Easy', 'Normal', 'Hard', 'Expert', 'ExpertPlus'),
                          njs decimal(4,2),
                          offsetDificuldade decimal(4,2),
                          notas int,
                          bombas int,
                          obstaculos int,
                          notasPSegundo decimal(5,2),
                          maxScore int,
						  fkMapa int,
                          foreign key (fkMapa) references Mapa(idMapa),
                          primary key(idDificuldade, fkMapa)
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

create table Historico (
    fkJogador int,
    foreign key (fkJogador) references Jogador(idJogador),
    idHistorico int,
    primary key(fkJogador, idHistorico),
    rankGlobal int NOT NULL,
    diaRank Date
);
select * from dificuldade join Mapa on idMapa = fkMapa;
select * from dificuldade order by fkMapa;
select * from Mapa where hashMapa = '621487b366d4793a095bc2e2fcf542845e325b38';
select * from Score 
					join mapa on idMapa = fkMapa;
select * from score;
INSERT INTO Score SELECT 1, idDificuldade, idMapa, 10000, '2022-10-10', false FROM Dificuldade JOIN Mapa ON hashMapa = '621487b366d4793a095bc2e2fcf542845e325b38' and nomeDificuldade = 'Easy';