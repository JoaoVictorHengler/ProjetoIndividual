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
select * from score;

alter table jogador rename column OculosDeVrUsado to vrUtilizado;

select idJogador, nome, pais,
    ROW_NUMBER() OVER (order by	sum(pontosDePerformace) desc) as 'rank',
    (select round(avg(round(pontuacao / maxPontuacao * 100, 2)),2 ) as 'precisao' from Dificuldade 
    join score on idDificuldade = fkDificuldade and score.fkMapa = dificuldade.fkMapa
    and Jogador.idJogador = fkJogador group by fkJogador) as 'precisaoMedia',
    (select count(*) from Dificuldade 
    join score on idDificuldade = fkDificuldade and score.fkMapa = dificuldade.fkMapa
    and Jogador.idJogador = fkJogador group by fkJogador) as 'mapasJogados',
    (select sum(pontosDePerformace) from Dificuldade 
    join score on idDificuldade = fkDificuldade and score.fkMapa = dificuldade.fkMapa
    and Jogador.idJogador = fkJogador group by fkJogador) as 'ppTotal',
    (select count(*) from Dificuldade 
    join score on idDificuldade = fkDificuldade and score.fkMapa = dificuldade.fkMapa
    and Jogador.idJogador = fkJogador and round((pontuacao / maxPontuacao) * 100, 2) >= 90 group by fkJogador) as 'SS',
    (select count(*) from Dificuldade 
    join score on idDificuldade = fkDificuldade and score.fkMapa = dificuldade.fkMapa
    and Jogador.idJogador = fkJogador and round((pontuacao / maxPontuacao) * 100, 2) >= 80 and round((pontuacao / maxPontuacao) * 100, 2) < 90 group by fkJogador) as 'S',
    (select count(*) from Dificuldade 
    join score on idDificuldade = fkDificuldade and score.fkMapa = dificuldade.fkMapa
    and Jogador.idJogador = fkJogador and round((pontuacao / maxPontuacao) * 100, 2) >= 65 and round((pontuacao / maxPontuacao) * 100, 2) < 80 group by fkJogador) as 'A'
    from Jogador join score on idJogador = fkJogador and pais = 'BR'group by idJogador order by ppTotal desc;

select idJogador, count(*) from Score where Jogador.idJogador = fkJogador and precisao >= 90 group by fkJogador;
select * from jogador;

use gurasaber;

select * from jogador;
select nome, pais, idScoresaber, vrUtilizado,
(select round(avg(round(pontuacao / maxPontuacao * 100, 2)),2 ) as 'precisao' from Dificuldade 
    join score on idDificuldade = fkDificuldade and score.fkMapa = dificuldade.fkMapa
    and Jogador.idJogador = fkJogador group by fkJogador) as 'precisaoMedia',
    (select sum(pontosDePerformace) from Dificuldade 
    join score on idDificuldade = fkDificuldade and score.fkMapa = dificuldade.fkMapa
    and Jogador.idJogador = fkJogador group by fkJogador) as 'ppTotal',
    (select ROW_NUMBER() OVER (order by	sum(pontosDePerformace) desc)
from Jogador j1 join score on j1.idJogador = fkJogador and idJogador = Jogador.idJogador group by idJogador order by rankGlobal) as 'rankGlobal'
from Jogador where idJogador = 2 group by idJogador;

select ROW_NUMBER() OVER (order by	sum(pontosDePerformace) desc) as 'rankGlobal'
from Jogador j1 join score on j1.idJogador = fkJogador and idJogador = Jogador.idJogador group by idJogador order by rankGlobal;

select * from Historico;
  

