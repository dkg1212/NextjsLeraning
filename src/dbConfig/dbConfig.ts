import mongoose from 'mongoose';

export async function connect(){
    try {
        mongoose.connect(process.env.MONGO_URI!);
        const connection=mongoose.connection;

        connection.on('connected',()=>{
            console.log('MongoDB Connected ');
        })
        connection.on('error',(err)=>{
            console.log("MongoDB connection error .Please make Sure MongoDB is runnning  welll ."+err);
            process.exit();
        })

    }catch(error){
        console.log("something went Wrong "+error);
    }
}