#!/usr/bin/env node
const program = require('commander')

program
  .version('1.0.0')
  .usage('<command> jump node cli')
  .command('init', '创建新项目')
  .parse(process.argv)
