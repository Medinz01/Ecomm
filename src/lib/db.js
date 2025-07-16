import SequelizePkg from 'sequelize';

const { Sequelize } = SequelizePkg;

let dialectModule;

try {
  dialectModule = (await import('mysql2')).default;
} catch (err) {
  throw new Error('mysql2 module not found. Please install it using: npm install mysql2');
}

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    dialectModule,
    logging: false,
  }
);
