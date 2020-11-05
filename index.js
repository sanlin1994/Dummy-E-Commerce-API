const functions = require('firebase-functions');
const admin = require('firebase-admin')
const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors({origin: true}))

const serviceAccount = require("./ecommerce-api-a8da5-firebase-adminsdk-di7n3-ad19c47f19.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://ecommerce-api-a8da5.firebaseio.com"
  });
  
const db = admin.firestore();

app.get('/hello-world', (req, res) => {
    return res.status(200).send('Hello World!');
})


//Add products to the Firestore database
app.post('/products', (req,res) =>{
    (async () => {
        try {
        db.collection('products').doc('/'+req.body.ProductID+'/').create(req.body)
          return res.status(200).send();
        } catch (error) {
          console.log(error);
          return res.status(500).send(error);
        }
      })()
})


//Get all products from Firestore database
app.get('/products',(req,res) => {
    (async () => {
        try {
          let query = db.collection('products');
          let response = [];
          await query.get().then(querySnapshot => {
          let docs = querySnapshot.docs;
        
          // eslint-disable-next-line promise/always-return
          for (let doc of docs) {
              response.push(doc.data());
          }
          })
          return res.status(200).send(response);
        } catch (error) {
            console.log(error)
            return res.status(500).send(error)
        }
        })()
})


//Get single product from Firestore database
app.get('/products/:item_id',(req,res) =>{
    (
        async() => {
            try {
                const document = db.collection('products').doc(req.params.item_id);
                let item = await document.get();
                let response = item.data();
                return res.status(200).send(response);
            } catch (error) {
                return res.status(500).send(error)
            }
        }
    )()
})


//Get single product on Firestore database
app.put('/products/:item_id', (req, res) => {
    (async () => {
        try {
            const document = db.collection('products').doc(req.params.item_id);
            await document.update(req.body);
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
        })();
    });


//Delete single product from Firestore database
app.delete('/products/:item_id', (req, res) => {
    (async () => {
        try {
            const document = db.collection('products').doc(req.params.item_id);
            await document.delete();
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
        })();
    });


//req body object
// {
//     item: req.body.item
// }

exports.app = functions.https.onRequest(app);