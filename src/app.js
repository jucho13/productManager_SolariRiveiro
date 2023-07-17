const express = require('express');
const ProductManager = require('C:/Users/julia/OneDrive/Documentos/programacion/CODERHOUSE/backEndProyecto/productManager_SolariRiveiro/productManager.js');
const pProduct = require('C:/Users/julia/OneDrive/Documentos/programacion/CODERHOUSE/backEndProyecto/productManager_SolariRiveiro/index.js');
const pManager= new ProductManager();

// declaramos express
const app = express();
const PORT = 8090;


// Middleware para poder usar los req.query
app.use(express.urlencoded({ extended: true }));


app.get('/products', async (req, res) => {
    
    const { limit } = req.query;
    const all_products = await pManager.productList();
    const limit_element = parseInt(limit);

    if (!isNaN(limit_element) && limit_element > 0) {
        const limit_products = all_products.slice(0, limit_element);
        return res.send(
            JSON.stringify(limit_products)
        );
    }

    return res.send(
        JSON.stringify(all_products)
    );
});


app.get('/products/:pid', async (req, res) => {

    let { pid } = req.params;
    const id = parseInt(pid);

    if (!isNaN(id) && id > 0) {
        let producto_by_id = await pManager.getProductsbyID(id);
        return res.send(
            JSON.stringify(producto_by_id)
        );
    }



    return res.send(
        JSON.stringify({
            "message": "El parametro ID debe ser entero positivo."
        })
    );
});


app.listen (PORT, ()=> {
    console.log(`Server run on port: ${PORT}`);
    pProduct();
})

