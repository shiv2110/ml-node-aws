const express = require('express');

const csv = require('csv-parser');

const fs = require('fs');

const app = express();

const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({extended : false});

app.set('view engine', 'ejs');

app.use('/assets', express.static('assets'));

let port = process.env.PORT || 3000;
app.listen(port, () =>{
    console.log('Now listenng to port 3000');
});

app.get('/', (req, res) =>{
    res.statusCode = 200;
    res.render('index', {qs : req.query});
    
    
});

app.post('/predict', urlencodedParser, (req, res) =>{
    console.log(req.body);
    let arr = [];
    let i = 0;
    fs.createReadStream('pairs.csv')
    .pipe(csv())
    .on('data', (row) => {
        arr[i] = row;
        i++;
        
    })
    .on('end', () => {
        console.log('CSV file successfully processed');
        let size = arr.length;
        let arr2 = [];
        let k = 0;
        for(let j=0; j<size; j++){
            if(arr[j]['Right Hand Side'] === req.body.item){
                arr2[k] = arr[j]['Left Hand Side'];
                k++;
            }
        }
        if(arr2.length === 1){
            res.render('home', {pred : 'Do you also want ' + arr2[0].toUpperCase() + '?'});
        }else if(arr2.length === 2){
            res.render('home', {pred : 'Do you also want ' + arr2[0].toUpperCase() + ' and ' + arr2[1].toUpperCase() + '?'});
        }
        
    });

});

