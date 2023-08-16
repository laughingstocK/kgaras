require('dotenv').config();

const config = {
  port: process.env.PORT || 3001,
  sshUser: process.env.SSH_USER || 'rob',
  logmapUrl: process.env.LOGMAP_URL || 'logmap',
  alcomoUrl: process.env.ALCOMO_URL || 'alcomo',
  privateKeyPath: process.env.PRIVATE_KEY_PATH || '/root/.ssh/id_rsa',
  database: {
    host: process.env.DATABASE_HOST || 'localhost',
    name: process.env.DATABASE_NAME || 'ontology_repair_db',
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
  },
};

module.exports = config;