var User=require('../models/user')
const Advert = require("../models/advert");

var jwt=require('jwt-simple')
var config=require('../config/dbconfig')
const { authenticate } = require('passport')

var functions={
    addNew:function(req,res){
        if((!req.body.name)||(!req.body.password)){
            res.json({succes:false,msg:'Enter all fields'})
        }
        else{
            var newUser=User({
                name:req.body.name,
                password:req.body.password
            });
            newUser.save(function(err,newUser){
                if(err){
                    console.log(err)
                    res.json({
                        succes:false,msg:'Failed to save'
                    })
                }
                else{
                    res.json({
                        succes:true,msg:'Succesfuly saved'
                    })
                }
            })
        }
    },

    authenticate:function(req,res){
        User.findOne({
            name:req.body.name
        },function(err,user){
            if(err) {
                throw err
            }
            if(!user){
                res.status(403).send({succes:false,msg:'Auth Failed, user not found'})
            }
            else{
                user.comparePassword(req.body.password,function(err,isMatch){
                    if(isMatch&&!err){
                        var token=jwt.encode(user,config.secret)
                        res.json({succes:true,token:token})
                    }
                    else{
                        return res.status(403).send({succes:false,msg:'Auth failed, wrong password'})
                    }
                })
            }
        }
        
        )
    },
    getinfo:function(req,res){
        if(req.headers.authorization&&req.headers.authorization.split(' ')[0]==='Bearer'){
            var token=req.headers.authorization.split(' ')[1]
            var decodedtoken=jwt.decode(token,config.secret)
            return res.json({succes:true,msg:'Hello'+decodedtoken.name})

        }
        else{
            return res.json({succes:false,msg:'No Headers'})

        }
    },
    addAdvert:function(req,res){
        if((!req.body.title)||(!req.body.description)||(!req.body.price)||(!req.body.province)||(!req.body.district)){
            console.log(req.body.title)
            console.log(req.body.description)
            console.log(req.body.price)
            console.log(req.body.province)
            console.log(req.body.district)

            res.json({succes:false,msg:'Enter all fields'})
        }
        else{
            var advert = new Advert({
                title: req.body.title,
                description: req.body.description,
                price: req.body.price,
                province: req.body.province,
                district: req.body.district,

            });
            advert.save(function(err,advert){
                if(err){
                    console.log(err)
                    res.json({
                        succes:false,msg:'failed to advert save'
                    })
                }
                else{
                    res.json({
                        succes:true,msg:'Advert succesfuly saved'
                    })
                }
            })
        }
    },
}

module.exports=functions