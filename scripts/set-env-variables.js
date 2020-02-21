#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const ENV_VARIABLES = ['ETHSTATS_SERVICE', 'BLOCKSCOUT_URL', 'GRAPHQL_BLOCKSCOUT_URL'];

function promiseify(fn) {
  return function() {
    const args = [].slice.call(arguments, 0);
    return new Promise((resolve, reject) => {
      fn.apply(this, args.concat([function (err, value) {
        if (err) {
          reject(err);
        } else {
          resolve(value);
        }
      }]));
    });
  };
}

const readFile = promiseify(fs.readFile);
const writeFile = promiseify(fs.writeFile);

function inlineResources(globs) {
  if (typeof globs == 'string') {
    globs = [globs];
  }

  return Promise.all(globs.map(dir => {
    const files = fs.readdirSync(dir)
      .filter(name => /\.js$/.test(name))
      .map(name => `${dir}/${name}`);

    return Promise.all(files.map(filePath => {
      return readFile(filePath, 'utf-8')
        .then(content => {
          ENV_VARIABLES
            .forEach(variable => {
              const value = process.env[variable]
              if (value) {
                content = content.replace(`%%DOCKER_ENV%%${variable}%%`, value)
              }
            })
          return content
        })
        .then(content => writeFile(filePath, content))
        .catch(err => {
          console.error('An error occurred: ', err);
        });
    }));
  }));
}

if (require.main === module) {
  inlineResources(process.argv.slice(2));
}

module.exports = inlineResources;
