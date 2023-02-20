const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const Posts = require('./Posts.js');
const urlDatabase = 'mongodb+srv://root:fera1020@cluster0.xlmnqqp.mongodb.net/news?retryWrites=true&w=majority';



app.use( bodyParser.json());
app.use(bodyParser.urlencoded({extended: true})); 

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use('/public', express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, '/pages'));


mongoose.connect(urlDatabase, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
    console.log('conectado com sucesso');
}).catch((err) => {
    console.log(err.message);
});

app.get('/', (req, res) => {
    
    if(req.query.busca == null){  
        Posts.find({}).sort({'_id': -1}).exec((err, posts) => {
            posts = posts.map((value) => {
                
                return {
                    
                    titulo: value.titulo,
                    imagem: value.imagem,
                    categoria: value.categoria,
                    conteudo: value.conteudo,
                    slug: value.slug,
                    descricaoCurta: value.conteudo.substring(0, 186),
                    tituloCurto: value.titulo.substring(0, 38),
                }
            })
            Posts.find({}).sort({'views': -1}).limit(3).exec((err,postsTop) => {
                postsTop = postsTop.map((value) => {
                    return {
                        titulo: value.titulo,
                        imagem: value.imagem,
                        categoria: value.categoria,
                        conteudo: value.conteudo,
                        slug: value.slug,
                        descricaoCurta: value.conteudo.substring(0, 100),
                        views: value.views,
                    }
                })
                res.render('home', {posts: posts, postsTop: postsTop}); 
            })          
        })   
    }else{ 
        Posts.find({titulo: {$regex: req.query.busca, $options: 'i'}}, (err,posts) => {
            posts = posts.map((value) => {
                return {
                    titulo: value.titulo,
                    imagem: value.imagem,
                    categoria: value.categoria,
                    conteudo: value.conteudo,
                    slug: value.slug,
                    descricaoCurta: value.conteudo.substring(0, 186),
                    views: value.views,
                }
            })
            res.render('busca', {posts: posts, count: posts.length});
            
        })
        
    } 
});




app.get('/:slug', (req, res)=>{
    Posts.findOneAndUpdate({slug: req.params.slug}, {$inc: {views: 1}}, {new: true}, (err, response) => {
        if(response != null) {
            Posts.find({}).sort({'views': -1}).limit(4).exec((err,postsTop) => {
                postsTop = postsTop.map((value) => {
                    return {
                        titulo: value.titulo,
                        imagem: value.imagem,
                        categoria: value.categoria,
                        conteudo: value.conteudo,
                        slug: value.slug,
                        descricaoCurta: value.conteudo.substring(0, 100),
                        views: value.views,
                    }
                })
                res.render('single', {noticia: response , postsTop: postsTop});
            }) 
        }else{
            res.render('404', {});
        }
        
    })
})



app.listen(5000, () => {
    console.log('server rodando!');
})