const mongoose=require("mongoose")


mongoose.set('strictQuery', false)
mongoose.connect(`${process.env.DB_URI}`,(err)=>{
    if(err) console.log(err)
    console.log('done')
})

