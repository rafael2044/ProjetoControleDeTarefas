import { useState } from "react"


export default function Item({idTask, percentual, descricaoExecucao, dataExecucao, idItem, status, onDeleteItem, onUpdateItem, onShowAlertMessage}){
    const [isChecked, setIsChecked] = useState(Boolean(status));
    const [itemStatus, setItemStatus] = useState(Number(status))

    //Função do checkbox que monitorá o status
    const handleChangeStatus = async ()=>{
        //Item com status alterado
        const itemChange = {idTask, percentual, descricaoExecucao, dataExecucao, status:Number(!itemStatus), _id:idItem}
        //Chama a função que irá fazer a chamada a API
        const res = await onUpdateItem(idItem, itemChange);
        if (res.status == '200' || res.status == "201"){
            onShowAlertMessage(res.message, 'success')
            //Altera o useStatus do status do item
            setItemStatus(!itemStatus);
            //Altera o useStatus do status do checkbox
            setIsChecked(!isChecked)
            return
        }
        onShowAlertMessage(res.message, 'danger')
        //Altera o useStatus do status do item
        setItemStatus(!itemStatus);
        //Altera o useStatus do status do checkbox
        setIsChecked(!isChecked)
    }

    //Função do botão excluir
    const handleDeleteItem= async (e)=>{
        const itemDelete = {idTask, percentual, descricaoExecucao, dataExecucao, status, _id:idItem}
        //Função que irá fazer a chama a API
        const res = await onDeleteItem(itemDelete);
        if (res.status == '200' || res.status =='201'){
            onShowAlertMessage(res.message, 'success')
            return
        }
        onShowAlertMessage(res.message, 'danger')
    }

    return (
        <>
            <div className="row mb-3">
                <div className="col-1">
                    <div className="row align-items-center justify-content-center">
                        <h2 className="fs-5 fw-bold text-center">Status</h2>
                        <input class="form-check-input fs-4 m-0" type="checkbox" value={itemStatus} 
                        onChange={(e)=>{handleChangeStatus()}} checked={isChecked}/>
                    </div>
                </div>
                <div className="col align-self-center">
                    <h2 className="fs-5 fw-bold">Descrição</h2>
                    <div className="row align-items-center justify-content-center">
                        <p className="m-0">{descricaoExecucao}</p>
                    </div>
                </div>
                <div className="col-2 align-self-center">
                    <div className="row align-items-center justify-content-center">
                        <h2 className="fs-5 fw-bold text-center">Data de Execução</h2>
                        <p className="m-0 text-center">{dataExecucao}</p>
                    </div>
                </div>
                <div className="col-2 align-self-center">
                    <div className="row align-items-center justify-content-center">
                        <h2 className="fs-5 fw-bold text-center"> Percentual</h2>
                        <p className="m-0 text-center">{percentual+"%"}</p>
                    </div>
                </div>
                <div className="col-1">
                    <div className="row h-100 align-items-center justify-content-center gap-2">
                        <button className="btn btn-danger w-auto" onClick={handleDeleteItem}><i class="fa-solid fa-x"></i></button>
                    </div>
                </div>
            </div>
        </>
    )
}