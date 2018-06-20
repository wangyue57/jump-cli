const path = require('path')
const download = require('download-git-repo')

module.exports = target => {
  target = path.join(target || '.', '.download-temp')

  return new Promise((resolve, reject) => {
    // 模板url、目标路径、callBack
    download(
      'wangyue57/vue-base-template',
      target,
      err => err ? reject(err) : resolve(target))
  })
}
