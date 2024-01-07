const { name } = require("ejs");
const fs = require("fs");
const path = require("path");

const productsFilePath = path.join(__dirname, "../data/productsDataBase.json");
const products = JSON.parse(fs.readFileSync(productsFilePath, "utf-8"));

const toThousand = (n) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
  // Root - Show all products
  index: (req, res) => {
    return res.render("products", {
      products,
      toThousand,
    });
  },

  // Detail - Detail from one product
  detail: (req, res) => {
    const product = products.find((product) => product.id === +req.params.id);
    return res.render("detail", {
      ...product,
      toThousand,
    });
  },

  // Create - Form to create
  create: (req, res) => {
    // Do the magic
    return res.render("product-create-form");
  },

  // Create -  Method to store
  store: (req, res) => {
    // Do the magic
    const lastID = products[products.length - 1].id; //para saber cual es el ultimo id

    const { name, price, discount, description, category } = req.body;

    const newProduct = {
      id: lastID + 1,
      name: name.trim(), //.trim() se usa para que no quede espacio a los lados.
      price: +price,
      discount: +discount,
      category: category,
      description: description.trim(),
      image: "default-image.png",
    };

	products.push(newProduct) //guardar nuevo array (producto)

	fs.writeFileSync(productsFilePath,JSON.stringify(products), "utf-8")  //strignificar el producto nuevo para q lo acepte el json

    return res.redirect('/products/detail/' + newProduct.id);
  },

  // Update - Form to edit
  edit: (req, res) => {
    // Do the magic
	const product = products.find((product) => product.id === +req.params.id);
	return res.render('product-edit-form',{
		...product
    
	})

  },
  // Update - Method to update
  update: (req, res) => {
    const { name, price, discount, description, category } = req.body;
    
    const productUpdated = products.map(product => {
      if(product.id === +req.params.id){
   
      product.name= name.trim(), //.trim() se usa para que no quede espacio a los lados.
      product.price= +price,
      product.discount= +discount,
      product.category= category,
      product.description= description.trim()
      }
    return product
})
    fs.writeFileSync(productsFilePath,JSON.stringify(productUpdated),"utf-8")  //strignificar el producto nuevo para q lo acepte el json

    return res.redirect('/products/detail/' + req.params.id);
  //  return res.send(req.body)
  },

  // Delete - Delete one product from DB
 destroy: (req, res) => {
    // Do the magic
    const {id} = req.params;
    // return res.send(id)

    const productoFiltrado = products.filter(producto => producto.id != id )

    fs.writeFileSync(productsFilePath,JSON.stringify(productoFiltrado),"utf-8")


    return res.redirect('/products')
  },
};

module.exports = controller;
