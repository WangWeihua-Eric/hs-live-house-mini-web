import {LiveRoomListService} from "./service/liveRoomListService";
import {formatTime} from "../../utils/time-utils/time-utils";
import {pageJump} from "../../utils/wx-utils/wx-base-utils";

const liveroom = require('../components/mlvb-live-room/mlvbliveroomcore.js')

const liveRoomListService = new LiveRoomListService()

Page({
    sessionId: '',

    /**
     * 页面的初始数据
     */
    data: {
        roomList: []
    },

    refresh() {
        if (this.sessionId) {
            liveRoomListService.queryRoomList(this.sessionId).then(roomList => {
                console.log(roomList)
                this.formatRoomList(roomList)
                this.setData({
                    roomList: roomList
                })
            }).catch(() => {
            })
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const sessionId = options.sessionId
        this.sessionId = sessionId
        this.refresh()
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
     * 去直播
     */
    jumpToLive(event) {
        const index = event.currentTarget.dataset.value
        const roomName = this.data.roomList[index].roomName
        const accountInfo = liveroom.getAccountInfo()
        const url = `../mlvb-live-room-demo/live-room-page/room?type=create&roomName=${roomName}&userName=${accountInfo.userName}&pureAudio=false`
        pageJump(url).then(() => {
        }).catch(() => {
        })
    },

    /**
     * 格式化房间信息
     */
    formatRoomList(roomList) {
        roomList.forEach(item => {
            const startTime = item.startTime
            item.openRoomTime = formatTime(startTime)
        })
    }
})