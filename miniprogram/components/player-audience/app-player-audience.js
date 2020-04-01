const webimhandler = require('../../pages/components/mlvb-live-room/webim_handler');

let inRoomImg = []

Component({
    component: null,

    /**
     * 组件的属性列表
     */
    properties: {
        roomTextList: {type: Array, value: []}
    },

    lifetimes: {
        attached() {
            this.component = this.selectComponent("#id_sendrose")
        }
    },

    observers: {
        "roomTextList": function(roomTextList) {
            if(roomTextList && roomTextList.length) {
                const id = `text-${roomTextList.length - 1}`
                this.setData({
                    toIndex: id
                })

                const lastRoomTextInfo = roomTextList[roomTextList.length - 1]
                switch (lastRoomTextInfo.type) {
                    case 'AudienceEnterRoom': {
                        inRoomImg.push(lastRoomTextInfo.userAvatar)
                        const userImgList = this.data.userImgList
                        if (userImgList.length < 3) {
                            userImgList.push(lastRoomTextInfo.userAvatar)
                            this.setData({
                                userImgList: userImgList
                            })
                        }
                        break
                    }
                    case 'AudienceLeaveRoom': {
                        inRoomImg = inRoomImg.filter(item => item !== lastRoomTextInfo.userAvatar)
                        let userImgList = this.data.userImgList
                        if (userImgList.indexOf(lastRoomTextInfo.userAvatar) > -1) {
                            userImgList = inRoomImg.filter((item, index) => index < 3)
                            this.setData({
                                userImgList: userImgList
                            })
                        }
                        break
                    }
                }
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
        userImgList: []
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
            this.component && this.component.onSendRose()
            const customMsg = {
                cmd: "AudienceCallLike",
                data: {}
            }
            const strCustomMsg = JSON.stringify(customMsg);
            webimhandler.sendCustomMsg({data: strCustomMsg, text: "notify"}, null)
        },
        onLinkTeacher() {
            this.triggerEvent('lintTeacher')
        },
    }
})
