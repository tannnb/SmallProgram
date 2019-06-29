//index.js
//获取应用实例
const app = getApp()
const config = getApp().globalData.config
const navSource = require('../../data/navData')

Page({
    data: {
        motto: 'Hello World',
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        COUNT: 20,
        navTitle: '推荐',
        active: 0,
        after: '',
        navComment: [],
        hotRecomment: []
    },
    onLoad() {
        // 获取导航
        this._getNavData()
        this._init()
    },

    _getNavData() {
        const { d, m } = navSource.navSource
        if (m === 'success') {
            let recommended = {
                "tagId": "121231230",
                "name": "推荐",
                "type": "POPULAR"
            }
            d.categoryList.unshift(recommended)
            this.setData({
                navComment: d.categoryList
            })
        }
    },

    _init() {
        let options = { "operationName": "", "query": "", "variables": { "first": 20, "after": "", "order": "POPULAR" }, "extensions": { "query": { "id": "21207e9ddb1de777adeaca7a2fb38030" } } }
        this._getHotRecomment(options)
    },

    onChange(event) {
        this.setData({
            after: '',
            hotRecomment: [],
            navTitle: event.detail.title
        })
        if (event.detail.title === '推荐') {
            let options;
            if (!this.data.after) {
                options = { "first": 10, "after": '', "order": "POPULAR" }
            }
            let query = {
                "operationName": "",
                "query": "",
                "variables": options,
                "extensions": { "query": { "id": "21207e9ddb1de777adeaca7a2fb38030" } }
            }
            this._getHotRecomment(query)
        } else {
            let options;
            let ret = this.data.navComment.filter(item => item.name == event.detail.title)
            console.log(ret)
            if (!this.data.after) {
                options = { "tags": [], "category": ret[0].id, "first": 10, "after": "", "order": "POPULAR" }
            }
            let query = {
                "operationName": "",
                "query": "",
                "variables": options,
                "extensions": { "query": { "id": "653b587c5c7c8a00ddf67fc66f989d42" } }
            }
            this._getHotRecomment(query)
        }
    },


    _getHotRecomment(options) {
        wx.showLoading({
            title: '加载中',
        })
        wx.request({
            url: `${config.trendsUrl}/query`,
            method: 'post',
            header: { 'X-Agent': 'Juejin/Web', },
            data: options,
            success: (res) => {
                wx.hideLoading()
                let { data: { articleFeed } } = res.data
                console.log(res.data)
                if (articleFeed.items && articleFeed.items.edges.length > 0) {
                    let filterDate = articleFeed.items.edges.map(item => ({ ...item.node }))
                    this.setData({
                        hotRecomment: this.data.hotRecomment.concat(filterDate),
                        after: articleFeed.items.pageInfo.endCursor
                    })
                }
            },
            fail: () => {
                wx.hideLoading()
            }
        })
    },

    handleItem(e) {
        let id = e.currentTarget.dataset.source.id
        let username = e.currentTarget.dataset.source.user.username
        let url = `/pages/postdetail/postdetail?id=${e.currentTarget.dataset.source.id}&title=${username}`
        wx.navigateTo({
            url,
        })
    },

    // 获取 timeline 推荐列表
    getEntryByTimeline() {

        wx.request({
            url: `${config.timelineRequestUrl}/get_entry_by_timeline`,
            data: {
                src: 'web',
                uid: '',
                device_id: '',
                token: '',
                limit: this.data.COUNT,
                category: 'all',
                recomment: 1,
                before: '',
            },
            success: (res) => {
                wx.hideLoading()
                const { m, d } = res.data
                if (m === 'ok') {
                    this.setData({
                        hotRecomment: this.data.hotRecomment.concat(d.entrylist)
                    }, () => {
                        console.log(this.data.hotRecomment)
                    })
                }
            },
            fail: () => {
                wx.hideLoading()
            }
        })
    },

    //事件处理函数
    bindViewTap: function () {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },

    getUserInfo: function (e) {
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        })
    },
    onReachBottom() {
        // code
        console.log('upuo')
        if (this.data.navTitle === '推荐') {
            let options = { "first": 10, "after": this.data.after, "order": "POPULAR" }
            let query = {
                "operationName": "",
                "query": "",
                "variables": options,
                "extensions": { "query": { "id": "21207e9ddb1de777adeaca7a2fb38030" } }
            }
            this._getHotRecomment(query)
        } else {
            let ret = this.data.navComment.filter(item => item.name == this.data.navTitle)
            let options = { "tags": [], "category": ret[0].id, "first": 10, "after": this.data.after, "order": "POPULAR" }
            let query = {
                "operationName": "",
                "query": "",
                "variables": options,
                "extensions": { "query": { "id": "653b587c5c7c8a00ddf67fc66f989d42" } }
            }
            this._getHotRecomment(query)
        }
    },
})
