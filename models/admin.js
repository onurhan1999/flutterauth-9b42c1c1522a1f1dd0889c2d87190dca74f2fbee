var mongoose=require('mongoose')
var Schema=mongoose.Schema;
var bcrypt=require('bcrypt')

var adminSchema=new Schema({
    name:{
        type:String,
        require:true
    },
    mail:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
})

adminSchema.pre('save',function(next){
    var admin=this;
    if(this.isModified('password')||this.isNew){
        bcrypt.genSalt(10,function(err,salt){
            if(err){
                return next(err)
            }
            bcrypt.hash(admin.password,salt,function(err,hash){
                if(err){
                     return next(err)

                }
                admin.password=hash;
                next()
            })
        })
    }
    else{
        return next()
    }
})

adminSchema.methods.comparePassword=function(passw,cb){
    bcrypt.compare(passw,this.password,function(err,isMatch){
        if(err){
            return cb(err)
        }
        cb(null,isMatch)

    })
}

module.exports=mongoose.model('Admin',adminSchema)