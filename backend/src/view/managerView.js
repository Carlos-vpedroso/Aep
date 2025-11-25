const { sequelize } = require("../database");
const associadoModel = require("../model/Associado");
const associadoTurnoModel = require("../model/AssociadoTurno");
const diretoriaModel = require("../model/Diretoria");
const listaViagemModel = require("../model/ListaViagem");
const listaViagemAlunosModel = require("../model/ListaViagemAluno");
const motoristaModel = require("../model/Motorista");
const pagamentosModel = require("../model/Pagamentos");
const rotaModel = require("../model/Rota");
const turnoModel = require("../model/Turno");

//#region Definição das tabelas
const AssociadoViewModel = sequelize.define("Associado", associadoModel, {
  tableName: "associados",
  timestamps: true,
});

const DiretoriaViewModel = sequelize.define("Diretoria", diretoriaModel, {
  tableName: "diretorias",
  timestamps: true,
});

const ListaViagemViewModel = sequelize.define("ListaViagem", listaViagemModel, {
  tableName: "lista_viagens",
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

const TurnoViewModel = sequelize.define("Turno", turnoModel, {
  tableName: "turnos",
  timestamps: true,
});

const AssociadoTurnoViewModel = sequelize.define(
  "AssociadoTurno",
  associadoTurnoModel,
  {
    tableName: "associado_turnos",
    timestamps: true,
  }
);
//#endregion

//#region Relacionamentos das Tabelas

// 🔹 Rota ↔ ListaViagem
RotasViewModel.hasMany(ListaViagemViewModel, {
  foreignKey: "idRota",
  as: "viagens",
});

ListaViagemViewModel.belongsTo(RotasViewModel, {
  foreignKey: "idRota",
  as: "rota",
});

// 🔹 Associado ↔ ListaViagem (via ListaViagemAluno)
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

// 🔹 ListaViagemAluno ↔ relacionamentos diretos
ListaViagemAlunosViewModel.belongsTo(AssociadoViewModel, {
  foreignKey: "idAssociado",
  as: "associado",
});

ListaViagemAlunosViewModel.belongsTo(ListaViagemViewModel, {
  foreignKey: "idLista",
  as: "lista",
});

// 🔹 Associado ↔ Pagamento
AssociadoViewModel.hasMany(PagamentosViewModel, {
  foreignKey: "idAssociado",
  as: "pagamentos",
});

PagamentosViewModel.belongsTo(AssociadoViewModel, {
  foreignKey: "idAssociado",
  as: "associado",
});

// 🔹 Associado ↔ Turno (N:N via AssociadoTurno)
AssociadoViewModel.belongsToMany(TurnoViewModel, {
  through: AssociadoTurnoViewModel,
  foreignKey: "idAssociado",
  otherKey: "idTurno",
  as: "turnos",
});

TurnoViewModel.belongsToMany(AssociadoViewModel, {
  through: AssociadoTurnoViewModel,
  foreignKey: "idTurno",
  otherKey: "idAssociado",
  as: "associados",
});

// 🔹 (Opcional, mas recomendado)
// Relacionamento direto no modelo de junção (útil pra include)
AssociadoTurnoViewModel.belongsTo(AssociadoViewModel, {
  foreignKey: "idAssociado",
  as: "associado",
});
AssociadoTurnoViewModel.belongsTo(TurnoViewModel, {
  foreignKey: "idTurno",
  as: "turno",
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
  TurnoViewModel,
  AssociadoTurnoViewModel,
};
