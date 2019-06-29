const config = getApp().globalData.config
const utils = require('../../utils/util')
Page({
    /**
     * 页面的初始数据
     */
    data: {
        imgUrls: [
            'http://y.gtimg.cn/music/common/upload/MUSIC_FOCUS/1416349.jpg',
            'http://y.gtimg.cn/music/common/upload/MUSIC_FOCUS/1402840.jpg'
        ],
        scrollTop: 0,
        searchValue: '',
        articleList: [],
        after: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad() {
        this._getQuery()
    },
    _getQuery() {
        wx.showLoading({
            title: '加载中',
        })
        let options = {
            after: this.data.after,
            first: 20,
            order: 'POPULAR'
        }
        wx.request({
            url: `${config.trendsUrl}/query`,
            method: 'post',
            header: { 'X-Agent': 'Juejin/Web' },
            data: {
                operationName: '',
                query: '',
                variables: options,
                extensions: { query: { id: '21207e9ddb1de777adeaca7a2fb38030' } }
            },
            success: res => {
                wx.hideLoading()
                let { data } = res.data
                if (data) {
                    let { items } = data.articleFeed

                    this.setData({
                        after: (items.pageInfo && items.pageInfo.endCursor) || ''
                    })
                    let result = items.edges.map(item => item.node)
                    let normalize = result.map(item => {
                        return {
                            ...item,
                            tags: item.tags[0]
                        }
                    })
                    this.setData({
                        after: items.pageInfo.endCursor,
                        articleList: this.data.articleList.concat(normalize)
                    })
                } else {
                    wx.showToast({
                        title: '没有更多了',
                        icon: 'none',
                        duration: 2000
                    })
                }
            },
            fail: () => {
                wx.hideLoading()
                wx.showToast({
                    title: '网络开小差了，请稍后再试',
                    icon: 'none'
                })
            }
        })
    },

    handleTapItem(e) {
        console.log(e)
    },

    scroll(e) {
        if (!e) {
            console.log('daodile')
        }
        this.setData({
            scrollTop: e.detail.scrollTop
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () { },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () { },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () { },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () { },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () { },

    /**
     * 页面上拉触底事件的处理函数
     */
    lower() {
        console.log('到底了')
    },
    onReachBottom: function () {
        this._getQuery()
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () { }
})
