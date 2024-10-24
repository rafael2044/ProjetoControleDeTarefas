const Datastore = require('nedb-promises')

//Prioridade, Nome, Data Limite, Percentual Concluido, Detalhes da tarefa
const taskControl = Datastore.create('taskcontrol.db');
//IdTask, Percentual correnspondente, Descrição de execução, Data de Execução
const taskItens = Datastore.create('taskitens.db')

module.exports = {taskControl, taskItens}