import mongoose from "mongoose";

const DbCon = async() =>{
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log('Mongodb is connected')
    } catch (error) {
        console.log("connection Error")
    }
}

export default DbCon