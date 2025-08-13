const { sequelize } = require('../database');
const associadoModel = require('../model/Associado');
const diretoriaModel = require('../model/Diretoria');
const listaFrancaMatutinoAlunosModel = require('../model/ListaFrancaMatutino_Alunos');
const listaFrancaMatutinoModel = require('../model/ListaFrancaMatutino');
const listaFrancaNoturnoAlunosModel = require('../model/ListaFrancaNoturno_Alunos');
const listaFrancaNoturnoModel = require('../model/ListaFrancaNoturno');
const listaPassosMatutinoAlunosModel = require('../model/ListaPassosMatutino_Alunos');
const listaPassosMatutinoModel = require('../model/ListaPassosMatutino');
const listaPassosNoturnoAlunosModel = require('../model/ListaPassosNoturno_Alunos');
const listaPassosNoturnoModel = require('../model/ListaPassosNoturno');
const motoristaModel = require('../model/Motorista');

// Definindo as views com tableName
const AssociadoViewModel = sequelize.define('Associado', associadoModel, {
  tableName: 'associados',
  timestamps: true,
});

const DiretoriaViewModel = sequelize.define('Diretoria', diretoriaModel, {
  tableName: 'diretores',
  timestamps: true,
});

const ListaFrancaMatutinoViewModel = sequelize.define('ListaFrancaMatutino', listaFrancaMatutinoModel, {
  tableName: 'ListaFrancaMatutino',
  timestamps: true,
});

const ListaFrancaMatutinoAlunosViewModel = sequelize.define('ListaAlunosFrancaMatutino', listaFrancaMatutinoAlunosModel, {
  tableName: 'ListaAlunosFrancaMatutino',
  timestamps: true,
});

const ListaFrancaNoturnoViewModel = sequelize.define('ListaFrancaNoturno', listaFrancaNoturnoModel, {
  tableName: 'ListaFrancaNoturno',
  timestamps: true,
});

const ListaFrancaNoturnoAlunosViewModel = sequelize.define('ListaAlunosFrancaNoturno', listaFrancaNoturnoAlunosModel, {
  tableName: 'ListaAlunosFrancaNoturno',
  timestamps: true,
});

const ListaPassosMatutinoViewModel = sequelize.define('ListaPassosMatutino', listaPassosMatutinoModel, {
  tableName: 'ListaPassosMatutino',
  timestamps: true,
});

const ListaPassosMatutinoAlunosViewModel = sequelize.define('ListaAlunosPassosMatutino', listaPassosMatutinoAlunosModel, {
  tableName: 'ListaAlunosPassosMatutino',
  timestamps: true,
});

const ListaPassosNoturnoViewModel = sequelize.define('ListaPassosNoturno', listaPassosNoturnoModel, {
  tableName: 'ListaPassosNoturno',
  timestamps: true,
});

const ListaPassosNoturnoAlunosViewModel = sequelize.define('ListaAlunosPassosNoturno', listaPassosNoturnoAlunosModel, {
  tableName: 'ListaAlunosPassosNoturno',
  timestamps: true,
});

const MotoristaViewModel = sequelize.define('Motorista', motoristaModel, {
  tableName: 'motoristas',
  timestamps: true,
});

// Associado ↔ Listas França
AssociadoViewModel.hasMany(ListaFrancaMatutinoAlunosViewModel, { foreignKey: 'idAluno', onDelete: 'CASCADE' });
ListaFrancaMatutinoAlunosViewModel.belongsTo(AssociadoViewModel, { foreignKey: 'idAluno' });

ListaFrancaMatutinoViewModel.hasMany(ListaFrancaMatutinoAlunosViewModel, { foreignKey: 'idLista', onDelete: 'CASCADE' });
ListaFrancaMatutinoAlunosViewModel.belongsTo(ListaFrancaMatutinoViewModel, { foreignKey: 'idLista' });

AssociadoViewModel.hasMany(ListaFrancaNoturnoAlunosViewModel, { foreignKey: 'idAluno', onDelete: 'CASCADE' });
ListaFrancaNoturnoAlunosViewModel.belongsTo(AssociadoViewModel, { foreignKey: 'idAluno' });

ListaFrancaNoturnoViewModel.hasMany(ListaFrancaNoturnoAlunosViewModel, { foreignKey: 'idLista', onDelete: 'CASCADE' });
ListaFrancaNoturnoAlunosViewModel.belongsTo(ListaFrancaNoturnoViewModel, { foreignKey: 'idLista' });

// Associado ↔ Listas Passos
AssociadoViewModel.hasMany(ListaPassosMatutinoAlunosViewModel, { foreignKey: 'idAluno', onDelete: 'CASCADE' });
ListaPassosMatutinoAlunosViewModel.belongsTo(AssociadoViewModel, { foreignKey: 'idAluno' });

ListaPassosMatutinoViewModel.hasMany(ListaPassosMatutinoAlunosViewModel, { foreignKey: 'idLista', onDelete: 'CASCADE' });
ListaPassosMatutinoAlunosViewModel.belongsTo(ListaPassosMatutinoViewModel, { foreignKey: 'idLista' });

AssociadoViewModel.hasMany(ListaPassosNoturnoAlunosViewModel, { foreignKey: 'idAluno', onDelete: 'CASCADE' });
ListaPassosNoturnoAlunosViewModel.belongsTo(AssociadoViewModel, { foreignKey: 'idAluno' });

ListaPassosNoturnoViewModel.hasMany(ListaPassosNoturnoAlunosViewModel, { foreignKey: 'idLista', onDelete: 'CASCADE' });
ListaPassosNoturnoAlunosViewModel.belongsTo(ListaPassosNoturnoViewModel, { foreignKey: 'idLista' });

module.exports = {
  AssociadoViewModel,
  DiretoriaViewModel,
  ListaFrancaMatutinoAlunosViewModel,
  ListaFrancaMatutinoViewModel,
  ListaFrancaNoturnoAlunosViewModel,
  ListaFrancaNoturnoViewModel,
  ListaPassosMatutinoAlunosViewModel,
  ListaPassosMatutinoViewModel,
  ListaPassosNoturnoAlunosViewModel,
  ListaPassosNoturnoViewModel,
  MotoristaViewModel,
};
