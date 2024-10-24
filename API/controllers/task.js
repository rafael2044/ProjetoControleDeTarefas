const {taskControl, taskItens} = require("../db")

const getTasks = async (req, res) =>{
    try{
        //Procura todas as tarefas no banco de dados 
        const tasks = await taskControl.find();
        //Caso dê algum erro na consulta, retorna status 500 e a mensagem de erro
        if (!tasks){
            return res.status(500).json({message:"Erro ao consultar tarefas."});
        }
        //Returna status 200 e o array de tarefas
        return res.status(200).json({tasks});
    }catch(error){
        //Caso aconteça algum erro na API, retorna status 500 e a mensagem de erro
        return res.status(500).json({message:error.message});
    }
}


const insertTask = async (req, res)=>{
    //Procura os dados no body do request
    const {prioridadeTarefa, nomeTarefa, dataLimite, detalhesTarefa} = req.body;
    //Caso esteja faltando algum dado, retorna status 400 e a mensagem de insuficiência de dados
    if (!prioridadeTarefa || !nomeTarefa || !dataLimite || !detalhesTarefa){
        return res.status(400).json({message:"Está faltando dados."});
    }
    //Caso todos os dados esteja corretos, passa para o processo de inserção da nova tarefa
    try{
        //Insere a nova tarefa no banco de dados
        const newTask = await taskControl.insert({prioridadeTarefa, nomeTarefa, dataLimite, percentualConcluido: 0, detalhesTarefa});
        //Caso aconteça algum erro na inserção, retorna status 500 e o motivo do erro
        if (!newTask){
            return res.status(500).json({message:"Erro ao criar tarefa."});
        }
        //Caso não aconteça erro na inserção, retorna status 201, a mensagem de sucesso e a tarefa
        return res.status(201).json({message:"Tarefa criada com sucesso", task: newTask})
    
    }catch(error){
        //Caso aconteça algum erro na API, retorna status 500 e a mensagem de erro
        return res.status(500).json({message:error.message});
    }

}

const deleteTask = async (req, res)=>{
    const {idTask} = req.params;
    if(!idTask){
        return res.status(400).json({message:"Falta de dados"});
    }
    try{
        await taskControl.deleteMany({_id:idTask});
        await taskControl.compactDatafile();
        await taskItens.deleteMany({idTask});
        await taskItens.compactDatafile();
        return res.status(201).json({message:"Tarefa excluida com sucesso."})
    }catch(error){
        return res.status(500).json({message:error.message})
    }

}

module.exports = {getTasks, insertTask, deleteTask}