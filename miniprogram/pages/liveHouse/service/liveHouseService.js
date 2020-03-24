import {HttpUtil} from "../../../utils/http-utils/http-util";
import {UserBase} from "../../../utils/user-utils/user-base";
import {isSessionReady} from "../../../utils/user-utils/user-base-utils";

let singletonPattern = null;

export class LiveHouseService {
    http = new HttpUtil()
    userBase = new UserBase()

    constructor() {
        if (singletonPattern) {
            return singletonPattern
        }
        singletonPattern = this
    }

    //  格式时间
    formatYMD(time) {
        return time.getFullYear() + '-' + this.addZero(time.getMonth() + 1) + '-' + this.addZero(time.getDate())
    }

    //  数字补0操作
    addZero(num) {
        return num < 10 ? '0' + num : num;
    }

    /**
     * 获取播放列表
     */
    getScheduleInfo(startTime = '', finishTime = '') {
        if (!startTime || !finishTime) {
            const now = new Date();
            const nowTime = now.getTime();
            const day = now.getDay();
            const oneDayTime = 24 * 60 * 60 * 1000;
            const MondayTime = nowTime - (day - 1) * oneDayTime;//显示周一
            const SundayTime = nowTime + (15 - day) * oneDayTime;//显示周日

            const nowDate = new Date(MondayTime)
            const endDate = new Date(SundayTime)

            if (!startTime) {
                startTime = this.formatYMD(nowDate)
            }
            if (!finishTime) {
                finishTime = this.formatYMD(endDate)
            }
        }

        const url = '/course/api/schedules'
        const params = {
            startTime: startTime,
            finishTime: finishTime
        }

        return new Promise((resolve, reject) => {
            isSessionReady().then(res => {
                if (res) {
                    this.http.get(url, params, this.userBase.getGlobalData().sessionId).then(res => {
                        if (res && res.state && res.state.code === '0') {
                            resolve(res.data)
                        } else {
                            reject(res)
                        }
                    }).catch((err) => {
                        reject(err)
                    })
                } else {
                    // 获取 sessionId 失败
                    reject('获取 sessionId 失败')
                }
            }).catch(err => {
                reject(err)
            })
        })
    }
}