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

    var pageCount = req.query.pageCount
    var pageNo = req.query.pageNo
    if(pageCount == undefined || typeof pageCount == 'undefined' || pageCount == null){
        pageCount=10
    }else{
        pageCount=parseInt(pageCount)
    }

    if(pageNo == undefined || typeof pageNo == 'undefined' || pageNo == null){
        pageNo = 1
    }else{
        pageNo = parseInt(pageNo)
    }

    var startNo = (pageNo-1)*pageCount == 0 ? 1 : (pageNo-1)*pageCount+1
    var totalCount
    conn.query('select count(*) as count from book',function(err,results){
        if(err){
            console.log(err)
        }
        totalCount = results[0].count
    })
    
    conn.query('select * from book order by id DESC limit ' + pageCount + ' offset ' +  (startNo-1),function(err,results){
        if(err){
            console.log(err)
        }
        var endNo = (pageNo * pageCount)-1 < totalCount ? (pageNo * pageCount) : totalCount
        var endPage = (totalCount % pageCount != 0 )? totalCount / pageCount + 1 : totalCount / pageCount
        var counts = results.length

        console.log(results)
        console.log('totalCount', totalCount)
        console.log('startNo', startNo)
        console.log('endNo', endNo)
        console.log('pageNo', pageNo)
        console.log('endPage', endPage)
        res.render('index', {book:results,endPage:Math.floor(endPage),pageNo:pageNo,counts:counts,pageCount:pageCount,totalCount:totalCount}) 
    })
})

app.get('/delete/:idx',function(req,res){
    console.log(req.params.idx)

    conn.query('delete from book where id='+req.params.idx, function(err,results,files){
        if(err){
            console.log(err)
        }
        console.log(results)
        res.redirect('/')
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