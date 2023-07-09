class Product {
    constructor(title, description, price, thumbnail, code, stock, id) {
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
        this.id=id;
    }
    static id=0;
};

    

class ProductManager {
    #products;
    #productDirPath;
    #productFilePath;
    #fileSystem;

    constructor() {
        this.#products = new Array();
        this.#productDirPath = "./files";
        this.#productFilePath = this.#productDirPath + "/Products.json";
        this.#fileSystem = require("fs");
    }


    // METODOS con persistencia en archivo.json
    // Crear producto
    createProduct = async (title, description, price, thumbnail, code, stock, id) => {
        let sumador=0;
        for (let i=0; i < this.#products.length; i++)
        {
            if (this.#products[i].code === code){
                console.log(`El codigo ${code} esta repetido`);
                sumador++;
                break;
            }      
        }
        if (sumador === 0 && id == 0){
            Product.id++;
            let newProduct = new Product(title, description, price, thumbnail, code, stock,id=Product.id);
            console.log("Crear Producto: producto a registrar:");
            console.log(newProduct);

            try {
                //Creamos el directorio
                await this.#fileSystem.promises.mkdir(this.#productDirPath, { recursive: true });

                //Validamos que exista ya el archivo con usuarios sino se crea vacío para ingresar nuevos:
                if (!this.#fileSystem.existsSync(this.#productFilePath)) {
                    //Se crea el archivo vacio.
                    await this.#fileSystem.promises.writeFile(this.#productFilePath, "[]");
                }

                //leemos el archivo
                let productsFile = await this.#fileSystem.promises.readFile(this.#productFilePath, "utf-8"); // []

                //Cargamos los productos encontrados para agregar el nuevo:
                //Obtenemos el JSON String 
                console.info("Archivo JSON obtenido desde archivo: ");
                console.log(productsFile);
                this.#products = JSON.parse(productsFile);

                console.log("Productos encontrados: ");
                console.log(this.#products);
                this.#products.push(newProduct);
                console.log("Lista actualizada de productos: ");
                console.log(this.#products);

                //Se sobreescribe el archivos de productos para persistencia.
                await this.#fileSystem.promises.writeFile(this.#productFilePath, JSON.stringify(this.#products, null, 2, '\t'));
            } catch (error) {
                console.error(`Error creando producto nuevo: ${JSON.stringify(newProduct)}, detalle del error: ${error}`);
                throw Error(`Error creando producto nuevo: ${JSON.stringify(newProduct)}, detalle del error: ${error}`);
            }
        }
        else if (sumador === 0 && id !== 0)
        {
            let newProduct = new Product(title, description, price, thumbnail, code, stock,id);
            console.log("Crear Producto: producto a registrar:");
            console.log(newProduct);

            try {
                //leemos el archivo
                let productsFile = await this.#fileSystem.promises.readFile(this.#productFilePath, "utf-8"); // []

                //Cargamos los productos encontrados para agregar el nuevo:
                //Obtenemos el JSON String 
                console.info("Archivo JSON obtenido desde archivo: ");
                console.log(productsFile);
                this.#products = JSON.parse(productsFile);

                console.log("Productos encontrados: ");
                console.log(this.#products);
                this.#products.push(newProduct);
                console.log("Lista actualizada de productos: ");
                console.log(this.#products);

                //Se sobreescribe el archivos de productos para persistencia.
                await this.#fileSystem.promises.writeFile(this.#productFilePath, JSON.stringify(this.#products, null, 2, '\t'));
            } catch (error) {
                console.error(`Error creando producto nuevo: ${JSON.stringify(newProduct)}, detalle del error: ${error}`);
                throw Error(`Error creando producto nuevo: ${JSON.stringify(newProduct)}, detalle del error: ${error}`);
            }
        }
    }
    // Leer productos 
    productList = async () => {
        try {

            //Creamos el directorio
            await this.#fileSystem.promises.mkdir(this.#productDirPath, { recursive: true });

            //Validamos que exista ya el archivo con productos si no se crea vacío para ingresar nuevos:
            if (!this.#fileSystem.existsSync(this.#productFilePath)) {
                //Se crea el archivo vacio.
                await this.#fileSystem.promises.writeFile(this.#productFilePath, "[]");
            }

            //leemos el archivo
            let productsFile = await this.#fileSystem.promises.readFile(this.#productFilePath, "utf-8");


            //Obtenemos el JSON String 
            console.info("Archivo JSON obtenido desde archivo: ");
            console.log(productsFile);
            this.#products = JSON.parse(productsFile);
            console.log("Productos encontrados: ");
            console.log(this.#products);
            return this.#products;

        } catch (error) {
            console.error(`Error consultando los productos por archivo, valide el archivo: ${this.#productDirPath}, 
                detalle del error: ${error}`);
            throw Error(`Error consultando los productos por archivo, valide el archivo: ${this.#productDirPath},
             detalle del error: ${error}`);
        }
    }

    //Leer productos por ID
    getProductsbyID = async (id) => {
        if(!this.#products.find((prod)=> prod.id === id)){
            console.log("NOT FOUND");
        }
        else
        {
            console.log("Objeto obtenido por ID = ");
            console.log(this.#products.find((prod)=> prod.id === id));
        }
    }

    // elimino un producto a traves de un id

    deleteProduct = async (id) => {
        const index = this.#products.findIndex(prod => prod.id === id);
        console.log(`Producto proximo a ser eliminado: ${this.#products[index].title} ID numero: ${this.#products[index].id}`);
        this.#products.splice(index, 1);
        await this.#fileSystem.promises.writeFile(this.#productFilePath, JSON.stringify(this.#products, null, 2, '\t'));
        console.log("Lista actualizada de productos desde el programa: ");
        console.log(this.#products);
        console.log("Lista actualizada de productos desde el archivo: ");
        let productsFile = await this.#fileSystem.promises.readFile(this.#productFilePath, "utf-8");
        console.log(productsFile);
        console.log("Producto eliminado correctamente");
    }
   



    //Actualizar un producto pidiendo su informacion

    async updateProduct (title, description, price, thumbnail, code, stock,id){ 
        const index = this.#products.findIndex(obj => obj.id === id);
        console.log(`Producto proximo a ser Updateado: ${this.#products[index].title} description: ${this.#products[index].description}`);
        console.log(`Reemplazado por:${title} description: ${description}`);
        await this.deleteProduct(id);
        await this.createProduct(title,description,price,thumbnail,code,stock,id);
    }
    
    
}

module.exports = ProductManager;


