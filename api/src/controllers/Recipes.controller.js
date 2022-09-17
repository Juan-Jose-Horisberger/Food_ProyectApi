require('dotenv').config();
const { YOUR_API_KEY } = process.env;
const { Op } = require('sequelize');
const axios = require('axios');
const { Recipe, Diet } = require('../db.js'); //Models
const { Router, json } = require('express');
const router = Router();
router.use(json());
const {
    getOneRecipe,
    getOrderedRecipes
} = require('./utils');
//GET

const getAllInfo = async (req, res, next) => {
    try {
        const { name } = req.query;

        const allTheRecipes = await Recipe.findAll({ include: Diet });
        if (name) {
            const newName = name.substr(-1) === 's' ? name.substr(0, name.length - 1) : name;
            const recipes = allTheRecipes?.filter(e => (
                e.name.toLowerCase().includes(newName.toLowerCase())
            ));
            recipes.length
                ? res.send(recipes)
                : res.status(400).json({ messaje: 'Error that recipe does not exist' });
        }
        else if (allTheRecipes.length) {
            res.send(allTheRecipes)
        }
    }
    catch (e) {
        next(e);
    }


}

//GET

const recipeById = async (req, res, next) => {
    const { id } = req.params;
    try {
        if (id) {
            const recipe = await getOneRecipe(id);
            recipe
                ? res.send([recipe])
                : res.status(400).json({ message: "Recipe details not found" })
        }
    }
    catch (e) {
        next(e);
    }
}

//POST
const addInfo = async (req, res, next) => {
    const { recipe, dietsApi } = req.body;

    if (
        !recipe.name ||
        !recipe.summary ||
        !recipe.healthScore ||
        !recipe.image
    )
        return res.status(404).json({ message: "Falta enviar datos obligatorios" });
    if (typeof recipe.healthScore === 'string') recipe.healthScore = parseInt(recipe.healthScore);
    if (recipe.healthScore < 0 || recipe.healthScore > 100) return res.status(404).json({ message: "La puntuación de salud debe estar entre 0 y 100." });

    try {

        const newRecipe = await Recipe.create(recipe);
        //Nosotros queremos darle la posibilidad a el usuario a que la receta que esta creando, pueda estar relacionada a muchos tipos de dietas, para esto hacemos las relaciones

        let arr = [];

        for (let i = 0; i < dietsApi.length; i++) {
            arr[i] = await newRecipe.addDiet(dietsApi[i]);
        }

        if (newRecipe && arr[0]) res.json({ message: "Creado correctamente", data: newRecipe });
        else res.json({ message: "Error, por alguna razon no se pudo crear la receta, fiajte mejor" });
    }
    catch (e) {
        next(e);
    }

    /*

    ---------------------------------------------------------------------------------------------

    // try {
    //     const { recipe } = req.body;
    //     let receta = await Recipe.create(recipe)

    //     //res.send(recipe.diets + 'No llega nada');

    //     recipe.diets.forEach(async (d) => {
    //         let dieta = await Diet.findAll({ where: { name: d.toLowerCase() } });
    //         //res.send(dieta);
    //         await dieta.addRecipe(receta);
    //     });


    //     let response = await Recipe.findAll({
    //         where: { name: recipe.name },
    //         include: Diet,
    //     });
    //     res.json(response);
    // }
    // catch (e) {
    //     next(e);
    // }

    */
}


// Esta no funciona X, ordena las recetas de la api, y a lo ultimo de estas recetas
// estan las recetas de la bd ordenadas.

const orderByName = async (req, res, next) => {
    const { order } = req.params;

    try {
        // console.log(order)
        if (order) {
            const infoOrdered = await getOrderedRecipes(order);
            infoOrdered.length
                ? res.send(infoOrdered)
                : res.status(400).json({ message: "No information received" });
        }
    }
    catch (e) {
        next(e);
    }
}




module.exports = {
    getAllInfo,
    recipeById,
    //getRecipesForDiet,
    addInfo,
    orderByName,
};