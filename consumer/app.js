const express = require('express')
const app = express()
const amqp = require('amqplib')

const PORT = 3002

const amqpServer = require('../env')
let conn, channel

const connectToRabbitMQ = async () => {
    try {
        conn = await amqp.connect(amqpServer)
        channel = await conn.createChannel()
        await channel.assertQueue('data-channel')
        console.log('Connected with RabbitMQ!')
        channel.consume('data-channel', (data) => {
            const userData = JSON.parse(Buffer.from(data.content))
            channel.ack(data)
            console.log('Data Received: ', userData)
        })
    } catch(err) {
        console.log('Error in Connecting RabbitMQ!')
    }
}

connectToRabbitMQ()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.listen(PORT, () => {
    console.log(`Server - 2 is Running at PORT: ${PORT}`)
})