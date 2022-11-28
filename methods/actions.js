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
            } else {
                if ((!req.body.name) || (!req.body.password) || (!req.body.mail)) {
                    res.json({ succes: false, msg: 'Boş alanları doldurun.' })
                } else {
                    var newUser = User({
                        name: req.body.name,
                        password: req.body.password,
                        mail: req.body.mail
                    });
                    if (user) {
                        res.status(403).send({ succes: false, msg: 'Kayıt başarısız. Bu mail zaten kayıtlı.' })


                    } else {

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
            mail: req.body.mail
        }, function (err, user) {
            if (err) {
                throw err
            }
            if (user) {
                user.comparePassword(req.body.password, function (err, isMatch) {
                    if (isMatch && !err) {
                        var token = jwt.encode(user, config.secret)
                        res.json({ succes: true, token: token, name: user.name, })
                    }
                    else {
                        return res.status(403).send({ succes: false, msg: 'Şifre hatalı!' })
                    }
                })

            }
            else {
                res.status(403).send({ succes: false, msg: 'Giriş başarısız. Kullanıcı bulunamadı.' })
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
        if ((!req.body.title) || (!req.body.description) || (!req.body.price) || (!req.body.province) || (!req.body.district) || (!req.body.numberOfRooms) || (!req.body.street)) {

            res.json({ succes: false, msg: 'Enter all fields' })
        }
        else {
            var advert = new Advert({
                title: req.body.title,
                description: req.body.description,
                price: req.body.price,
                province: req.body.province,
                district: req.body.district,
                street: req.body.street,
                numberOfRooms: req.body.numberOfRooms

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


    deleteAdvert: function (req, res) {
        console.log(req.body._id)
        console.log(req.body.name)
        Advert.deleteOne({ _id: req.body._id }, function (err) {
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

    getData: function (req, res) {
        connection = mongoose.connection;

        connection.collection("adverts").find({
        }).toArray(function (err, info) {
            if (err) {
                res.json({
                    succes: false, msg: 'getData fonksiyonu başarısız oldu.'
                })
            } else {
                console.log(typeof info)
                console.log(info)
                res.status(200).json({
                    data: info
                })
            }
        })
    },

    getDataWithFilter: function (req, res) {
        connection = mongoose.connection;

        if (req.body.province && req.body.district && req.body.numberOfRooms) {
            //HEM İL HEM İLÇE HEM DE ODA SAYISI VARSA
            connection.collection("adverts").find({

                province: req.body.province,
                district: req.body.district,
                numberOfRooms: req.body.numberOfRooms


            }).toArray(function (err, info) {
                if (err) {
                    res.json({
                        succes: false,
                        msg: 'getDataWithFilter0 fonksiyonu başarısız oldu.',
                    })
                } else {
                    res.status(200).json({
                        data: info
                    })
                }
            })
        } else if (req.body.province && req.body.district && !req.body.numberOfRooms) {
            console.log("SADECE İL VE İLÇE VARSA ODA YOKSA")
            console.log(req.body.province)
            console.log(req.body.district)
            //SADECE İL VE İLÇE VARSA ODA YOKSA
            connection.collection("adverts").find({

                province: req.body.province,
                district: req.body.district,
                
            }).toArray(function (err, info) {
                if(err){
                    res.json({
                        succes: false,
                         msg: 'getDataWithFilter1 fonksiyonu başarısız oldu.',
                         
    
                    })
                }else{
                    res.status(200).json({
                        data:info
                    })
                }
              })

        } else if (req.body.province && !req.body.district && !req.body.numberOfRooms) {
            //SADECE İL VARSA İLÇE VE ODA YOKSA
            connection.collection("adverts").find({
        
                province: req.body.province,
                
              
                
    
            }).toArray(function (err, info) {
                if(err){
                    res.json({
                        succes: false,
                         msg: 'getDataWithFilter1 fonksiyonu başarısız oldu.',
                         
    
                    })
                }else{
                    res.status(200).json({
                        data:info
                    })
                }
              })
        }
        else if (req.body.province && !req.body.district && req.body.numberOfRooms) {
            //SADECE İL VARSA VE ODA VARSA
            connection.collection("adverts").find({
        
                province: req.body.province,
                numberOfRooms: req.body.numberOfRooms,
              
                
    
            }).toArray(function (err, info) {
                if(err){
                    res.json({
                        succes: false,
                         msg: 'getDataWithFilter1 fonksiyonu başarısız oldu.',
                         
    
                    })
                }else{
                    res.status(200).json({
                        data:info
                    })
                }
              })
        }
        else if (!req.body.province && !req.body.district && req.body.numberOfRooms) {
            //İL VE İLçE YOK SADECE ODA VAR
            connection.collection("adverts").find({
        
                numberOfRooms: req.body.numberOfRooms,
                
              
                
    
            }).toArray(function (err, info) {
                if(err){
                    res.json({
                        succes: false,
                         msg: 'getDataWithFilter1 fonksiyonu başarısız oldu.',
                         
    
                    })
                }else{
                    res.status(200).json({
                        data:info
                    })
                }
              })

        } else {
            //HİÇBİRİ YOKSA BÜTÜN DATALARI GÖNDERİR
            connection.collection("adverts").find({}).toArray(function (err, info) {
                if(err){
                    res.json({
                        succes: false,
                         msg: 'getDataWithFilter1 fonksiyonu başarısız oldu.',
                         
    
                    })
                }else{
                    res.status(200).json({
                        data:info
                    })
                }
              })
        }





    },





}

module.exports = functions