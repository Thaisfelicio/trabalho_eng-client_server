//exportações
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const User = require('./models/User');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());

//acessar a pagina atraves do link http://localhost:3001/
//para rodar o servidor, abrir um terminal e digitar npm run dev



app.get("/", function(req, res){
  app.use(express.static(__dirname + '/styles'))
  app.use('/styles', express.static('styles'))

  app.use(express.static(__dirname + '/images'))
  app.use('/images', express.static('images'))

  app.use(express.static(__dirname + '/pages'))
  app.use('/pages', express.static('pages'))

  res.sendFile(__dirname + "/pages/cadastro.html");

  
    //res.status(200).json({msg: 'welcome to this api'});
})

mongoose.connect("mongodb+srv://ThaisFelicio:fjmaXzX3zqpUjEze@dadoscurriculo.otgkmeg.mongodb.net/Users", {useNewUrlParser: true}, {useUnifiedTopology: true}).then(() =>{
    app.listen(3001)
    console.log("database connected");
    
}).catch((erro) => console.log(erro))

app.get('/user/:id', async(req, res)=>{
  const id = req.params.id

  //checar se o usuario existe
  const user = await User.findById(id, '-senha')

  if(!user){
    return res.status(404).json({msg: 'Usuário não encontrado'})
  }
  res.status(200).json({ user })
})

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ CADASTRO +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++//
app.post("/", async(req, res) =>{
  
    //const {email, senha, confirmarSenha} = req.body;
    const email = req.body.email;
    const senha = req.body.senha;
    const confirmarSenha = req.body.confirmarSenha;

    function checkEmail(email) {
        return /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/.test(email);
      }

      if(!checkEmail(email)){
        return res.status(422).json({msg: 'email inválido'});
      }
      else if(!email){
        return res.status(422).json({msg: 'o email é obrigatório'});
      }
      if(!senha){
        return res.status(422).json({msg: 'a senha é obrigatória'});
      }

      if(senha !== confirmarSenha){
        return res.status(422).json({msg: 'As senhas não conferem'});
      }

      //checar se o usuario existe
      const userExists = await User.findOne({ Email: email});

       if(userExists){
         return res.status(422).json({msg: 'Por favor, utilize outro email'});
       }
      //cria o usuario
      const newUser = new User({
                Email: req.body.email,
                Senha: req.body.senha,
            });

      try{
        await newUser.save();
        //return res.status(201).json({msg: 'Usuário cadastrado com sucesso!'});
        return res.sendFile(__dirname + '/pages/login.html')
      }catch(error){
        console.log(error)
        return res.status(500).json({msg: 'Aconteceu um erro no servidor, tente mais tarde'});
      }      
})

//+++++++++++++++++++++++++++++++++++++++++++++++++++ LOGIN +++++++++++++++++++++++++++++++++++++++++++++++++++++++++//

// app.post("/", async (req, res) =>{
//   //const {email, senha} = req.body;
  

//   const email = req.body.Email;
//   const senha = req.body.Senha;

//   //validações
//   if(!email){
//     return res.status(422).json({msg: 'o email é obrigatório'});
//   }
//   if(!senha){
//     return res.status(422).json({msg: 'a senha é obrigatória'});
//   }

//   //checar se o usuario existe
//   const newUser = await User.findOne({ email: email});

//       if(!newUser){
//         return res.status(404).json({msg: 'Por favor, utilize outro email'});
//       }

//   //checar se as senhas conferem
//   const checkSenha = await compare(senha, newUser.senha)
//   if(!checkSenha){
//     return res.status(422).json({msg: 'Senha inválida!'})
//   }

//   try {

//     return res.status(201).json({msg: 'Usuário existe!'});

//   } catch (err) {
//     console.log(err)
//     res.status(500).json({msg: 'Aconteceu um erro no servidor, tente novamente mais tarde!'})
//   }
// })








