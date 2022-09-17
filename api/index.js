//                       _oo0oo_
//                      o8888888o
//                      88" . "88
//                      (| -_- |)
//                      0\  =  /0
//                    ___/`---'\___
//                  .' \\|     |// '.
//                 / \\|||  :  |||// \
//                / _||||| -:- |||||- \
//               |   | \\\  -  /// |   |
//               | \_|  ''\---/''  |_/ |
//               \  .-\__  '-'  ___/-. /
//             ___'. .'  /--.--\  `. .'___
//          ."" '<  `.___\_<|>_/___.' >' "".
//         | | :  `- \`.;`\ _ /`;.`/ - ` : | |
//         \  \ `_.   \_ __\ /__ _/   .-` /  /
//     =====`-.____`.___ \_____/___.-`___.-'=====
//                       `=---='
//     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const server = require('./src/app.js');
//const { getAllDietsTypes } = require('./src/controllers/Diets.controller.js');
const { conn, Diet, Recipe } = require('./src/db.js');
const { dbLoader, dbLoaderDiets } = require('./src/controllers/utils');
// const diets_List = require('./src/controllers/Diets_list');

// Syncing all the models at once.
conn.sync({ force: false }).then(() => {
  dbLoaderDiets();
  dbLoader();

  const PORT = process.env.PORT;
  server.listen(PORT, () => {
    console.log("%s listening at 3001"); // eslint-disable-line no-console
  });

});
