const app = getApp()

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        debug: {type: Boolean, value: false},
        menuItems: {type: Array, value: []},
        isCaster: {type: Boolean, value: true},
        mainPusherInfo: {type: Object, value: {}},
        beauty: {type: Number, value: 5},
        muted: {type: Boolean, value: false},
        pureaudio: {type: Boolean, value: false},
        userName: {type: String, value: ''},
        visualPlayers: {type: Array, value: []},
        linkPusherInfo: {type: Object, value: {}},
        members: {type: Array, value: []},
        mode: {type: String, value: 'RTC'},
        roomname: {type: String, value: 'undefined'},
        headerHeight: {type: Number, value: app.globalData.headerHeight},
        statusBarHeight: {type: Number, value: app.globalData.statusBarHeight},
        roomTextList: {type: Array, value: []},
        pusherStatus: {type: Number, value: 0}
    },

    observers: {
        "pusherStatus": function (pusherStatus) {
            console.log("pusherStatus: ", pusherStatus)
        }
    },

    /**
     * 组件的初始数据
     */
    data: {},

    /**
     * 组件的方法列表
     */
    methods: {
        onSendTextMsg(event) {
            const param = event.detail
            this.triggerEvent('sendTextMsgEvent', param)
        },

        onMainPush(event) {
            this.triggerEvent('mainPushEvent', event)
        },


        onLinkTeacherEvent() {
            this.triggerEvent('lintTeacher')
        },
        onMainPlayState(e) {
            console.log('===> onMainPlayState: ', e)
            var self = this;
            //主播拉流失败不抛错误事件出去
            if (self.data.isCaster == true) {
                return;
            }
            switch (e.detail.code) {
                case -2301: {
                    // 多次拉流失败
                    console.error('多次拉流失败')
                    break;
                }

            }
        }
    }
})
