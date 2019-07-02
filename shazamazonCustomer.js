var mysql = require("mysql");
require('dotenv').config();
const {table} = require('table');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: process.env.DB_PASSWORD,
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
});

function listInventory() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    console.log(res);
  })
  connection.end();
}

function logPurchase(prod, quant) {

  connection.query("SELECT * FROM products WHERE item_id="+ prod, function(err, res) {
    if (err) throw err;
 
    let purchasePrice = res[0].price * quant;
    console.log(`thank you for your $ ${purchasePrice} purchase of ${res[0].product_name}`)
    // listInventory();
    // return res;
  })
}

function updateInventory(prod, quant, numOrdered) {

  var query = connection.query(
    "UPDATE products SET ? WHERE ?",
    [
      {
        stock_quantity: quant
      },
      {
        item_id: prod
      }
    ],
    function(err, res) {
      if (err) throw err;
      logPurchase(prod, numOrdered);
      
      // var purchasTotal = quant * updatedProduct.price;
      // console.log(res);
      console.log(res.affectedRows + " products updated!\n");
      // console.log(`thank you for your purchase: $ ${purchasTotal}`)
      // listInventory();

    }
  );

  // logs the actual query being run
  console.log(query.sql);
  
}

function checkInventory(product, quantity) {

  
  connection.query("SELECT * FROM products WHERE item_id="+product, function(err, res) {
    if (err) throw err;
    let newQuantity;

    if(Number(quantity) > Number(res[0].stock_quantity)) {
      console.log('Insufficient Quantity');
      setTimeout(function (){
        renderCustomerProducts(askWhichProduct);
      }, 2000);
    } else {
      newQuantity = Number(res[0].stock_quantity) - quantity;
   
      updateInventory(product, newQuantity, quantity);
    }

  })
  
}


function renderCustomerProducts(cb) {

  console.log('render-products-wascalled');
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
  
    let data =[];
    let output, dataRow;
    
    let tableHead = `ID, PRODUCT NAME, PRICE ($)`;
    let tableHeadArr = tableHead.split(",");
    data.push(tableHeadArr);
        // for(i=0; i<)
        for(i=0; i<res.length; i++) {
  
          dataRow=`${res[i].item_id}, ${res[i].product_name}, ${res[i].price}`;
  
          var dataRowArr = dataRow.split(",");
          data.push(dataRowArr);
        }
  
    config = {
      columns: {
        0: {
          alignment: 'center',
          width: 2
        },
        1: {
          alignment: 'center',
          width: 25
        },
        2: {
          alignment: 'center',
          width: 20
        }
      }
    };
    
    output = table(data, config);
    console.log(output);
  
   
    cb();
  });
  
}

let customerProduct, customerQuantity;


function askWhichProduct() {
  console.log('prompt user was called');
  inquirer.prompt([
    {
      type: "input",
      name: "product_id",
      message: "please input the PRODUCT ID for the Product you would like to buy"
    },
    {
      type: "input",
      name: "quantity",
      message: "how many would you like to buy?"
    }
  ]).then(function(res) {
    customerProduct = res.product_id;
    customerQuantity = res.quantity;
    console.log(customerProduct, customerQuantity);
    checkInventory(customerProduct, customerQuantity);
    
  })
}

renderCustomerProducts(askWhichProduct);
