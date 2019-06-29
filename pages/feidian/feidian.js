const config = getApp().globalData.config
const utils = require('../../utils/util')
Page({
  data: {
    auth: null,
    hotRecommendList: [],
    after: ''
  },
  onLoad() {
    const auth = this.data.auth  // 是否登录
    this._getQuery()
  },
  _getQuery() {
    let options = {
      "size": 10,
      "after": this.data.after,
      "afterPosition": ""
    }
    wx.request({
      url: `${config.trendsUrl}/query`,
      method: 'post',
      header: { 'X-Agent': 'Juejin/Web', },
      data: {
        "operationName": "",
        "query": "",
        "variables": options,
        "extensions": { "query": { "id": "249431a8e4d85e459f6c29eb808e76d0" } }
      },
      success: (res) => {
        let { data } = res.data
        if (data) {
          let { items } = data.recommendedActivityFeed
          this.setData({
            after: (items.pageInfo && items.pageInfo.endCursor) || ''
          })
          let result = items.edges.map(item => (item.node))
          let normalize = result.map(item => {
            return {
              ...item,
              actors: item.actors[0],
              targets: item.targets[0]
            }
          })
          console.log(normalize)
          this.setData({
            hotRecommendList: this.data.hotRecommendList.concat(normalize)
          })
        }
      },
      fail: () => {
        wx.showToast({
          title: '网路开小差了，请稍后再试',
          icon: 'none',
        })
      }
    })
  },
  onReachBottom() {
    this._getQuery()
    console.log('监听用户上拉触底事件')
  },
})
