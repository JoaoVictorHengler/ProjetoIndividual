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
                      idScoresaber varchar(20) NULL UNIQUE,
                      vrUtilizado varchar(45) NULL,
                      replaysAssistidos int Null
);

create table Mapa (
					idMapa int primary key auto_increment,
                    nomeMusica varchar(254),
                    subNomeMusica varchar(254),
                    criadorMapa varchar(254),
                    artistaMusica varchar(254),
                    hashMapa char(40) UNIQUE,
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
                    scoreFavorito bool NOT NULL,
                    pontosDePerformace decimal(6,2)
);

create table Historico (
    fkJogador int,
    foreign key (fkJogador) references Jogador(idJogador),
    idHistorico int,
    primary key(fkJogador, idHistorico),
    rankGlobal int NOT NULL,
    diaRank Date
);
select * from historico;
select * from jogador;

