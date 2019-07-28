const program = require('commander')
const { prompt } = require('inquirer')
const chalk = require('chalk')
const ora = require('ora')
const download = require('download-git-repo')
const fs = require('fs')
const path = require('path')

const option = program.parse(process.argv).args[0]
const defaultName = option && typeof option === 'string' ? option : 'vue-component-project'
const tpls = require('../template.json')
const tplsList = Object.keys(tpls) || []
const questions = [
  {
    type: 'input',
    name: 'name',
    message: 'Project name',
    default: defaultName,
    filter (val) {
      return val.trim()
    },
    validate (val) {
      return val.indexOf(' ') > -1 ? 'Project name is not allowed to have spaces' : true
    },
    transformer (val) {
      return val
    }
  },
  {
    type: 'list',
    name: 'template',
    message: 'Project template',
    choices: tplsList,
    default: tplsList[0],
    validate () {
      return true
    },
    transformer (val) {
      return val
    }
  },
  {
    type: 'input',
    name: 'description',
    message: 'Project description',
    default: 'A single vue component project',
    validate () {
      return true
    },
    transformer (val) {
      return val
    }
  },
  {
    type: 'input',
    name: 'author',
    message: 'Project author',
    default: '',
    validate () {
      return true
    },
    transformer (val) {
      return val
    }
  }
]

module.exports = prompt(questions).then(({ name, template, description, author }) => {
  const projectName = name
  const projectTemplate = template
  const repo = tpls[projectTemplate].repo
  const dest = `${process.cwd()}/${projectName}`
  if (!repo) {
    console.log(chalk.red('Template dose not exist'))
    return
  }
  const spinner = ora('Downloading template, please wait')
  spinner.start()
  download(repo, dest, (err) => {
    if (err) {
      spinner.stop()
      console.log(chalk.red(err))
      process.exit()
    }
    fs.readFile(`${process.cwd()}/${projectName}/package.json`, 'utf-8', (err, data) => {
      if (err) {
        spinner.stop()
        console.log(chalk.red(err))
        process.exit()
      }
      const packageJson = JSON.parse(data)
      packageJson.name = projectName
      packageJson.description = description
      packageJson.author = author
      const newPackageJson = JSON.stringify(packageJson, null, 2)
      fs.writeFile(`${process.cwd()}/${projectName}/package.json`, newPackageJson, 'utf-8', (err) => {
        if (err) {
          spinner.stop()
          console.log(chalk.red(err))
          process.exit()
        }
        spinner.stop()
        console.log(`Successfully created project ${chalk.yellow(projectName)}`)
        console.log('Get started with the following commands:')
        console.log(`
          ${chalk.blue(`cd ${projectName}`)}
          ${chalk.blue(`npm install`)}
          ${chalk.blue(`npm run dev`)}
        `)
      })
    })
  })
})
