const express = require('express');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const routRecipes = require('./Recipes.js');
const routDiets = require('./Diets.js');
const routes = express();


// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
routes.use('/recipes', routRecipes);
routes.use('/diets', routDiets);

module.exports = routes;

//---> Request ----> Server ----> Index.JS ---->
//                                                \
//                                                 \
//                                                /  \
//                                               /    \
//                                          /recipes   /diets