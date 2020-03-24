import {LiveHouseService} from "./service/liveHouseService";

const liveHouseService = new LiveHouseService()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        scheduleList: []
    },

    /**
     * 刷新
     */
    refresh() {
        liveHouseService.getScheduleInfo().then(res => {
            this.formatScheduleInfo(res)
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.refresh()
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

    },

    /**
     * 格式化课数据
     * @param data
     */
    formatScheduleInfo(data) {
        const self = this
        const scheduleList = []

        data.forEach(coursesItem => {
            const coursesList = coursesItem.courses
            const group = coursesItem.group

            coursesList.forEach(item => {
                const lessonInfo = {
                    ...item,
                    time: self.formatLessonTime(item, group),
                    totalBook: '789 人成功预约'
                }
                scheduleList.push(lessonInfo)
            })
        })
        this.setData({
            scheduleList: scheduleList
        })
        console.log(data)
    },

    /**
     * 课程时间格式化
     * @param data
     */
    formatLessonTime(data, group) {
        return group.date + ' ' + data.startTime.split(' ')[1] + ' - ' + data.finishTime.split(' ')[1]
    },

    /**
     * 格式化 title or subTitle
     * @param title
     * @param type
     */
    formatTitle(title, type) {
      const titles = title.split('-')

    }
})