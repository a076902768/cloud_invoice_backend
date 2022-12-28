const useBcrypt = require('sequelize-bcrypt');

const options = {
  field: 'pwd', // secret field to hash, default: 'password'
  rounds: 12, // used to generate bcrypt salt, default: 12
  compare: 'authenticate', // method used to compare secrets, default: 'authenticate'
};

module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define('users', {
    uid: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    phone: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true,
      }
    },
    pwd: {
      type: DataTypes.STRING,
    },
    token: {
      type: DataTypes.STRING,
    },
    token_exp_date: {
      type: DataTypes.STRING,
    },
  },
    {
      freezeTableName: true,
      // timestamps: false,
      // // If don't want createdAt
      // createdAt: false,
      // // If don't want updatedAt
      // updatedAt: false,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    });

  useBcrypt(users, options);

  return users;
};
