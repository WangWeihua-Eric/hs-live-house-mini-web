// components/pusher-caster/app-pusher-caster.js
import {debounceForFunction} from "../../utils/time-utils/time-utils";

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        roomTextList: {type: Array, value: []},
        pusherStatus: {type: Number, value: 1},
        beauty: {type: Number, value: 5}
    },

    /**
     * 组件的初始数据
     */
    data: {
        playStatus: 0,
        readyTime: 3,
        toIndex: '',
        showMessage: true,
        frontCamera: true
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
        }
    }
})
