const { Client } = require('ssh2')
const fs = require('fs')
const config = require('../config')

const { logmapUrl, sshUser, privateKeyPath } = config

function executeSSHCommand(host, username, privateKeyPath, command) {
    return new Promise((resolve, reject) => {
      const conn = new Client();
      conn.on('ready', () => {
        conn.exec(command, (err, stream) => {
          if (err) {
            reject(err);
            return;
          }
  
          let output = '';
  
          stream
            .on('close', (code, signal) => {
              conn.end();
              resolve(output);
            })
            .on('data', (data) => {
              output += data;
            })
            .stderr.on('data', (data) => {
            });
        });
      }).connect({
        host,
        port: 22,
        username,
        privateKey: fs.readFileSync(privateKeyPath),
      });
  
      conn.on('error', (err) => {
        reject(err);
      });
    });
  }

  async function runSSHCommand(command) {
    try {
  
      const output = await executeSSHCommand(logmapUrl, sshUser, privateKeyPath, command)
      console.log('SSH command output:', output)
    } catch (err) {
      console.error('Error executing SSH command:', err)
    }
  }

  module.exports = {
      runSSHCommand
    }