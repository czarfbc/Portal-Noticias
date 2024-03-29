const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const fileupload = require('express-fileupload')

const app = express();
const Posts = require('./Posts.js');
const urlDatabase = require('./urlDatabase.js');

var session = require('express-session')



app.use( bodyParser.json());
app.use(bodyParser.urlencoded({extended: true})); 

app.use(fileupload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, 'temp')
}));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use('/public', express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, '/pages'));

app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}));

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
                    descricaoCurta: value.conteudo.substring(0, 350),
                    views: value.views,
                }
            })
            Posts.find({categoria: {$regex: req.query.busca, $options: 'i'}}, (err,postsCategoria) => {
                postsCategoria = postsCategoria.map((value) => {
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
                res.render('busca', {posts: posts, postsCategoria: postsCategoria, countTotal: posts.length + postsCategoria.length}); 
            }).sort({'_id': -1});
            // res.render('busca', {posts: posts, count: posts.length});         
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


var users = [{
    user: 'czar',
    password: '1234',
}];

app.post('/admin/login', (req, res) => {
    users.map((value) => {
        if(value.user == req.body.login && value.password == req.body.senha) {
            req.session.login = 'czar';
        }
    })
    res.redirect('/admin/login')
})

app.post('/admin/cadastro', (req, res) => {

    let format = req.files.arquivo.name.split('.');
    let image = '';

    if(format[format.length - 1] == 'jpg' || format[format.length - 1] == 'png') {
        image = `${new Date().getTime()+req.files.arquivo.name}`;
        req.files.arquivo.mv(`${__dirname}/public/images/${image}`)
    }else {
        fs.unlinkSync(req.files.arquivo.tempFilePath);
    }

    Posts.create({
        titulo: req.body.titulo_noticia,
        imagem: `http://localhost:5000/public/images/${image}`,
        categoria: req.body.categoria_noticia,
        conteudo: req.body.noticia,
        slug: req.body.slug_cadastro_noticia,
        autor: req.body.autor_noticia,
        views: 0,
    })
    
    res.redirect('back')
})

app.get('/admin/deletar/:id', (req, res) => {
    Posts.deleteOne({_id:req.params.id}).then(() => {
        res.redirect('/admin/login')
    });
})


app.get('/admin/login', (req, res) => {
    if(req.session.login == null) {
        res.render('admin-login');
    }else{
        Posts.find({}).sort({'_id': -1}).exec(function(err,posts){
            posts = posts.map(function(val){
                return {
                    id: val._id,
                    titulo: val.titulo,
                    conteudo: val.conteudo,
                    descricaoCurta: val.conteudo.substr(0,100),
                    imagem: val.imagem,
                    slug: val.slug,
                    categoria: val.categoria,
                }
            })
            res.render('admin-painel',{posts:posts});
        })
    }
})




app.listen(5000, () => {
    console.log('server rodando!');
})