import { useEffect, useRef, useState } from "react"
import "./Task.css"
import Item from "../Item/Item";
import FormItem from "../Item/FormItem"
export default function Task({idTask, prioridadeTarefa, nomeTarefa, dataLimite, percentualConcluido, detalhesTarefa, onAtualizarPercentual, onShowAlertMessage,onDeleteTask}){
    const [pConcluido, setPConcluido] = useState(Number(percentualConcluido))
    const [itens, setItens] = useState([]);
    
    //Esse metodo useEffect irá buscar os itens da tarefa na API e fazer o carregamento dela na tarefa
    useEffect(
        ()=>{
            //Função responsavel por buscar os itens da tarefa na rota /item/:idTask da API
            const getItensTask = async ()=>{
                const response = await fetch(`http://127.0.0.1:3000/item/${idTask}`, {method:"GET"});
                //Caso a API retorne erro, trata o erro e mostra o alerta com a mensagem do erro retornada
                if (!response.ok){
                    const data = await response.json();
                    onShowAlertMessage(data.message, 'danger');
                    return
                }
                //Caso a API retorne 200, pega o dados do response
                const data = await response.json();
                //Insere os dados no useStatus itens
                setItens([...data.itens])
            }
            //Chama a função de buscar os itens
            getItensTask();
        },[]
    )   

    //Envia os dados do novo item para a rota /item/insertitem API
    const addItem = async (idTask, newItem)=>{
        try{
            //Envia os dados atraves do metodo POST para a url da API
            const response = await fetch(`http://127.0.0.1:3000/item/insertitem/`,{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({
                    //Estrutura JSON dos dados do item
                    idTask,
                    percentual: newItem.percentual,
                    descricaoExecucao: newItem.descricao,
                    dataExecucao: newItem.data
                })
            });
            //Caso a API retorne algum erro, trata-o
            if (!response.ok){
                const data = await response.json();
                const status = response.status
                //Retorna o status do erro e a mensagem para ser inserido no alerta
                return {status, message:data.message}
            }
            //Caso a API retorne status 200 ou 201, recebe o dados da API
            const data = await response.json();
            //Recebo o objeto item que a API retorna
            const dataNewItem = data.item;
            //Insere esse novo item no useStatus itens
            setItens([...itens, dataNewItem]);
            //Retorna o status e a mensagem que a API retorna
            return {status: response.status, message: data.message}
            
        }catch(error){
            //Caso a API retorne algum erro do sistema, retorna o status do erro e a mensagem
            return {status: response.status, message: error.message}
        }
    }

    //Envia o id do item para a rota /item/delete da API
    const deleteItem = async (itemDelete/*Recebe como parametro o item que será deletado*/)=>{
        const response = await fetch(`http://127.0.0.1:3000/item/delete/${itemDelete._id}`, {method:"DELETE"})
        //Caso a API retorne erro, trata-o e retorna o status e a mensagem do erro
        if (!response.ok){
            const data = await response.json();
            const status = response.status;
            return {status, message:data.message}
        }
        //Caso a API retorne status 201, pega os dados JSON do response
        const data = await response.json();
        //deleta o item do useStatus itens
        setItens(prevData=>prevData.filter(item=>item._id!=itemDelete._id))
        //Caso o item deletado tenha status concluido, altera o percentual concluido do useStatus pConcluido da tarefa
        if (Number(itemDelete.status)){
            const percentualItem = Number(itemDelete.percentual);
            setPConcluido(pConcluido-percentualItem);
            //Chama a função que irá atualizar a tarefa no useStatus tasks da pagina principal
            //A função recebe o id da tarefa e a tarefa atualizada
            onAtualizarPercentual(itemDelete.idTask, {_id:idTask, prioridadeTarefa, nomeTarefa, dataLimite, percentualConcluido:pConcluido, detalhesTarefa})
        }
        //retorna o status e a mensagem
        return {status:response.status, message:data.message}
    }

    const updateItem = async (idItem, itemChange)=>{
        const response = await fetch(`http://127.0.0.1:3000/item/updatestatus/${idItem}`, {
            method:"PUT",
            headers: {'Content-Type':"application/json"},
            body: JSON.stringify({status: itemChange.status})
        });
        if (!response.ok){
            const data = await response.json()
            return {status:response.status, message:data.message}
        }
        const data = await response.json();
        setItens(prevData=>prevData.map(item=>item._id===idItem?itemChange:item));
        const percentual = Number(itemChange.percentual);
        setPConcluido(itemChange.status?pConcluido+percentual:pConcluido-percentual);
        onAtualizarPercentual(itemChange.idTask, {_id:idTask, prioridadeTarefa, nomeTarefa, dataLimite, percentualConcluido:pConcluido, detalhesTarefa})
        return {status:response.status, message: data.message}
    }

    const hadlerDeleteTask = (e)=>{
        const confirmad = confirm("Tem certeza que deseja deletar essa tarefa?");
        if (confirmad){
            onDeleteTask(idTask);
        }
    }
    return (
        <>
            <div className="card px-0">
                <div className="card-header">
                    <div className="row">
                        <div className="col">
                            <div className="row g-4">
                                <div className="col-2 w-auto">
                                    <h2 className="fs-5 fw-bold">Prioridade</h2>
                                    <p className="text-center">{prioridadeTarefa}</p>
                                </div>
                                <div className="col w-100">
                                    <h2 className="fs-5 fw-bold">Tarefa</h2>
                                    <p>{nomeTarefa}</p>
                                </div>
                                <div className="col-2 w-auto">
                                    <div className="row h-100 justify-content-center align-items-center">
                                        <h2 className="fs-5 fw-bold text-center">Concluído</h2>
                                        <p className="text-center">{pConcluido}%</p>
                                    </div>
                                </div>
                                <div className="col-2 w-auto">
                                    <div className="row h-100 justify-content-center align-items-center">
                                        <h2 className="fs-5 fw-bold text-center">Data Limite</h2>
                                        <p className="text-center">{dataLimite}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <h2 className="fs-5 fw-bold">Detalhes da Tarefa</h2>
                                    <p>{detalhesTarefa}</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-1">
                            <div className="row h-100 align-itens-evenly justify-content-center">
                                
                                    <a data-toggle="collapse" href={"#"+"tarefa"+idTask} aria-expanded="true" aria-controls={idTask} id={"heading-"+idTask} className="d-block w-auto"><i className="fa fa-chevron-down pull-right fs-1"></i></a>
                                
                                <div className="col-12 align-self-center">
                                    <div className="row justify-content-center align-items-center">
                                        <button className="btn btn-danger w-auto" onClick={hadlerDeleteTask}><i className="fa-solid fa-x fs-5"></i></button>                              
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id={"tarefa"+idTask} className="collapse" aria-labelledby={"heading-"+idTask}>
                    <div className="card-body">
                        {itens.map(item=>(
                            <Item key={item._id} idTask={item.idTask} idItem={item._id} descricaoExecucao={item.descricaoExecucao}
                            percentual={item.percentual} dataExecucao={item.dataExecucao} status={item.status}
                            onDeleteItem={deleteItem} onUpdateItem={updateItem} onShowAlertMessage={onShowAlertMessage}/>
                        ))}
                        <FormItem onAddItem={addItem} idTask={idTask} onShowAlertMessage={onShowAlertMessage}/>
                    </div>
                </div>
            </div>
        </>
    )
}