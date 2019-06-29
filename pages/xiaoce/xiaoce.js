const config = getApp().globalData.config
const utils = require('../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        active: 0,
        currentIndex: 0,
        auth: {},
        pageNum: 1,
        alias: '',
        navSource: [],
        detailList: []
    },

    onChange(event) {
        this.setData({
            pageNum: 1,
            detailList: []
        })
        let filterData = this.data.navSource
        let filter = filterData.filter(item => item.name === event.detail.title)
        this.setData({ alias: filter[0].alias }, () => {
            this.getAll()
        })
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad() {
        let auth = utils.ifLogined()
        // 获取小册类型列表
        this.getNavList()
        // 获取所有小册
        this.getAll()
    },
    getAll() {
        wx.showLoading({
            title: '加载中',
        })
        wx.request({
            url: `${config.getXiaoceDetail}/getListByLastTime`,
            data: {
                uid: '',
                client_id: '',
                token: '',
                src: 'web',
                alias: this.data.alias,
                pageNum: this.data.pageNum
            },
            success: (res) => {
                wx.hideLoading()
                let { d, m } = res.data
                if (m === 'ok' && d) {
                    this.setData({
                        detailList: this.data.detailList.concat(d)
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
            }
        })
    },
    getNavList() {
        wx.request({
            url: `${config.getXiaoceNav}/getNavList`,
            success: (res) => {
                let { d, m } = res.data
                if (m === 'ok' && d) {
                    let all = {
                        alias: '',
                        createdAt: "2018-08-21T15:11:46.000Z",
                        id: '48',
                        name: '全部',
                        score: '-1'
                    }
                    this.setData({
                        navSource: [all, ...d]
                    })

                } else {
                    this.setData({
                        navSource: []
                    })
                }
            },
            fail(err) {
                wx.showToast({
                    title: '网络开小差了，请稍后再试',
                    icon: 'none',
                })
            }
        })
    },

    __init__() {
        this.setData({ auth })
        this.getXiaoCeData()
    },
    getXiaoCeData() {
        wx.request({
            url: `${config.xiaoceRequestUrl}/getListByLastTime`,
            data: {
                src: 'web',
                uid: this.data.auth.uid || '',
                device_id: this.data.auth.clientId,
                token: this.data.auth.token,
                pageNum: this.data.pageNum,
            },
            success(res) {
                console.log(res.data)
            },
            fail() {
                wx.showToast({
                    title: '网络开小差了，请稍后再试',
                    icon: 'none',
                })
            }
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    pagechange: function (e) {
        console.log(e)
        if ("touch" === e.detail.source) {
            let currentPageIndex = this.data.currentIndex
            currentPageIndex = (currentPageIndex + 1) % 2
            this.setData({
                currentIndex: currentPageIndex
            })
        }
    },
    titleClick: function (e) {
        let currentPageIndex =
            this.setData({
                //拿到当前索引并动态改变
                currentIndex: e.currentTarget.dataset.idx
            })
    },


    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        this.setData({
            pageNum: this.data.pageNum + 1
        }, () => {
            this.getAll()
        })
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})