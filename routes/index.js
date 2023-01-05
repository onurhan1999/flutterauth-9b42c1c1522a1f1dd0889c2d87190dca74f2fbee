const express = require('express')
const actions= require('../methods/actions')
const router = express.Router()





router.get('/', (req, res) => {
    res.send('Hello World')
})

router.get('/dashboard', (req, res) => {
    res.send('Dashboard')
})

//Admin işlemlerinin yapıldığı metodlar
router.post('/adminAuthenticate',actions.adminAuthenticate)
router.post('/adminAddNew',actions.adminAddNew)

//Kullanıcı işlemlerinin yapıldığı metodlar
router.post('/adduser',actions.addUser)
router.post('/authenticate',actions.authenticate)
router.get('/getUserInfo',actions.getUserInfo)

//İlan işlemlerinin yapıldığı metodlar
router.post('/addAdvert',actions.addAdvert)
router.post('/deleteAdvert',actions.deleteAdvert)
router.get('/getData',actions.getData)
router.get('/getDataWithFilter',actions.getDataWithFilter)
router.post('/updateAdvertsFavField',actions.updateAdvertsFavField)
router.get('/getFavAdverts',actions.getFavAdverts)



router.get('/sendMessage',actions.sendMessage)
router.get('/getMessages',actions.getMessages)
router.get('/getMessageByUser',actions.getMessageByUser)



module.exports = router