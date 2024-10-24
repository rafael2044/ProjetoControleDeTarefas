import { useEffect, useState } from 'react'
import './App.css'
import Task from './components/Tarefa/Task'
import Alert from "./components/Alert/Alert"
import FormTask from './components/Tarefa/FormTask'

function App() {
  const [tasks, setTasks] = useState([]);
  const [showAlert, setShowAlert] = useState(false)
  const [messageAlert, setMessageAlert] = useState("")
  const [typeAlert, setTypeAlert] = useState("");

  //Esse metodo useEffect irá buscar as tarefa na API e fazer o carregamento delas
  useEffect(()=>{
    //Função responsavel por buscar as tarefa na rota /task/ da API
    const getTasks = async()=>{
      const res = await fetch("http://127.0.0.1:3000/task", {method: "GET"});
      if (!res.ok){
        const data = await response.json();
        showAlertMessage(data.message, 'danger');
        return
      }
      //Caso a API retorne 200, pega o dados do response
      const data = await res.json();
      //Insere os dados no useStatus tasks
      setTasks([...data.tasks]);
    }
    //Chama a função de buscar as tarefas
    getTasks();
    
  }, [])

  //Envia os dados da nova tarefa para a rota /task/inserttask da API
  const addTask = async(newTask)=>{
    try{
      //Envia os dados atraves do metodo POST para a url da API
      const response = await fetch(`http://127.0.0.1:3000/task/inserttask/`,{
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify(newTask)
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
      //Recebo o objeto tarefa que a API retorna
      const dataNewTask = data.task;
      //Insere essa nova tarefa no useStatus tasks
      setTasks([...tasks, dataNewTask])
      //Retorna o status do erro e a mensagem para ser inserido no alerta
      return {status: response.status, message: data.message}
    }catch(error){
      //Caso a API retorne algum erro do sistema, retorna o status do erro e a mensagem
        return {status: response.status, message: error.message}
    }
  }

  const deletaTask = async(idTask)=>{
    try{
      const response = await fetch(`http://127.0.0.1:3000/task/delete/${idTask}`, {method:"DELETE"});
      if(!response.ok){
        const data = await response.json();
        const status = response.status;
        showAlertMessage(data.message, 'danger')
        return
      }
      //Caso a API retorne status 201, pega os dados JSON do response
      const data = await response.json();

      //deleta o item do useStatus itens
      setTasks(prevData=>prevData.filter(task=>task._id!=idTask))
      showAlertMessage(data.message, 'success')
    }catch(error){
      showAlertMessage(error.message, 'danger')
    }
  }

  //Função responsável por atualizar o percentual Concluido da tarefa
  const atualizarPercentualTask = (idTask, taskChange)=>{
      //Procura a tarefa o useStates tasks e substitui pela tarefa com percentual concluido atualizado
      setTasks(prevData=>prevData.map(task=>task._id === idTask?taskChange:task))
  }

  //Função que chama o alerta
  const showAlertMessage = (message, typeAlert)=>{
    setMessageAlert(message)
    setTypeAlert(typeAlert)
    setShowAlert(true)
  }

  return (
    <>
      <div className='container gap-2'>
        <h1 className='fs-1 fw-bold'>Controle de Tarefas</h1>
        <FormTask onAddTask={addTask} onShowAlertMessage={showAlertMessage}/>
        <h2 className='fs-1 fw-bold'>Tarefas Cadastradas</h2>
        <div className='container p-0 m-0'>
          {tasks.map((task)=>(
            <div className='row mb-3' key={task._id}><Task idTask={task._id} prioridadeTarefa={task.prioridadeTarefa} nomeTarefa={task.nomeTarefa} dataLimite={task.dataLimite} percentualConcluido={task.percentualConcluido}
            detalhesTarefa={task.detalhesTarefa} onAtualizarPercentual = {atualizarPercentualTask} onShowAlertMessage={showAlertMessage}
            onDeleteTask={deletaTask}/></div>
          ))}
        </div>
      </div>
      <Alert message={messageAlert}
            type={typeAlert}
            show={showAlert}
            onClose={()=>{setShowAlert(false)}}
            duration={5000}></Alert>
    </>
  )
}

export default App
