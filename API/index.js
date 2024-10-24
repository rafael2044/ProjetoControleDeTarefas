const express = require('express');
const cors = require('cors');
const routeTask = require("./routes/task");
const routeItem = require('./routes/item')

const app = express();
app.use(cors());

app.use(express.json());

app.use('/task', routeTask);
app.use('/item', routeItem)

app.listen(3000, ()=>{
    console.log("API iniciada na porta 3000");
})