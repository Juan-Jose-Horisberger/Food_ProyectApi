const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('recipe', {
    // id: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    //   primaryKey: true
    // },

    id: {
      // type: DataTypes.INTEGER,
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    summary: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    healthScore: {
      type: DataTypes.INTEGER,
    },
    // analyzedInstructions: { //lo cambio el anterior abajo
    //   type: DataTypes.TEXT,
    //   defaultValue: null
    // },
    analyzedInstructions: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      defaultValue: null
    },
    image: {
      type: DataTypes.STRING, //Cambiamos STRING por text, ya que STRING espera como max 255 caracteres
      defaultValue: 'https://assets.unileversolutions.com/recipes-v2/109064.jpg',
    },
    dietsApi: { //esto es nuevo, le cambiamos a dietsApi, sino colision de nombres con diets.
      type: DataTypes.ARRAY(DataTypes.TEXT),
      defaultValue: null
    },
    createdInBd: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });


}