import { useState } from "react"

export default function FormTask({onAddTask, onShowAlertMessage}){
    const [nome, setNome] = useState("")
    const [detalhes, setDetalhes] = useState("")
    const [data, setData] = useState("")
    const [prioridade, setPrioridade] = useState("")

    //Função que o submit do formulário irá chamar
    const handleAddTask = async (e)=>{
        e.preventDefault();
        //Chama a função addTask que irá fazer a chama a API e inserir a nova tarefa
        const res = await onAddTask({
            prioridadeTarefa:prioridade,
            nomeTarefa: nome,
            dataLimite: data,
            detalhesTarefa: detalhes
        })
        //Caso o atributo status do objeto retornado pela função sejá 200 ou 201
        if (res.status === 200 || res.status === 201){
            //mensagem de sucesso
            onShowAlertMessage(res.message, 'success')
            //Limpa os campos do formulário
            limparCampos();
            return
        }
        //Caso não, alerta de erro
        onShowAlertMessage(res.message, 'danger')
    }

    //Função que limpa os campos do formulário
    const limparCampos = ()=>{
      setPrioridade("");
      setNome("");
      setDataLimite("");
      setPercentualConcluido("");
      setDetalhes("");
    }

    return (
        <form onSubmit={handleAddTask}>
          <h2 className='fs-3 fw-bold'>Cadastrar nova tarefa</h2>
          <div className="mb-3">
            <div className="row">
              <div className="col-5">
                <input type="text" className='form-control fs-5' placeholder='Nome da tarefa' value={nome} onChange={(e)=>setNome(e.target.value)}/>
              </div>
              <div className="col">
                <input type="text" className='form-control fs-5' placeholder='Detalhes da Tarefa'value={detalhes} onChange={(e)=>setDetalhes(e.target.value)}/>
              </div>
            </div>
          </div>
          <div className="mb-3">
            <div className="row">
              <div className="col-2">
                <input type="date" className='form-control fs-5' placeholder='Data Limite' value={data} onChange={(e)=>setData(e.target.value)}/>
              </div>
              <div className="col-2">
                <select className='form-select fs-5' value={prioridade} onChange={(e)=>setPrioridade(e.target.value)}>
                  <option hidden>Prioridade</option>
                  <option value="Alta">Alta</option>
                  <option value="Media">Media</option>
                  <option value="Baixa">Baixa</option>
                </select>
              </div>
              <div className="col">
                <button type="submit" className='btn btn-primary w-100 fs-5'>Cadastrar</button>
              </div>
            </div>
          </div>
        </form>
    )
}