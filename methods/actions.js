var User = require('../models/user')
var Admin = require('../models/admin')
const Advert = require("../models/advert");
const Message = require("../models/message");
var jwt = require('jwt-simple')
var config = require('../config/dbconfig')
const { authenticate } = require('passport')
var List = require("collections/list");
var ObjectId = require('mongodb').ObjectId;
var mongoose = require('mongoose');





var functions = {

   


   







    addUser: function (req, res) {
        User.findOne({
            mail: req.body.mail
        }, function (err, user) {
            var array = [];

            if (err) {
                throw err
            } else {
                if ((!req.body.name) || (!req.body.password) || (!req.body.mail)) {
                    res.json({ succes: false, msg: 'Boş alanları doldurun.' })
                } else {

                    var newUser = User({
                        name: req.body.name,
                        password: req.body.password,
                        mail: req.body.mail,
                        favList: array,
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


    adminAddNew: function (req, res) {
        Admin.findOne({
            mail: req.body.mail
        }, function (err, admin) {
            var array = [];

            if (err) {
                throw err
            } else {
                if ((!req.body.name) || (!req.body.password) || (!req.body.mail)) {
                    res.json({ succes: false, msg: 'Boş alanları doldurun.' })
                } else {

                    var newUser = Admin({
                        name: req.body.name,
                        password: req.body.password,
                        mail: req.body.mail,
                    });
                    if (admin) {
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
                        console.log('kullanısscı yok bu adla')

                    }
                }
            }
        })
    },


    adminAuthenticate: function (req, res) {
        Admin.findOne({
            mail: req.body.mail
        }, function (err, admin) {
            if (err) {
                throw err
            }
            if (admin) {
                admin.comparePassword(req.body.password, function (err, isMatch) {
                    if (isMatch && !err) {
                        var token = jwt.encode(admin, config.secret)
                        res.json({ succes: true, token: token, name: admin.name, })
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


    getUserInfo: function (req, res) {
        console.log(req.query.mail)

        User.findOne({
            mail: req.query.mail
        }, function (err, user) {
            if (err) {
                console.log("error")
                throw err
            }
            if (user) {
                console.log("user")
                console.log(user.favList)
                res.status(200).json({
                    name: user.name,
                    mail: user.mail,
                    favList: user.favList,
                    id: user.id
                })

            }
            else {
                res.status(403).send({ succes: false, msg: 'İşlem Başarısız.' })
            }
        }

        )
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
                numberOfRooms: req.body.numberOfRooms,
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

    updateAdvertsFavField: function (req, res) {
        connection = mongoose.connection;
        connection.collection("users").find({ $and: [{ favList: req.body.advertId }, { _id: ObjectId(req.body.userId) }] }).toArray(function (err, info) {

            if (err) {
                res.json({
                    succes: false,
                    msg: 'updateAdvertsFavField fonksiyonu başarısız oldu.',
                })
            } else {
                console.log("else içi")
                console.log(info)
                if (info.length == 0) {
                    // değer listede olmadığı için değeri listeye ekleyeceğiz burada
                    connection.collection("users").findOneAndUpdate({ _id: ObjectId(req.body.userId), }, { $push: { favList: req.body.advertId } }, { upsert: false }, function (err) {
                        if (!err) {
                            res.json({
                                succes: true, msg: 'Favori eklemesi başarılı.'
                            })
                        }
                        else {
                            res.json({
                                succes: false, msg: 'Favori eklemesi başarısız.'
                            })
                        }
                    });
                } else {
                    connection.collection("users").findOneAndUpdate({ _id: ObjectId(req.body.userId), }, { $pull: { favList: req.body.advertId } }, function (err) {
                        console.log("findoneandupdate için")

                        if (!err) {
                            res.json({
                                succes: true, msg: 'Favori silme başarılı.'
                            })
                        }
                        else {
                            res.json({
                                succes: false, msg: 'Favori silme başarısız.'
                            })
                        }
                    });
                }
            }
        })









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
                res.status(200).json({
                    data: info
                })
            }
        })
    },


    sendMessage: function (req, res) {
        if ((!req.body.from) || (!req.body.to) || (!req.body.message) || (!req.body.sendAt)) {

            res.json({ succes: false, msg: 'Enter all fields' })
        }
        else {
            var message = new Message({
                from: req.body.from,
                to: req.body.to,
                message: req.body.message,
                sendAt: req.body.sendAt,
            });
            message.save(function (err, message) {
                if (err) {
                    console.log(err)
                    res.json({
                        succes: false, msg: 'Mesaj gönderilemedi.'
                    })
                }
                else {
                    res.json({
                        succes: true, msg: 'Mesaj başarıyla eklendi.'
                    })
                }
            })
        }
    },


    getMessages: function (req, res) {
        connection = mongoose.connection;
        connection.collection("messages").find({
        }).toArray(function (err, info) {
            if (err) {
                res.json({
                    succes: false, msg: 'getData fonksiyonu başarısız oldu.'
                })
            } else {
                res.status(200).json({
                    data: info
                })
            }
        })
    },
    getMessageByUser: function (req, res) {
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








    getFavAdverts: function (req, res) {
        connection = mongoose.connection;
        console.log("getFavAdverts")
        var array = []
        var idArray = [];
        array = req.query.list;

        if (typeof array == "string") {
            idArray.push(ObjectId(array))
            connection.collection("adverts").find({ _id: { "$in": idArray }, }).toArray(function (err, info) {
                if (err) {
                    res.json({
                        success: false,
                        msg: 'getDataWithFilter1 fonksiyonu başarısız oldu.',
                    })
                } else {
                    console.log(info)
                    res.status(200).json({
                        success: true,
                        data: info
                    })
                }
            })
        } else if (typeof array == "undefined") {
            res.json({
                success: false,
                msg: 'Liste boş.',
            })
        } else {
            array.forEach(element => {
                idArray.push(ObjectId(element))
            });
            connection.collection("adverts").find({ _id: { "$in": idArray }, }).toArray(function (err, info) {

                if (err) {
                    res.json({
                        success: false,
                        msg: 'getDataWithFilter1 fonksiyonu başarısız oldu.',
                    })
                } else {
                    console.log(info)
                    res.status(200).json({
                        success: true,
                        data: info
                    })
                }
            })
        }






        //bir string listesi göndereceğim ve bu listeyi foreach ile dönüp her elemanını objarraye ekleyeceğiz ve bunu da aşağıdaki gibi aratacağız


    },




    getDataWithFilter: function (req, res) {
        console.log("getdatawithfilter")
        connection = mongoose.connection;
        if (req.query.province && req.query.district && req.query.numberOfRooms) {
            console.log("HEM İL HEM İLÇE HEM DE ODA SAYISI VARSA")
            //HEM İL HEM İLÇE HEM DE ODA SAYISI VARSA
            connection.collection("adverts").find({
                province: req.query.province,
                district: req.query.district,
                numberOfRooms: req.query.numberOfRooms,
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
        } else if (req.query.province && req.query.district && !req.query.numberOfRooms) {
            console.log("SADECE İL VE İLÇE VARSA ODA YOKSA")
            console.log(req.query.province)
            console.log(req.query.district)
            //SADECE İL VE İLÇE VARSA ODA YOKSA
            connection.collection("adverts").find({
                province: req.query.province,
                district: req.query.district,
            }).toArray(function (err, info) {
                if (err) {
                    res.json({
                        succes: false,
                        msg: 'getDataWithFilter1 fonksiyonu başarısız oldu.',
                    })
                } else {
                    res.status(200).json({
                        data: info
                    })
                }
            })
        } else if (req.query.province && !req.query.district && !req.query.numberOfRooms) {
            console.log("SADECE İL VARSA İLÇE VE ODA YOKSA")
            //SADECE İL VARSA İLÇE VE ODA YOKSA
            connection.collection("adverts").find({
                province: req.query.province,
            }).toArray(function (err, info) {
                if (err) {
                    res.json({
                        succes: false,
                        msg: 'getDataWithFilter1 fonksiyonu başarısız oldu.',
                    })
                } else {
                    res.status(200).json({
                        data: info
                    })
                }
            })
        }
        else if (req.query.province && !req.query.district && req.query.numberOfRooms) {
            console.log("SADECE İL VARSA VE ODA VARSA")
            //SADECE İL VARSA VE ODA VARSA
            connection.collection("adverts").find({
                province: req.query.province,
                numberOfRooms: req.query.numberOfRooms,
            }).toArray(function (err, info) {
                if (err) {
                    res.json({
                        succes: false,
                        msg: 'getDataWithFilter1 fonksiyonu başarısız oldu.',
                    })
                } else {
                    res.status(200).json({
                        data: info
                    })
                }
            })
        }
        else if (!req.query.province && !req.query.district && req.query.numberOfRooms) {
            console.log("İL VE İLçE YOK SADECE ODA VAR")

            //İL VE İLçE YOK SADECE ODA VAR
            connection.collection("adverts").find({
                numberOfRooms: req.query.numberOfRooms,
            }).toArray(function (err, info) {
                if (err) {
                    res.json({
                        succes: false,
                        msg: 'getDataWithFilter1 fonksiyonu başarısız oldu.',


                    })
                } else {
                    res.status(200).json({
                        data: info
                    })
                }
            })

        } else {
            console.log("HİÇBİRİ YOKSA BÜTÜN DATALARI GÖNDERİR")

            //HİÇBİRİ YOKSA BÜTÜN DATALARI GÖNDERİR
            connection.collection("adverts").find({}).toArray(function (err, info) {
                if (err) {
                    res.json({
                        succes: false,
                        msg: 'getDataWithFilter1 fonksiyonu başarısız oldu.',


                    })
                } else {
                    res.status(200).json({
                        data: info
                    })
                }
            })
        }
    },



    



    
    

}

module.exports = functions