var User = require('../models/user')
const Advert = require("../models/advert");

var jwt = require('jwt-simple')
var config = require('../config/dbconfig')
const { authenticate } = require('passport')

var mongoose = require('mongoose');


var functions = {
    addNew: function (req, res) {
        User.findOne({
            mail: req.body.mail
        }, function (err, user) {
            if (err) {
                throw err
            }else{
                if ((!req.body.name) || (!req.body.password)|| (!req.body.mail)) {
                    res.json({ succes: false, msg: 'Boş alanları doldurun.' })
                }else{
                    var newUser = User({
                        name: req.body.name,
                        password: req.body.password,
                        mail:req.body.mail
                    });
                    if (user) {
                        res.status(403).send({ succes: false, msg: 'Kayıt başarısız. Bu mail zaten kayıtlı.' })


                    }else{

                        newUser.save(function (err, newUser) {
                            if (err) {
                                console.log(err)
                                res.json({
                                    succes: false, msg: 'Kayıt başarısız.'
                                })
                            }
                            else {
                                res.json({
                                    succes: true, msg: 'Kayıt başarılı.'
                                })
                            }
                        })
                        console.log('kullanıcı yok bu adla')

                    }
                }
            }           
        })
    },

    authenticate: function (req, res) {
        User.findOne({
            name: req.body.name
        }, function (err, user) {
            if (err) {
                throw err
            }
            if (!user) {
                res.status(403).send({ succes: false, msg: 'Giriş başarısız. Kullanıcı bulunamadı.' })
            }
            else {
                user.comparePassword(req.body.password, function (err, isMatch) {
                    if (isMatch && !err) {
                        var token = jwt.encode(user, config.secret)
                        res.json({ succes: true, token: token })
                    }
                    else {
                        return res.status(403).send({ succes: false, msg: 'Şifre hatalı!' })
                    }
                })
            }
        }

        )
    },
    getinfo: function (req, res) {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            var token = req.headers.authorization.split(' ')[1]
            var decodedtoken = jwt.decode(token, config.secret)
            return res.json({ succes: true, msg: 'Hello' + decodedtoken.name })

        }
        else {
            return res.json({ succes: false, msg: 'No Headers' })

        }
    },
    addAdvert: function (req, res) {
        if ((!req.body.title) || (!req.body.description) || (!req.body.price) || (!req.body.province) || (!req.body.district)|| (!req.body.numberOfRooms)|| (!req.body.street)) {

            res.json({ succes: false, msg: 'Enter all fields' })
        }
        else {
            var advert = new Advert({
                title: req.body.title,
                description: req.body.description,
                price: req.body.price,
                province: req.body.province,
                district: req.body.district,
                street:req.body.street,
                numberOfRooms:req.body.numberOfRooms

            });
            advert.save(function (err, advert) {
                if (err) {
                    console.log(err)
                    res.json({
                        succes: false, msg: 'İlan ekleme başarısız.'
                    })
                }
                else {
                    res.json({
                        succes: true, msg: 'İlan başarıyla eklendi.'
                    })
                }
            })
        }
    },


    deleteAdvert:function(req,res){
        console.log(req.body.name)
        Advert.deleteOne({ name: "onurhan" }, function(err) {
            if (!err) {
                res.json({
                    succes: true, msg: 'İlan başarıyla silindi.'
                })
            }
            else {
                res.json({
                    succes: false, msg: 'İlan silme başarısız.'
                })
            }
        });
        
    },

    getData:function(req,res){
        connection = mongoose.connection;

        connection.collection("adverts").find({}).toArray(function (err, info) {
            if(err){
                res.json({
                    succes: false, msg: 'getData fonksiyonu başarısız oldu.'
                })
            }else{
                console.log(typeof info)
                console.log(info)
                res.status(200).json({
                    data:info
                })
            }
          })
    }

}

module.exports = functions