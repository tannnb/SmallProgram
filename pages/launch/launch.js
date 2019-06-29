const utils = require('../../utils/util')

Page({
  onLoad() {
    let timer = setTimeout(() => {
      this.direct()
    }, 2000)
  },
  direct() {
    // 是否登陆
    let auth = utils.ifLogined()
    let url = ''
    auth ? (url = '/pages/index/index') : (url = '/pages/feidian/feidian')
    console.log(url)
    wx.switchTab({ url })
  }
})
