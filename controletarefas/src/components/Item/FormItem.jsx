import { useState } from "react"

export default function FormItem({onAddItem, idTask, onShowAlertMessage}){

    const [itemIdTask, setItemIdTask] = useState(idTask)
    const [descricao, setDescricao] = useState("")
    const [data, setData] = useState("")
    const [percentual, setPercentual] = useState(0)

    //Função que o submit do formulário irá chamar
    const handleAddItem = async (e)=>{
        e.preventDefault();
        //Valida se os dados não estão vazios
        if (descricao && data && percentual){
            //Chama a função que irá fazer a chamada na API e inserir o novo item
            const res = await onAddItem(itemIdTask, {percentual, descricao, data});
            //Se o atributo status do objeto retornado pela função for 200 ou 201;
            if (res.status === 200 || res.status === 201){
                //Mensagem de sucesso
                onShowAlertMessage(res.message, "success")
                //Limpa os campos do formulário
                limparCampos();
                return
            }
            //Caso sejá retorne erro, mostra a mensagem de erro
            onShowAlertMessage(res.message, 'danger')
        }
    }                   

    //Função que irá limpar os campos do formulário
    const limparCampos = ()=>{
        setDescricao("")
        setData("")
        setPercentual("")
    }

    return(
        <>
            <form onSubmit={handleAddItem}>
                <div className="row align-items-center">
                    <div className="col-1 align-self-center">
                    </div>
                    <div className="col align-self-center">
                        <input type="text" className="form-control" placeholder="Descrição" value={descricao} onChange={(e)=>{setDescricao(e.target.value)}} />
                    </div>
                    <div className="col-2 align-self-center">
                        <input type="date" className="form-control" value={data} onChange={(e)=>setData(e.target.value)}/>
                    </div>
                    <div className="col-1 align-self-center">
                        <input type="number" className="form-control" placeholder="%" value={percentual} onChange={(e)=>setPercentual(e.target.value)} />
                    </div>
                    <div className="col-2">
                        <button className="btn btn-primary w-100 fs-5 fw-bold" type="submit">Cadastrar</button>
                    </div>
                </div>
            </form>
        </>
    )
}