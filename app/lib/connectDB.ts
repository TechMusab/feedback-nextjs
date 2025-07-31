import mongoose from "mongoose";

type connectionObject = {
    isConnected?: number;
}

const connection: connectionObject = {};

async function connectDB():Promise<void> {
    if(connection.isConnected) {
        console.log("Already connected to MongoDB");
        return;
    }

    try {
        const db=await mongoose.connect(process.env.MONGODB_URI as string || "")
        connection.isConnected=db.connections[0].readyState
        console.log("Connected to MongoDB");
        
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
}

export default connectDB;