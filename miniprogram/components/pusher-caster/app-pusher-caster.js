// components/pusher-caster/app-pusher-caster.js
import {debounceForFunction} from "../../utils/time-utils/time-utils";

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        roomTextList: {type: Array, value: []},
        pusherStatus: {type: Number, value: 1},
        beauty: {type: Number, value: 5},
        requestJoinAnchorList: {type: Array, value: []}
    },

    /**
     * 组件的初始数据
     */
    data: {
        playStatus: 0,
        readyTime: 3,
        toIndex: '',
        showMessage: true,
        frontCamera: true,
        show: false,
        bgColor: 'rgba(0,0,0,0.75)',
        inLink: false,
        inLinkUser: {}
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
        "showMessage": function (showMessage) {
            if(showMessage) {
                const roomTextList = this.data.roomTextList
                if(roomTextList && roomTextList.length) {
                    const id = `text-${roomTextList.length - 1}`
                    this.setData({
                        toIndex: id
                    })
                }
            }
        }
    },

    /**
     * 组件的方法列表
     */
    methods: {
        onPlayLive() {
            this.setData({
                playStatus: 2
            })
            this.onReadyPlay()
        },
        onReadyPlay() {
            setTimeout(() => {
                if (this.data.readyTime > 0) {
                    const time = this.data.readyTime - 1
                    this.setData({
                        readyTime: time
                    })
                    this.onReadyPlay()
                } else {
                    this.toPaly()
                }
            }, 1000)
        },
        toPaly() {
            this.setData({
                playStatus: 3
            })
            this.triggerEvent('casterStartEvent')
        },
        onShowMessage() {
            this.setData({
                showMessage: !this.data.showMessage
            })
        },
        onChangeBeauty() {
            if(debounceForFunction()) {
                return
            }
            this.triggerEvent('changeBeautyEvent')
        },
        onSwitchCameraEvent() {
            if(debounceForFunction()) {
                return
            }
            const frontCamera = this.data.frontCamera
            this.setData({
                frontCamera: !frontCamera
            })
            this.triggerEvent('switchCameraEvent')
        },
        onCloseSheet() {
            this.setData({ show: false });
        },

        onShowSheet() {
            this.setData({ show: true });
        },
        onResolveLinkEvent(event) {
            const audience = event.currentTarget.dataset.value
            const params = {
                agree: true,
                audience: audience
            }
            this.triggerEvent('opLinkEvent', params)
            this.onCloseSheet()
            this.setData({
                inLink: true,
                inLinkUser: audience
            })
        },
        onRejectLinkEvent(event) {
            const params = {
                agree: false,
                audience: event.currentTarget.dataset.value
            }
            this.triggerEvent('opLinkEvent', params)
        },
        onCloseLink() {
            const closeUser = this.data.inLinkUser
            if (closeUser) {
                this.triggerEvent('onCloseLinkEvent', closeUser)
            }
            this.setData({
                inLink: false,
                inLinkUser: {}
            })
        }
    }
})
