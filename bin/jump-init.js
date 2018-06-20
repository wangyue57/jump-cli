#!/usr/bin/env node
const fs = require('fs')
const glob = require('glob')
const path = require('path')
const program = require('commander')
const inquirer = require('inquirer')
const download = require('../lib/download')
const generator = require('../lib/generator')

program.usage('<请输入要创建的项目名称>').parse(process.argv)

// get projectName from user input
let projectName = program.args[0]
if (!projectName) {
  return program.help()
}

const list = glob.sync('*')
const currentPath = process.cwd()
const existed = list.some(name => {
  const fileName = path.resolve(currentPath, name)
  const isDir = fs.statSync(fileName).isDirectory()

  return name === projectName && isDir
})
if (existed) {
  return console.log(`项目${projectName}已存在！`)
}

const projectRoot = path.resolve(currentPath, projectName)
download(projectRoot).then(target => ({
  name: projectRoot,
  root: projectRoot,
  downloadTemp: target
})).then(context => {
  return inquirer.prompt([
    {name: 'vuex', message: '要不要 vuex', type: 'confirm', default: true},
    {name: 'axios', message: '要不要 axios', type: 'confirm', default: true},
    {name: 'router', message: '要不要 router', type: 'confirm', default: true},
  ]).then(metadata => ({metadata, ...context}))
}).then(({metadata, root, downloadTemp}) => {
  return generator(metadata, downloadTemp, root)
}).then(context => {
  console.log(context, '创建成功')
}).catch(err => {
  console.log(err)
})

