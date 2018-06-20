const rm = require('rimraf').sync
const currentPath = process.cwd()
const Metalsmith = require('metalsmith')
const Handlebars = require('handlebars')

module.exports = (metadata = {}, src, dest = '.') => {
  if (!src) {
    return Promise.reject(new Error(`无效的source: ${src}`))
  }

  return new Promise((resolve, reject) => {
    Metalsmith(currentPath)
      .metadata(metadata)
      .clean(false)
      .source(src)
      .destination(dest)
      .use((files, metalsmith, done) => {
        const meta = metalsmith.metadata()
        Object.keys(files).forEach(fileName => {
          if (['md', 'html', 'css', 'js', 'json', 'babel', 'jsx', 'vue'].includes(fileName.split('.').pop())) {
            const fileStr = files[fileName].contents.toString()
            files[fileName].contents = Buffer.from(Handlebars.compile(fileStr)(meta))
          }
        })
        done()
      })
      .build(err => {
        rm(src)
        err ? reject(err) : resolve
      })
  })
}
