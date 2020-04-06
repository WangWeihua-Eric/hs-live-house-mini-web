const liveroom = require('../pages/components/mlvb-live-room/mlvbliveroomcore.js')

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
    loginRoom(roomId, userName, userSig, roomAppId) {

        const loginInfo = {
            sdkAppID: roomAppId,
            userID: roomId,
            userSig: userSig,
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