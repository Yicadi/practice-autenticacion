const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
require('dotenv').config();

const port = process.env.PORT;
const FirmaJWT = process.env.FIRMA_JWT;


//MIDDLEWARE
app.use(express.json());

// USUARIOS PREDEFINIDOS
const users = [
   { id: 1, username: 'user1', password: 'password1' },
   { id: 2, username: 'user2', password: 'password2' },
];

// RUTA LOGIN
app.post('/login', (req, res) => {
   const { username, password } = req.body;
   //ENCONTRAR USUARIO
   const user = users.find((u) => u.username === username);

   // NO ENCUENTRA AL USUARIO
   if (!user) {
      return res.status(401).json({ error: 'nombre de usuario o contraseña invalido' })
   }
   // CREAR JWT TOKEN
   const token = jwt.sign({ id: user.id }, process.env.FIRMA_JWT, {
      expiresIn: '1h',
   });

   //RETORNO TOKEN
   res.json({ token });
});

//PROTECCION DE RUTA
app.get('/protected', (req, res) => {
   //OBTENER TOKEN ENCABEZADO
   const token = req.headers.authorization;
   console.log(token)
   //SI NO ENCUENTRA EL TOKEN 
   if (!token) {
      return res.status(401).json({ error: 'token no encontrado' });
   }

   //VERIFICAR TOKEN
   console.log(process.env.FIRMA_JWT)
   jwt.verify(token, process.env.FIRMA_JWT, (err, decoded) => {
      if (err) {
         return res.status(401).json({ error: err });
      }
   });
   // SI ES VALIDO EL TOKEN, RETORNE
   res.json({ message: 'se accedio exitosamente a la ruta' });
});



app.listen(port, () => {
   console.log('el servidor inicio en el puerto 3000');
});

