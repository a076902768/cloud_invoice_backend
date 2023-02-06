const dayjs = require('dayjs');

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user',
    {
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
      card_encrypt: { // 手機條碼驗證碼
        type: DataTypes.STRING,
      },
      card_no: { // 手機條碼
        type: DataTypes.STRING,
      },
      token: {
        type: DataTypes.STRING,
      },
      token_exp_date: {
        type: DataTypes.STRING,
      },
      'created_at': {
        type: DataTypes.DATE,
        get() {
          return this.getDataValue('created_at') ? dayjs(this.getDataValue('created_at')).format('YYYY-MM-DD HH:mm:ss') : null;
        },
      },
      'updated_at': {
        type: DataTypes.DATE,
        get() {
          return this.getDataValue('updated_at') ? dayjs(this.getDataValue('updated_at')).format('YYYY-MM-DD HH:mm:ss') : null;
        },
      },
    },
    {
      tableName: 'user_info',
      timestamps: false, // 禁用createdAt、updatedAt
      hooks: {
        beforeCreate: (record) => {
          record.dataValues['created_at'] = dayjs().format();
        },
        afterCreate: (record) => {
          delete record.dataValues.uid;
          delete record.dataValues.pwd;
          delete record.dataValues.token_exp_date;
        },
        beforeUpdate: (record) => {
          record.dataValues['updated_at'] = dayjs().format();
        },
        afterUpdate: (record) => {
          delete record.dataValues.uid;
          delete record.dataValues.pwd;
          delete record.dataValues.token_exp_date;
        },
      },
    }
  );

  return user;
};
