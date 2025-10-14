const { sequelize } = require("../database");
const associadoModel = require("../model/Associado");
const diretoriaModel = require("../model/Diretoria");
const listaViagemModel = require("../model/ListaViagem");
const listaViagemAlunosModel = require("../model/ListaViagemAluno");
const motoristaModel = require("../model/Motorista");
const pagamentosModel = require("../model/Pagamentos");
const rotaModel = require("../model/Rota");

//#region Definição das tabelas
const AssociadoViewModel = sequelize.define("Associado", associadoModel, {
  tableName: "associados",
  timestamps: true,
});

const DiretoriaViewModel = sequelize.define("Diretoria", diretoriaModel, {
  tableName: "diretores",
  timestamps: true,
});

const ListaViagemViewModel = sequelize.define("ListaViagem", listaViagemModel, {
  tableName: "lista_viagem",
  timestamps: true,
});

const ListaViagemAlunosViewModel = sequelize.define(
  "ListaViagemAluno",
  listaViagemAlunosModel,
  {
    tableName: "lista_viagem_alunos",
    timestamps: true,
  }
);

const MotoristaViewModel = sequelize.define("Motorista", motoristaModel, {
  tableName: "motoristas",
  timestamps: true,
});

const PagamentosViewModel = sequelize.define("Pagamento", pagamentosModel, {
  tableName: "pagamentos",
  timestamps: true,
});

const RotasViewModel = sequelize.define("Rota", rotaModel, {
  tableName: "rotas",
  timestamps: true,
});
//#endregion

//#region Relacionamentos das Tabelas

// Rota ↔ ListaViagem
RotasViewModel.hasMany(ListaViagemViewModel, {
  foreignKey: "idRota",
  as: "viagens",
});

ListaViagemViewModel.belongsTo(RotasViewModel, {
  foreignKey: "idRota",
  as: "rota",
});

// Associado ↔ ListaViagem (via ListaViagemAluno)
AssociadoViewModel.belongsToMany(ListaViagemViewModel, {
  through: ListaViagemAlunosViewModel,
  foreignKey: "idAssociado",
  otherKey: "idLista",
  as: "viagens",
});

ListaViagemViewModel.belongsToMany(AssociadoViewModel, {
  through: ListaViagemAlunosViewModel,
  foreignKey: "idLista",
  otherKey: "idAssociado",
  as: "alunos",
});

// ListaViagemAluno ↔ relacionamentos diretos
ListaViagemAlunosViewModel.belongsTo(AssociadoViewModel, {
  foreignKey: "idAssociado",
  as: "associado",
});

ListaViagemAlunosViewModel.belongsTo(ListaViagemViewModel, {
  foreignKey: "idLista",
  as: "lista",
});

// Associado ↔ Pagamento
AssociadoViewModel.hasMany(PagamentosViewModel, {
  foreignKey: "idAssociado",
  as: "pagamentos",
});

PagamentosViewModel.belongsTo(AssociadoViewModel, {
  foreignKey: "idAssociado",
  as: "associado",
});

//#endregion

module.exports = {
  AssociadoViewModel,
  DiretoriaViewModel,
  ListaViagemViewModel,
  ListaViagemAlunosViewModel,
  MotoristaViewModel,
  PagamentosViewModel,
  RotasViewModel,
};
