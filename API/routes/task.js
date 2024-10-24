const {Router} = require('express');
const {getTasks, insertTask, deleteTask} = require("../controllers/task")

const router = Router()

router.get('/', getTasks)

router.post("/inserttask", insertTask)

router.delete('/delete/:idTask', deleteTask)

module.exports = router

