const express = require('express')
const app = express()
const amqp = require('amqplib')

const PORT = 3001

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const amqpServer = require('../env')
let conn, channel

const connectToRabbitMQ = async () => {
    try {
        conn = await amqp.connect(amqpServer)
        channel = await conn.createChannel()
        await channel.assertQueue('data-channel')
        console.log('Connected with RabbitMQ!')
    } catch(err) {
        console.log('Error in Connecting RabbitMQ!')
    }
}

const addDataToRabbitMQ = async (data) => {
    await channel.sendToQueue('data-channel', Buffer.from(JSON.stringify(data)))
}

connectToRabbitMQ()

app.post('/', (req, res) => {
    const data = req.body
    addDataToRabbitMQ(data)
    console.log('Data Sent: ', data)
    res.json({
        message: 'Data Sent',
        data
    })
})

app.listen(PORT, () => {
    console.log(`Server - 1 is Running  at PORT: ${PORT}`)
})