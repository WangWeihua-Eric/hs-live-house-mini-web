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
                const id = `#text-${roomTextList.length - 1}`
                this.setData({
                    toIndex: id
                })
            }
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        value: '',
        toIndex: ''
    },

    /**
     * 组件的方法列表
     */
    methods: {
        onConfirm(event) {
            const text = event.detail
            this.setData({
                value: ''
            })
            this.triggerEvent('sendTextMsgEvent', {text: text})
        },
        onSendRose() {
            this.component && this.component.onSendRose()
        },
        onLinkTeacher() {
            this.triggerEvent('lintTeacher')
        },
    }
})
