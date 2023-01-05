var mongoose=require('mongoose')
var Schema=mongoose.Schema;
var advertSchema=new Schema({
    title:{
        type:String,
        require:true
    },
    description:{
        type:String,
        require:true
    },
    price:{
        type:String,
        require:true
    },
    province:{
        type:String,
        require:true
    },
    district:{
        type:String,
        require:true
    },
    street:{
        type:String,
        require:true
    },
    numberOfRooms:{
        type:String,
        require:true
    },
})
module.exports=mongoose.model('Advert',advertSchema)