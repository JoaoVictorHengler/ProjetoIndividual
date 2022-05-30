drop database guraSaber;

create database guraSaber;
use guraSaber;

-- dificuldade.tipoDificuldade+0

create table Jogador (
					  idJogador int primary key auto_increment,
                      nome varchar(90) NOT NULL,
                      email varchar(180) UNIQUE NOT NULL,
                      senha char(128) NOT NULL,
                      pais varchar(30),
                      rankGlobal int,
                      rankNacional int,
                      idScoresaber varchar(20) NULL UNIQUE,
                      OculosDeVrUsado varchar(45) NULL
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
                          nomeDificuldade varchar(45) NOT NULL,
                          njs decimal(4,2) NOT NULL,
                          offsetDificuldade decimal(4,2) NOT NULL,
                          notas int NOT NULL,
                          bombas int NOT NULL,
                          obstaculos int NOT NULL,
                          notasPSegundo decimal(5,2) NOT NULL,
                          maxPontuacao int NOT NULL,
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
                    pontuacao int NOT NULL,
                    corteRuim int NOT NULL,
                    notasErradas int NOT NULL,
                    comboMaximo int NOT NULL,
                    dataScore datetime NOT NULL,
                    scoreFavorito bool NOT NULL 
);

create table Historico (
    fkJogador int,
    foreign key (fkJogador) references Jogador(idJogador),
    idHistorico int,
    primary key(fkJogador, idHistorico),
    rankGlobal int NOT NULL,
    diaRank Date
);
select * from Jogador;
select * from Score;
select idJogador, nome, pais, rankGlobal, rankNacional, (select sum(pontuacao) from Score where fkJogador = idJogador) as 'Pontuacao Total' from Jogador join Score on idJogador = fkJogador group by idJogador;
select * from mapa where nomeMusica like 'Captain Murasa%';
select * from dificuldade join Mapa on idMapa = fkMapa;
select * from dificuldade order by fkMapa;
select * from Mapa where hashMapa = '621487b366d4793a095bc2e2fcf542845e325b38';
select * from Score 
					join mapa on idMapa = fkMapa;
select * from score;
INSERT INTO Score SELECT 1, idDificuldade, idMapa, 10000, '2022-10-10', false FROM Dificuldade JOIN Mapa ON hashMapa = '621487b366d4793a095bc2e2fcf542845e325b38' and nomeDificuldade = 'Easy';