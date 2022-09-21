import * as pg from 'pg';
import { Sequelize, DataTypes } from 'sequelize';

const DB_STRING = process.env.NEXT_PUBLIC_DB_STRING;
export const sequelize = new Sequelize(DB_STRING, {
  logging: false,
  dialectModule: pg,
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
