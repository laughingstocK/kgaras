require('dotenv').config();

const config = {
  port: process.env.PORT || 3000,
  sshUser: process.env.SSH_USER || 'rob',
  logmapUrl: process.env.LOGMAP_URL || 'localhost',
  privateKeyPath: process.env.PRIVATE_KEY_PATH || '/Users/krerkkiathemadhulin/.ssh/id_rsa',
};

module.exports = config;