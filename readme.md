#Shazamazon Node.js and MySQL

## Overview 

This is an app that mimics the functionality of an e-commerce site by rendering products for sale and executing some CRUD operations to the products depending on the desired outcome. 

## Options for views

You will have two options for interfacing with the database.

### customerr terminal

  * you can access by navigating to the root directory in the terminal and running the command:
  `node shazamazonCustomer.js`

  * after running the above command you will be prompted

    1. input the id of the item you would like to buy

    2. input the quantity of that item you would like to by

  * the terminal will calculate your purchase and updtate the database with the change in quantity

### manager terminal

  * access using the command: `node shazamazonManager.js`

  * after running the command above you will be prompted with the following options:

  1. view products for sale

    * this will render all the products from the database witht their relavant departments, quantities, prices, and id's

  2. view low inventory 

    * this will render items with inventory less then or equal to 5
  
  3. add to inventory

    * this will prompt you :

      1. what is the id of the item you would like to add

      2. what quantity would you like to add
    
    * this will update the database with the new quantity

  4. add new product

    * if you select this option you will be prompted with the following:

      1. what is the name of the product you will add

      2. which department will the product be a part of

      3. what is the price of this product

      4. how many of this product would you like to add

    * this will update the database with the new product added


