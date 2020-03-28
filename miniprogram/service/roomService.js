const liveroom = require('../pages/components/mlvb-live-room/mlvbliveroomcore.js')
const GenerateTestUserSig = require("../pages/mlvb-live-room-demo/debug/GenerateTestUserSig.js")

let singletonPattern = null;

export class RoomService {
    constructor() {
        if (singletonPattern) {
            return singletonPattern
        }
        singletonPattern = this
    }

    /**
     * 登录房间
     */
    loginRoom(roomId, userName) {
        const roomSig = GenerateTestUserSig.genTestUserSig(roomId)

        const loginInfo = {
            sdkAppID: roomSig.sdkAppID,
            userID: roomId,
            userSig: roomSig.userSig,
            userName: userName,
            userAvatar: ''
        }

        return new Promise((resolve, reject) => {
            //  MLVB 登录
            liveroom.login({
                data: loginInfo,
                success: (res) => {
                    //  登录成功
                    resolve(res)
                },
                fail: (err) => {
                    //  登录失败
                    reject(err)
                }
            })
        })
    }
}