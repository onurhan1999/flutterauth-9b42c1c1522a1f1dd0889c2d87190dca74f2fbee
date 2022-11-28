const express = require('express')
const actions=require('../methods/actions')
const router = express.Router()

router.get('/', (req, res) => {
    res.send('Hello World')
})

router.get('/dashboard', (req, res) => {
    res.send('Dashboard')
})


router.post('/authenticate',actions.authenticate)

router.post('/adduser',actions.addNew)
router.post('/addAdvert',actions.addAdvert)

router.post('/deleteAdvert',actions.deleteAdvert)

router.get('/getinfo',actions.getinfo)


router.get('/getData',actions.getData)
router.get('/getDataWithFilter',actions.getDataWithFilter)

module.exports = router