const express = require('express')
const actions= require('../methods/actions')
const router = express.Router()

router.get('/', (req, res) => {
    res.send('Hello World')
})

router.get('/dashboard', (req, res) => {
    res.send('Dashboard')
})


router.post('/authenticate',actions.authenticate)
router.post('/adminAuthenticate',actions.adminAuthenticate)
router.post('/adminAddNew',actions.adminAddNew)


router.post('/adduser',actions.addNew)
router.post('/addAdvert',actions.addAdvert)

router.post('/deleteAdvert',actions.deleteAdvert)
router.post('/updateAdvertsFavField',actions.updateAdvertsFavField)

router.get('/getUserInfo',actions.getUserInfo)


router.get('/getData',actions.getData)
router.get('/getDataWithFilter',actions.getDataWithFilter)
router.post('/addFavAdvert',actions.addFavAdvert)

router.get('/getFavAdverts',actions.getFavAdverts)


router.get('/sendMessage',actions.sendMessage)
router.get('/getMessages',actions.getMessages)
router.get('/getMessageByUser',actions.getMessageByUser)


module.exports = router