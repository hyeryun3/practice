var express = require('express')
var bodyParser = require('body-parser')
const mysql = require('mysql')
const dbconfig = require('./config/db_config.js')
const conn = mysql.createConnection(dbconfig)

var app = express()
app.locals.pretty = true
app.set('view engine','pug')
app.set('views','./views')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: false}))
// app.use(express.static('public')) // /public 입력할 필요없이 폴더에 접근 가능

app.get('/',function(req,res){

    
    var pageSize = req.query.pageSize
    var pageNo = req.query.pageNo
    if(pageSize == undefined || typeof pageSize == 'undefined' || pageSize == null){
        pageSize=10
    }else{
        pageSize=parseInt(pageSize)
    }

    if(pageNo == undefined || typeof pageNo == 'undefined' || pageNo == null){
        pageNo = 1
    }else{
        pageNo = parseInt(pageNo)
    }

    var startNo = (pageNo-1)*pageSize == 0 ? 1 : (pageNo-1)*pageSize+1
    
    conn.query('select * from book',function(err,results,files){
        if(err){
            console.log(err)
        }
        console.log(results)
        
        var totalCount = results.length
        var endNo = (pageNo * pageSize)-1 < totalCount ? (pageNo * pageSize) : totalCount
        var endPage = (totalCount % pageSize != 0 )? totalCount / pageSize + 1 : totalCount / pageSize
            
        res.render('index', {book:results,startNo:startNo,endNo:endNo,endPage:Math.floor(endPage),pageSize:pageSize}) 
            
    })
})

app.get('/one',function(req,res){
    res.send('one  입니다.')
})
app.post('/formOk',function(req,res){
    var title = req.body.title
    var contents = req.body.contents

    conn.query("insert into book(title,contents) values('"+title+"','"+ contents + "')",function(err,results,files){
        if(err){
            console.log(err)
        }
        console.log(results)
        res.redirect('/')
        // res.render('index', {book:results}) 
    })

})
app.get('/two',function(req,res){
    res.send('two 입니다.')
})

app.listen(3000,function(){
    console.log('Connected 3000 port!')
})