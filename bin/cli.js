#!/usr/bin/env node

const program = require('commander')

program
  .version(require('../package.json').version)
  .usage('<command>')

program
  .command('init')
  .description('create a new project')
  .action(() => {
    require('../lib/init.js')
  })

program.parse(process.argv)
if (!program.args.length) {
  program.help()
}
