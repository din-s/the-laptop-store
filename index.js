const fs = require('fs')
const http = require('http')
const url = require('url')

const json = fs.readFileSync(`${__dirname}/data/data.json`,'utf-8')

const laptops = JSON.parse(json)
// console.log(laptops)

//create a http server 
const server = http.createServer((req,res)=>{
    const pathName = url.parse(req.url, true).pathname
    const id = url.parse(req.url,true).query.id

    //home page
    if(pathName === '/products' || pathName === '/'){
        res.writeHead(200,{'Content-type' :'text/html'})

        fs.readFile(`${__dirname}/templates/template-overview.html`,'utf-8',(err,data)=>{
            let overViewHtml = data
            let cardsHtml;
            fs.readFile(`${__dirname}/templates/template-cards.html`,'utf-8',(err,cardHtml)=>{
                cardsHtml = laptops.map((laptop)=>replaceHtml(cardHtml,laptop)).join()       
                overViewHtml = overViewHtml.replace('{%CARDS%}',cardsHtml) 
                // console.log(overViewHtml)
                res.end(overViewHtml)  

            })
        })
    }
    // individual laptop page
    else if( pathName === '/laptop' && id < laptops.length){
        // console.log(laptops[id])
        res.writeHead(200,{'Content-type' :'text/html'})
        fs.readFile(`${__dirname}/templates/template-laptop.html`,'utf-8',(err,html)=>{
            const laptop = laptops[id]
            const output = replaceHtml(html,laptop)            
            res.end(output)
        })
    }
    //images request
    else if ((/\.(jpg|jpeg|png|gif)$/).test(pathName)){

        fs.readFile(`${__dirname}/data/img/${pathName}`,(err,img)=>{
            res.writeHead(200,{'Content-type' : 'image/jpeg'})
            res.end(img)
        })

    }
    // error 404
    else{
        res.writeHead(404,{'Content-type' :'text/html'})
    res.end('The page you are trying to reach is not on the server')
    }
    
})

server.listen(3000,'127.0.0.1',()=>{
    console.log('listening')
})

const replaceHtml = (templateHtml,laptop)=>{
    let output = templateHtml.replace(/{%ID%}/g, laptop.id)
    output = output.replace(/{%PRODUCTNAME%}/g, laptop.productName)
    output = output.replace(/{%IMAGE%}/g, laptop.image)
    output = output.replace(/{%CPU%}/g, laptop.cpu)
    output = output.replace(/{%RAM%}/g, laptop.ram)
    output = output.replace(/{%STORAGE%}/g, laptop.storage)
    output = output.replace(/{%SCREEN%}/g, laptop.screen)
    output = output.replace(/{%PRICE%}/g, laptop.price)
    output = output.replace(/{%DESCRIPTION%}/g, laptop.description)

    return output
}