'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('SenderMasks', {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.bulkInsert('SenderMasks', [
      {
        name: 'Maya',
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'MayaRewards',
        id: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'MayaAgent',
        id: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'MayaCenter',
        id: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'MayaSavings',
        id: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'MayaCredit',
        id: 6,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'MayaPayLatr',
        id: 7,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'MayaHoliday',
        id: 8,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'MayaTest',
        id: 9,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
