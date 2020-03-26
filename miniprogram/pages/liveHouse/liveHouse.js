import {LiveHouseService} from "./service/liveHouseService"
import {pageJump} from "../../utils/wx-utils/wx-base-utils";

const liveroom = require('../components/mlvb-live-room/mlvbliveroomcore.js')
const GenerateTestUserSig = require("../mlvb-live-room-demo/debug/GenerateTestUserSig.js")

const app = getApp()
const liveHouseService = new LiveHouseService()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        userName: '',
        scheduleList: [],
        roomList: [],	// 房间列表
        isGetLoginInfo: false,  // 是否已经获取登录信息
        firstshow: true // 第一次显示页面
    },

    /**
     * 刷新
     */
    refresh() {
        this.refreshLiveRoom()
        this.refreshScheduleInfo()
    },

    /**
     * 刷新直播间
     */
    refreshLiveRoom() {
        wx.showLoading({
            title: '登录信息获取中',
        })

        const userID = new Date().getTime().toString(16)
        const userSig = GenerateTestUserSig.genTestUserSig(userID)

        const loginInfo = {
            sdkAppID: userSig.sdkAppID,
            userID: userID,
            userSig: userSig.userSig,
            userName: this.userName,
            userAvatar: ''
        }

        //MLVB 登录
        liveroom.login({
            data: loginInfo,
            success: (ret) => {
                //登录成功，拉取房间列表
                this.data.firstshow = false
                this.data.isGetLoginInfo = true
                this.getRoomList()
                wx.hideLoading()
            },
            fail: (ret) => {
                //登录失败
                this.data.isGetLoginInfo = false
                wx.hideLoading()
                wx.showModal({
                    title: '提示',
                    content: ret.errMsg,
                    showCancel: false,
                    complete: () => {
                        wx.navigateBack({})
                    }
                })
            }
        })
    },

    /**
     * 刷新课表
     */
    refreshScheduleInfo() {
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
        const scheduleList = []

        data.forEach(coursesItem => {
            const coursesList = coursesItem.courses
            const group = coursesItem.group

            coursesList.forEach(item => {
                const lessonInfo = {
                    ...item,
                    time: this.formatLessonTime(item, group),
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

    },

    /**
     * 拉取房间列表
     * @return {[type]}            [description]
     */
    getRoomList() {
        if (!this.data.isGetLoginInfo) {
            wx.showModal({
                title: '提示',
                content: '登录信息初始化中，请稍后再试',
                showCancel: false
            })
            return
        }
        liveroom.getRoomList({
            data: {
                index: 0,
                cnt: 20
            },
            success: (ret) => {
                this.setData({
                    roomList: ret.rooms
                })
                console.log('获取房间列表成功111222333: ', this.data.roomList)
            },
            fail: (ret) => {
                console.log(ret)
                wx.showModal({
                    title: '获取房间列表失败',
                    content: ret.errMsg,
                    showCancel: false
                })
            }
        })
    },

    /**
     * 跳转到直播间
     */
    jumpLiveRoom() {
        const room = this.data.roomList[0]
        const url = '../mlvb-live-room-demo/live-room-page/room?roomID=' + room.roomID + '&roomName=' + room.roomInfo + '&userName=' + this.data.userName + '&accelerateURL=' + room.mixedPlayURL
        pageJump(url).then(() => {
        }).catch(() => {
        })
    },

    /**
     * 去直播页
     */
    jumpToLive() {
        const url = '../liveRoomList/liveRoomList'
        pageJump(url).then(() => {
        }).catch(() => {
        })
    }
})