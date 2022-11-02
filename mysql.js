var mysql = require('mysql')

var conn = mysql.createConnection({
    host: 'localhost',
    user : 'root',
    password : 'choonsik',
    database : 'test' 
})

conn.connect();

function selectContents(callback){

    conn.query('select * from book',function(err,results,files){
        if(err){
            console.log(err)
        }
        console.log(results)
    })
    
}

module.exports = {
    selectContents
}
conn.end()