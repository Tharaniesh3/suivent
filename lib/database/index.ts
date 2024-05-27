import mongoose from "mongoose";
const MongoDB_URI = 'mongodb+srv://tharaniesh3:1234567890@cluster0.7bm0iz6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

let cached = (global as any).mongoose || {conn:null,promise:null};

export const connectToDatabse =async () => {
    if(cached.conn) return cached.conn;
    if(!MongoDB_URI) throw new Error('MongoDB_URI missing');
    cached.promise = cached.promise ||mongoose.connect(MongoDB_URI,{
        dbName:'suivent',
        bufferCommands:false,
    })
    cached.conn = await cached.promise;
    return cached.conn;
}


//server actions
//connectToDatabase()....