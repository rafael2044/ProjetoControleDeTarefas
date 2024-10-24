const {taskControl, taskItens} = require("../db");

const getItens = async (req, res)=>{
    //Procura o parametro ID da tarefa no request
    const {idTask} = req.params;
    //Verifica se o Parametro foi recebido
    if (!idTask){
        return res.status(400).json({message:"Está faltando dados."});
    }
    //Faz a procura dos Item da tarefa no Banco de dados
    try{
        //Procura todos os itens associados ao ID da tarefa
        const itens = await taskItens.find({idTask});
        //Caso de algum erro, retorna com status 400 e informa o erro
        if(!itens){
            return res.status(400).json({message:"Erro ao consultar itens da tarefa."});
        }
        //Caso contrario, retorna status 200 e todos os itens associados ao ID da tarefa
        return res.status(200).json({itens})
    }catch(error){
        //Caso dê algum erro na API, retorna status 500 e o erro
        return res.status(500).json({message:error.message});
    }
}

const insertItem = async (req, res)=>{
    //Procura os dados passados no body do request
    const {idTask, percentual, descricaoExecucao, dataExecucao} = req.body;
    //Caso esteja faltando algum dados, retorna status 400 e a mensagem informando a falta de dados
    if (!idTask || !percentual || !descricaoExecucao || !dataExecucao){
        return res.status(400).json({message:"Está faltando dados."});
    }
    //Caso os dados esteja completos, passa para a parte de inserção do novo item
    try{
        //Procura a tarefa no banco de dados
        const task = await taskControl.findOne({_id:idTask});
        //Caso a tarefa não exista ou dê algum erro, retorna status 400 e a mensagem de erro
        if (!task){
            return res.status(400).json({message:"Essa tarefa não existe"});
        }
        //Caso a tarefa exista, valida se o percentual dos itens e do novo item da tarefa não ultrapassam 100%
        const itens = await taskItens.find({idTask:task._id});
        const percent = itens.reduce((sum, item)=>sum+Number(item.percentual),0);
        //Caso ultrapasse, retorna status 400 e a informação do total percentual está passando de 100%
        if ((percent+Number(percentual))>100){
            return res.status(400).json({message:"O percentual total está passando de 100%"});
        }
        //Caso não ultrapasse, insere o novo item no banco de dados
        const newItem = await taskItens.insert({idTask:task._id, percentual, descricaoExecucao, dataExecucao, status:0});
        //Caso dê algum erro na inserção, retorna status 400 e a mensagem do erro
        if(!newItem){
            return res.status(400).json({message:"Erro ao tentar criar novo item."});
        }
        //Caso o item seja inserido, retorna status 201, a mensagem de sucesso e o item inserido.
        return res.status(201).json({message:"Item da tarefa registrado com sucesso.", item: newItem});

    }catch(error){
        //Caso dê algum erro na API, retorna status 500 e informa o erro
        return res.status(500).json({message:error.message});
    }
}

const deleteItem = async(req, res)=>{
    //Procura o parametro ID no request
    const {idItem} = req.params;
    //Caso não exista, retorna 400 e informa da falta do dado
    if(!idItem){
        return res.status(400).json({message:"Está faltando o ID do item"});
    }
    //Caso o ID seja encontrado, passa para o processo de exclusão do item
    try{
        //Procura o item no banco de dados
        const item = await taskItens.findOne({_id:idItem});        
        //Verifica se o item excluido tinha sido concluido
        if (item.status){
            //Caso sim
            //Procura a tarefa associada ao item que será excluido
            const task = await taskControl.findOne({_id:item.idTask});
            //Verifica se a tarefa existe, caso não, retorna erro 400 e a mensagem do erro
            if(!task){
                return res.status(400).json({message:"Nenhuma tarefa associada a esse item"});
            }
            //Se sim, atualizado o percentual concluido da tarefa, subtraindo pelo valor percentual do item
            task.percentualConcluido = (Number(task.percentualConcluido)-Number(item.percentual))
            //Atualiza a tarefa
            await taskControl.updateOne({_id:item.idTask}, task);
        }
        //exclui o item do banco de dados
        await taskItens.removeMany({_id:idItem});
        await taskItens.compactDatafile();
        //Retorna status 201 e a mensagem de sucesso;
        return res.status(201).json({message:"Item removido com sucesso"});
    }catch(error){
        //Caso aconteça algum erro na API, retorna status 500 e a mensagem do erro
        return res.status(500).json({message:error.message})
    }

}
const updateStatusItem = async(req, res)=>{
    //Procura o ID do item nos parametros do request
    const {idItem} = req.params;
    //Procura o dado status no body do request
    const {status} = req.body;
    //Caso o parametro e o dado status não existam, retorna erro 400 e informa da falta dos dados
    if(!idItem || status === undefined){
        return res.status(400).json({message:"Está faltando dados"});
    }
    //Caso todos os dados estejam corretos, inicia a atualização do status do item
    try{
        //Procura o item no banco de dados
        const item = await taskItens.findOne({_id:idItem});
        //Caso o item não exista, retorna erro 400 e a informação de que o item não existe.
        if(!item){
            return res.status(400).json({message:"Está não existe."});
        }
        //Caso o item exista, procura a tarefa associada a ele
        const task = await taskControl.findOne({_id:item.idTask});
        //Caso não exista tarefa associada ao item, retorna erro 400 e a informação de que não existe tarefa associada ao item
        if(!task){
            return res.status(400).json({message:"Nenhuma tarefa associada a esse item"});
        }
        //Caso a tarefa existe, atualiza o status do item;
        item.status = status;
        //Insere a atualização do item no banco de dados
        await taskItens.updateOne({_id:item._id}, item);
        await taskItens.compactDatafile();
        //Verifica se o status do item foi para concluido ou pendente
        //Caso concluido, incrementa o valor percentual do item no percentual concluido da tarefa
        
        status ? task.percentualConcluido = (Number(task.percentualConcluido)+Number(item.percentual)) 
        //Caso pendente, decrementa o valor percentual do item no percentual concluido da tarefa
        : task.percentualConcluido = Number(task.percentualConcluido)-Number(item.percentual)
        //Atualiza o tarefa no banco de dados
        await taskControl.updateOne({_id:item.idTask}, task);
        await taskControl.compactDatafile();
        //Retorna status 201 e a mensagem de sucesso!
        return res.status(201).json({message:`Item da tarefa ${Number(status)?"concluido":"pendênte"}.`});
    }catch(error){
        //Caso aconteça algum erro na API, retorna status 500 e a mensagem do erro
        return res.status(500).json({message:error.message})
    }
}

module.exports = {getItens, insertItem, deleteItem, updateStatusItem}