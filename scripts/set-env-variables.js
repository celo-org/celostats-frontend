#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

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
          return content.replace(
            /['"]%%DOCKER_ENV%%([A-Z_]*)%%['"]/g,
            (_, envVar) => JSON.stringify(process.env[envVar]) || null,
          )
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
