const config = getApp().globalData.config

Page({

    /**
     * 页面的初始数据
     */
    data: {
        postId: '',
        artDetail: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            postId: options.id,
            title: options.title
        }, () => {
            this._init()
        })
    },

    _init() {
        wx.request({
            url: `${config.getDetailDataUrl}/getDetailData`,
            data: {
                uid: "58a33e428d6d81006caa493b",
                device_id: "1561636417235",
                token: "",
                src: "web",
                type: "entry",
                postId: this.data.postId
            },
            success: (res) => {
                const { m, d } = res.data
                console.log(res.data)
                if (m === 'ok') {
                    this.setData({
                        artDetail: d
                    }, () => {
                        console.log('asdasdasd')
                        console.log(this.data.artDetail)
                    })
                }
            },
            fail: () => {

            }
        })
        // entryView
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        wx.setNavigationBarTitle({
            title: this.data.title
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

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})