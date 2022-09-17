const { Diet } = require('../db.js'); //Models

module.exports = {
    getDiets: async (req, res, next) => {
        try{
            Diet.findAll().then(r => res.json(r))
        }
        catch(e){
            next(e);
        }
    }
}