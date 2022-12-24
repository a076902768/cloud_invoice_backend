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
      isEmail: true, //checks for email format
    }
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
  // users.associate = (models) => {
  //   users.hasMany(models.TodoItem, {
  //     foreignKey: 'todoId',
  //     as: 'todoItems',
  //   });
  // };
  return users;
};
