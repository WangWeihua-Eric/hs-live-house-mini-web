import {CasterLoginService} from "./service/casterLoginService";
import {pageJump} from "../../utils/wx-utils/wx-base-utils";

const md5 = require('md5');
const casterLoginService = new CasterLoginService()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        phoneValue: '18610637369',
        pwValue: '123456'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(md5('13364003436'));
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

    onPhChange(event) {
        // event.detail 为当前输入的值
        this.setData({
            phoneValue: event.detail
        })
    },

    onPwChange(event) {
        // event.detail 为当前输入的值
        console.log(event.detail);
        this.setData({
            pwValue: event.detail
        })
    },

    toLoginBtn() {
        const phone = this.data.phoneValue
        const phoneMd5 = md5(phone)
        const pwMd5 = md5(phoneMd5 + this.data.pwValue)
        const params = {
            phone: phone,
            passwd: pwMd5
        }

        casterLoginService.casterToLogin(params).then(res => {
            console.log(res)
            const sessionId = res.sessionId
            const url = `../liveRoomList/liveRoomList?sessionId=${sessionId}`
            pageJump(url).then(() => {
            }).catch(() => {
            })

        }).catch(e => {
            console.log(e)
        })
    }
})