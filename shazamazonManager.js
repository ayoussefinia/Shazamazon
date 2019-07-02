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
  managerActionToPerform();
});

function managerActionToPerform() {

  inquirer.prompt([
    {
      type: "list",
      name: "managerAction",
      message: "Which Action Would You Like To Perform",
      choices: ["view products for sale", "view low inventory", "add to inventory", "add new product"]
    }
  ]).then(function(res) {
    managerAction = res.managerAction;
    if(managerAction == 'view products for sale') {
      renderProductsForSale();
    } else if(managerAction == 'view low inventory') {
      console.log('query sql db for low enventory')
      renderLowInventoryProducts();
    } else if(managerAction == 'add to inventory') {
      addInventoryItem();
    } else if(managerAction == 'add new product') {
      addNewProduct();
    }
    // connection.end();
  })
}

function addNewProduct() {
  inquirer.prompt([
    {
      type: "input",
      name: "itemName",
      message: "What is the Name of the item you will create",
    },
    {
      type: "input",
      name: "departmentName",
      message: "which department will this item be a part of",
    },
    {
      type: "input",
      name: "price",
      message: "what is the price of this prduct in dollars and cents",
    },
    {
      type: "input",
      name: "quantity",
      message: "what  quantity of the product will you add to stock",
    }
  ]).then(function(res) {
    let itemName =  res.itemName;
    let departmentName = res.departmentName;
    let price = res.price;
    let quantity = res.quantity;
    connection.query(
      "INSERT INTO products SET ?",
      {
        product_name: itemName,
        department_name: departmentName,
        price: price,
        stock_quantity: quantity
      },
      function(err, res) {
        if (err) throw err;
        setTimeout(renderProductsForSale, 1200);
      }
    )
  });
}
 

function askWhichProductToUpdate () {
  inquirer.prompt([
    {
      type: "input",
      name: "itemToUpdate",
      message: "What is the ID of the item you would like to update",
    },
    {
      type: "input",
      name: "updateQuantity",
      message: "How Many of This Product Would You Like to Add",
    }
  ]).then(function(res) {
    let itemToUpdate = res.itemToUpdate;
    let updateQuantity = res.updateQuantity;
    updateItem(itemToUpdate, updateQuantity);
    // console.log(itemToUpdate);
    // connection.end();
  })
}

function updateItem(item, quant) {
  console.log(item);
  connection.query("SELECT * FROM products WHERE item_id="+item, function(err,res) {
    if (err) throw err;
 
    let currentQuant = res[0].stock_quantity;
    let newQuant = Number(currentQuant)+Number(quant);
    connection.query(
      "UPDATE products SET ? WHERE ?",
      [
        {
          stock_quantity: newQuant
        },
        {
          item_id: item
        }
      ], function(err, res) {
      if (err) throw err;
      setTimeout(renderProductsForSale, 1000);
      })
  }) 
}

function addInventoryItem() {
  renderProductsForUpdate(askWhichProductToUpdate)
}

function renderProductsForUpdate(cb) {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
  
    let data =[];
    let output, dataRow;
    
    let tableHead = `ID, PRODUCT NAME, ($) PRICE, Quantity In Stock`;
    let tableHeadArr = tableHead.split(",");
    data.push(tableHeadArr);
        // for(i=0; i<)
        for(i=0; i<res.length; i++) {
  
          dataRow=`${res[i].item_id}, ${res[i].product_name}, ${res[i].price}, ${res[i].stock_quantity}`;
  
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
          width: 10
        },
        3: {
          alignment: 'center',
          width: 10
        }
      }
    };
    
    output = table(data, config);
    console.log(output);
  
   setTimeout(cb, 1200);
  });
}

function renderLowInventoryProducts() {
  connection.query("SELECT * FROM products WHERE stock_quantity <= 5", function(err, res) {
    if (err) throw err;
  
    let data =[];
    let output, dataRow;
    
    let tableHead = `ID, PRODUCT NAME, ($) PRICE, Quantity In Stock`;
    let tableHeadArr = tableHead.split(",");
    data.push(tableHeadArr);
        // for(i=0; i<)
        for(i=0; i<res.length; i++) {
  
          dataRow=`${res[i].item_id}, ${res[i].product_name}, ${res[i].price}, ${res[i].stock_quantity}`;
  
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
          width: 10
        },
        3: {
          alignment: 'center',
          width: 10
        }
      }
    };
    
    output = table(data, config);
    console.log(output);
  
   setTimeout(managerActionToPerform, 1200);
  });
}

function renderProductsForSale() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
  
    let data =[];
    let output, dataRow;
    
    let tableHead = `ID, PRODUCT NAME, ($) PRICE, Quantity In Stock`;
    let tableHeadArr = tableHead.split(",");
    data.push(tableHeadArr);
        // for(i=0; i<)
        for(i=0; i<res.length; i++) {
  
          dataRow=`${res[i].item_id}, ${res[i].product_name}, ${res[i].price}, ${res[i].stock_quantity}`;
  
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
          width: 10
        },
        3: {
          alignment: 'center',
          width: 10
        }
      }
    };
    
    output = table(data, config);
    console.log(output);
  
   setTimeout(managerActionToPerform, 2000);
  });
}