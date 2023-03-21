'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      email: 'trind@gmail.com',
      password: '123456', // phải hash password
      firstName: 'Tri',
      lastName: 'Nguyen',
      address: '89/2E Mỹ Hòa 1, Trung Chánh, Hóc Môn',
      gender: 1,
      typeRole: "ROLE",
      keyRole: "R1",

      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
