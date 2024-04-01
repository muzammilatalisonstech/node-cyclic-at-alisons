const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const { default: axios } = require("axios");
const mongoose = require('mongoose');
const { resolvers, typeDefs } = require("./src/schema/schema");
const Permission = require("./src/models/PermissionsModel");

dotenv.config()


const startServer = async () => {
    const app = express();
    const server = new ApolloServer({
        typeDefs, resolvers,
        introspection: false,
        playground: false,
        playgroundAlways: false
    });

    app.use(bodyParser.json());
    app.use(cors());
    app.use(express.static("public"))
    await mongoose.connect(process.env.MONGO_URI);
    console.log("connected to MongoDB");
    // app.post('/add-permission', async (req, res) => {
    //     const data = await Permission.create(req.body)
    //     console.log(data)
    //     res.send('added successfully')
    // })
    await server.start()
    app.use("/graphql",
        expressMiddleware(server, { context: ({ req }) => ({ token: req.headers.authorization }) }));

    app.listen(process.env.PORT || 9090, () => {
        console.log(`🚀 Server running on http://localhost:${process.env.PORT}`)
    })

}

startServer()