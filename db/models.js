import { Sequelize, DataTypes } from 'sequelize';

const DB_STRING = process.env.DB_STRING;
const sequelize = new Sequelize(DB_STRING, {
  logging: false,
});

export const User = sequelize.define('User', {
  username: DataTypes.STRING,
  token: DataTypes.STRING,
});

export const WateringEvent = sequelize.define('WateringEvent', {
  date: DataTypes.DATE,
  done: DataTypes.BOOLEAN,
});

WateringEvent.User = WateringEvent.belongsTo(User);

sequelize.sync({ alter: true });
