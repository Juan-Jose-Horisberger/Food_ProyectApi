const axios = require("axios");
const { Recipe, Diet } = require('../db.js'); //Models
require('dotenv').config();
const { YOUR_API_KEY } = process.env;

const dbLoader = async () => {
    try {
        const api = await axios.get(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${YOUR_API_KEY}&addRecipeInformation=true&number=100`);

        if (api) {
            const apiInfo = api.data.results?.map(e => {
                return {
                    id: e.id, //Quitar este id ya que lo generamos solo desde el db
                    name: e.title,
                    summary: e.summary.replace(/<[^>]*>?/gm, ""),
                    healthScore: e.healthScore,
                    analyzedInstructions: e.analyzedInstructions
                        ? e.analyzedInstructions.map(a => a.steps.map((b, i) => `${i + 1}. ${b.step}.`)).flat()
                        : "",
                    image: e.image,
                    dietsApi: e.diets
                }
            })

            const allInfo = Recipe.findAll({ include: Diet })
            if (!allInfo.length) {
                for (let i = 0; i < apiInfo.length; i++) {
                    await Recipe.create(apiInfo[i])
                }
            }
        }

        // const recipes = await axios(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${YOUR_API_KEY}&addRecipeInformation=true&number=100`);

        // // formatea todas los elem filtrados de la api
        // const recipesApi = recipes.data.results.map(result => {

        //     // formateo en un obj lo necesario
        //     const recipeFormat = {
        //         //id: result.id,
        //         name: result.title,
        //         summary: result.summary?.replace(/<\/?[^>]+(>|$)/g, ""),
        //         healthScore: result.healthScore,
        //         analyzedInstructions: result.analyzedInstructions[0] ? result.analyzedInstructions[0].steps.map(data => data.step) : ["..."], // lo agrega solo si existe
        //         image: result.image,
        //         dietsApi: result.diets
        //     };
        //     return recipeFormat;
        // });

        // let dietsFound = [];

        // for (let i = 0; i < recipesApi.length; i++) {

        //     const api = recipesApi[i];

        //     // me fijo que no exista
        //     const exists = await Recipe.findOne({ where: { name: api.name } });

        //     if (!exists) {
        //         // creo en la db la nueva Receta
        //         const newRecipe = await Recipe.create({
        //             id: api.id,  // si comento el id lo podria autogenerar y hacer que todas sean editables          
        //             name: api.name,
        //             summary: api.summary,
        //             healthScore: api.healthScore,
        //             analyzedInstructions: api.analyzedInstructions,
        //             image: api.image
        //         });

        //         for (let j = 0; j < api.diets.length; j++) {
        //             const diet = api.diets[j]; // nombre de dieta
        //             const findDiet = await Diet.findOne({ where: { name: diet } }); // busco en la db

        //             if (findDiet && findDiet.id) {
        //                 console.log(findDiet.id); // id
        //                 dietsFound.push(findDiet.id); // guardo los id 
        //             }
        //         }
        //         // relaciono la receta con la/las dieta/s 
        //         if (dietsFound.length) {
        //             newRecipe.addDiets(dietsFound);
        //             dietsFound = [];
        //         }
        //     }
        // }
        // console.log("Recipes preloaded!");
    }
    catch (e) {
        console.log(e);
    }
}

function dbLoaderDiets() {

    axios(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${YOUR_API_KEY}&addRecipeInformation=true&number=100`)
        .then(result => {

            let unique = [];

            result.data.results.forEach(data => {

                data.diets.forEach(element => {

                    unique.push(element);
                })
            })
            unique = new Set(unique);

            /* la formateo c/e en un obj */
            let diets = [...unique].map(diet => {
                return { name: diet }
            });

            // almaceno en la db los tipos de dieta que no existan (sin duplicarlos)
            Diet.bulkCreate(diets, {
                ignoreDuplicates: true
            });

            console.log("Diets preloaded!");
        })
        .catch(error => {
            console.log(error.message);
        });
}

const getOneRecipe = async (id) => {
    try {
        if (id) {
            const recipe = await Recipe.findByPk(id, { include: Diet });
            return recipe;
        }
    }
    catch (e) {
        console.log(e)
    }
}

const getOrderedRecipes = async (order) => {
    try {
        // return order;
        if (order) {
            const allInfo = await Recipe.findAll({ include: Diet });

            if (order === 'asc') {
                allInfo.sort(function (a, b) {
                    if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
                    if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
                    return 0;
                })
                return allInfo;
            }
            else if (order === 'desc') {
                allInfo.sort(function (a, b) {
                    if (a.name.toLowerCase() > b.name.toLowerCase()) return -1;
                    if (a.name.toLowerCase() < b.name.toLowerCase()) return 1;
                    return 0;
                })
                return allInfo;
            }
        }
    }
    catch (e) {
        console.log(e)
    }
}


module.exports = {
    dbLoader,
    getOneRecipe,
    getOrderedRecipes,
    dbLoaderDiets
}