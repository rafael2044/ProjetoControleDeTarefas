const {Router} = require('express');
const {getItens, insertItem, deleteItem, updateStatusItem} = require("../controllers/item")

const router = Router()

router.get('/:idTask', getItens)

router.post("/insertitem", insertItem)

router.delete("/delete/:idItem", deleteItem)

router.put("/updatestatus/:idItem", updateStatusItem)


module.exports = router