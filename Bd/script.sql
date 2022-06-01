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
select * from mapa where nomeMusica like 'Pastel%';

select Mapa.*, idDificuldade, nomeDificuldade, njs, offsetDificuldade, notas, bombas, obstaculos, notasPSegundo, maxPontuacao, fkjogador, nome, pontuacao, corteRuim, notasErradas, comboMaximo, dataScore from Mapa 
join Dificuldade on idMapa = fkMapa and idMapa = 1 
join score on fkDificuldade = idDificuldade and score.fkMapa = idMapa
join jogador on fkJogador = idJogador; 

select * from dificuldade join Mapa on idMapa = fkMapa;
select * from dificuldade order by fkMapa;
select * from Mapa where hashMapa = '2C01774FDB9C4BCC53DF1707ADE85CEA6F043477';
select * from dificuldade 
					join mapa on hashMapa = '2c01774fdb9c4bcc53df1707ade85cea6f043477' and idMapa = fkMapa and nomeDificuldade = 'Hard';
select * from score;

select * from score join mapa on idMapa = score.fkMapa and hashMapa = '2c01774fdb9c4bcc53df1707ade85cea6f043477'
					join Dificuldade on idMapa = Dificuldade.fkMapa and score.fkJogador = 2 and score.fkDificuldade = idDificuldade;
                    
SELECT idDificuldade, idMapa
FROM Dificuldade JOIN Mapa ON hashMapa = '2c01774fdb9c4bcc53df1707ade85cea6f043477' 
and nomeDificuldade = 'ExpertPlus' and idMapa = Dificuldade.fkMapa;

select m1.*, d.nomeDificuldade, (select count(*) from Score where Score.fkMapa = m1.idMapa and Score.fkDificuldade = d.idDificuldade group by fkMapa) as 'QtdScores'
from Mapa m1 join Dificuldade d on m1.idMapa = d.fkMapa;

select m1.*, d.nomeDificuldade, 
(select count(*) from Score where Score.fkMapa = m1.idMapa and Score.fkDificuldade = d.idDificuldade and scoreFavorito = 1 group by fkMapa) as 'QtdMapaFavorito'
(select count(*) from Score where Score.fkMapa = m1.idMapa and Score.fkDificuldade = d.idDificuldade group by fkMapa) as 'QtdScores'
from Mapa m1 join Dificuldade d on m1.idMapa = d.fkMapa;