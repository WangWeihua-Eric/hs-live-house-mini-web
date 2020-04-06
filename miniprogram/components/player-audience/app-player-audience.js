const webimhandler = require('../../pages/components/mlvb-live-room/webim_handler');
const liveroom = require('../../pages/components/mlvb-live-room/mlvbliveroomcore.js');

let roseNumber = 0
let roseTimeHandle = null

Component({
    component: null,

    /**
     * 组件的属性列表
     */
    properties: {
        roomTextList: {type: Array, value: []},
        showUserImgList: {type: Array, value: []},
        roomInfoData: {type: Object, value: {}},
        requestLinkError: {type: Boolean, value: false},
        requestLinkOk: {type: Boolean, value: false},
        linkPusherInfo: {type: Object, value: {}}
    },

    observers: {
        "roomTextList": function(roomTextList) {
            if(roomTextList && roomTextList.length) {
                const id = `text-${roomTextList.length - 1}`
                this.setData({
                    toIndex: id
                })
            }
        },
        "showUserImgList": function (showUserImgList) {
            console.log('showUserImgList', showUserImgList)
            this.setData({
                userImgList: showUserImgList
            })
        },
        "linkPusherInfo": function (linkPusherInfo) {
            if (!linkPusherInfo.url) {
                this.setData({
                    requestLinkOk: false
                })
            } else {
                this.setData({
                    requestLinkOk: true
                })
            }
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        value: '',
        toIndex: '',
        keyBoardHeight: 0,
        focusInput: false,
        userImgList: [],
        show: false,
        bgColor: 'rgba(0,0,0,0.75)',
        inCallLink: false,
        callTime: 0
    },

    /**
     * 组件的方法列表
     */
    methods: {
        onConfirm(event) {
            const text = event.detail
            if (!text) {
                return
            }
            this.setData({
                value: ''
            })
            this.triggerEvent('sendTextMsgEvent', {text: text})
        },
        onFocus(event) {
            const keyBoardHeight = event.detail.height
            this.setData({
                keyBoardHeight: keyBoardHeight
            })
        },
        onClickInput() {
            this.setData({
                focusInput: true
            })
        },
        onBlur() {
            this.setData({
                focusInput: false
            })
        },
        onSendRose() {
            if (this.data.show) {
                this.setData({
                    show: false
                })
            } else {
                this.realSendRose()
            }
        },
        realSendRose() {
            if (roseTimeHandle) {
                clearTimeout(roseTimeHandle)
            }
            roseNumber++
            roseTimeHandle = setTimeout(() => {
                this.readyRose(roseNumber)
            }, 5000)
        },
        readyRose(number = 0) {
            if (!number) {
                return
            }

            console.log('id_sendroseid_sendrose')
            this.component = this.selectComponent("#id_sendrose")
            console.log('this.component', this.component)
            this.component.onSendRose()
            const userInfo = liveroom.getAccountInfo()
            const customMsg = {
                cmd: "AudienceCallLike",
                data: {
                    userID: userInfo.userID,
                    userName: userInfo.userName,
                    userAvatar: userInfo.userAvatar,
                    number: number
                }
            }
            const strCustomMsg = JSON.stringify(customMsg);
            webimhandler.sendCustomMsg({data: strCustomMsg, text: "notify"}, null)
            roseNumber = 0
        },

        onLinkTeacher() {
            this.setData({ show: true });
        },
        onClickLink() {
            this.triggerEvent('lintTeacher')
            this.setData({
                inCallLink: true
            })
            this.callTimeLoop()
        },
        onCloseSheet() {
            this.setData({ show: false });
        },
        callTimeLoop() {
            if (this.data.requestLinkError || this.data.requestLinkOk) {
                if (this.data.requestLinkError) {
                    wx.showModal({
                        title: '连麦失败',
                        content: '老师未接听',
                        showCancel: false
                    })
                }
                this.setData({
                    show: false,
                    inCallLink: false,
                    callTime: 0
                })
            } else {
                setTimeout(() => {
                    this.setData({
                        callTime: this.data.callTime + 1
                    })
                    this.callTimeLoop()
                }, 1000)
            }
        },

        onCallDown() {
            this.triggerEvent('onCallDown')
        }
    }
})
