import {ApolloServer} from "apollo-server";
import mongoose from "mongoose";
import dotenv from "dotenv";

import typeDefs from "./graphql/typeDefs.js";
import resolvers from "./graphql/resolvers/index.js";

dotenv.config();


const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req}) => ({req})
});

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO, { useNewUrlParser: true }, { useUnifiedTopology: true });
        console.log("Connected to MongoDB");
    } catch (error) {
        throw error
    }
};

mongoose.connection.on("disconnected", () => {
    console.log("MongoDB disconnected");
});

mongoose.connection.on("connected", () => {
    console.log("MongoDB connected");
});

server.listen({port: 5000}).then(res => {
    connect();
    console.log(`Server running on ${
        res.url
    }`);
})
