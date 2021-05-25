let mysql=require('../../db/mysql');
let invoice=require('../models/invoice');
module.exports = {

   create:(req,res)=>{
      //{date, total, amount, products[id_product, quantity, cost]}
      console.log(req.body);
      //console.log(req.body.productos);
      //console.log(req.body.productos[2].nombre);
      let rfc=req.body.rfc;
      let total=req.body.total;
      let tax=req.body.tax;
      let productos=req.body.detalles;
      let mensaje = {};

//    TRANSACCIONES CON ROLLBACK
      mysql.beginTransaction((error)=> {
   if(error){
      res.json(error);
   }
   else{
      mysql.query('insert into invoice (date,payment,tax,customer_rfc) values(?,?,?,?)',
      ['2021/05/11',total,tax,rfc],(err,rows,fields)=>{
         if(err){
            mysql.rollback((err)=>{ //realiza rollback (detiene y borra toda modificacion)
               res.json(err);
            })
         }
         else{
         console.log('Se insertó el ',rows.insertId)
         productos.forEach(element => {
            mysql.query('insert into invoice_details (invoice_id, product_id, quantity, cost) values(?,?,?,?)'
            ,[rows.insertId,element.id,element.quantity,element.cost], (err,rows,fields)=>{
               if(err){
                  mysql.rollback((err)=>{
               res.json(err);
            })
         }else{
            mensaje= {status:'ok',mensaje:'Se inserto la factura',folio:rows.insertId}
            mysql.commit((err)=>{ //al termino se realiza un commit para guardar todos los cambios
               if(err){
                  res.json(err)
               }
               else{
                  res.json(mensaje)
               }
            });
            }
         });
        });
       }
      });
      }
   })



      /*
      let mensaje = {};
      mysql.query('insert into invoice (date,payment,tax,customer_rfc) values(?,?,?,?)',
      ['2021/05/11',total,tax,rfc],(err,rows,fields)=>{
         if(!err){
         console.log('Se insertó el ',rows.insertId)*/
      /*la parte del foreach, se puede interpretar con un for de la siquiente manera:
      let values='' //declaramos una variable la cual guardará cada registro 
      for(let i=0; i<productos.lenght; i++){ recorre el vector y se extraen los valores
         values += `(${rows.insertId}, ${productos[i].id}, ${productos[i].quantity}, ${productos[i].cost})`
         if(i!=productos.lenght-1)
            values += ','; //cada que se termina de "leer" el registro se agrega coma para leer el siguiente
      }
      //posterior se puede agragar a invoice_details
      mysql.query('insert into invoice_details (invoice_id, product_id, quantity, cost) values' + values
      ,(err,rows,fields)=>{
         if(err)
               console.log(err);
      })
       mensaje={status:'ok',mensaje:'Se inserto la factura',folio:rows.insertId};
       res.json(mensaje)
   }
   else
      console.log(err)
   })
*/


/*REALIZANDO TRANSACCIONES CON FUNCIONES ROLLBACK*/
//http://www.codediesel.com/nodejs/mysql-transactions-in-nodejs/
//https://levelup.gitconnected.com/node-js-mysql-transaction-5713b33c53e8
//todo el query se encierra en la funcion begintransaction la cual ya viene en la libreria de mysql
/*mysql.beginTransaction((error)=> {
   if(error){
      res.json(error);
   }
   else{
      mysql.query('insert into invoice (date,payment,tax,customer_rfc) values(?,?,?,?)',
      ['2021/05/11',total,tax,rfc],(err,rows,fields)=>{
         if(err){ //si esiste un error
            mysql.rollback((err)=>{ //realiza rollback (detiene y borra toda modificacion)
               res.json(err);
            })
         }
         else{ //de lo contrario se comienza a insertar el registro
            console.log('Se insertó el ',rows.insertId)
      /*la parte del foreach, se puede interpretar con un for de la siquiente manera:*/
           /* let values='' //declaramos una variable la cual guardará cada registro 
            for(let i=0; i<productos.lenght; i++){ //recorre el vector y se extraen los valores
                   values += `(${rows.insertId}, ${productos[i].id}, ${productos[i].quantity}, ${productos[i].cost})`
            if(i!=productos.lenght-1)
                   values += ','; //cada que se termina de "leer" el registro se agrega coma para leer el siguiente
       }
          //  console.log(values);
      mysql.query('insert into invoice_details (invoice_id, product_id, quantity, cost) values' + values
      ,(err,rows,fields)=>{
         if(err){
            mysql.rollback((err)=>{
               res.json(err);
            })
         }else{
            mensaje={status:'ok',mensaje:'Se inserto la factura',folio:rows.insertId};
            mysql.commit((err)=>{ //al termino se realiza un commit para guardar todos los cambios
               if(err){
                  res.json(err)
               }
               else{
                  res.json(mensaje)
               }
            })
           }
         });
        }
   }
) }
   });*/


          
   

      //console.log(JSON.parse(req.body));
      //JSON.parse(req.body.products).forEach(element => {
      //res.json({texto:'mensaje'});
      /*mysql.query('insert into order SET ?',req.body,(err,rows,fields)=>{
         if(!err)
            res.json(rows);
         else
            res.json(err);
      })*/
  },

   

   list:(req,res)=>{
      mysql.query('select * from order',(err,rows,fields)=>{
         if (!err)
            res.json(rows);
         else
            res.json(err);
      })
   },
   find:(req,res)=>{
      mysql.query('select * from order o inner join order_details d on o.id=d.order_id where o.id=?',req.params.id,(err,rows,fields)=>{
         if (!err)
            res.json(rows);
         else
            res.json(err);
      })
   }
}
