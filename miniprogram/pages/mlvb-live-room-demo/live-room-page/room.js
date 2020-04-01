import {getSetting, getUserInfo} from "../../../utils/wx-utils/wx-base-utils";
import {login} from "../../../utils/wx-utils/wx-cloud-utils";

const liveroom = require('../../components/mlvb-live-room/mlvbliveroomcore.js')
const GenerateTestUserSig = require("../../mlvb-live-room-demo/debug/GenerateTestUserSig.js")

const app = getApp()
let loadOptions = {}
let openId = ''

Page({
    component: null,
    data: {
        userName: '',
        roomID: '',
        roomName: '',
        pureAudio: false,
        role: 'audience',
        showLiveRoom: false,
        rooms: [],
        comment: [],
        linked: false,
        debug: false,
        frontCamera: true,
        inputMsg: [],
        muted: false,
        toview: '',
        beauty: 5,
        shouldExit: false,
        phoneNum: '',
        headerHeight: app.globalData.headerHeight,
        statusBarHeight: app.globalData.statusBarHeight,
        inputFocus: false,
        scopeUserInfo: true
    },

    refresh(options) {
        getUserInfo().then(userInfo => {
            console.log('userInfo: ', userInfo)
            if (userInfo && userInfo.userInfo) {
                const userData = userInfo.userInfo
                const userId = openId
                const userName = userData.nickName
                const userAvatar = userData.avatarUrl

                wx.showLoading({
                    title: '登录信息获取中',
                })

                const userSig = GenerateTestUserSig.genTestUserSig(userId)

                const loginInfo = {
                    sdkAppID: userSig.sdkAppID,
                    userID: userId,
                    userSig: userSig.userSig,
                    userName: userName,
                    userAvatar: userAvatar
                }

                //MLVB 登录
                liveroom.login({
                    data: loginInfo,
                    success: () => {
                        //登录成功
                        wx.hideLoading()

                        const role = options.type == 'create' ? 'anchor' : 'audience';

                        if (role == 'audience') {
                            this.setData({
                                roomID: options.roomID,
                                roomName: options.roomName,
                                userName: options.userName,
                                role: role,
                                showLiveRoom: true
                            }, function () {
                                this.start();
                            })
                        } else {
                            this.setData({
                                roomName: options.roomName,
                                userName: options.userName,
                                pureAudio: JSON.parse(options.pureAudio),
                                role: role,
                                showLiveRoom: true
                            }, function () {
                                this.start();
                            })
                        }

                    },
                    fail: (ret) => {
                        //登录失败
                        wx.hideLoading()
                        wx.showModal({
                            title: '提示',
                            content: ret.errMsg,
                            showCancel: false,
                            complete: () => {}
                        })
                    }
                })
            }
        }).catch(() => {})
    },

    onLoad: function (options) {
        loadOptions = options
        login().then(res => {
            if (res && res.result && res.result.openid) {
                openId = res.result.openid

                getSetting('scope.userInfo').then(scopeRes => {
                    if (scopeRes) {
                        //  已授权
                        this.setData({
                            scopeUserInfo: true
                        })
                        this.refresh(options)
                    } else {
                        //  未授权
                        this.setData({
                            scopeUserInfo: false
                        })
                    }
                }).catch(err => {
                    //  接口出错当未授权处理
                    this.setData({
                        scopeUserInfo: false
                    })
                })
            }
        }).catch(() => {

        })
    },

    onReady: function () {
        var self = this;
        wx.setNavigationBarTitle({
            title: self.data.roomName
        })
    },

    onRoomEvent: function (e) {
        var self = this;
        var args = e.detail;
        console.log('onRoomEvent', args)
        switch (args.tag) {
            case 'roomClosed': {
                wx.showModal({
                    content: `房间已解散`,
                    showCancel: false,
                    complete: () => {
                        // wx.navigateBack({delta: 1})
                    }
                });
                break;
            }
            case 'error': {
                wx.showToast({
                    title: `${args.detail}[${args.code}]`,
                    icon: 'none',
                    duration: 1500
                })
                if (args.code == 5000) {
                    this.data.shouldExit = true;
                } else {
                    console.error("收到error:", args)
                    if (args.code != -9004) {
                        setTimeout(() => {
                            wx.navigateBack({delta: 1})
                        }, 1500)
                    } else {
                        self.setData({
                            linked: false,
                            phoneNum: ''
                        })
                    }
                }
                break;
            }
            case 'linkOn': { // 连麦连上
                self.setData({
                    linked: true,
                    phoneNum: ''
                })
                break;
            }
            case 'linkOut': { //连麦断开
                self.setData({
                    linked: false,
                    phoneNum: ''
                })
                break;
            }
            case 'recvTextMsg': {
                console.log('收到消息:', e.detail.detail);
                var msg = e.detail.detail;
                self.data.comment.push({
                    content: msg.message,
                    name: msg.userName,
                    time: msg.time
                });
                self.setData({
                    comment: self.data.comment,
                    toview: ''
                });
                // 滚动条置底
                self.setData({
                    toview: 'scroll-bottom'
                });
                break;
            }
            case 'requestJoinAnchor': { //收到连麦请求
                var jioner = args.detail;
                var showBeginTime = Math.round(Date.now());
                wx.showModal({
                    content: `${jioner.userName} 请求连麦`,
                    cancelText: '拒绝',
                    confirmText: '接受',
                    success: function (sm) {
                        var timeLapse = Math.round(Date.now()) - showBeginTime;
                        if (timeLapse < 10000) {
                            if (sm.confirm) {
                                console.log('用户点击同意')
                                self.component && self.component.respondJoinAnchor(true, jioner);
                            } else if (sm.cancel) {
                                console.log('用户点击取消')
                                self.component && self.component.respondJoinAnchor(false, jioner);
                            }
                        } else {
                            wx.showToast({
                                title: '连麦超时',
                            })
                        }
                    }
                })
                break;
            }
            default: {
                console.log('onRoomEvent default: ', e)
                break;
            }
        }
    },

    start: function () {
        var self = this;
        self.component = self.selectComponent("#id_liveroom")
        console.log('self.component: ', self.component)
        console.log('self:', self);
        self.component.start();
    },
    onLinkClick: function () {
        var self = this;
        self.component && self.component.requestJoinAnchor();
        self.setData({
            phoneNum: 'phone-1'
        })
        self.setInternal();
    },
    setInternal: function () {
        var self = this;
        setTimeout(() => {
            if (!self.data.phoneNum) {
                return;
            }

            var curPhoneNum = '';
            switch (self.data.phoneNum) {
                case 'phone-1':
                    curPhoneNum = 'phone-2';
                    break;
                case 'phone-2':
                    curPhoneNum = 'phone-3';
                    break;
                case 'phone-3':
                    curPhoneNum = 'phone-1';
                    break;
                default:
                    break;
            }
            self.setData({
                phoneNum: curPhoneNum
            })
            self.setInternal();
        }, 500);
    },
    goRoom: function (e) {
        var self = this;
        var index = parseInt(e.currentTarget.dataset.index);
        var roomID = self.data.rooms[index].roomID;
        self.setData({
            roomID: roomID
        })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        if (this.data.shouldExit) {
            wx.showModal({
                title: '提示',
                content: "收到退房通知",
                showCancel: false,
                complete: function () {
                    wx.navigateBack({delta: 1});
                }
            });
        }
        var self = this;
        self.component && self.component.resume();
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        var self = this;
        self.component && self.component.pause();
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        var self = this;
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
        return {
            // title: '多人音视频',
            // path: '/pages/multiroom/roomlist/roomlist',
            // path: '/pages/home-page/main',
            imageUrl: 'https://mc.qcloudimg.com/static/img/dacf9205fe088ec2fef6f0b781c92510/share.png'
        }
    },

    showLog: function () {
        var self = this;
        self.setData({
            debug: !self.data.debug
        })
    },
    changeMute: function () {
        var self = this;
        self.setData({
            muted: !self.data.muted
        })
    },
    setBeauty: function () {
        var self = this;
        self.setData({
            beauty: self.data.beauty == 5 ? 0 : 5
        })
    },
    sendTextMsg() {
        this.setData({
            inputFocus: true
        })
        // this.component && this.component.sendTextMsg('老师你好啊')
    },
    changeCamera: function () {
        var self = this;
        self.component && self.component.switchCamera();
        self.setData({
            frontCamera: !self.data.frontCamera
        })
    },
    bindInputMsg: function (e) {
        this.data.inputMsg = e.detail.value;
    },
    onBack: function () {
        wx.navigateBack({
            delta: 1
        });
    },

    onClickGetUserInfo() {
        getSetting('scope.userInfo').then(scopeRes => {
            if (scopeRes) {
                //  已授权
                this.setData({
                    scopeUserInfo: true
                })
                this.refresh(loadOptions)
            } else {
                //  未授权
                this.setData({
                    scopeUserInfo: false
                })
            }
        }).catch(err => {
            //  接口出错当未授权处理
            this.setData({
                scopeUserInfo: false
            })
        })
    }
})
