// Description:
//   Nakoudo bot

const Nakoudo = require("../lib/nakoudo");

module.exports = robot => {
  const nakoudo = new Nakoudo(robot);
  nakoudo.setup();
};
