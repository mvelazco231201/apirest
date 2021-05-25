let Invproducts=[];
let products=new Map();
let total;

const btnGetProducts = document.getElementById('btnGetProducts');
btnGetProducts.addEventListener('click' , () =>{ //el fetch es a donde va a consultar la parte del back cuando se haga clic en dicho botón
    //llamada a nuestra api, directamente el get para la consulta necesaria
    products.clear();
    fetch('http://localhost:1339/api/product')//dentro se le pone el endpoint con el cual se va a trabajar
    .then(res =>res.json()) // este then trae los datos y se convierten a JSON
    .catch(error => console.log(error))
    .then(json=>{//{ .then(json=>console.log(JSON))  } si pusieramos JSON en mayus, nos estaríamos refiriendo al obj de js
        //console.log(json)
        //formar una cadena con todos los elementos existentes en el select con la información que me llega en la petición de refrescar
        let cadena = ''
        json.forEach(producto => {
            cadena+= `<option value = "${producto.id}">${producto.name} $ ${producto.cost}</option>`
            products.set(producto.id,producto)//haciendo uso de map inserta el producto
        })
        document.getElementById('mnuproducts').innerHTML = cadena; /* la razón por la cual es preferible agregar todos los productos al final es que 
         tocar los elementos del DOM lo vuelve un proceso tardado y ahí se pueden optimizar tiempos*/
    }) //este then es para el resultado
});
//agregar producto
const btnadd= document.getElementById('btnAdd');
btnadd.addEventListener('click', ()=>{
    let name, quantity, cost;
    //recuperamos cajas de texto
    name=document.getElementById('txtname').value;
    quantity=document.getElementById('txtquantity').value;
    cost=document.getElementById('txtcost').value;
    //asociamos los valores con los atributos creamos un json
    var data={name:name, quantity:quantity, cost:cost};
    fetch('http://localhost:1339/api/product', {
        method: 'POST',
        body:JSON.stringify(data),
        headers:{
            'Content-Type':'application/json'
        }
    })
    .then(res=>res.json())
    .catch(error=>console.log(error))
    .then(json=>console.log(json))
});
//incluir factura
const btnAdd2Invoice = document.getElementById('btnAdd2Invoice');
btnAdd2Invoice.addEventListener('click', () =>{
    let menu=document.getElementById('mnuproducts').value;//obtenemos id de producto
    //console.log(menu);
    let quantity=document.getElementById('txtinvquantity').value;
    let costo = products.get(parseInt(menu)).cost;
    total += costo*quantity;
    let record={id:menu, quantity:quantity, cost:costo}
    Invproducts.push(record);
    document.getElementById('detalleFactura').innerHTML +=
    `<p> Cantidad: ${record.quantity} Costo: $ ${record.cost} <p>`
});
//guardar factura
const btnSaveInvoice = document.getElementById('btnSaveInvoice');
btnSaveInvoice.addEventListener('click', ()=>{

    let rfc=document.getElementById('txtRFC').value;
    let data= {rfc:rfc,total:total,tax:total*0.16,detalles:Invproducts}
    console.log(data);
    fetch('http://localhost:1339/api/product', {
        method: 'POST',
        body:JSON.stringify(data),
        headers:{
            'Content-Type':'application/json'
        }
    })
    .then(res=>res.json())
    .catch(error=>console.log(error))
    .then(json=>console.log(json))
});

//hacer foreach con map