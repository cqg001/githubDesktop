/**
 * @name：CloudDB
 * @author: Microcqg
 * @description：Provides easy access to cloud databases
 * @CSDN :https://blog.csdn.net/chengqige
 * @github :https://github.com/cqg001
 */
//引入配置参数
const cloud = require('./Config')
//显示版本号
if (cloud.config.version) {
    require('./version')
}
//使用云数据库
const db = wx.cloud.database()
//使用云数据库命令
const _command = db.command
//初始化云开发环境
function cloudinit() {
    wx.cloud.init({
        env: cloud.config.env
    }).then(res => {

    }).catch(res => {
        console.error("请在app.js中加入代码wx.cloud.init()")
    })
}
//初始化云环境
cloudinit()

//云数据库增加数据
async function cloudAdd(name, data) {
    let arr = [],
        len = 0,
        lowerror = false
    let promiseID = []
    //检查数据库名字是否存在
    await db.collection(name).limit(1).get().then(res => {
        // console.log('存在')
    }).catch(res => {
        console.error("数据库名字写错了")
        lowerror = true
    })
    //犯了低级错误，数据库名字写错了
    if (lowerror) {
        return {
            code: 404,
            message: 'This database does not exist, please check the spelling',
            info: 'database ' + name + ' is not exist'
        }
    }
    //判断是不是对象类型
    if (typeof data != 'object') {
        console.error({
            code: 500,
            message: 'The second params must be a json object or a json array!!!'
        })
        return;
    }
    //判断是否为数组对象
    if (typeof data.length == 'undefined') {
        //如果不是数组对象则处理成数组
        arr.push(data)
    } else {
        arr = data
    }
    len = arr.length
    //循环添加数据
    arr.map((item) => {
        let promise = db.collection(name).add({
            data: item
        })
        promiseID.push(promise)
    })
    //全部添加完毕后给出反馈
    await Promise.all(promiseID)
    return {
        code: 200,
        message: 'Data added successfully!',
        info: name + ' added in ' + len + ' data'
    }
}
//云数据库获取数据
async function cloudGet(name, para = 'auto', number = 20) {
    const Max_limit = 20
    let count, limit, dataArray = [],
        lowerror = false
    const num = await db.collection(name).count()
    //过滤参数
    if (para == 'auto') {
        let term
        term = number
        if (number > num.total) {
            number = num.total
        }
        //计算需要取几次
        count = Math.ceil(number / Max_limit)
        number = term
        if (count > 1) {
            limit = Max_limit
        } else {
            limit = number
        }
    } else if (para == 'all') {
        count = Math.ceil(num.total / Max_limit)
        limit = Max_limit
        number = Max_limit
    } else {
        console.error("不支持" + para + "这个参数")
    }
    for (let i = 0; i < count; i++) {
        if (i == count - 1) {
            limit = number % Max_limit
        }
        let res = await db.collection(name).skip(i * Max_limit).limit(limit).get()
        dataArray = dataArray.concat(res.data)
    }
    if (para == "auto" && number == 20) {
        console.warn("当前参数作用下，最多获取20条数据")
    } else if (para == "auto") {
        console.warn("当前参数作用下，最多获取" + number + "条数据")
    } else if (para == "all") {
        console.warn("当前参数作用下，获取所有数据")
    }
    return dataArray
}
//获取分页数据
async function cloudGetToPage(name, pageTo = 2, pageLength = 10, mode = '==') {
    let para = true
    if (pageLength > 20) {
        return {
            code: 400,
            message: '每页的数据太多了',
            info: '每页数据应该小于20条'
        }
    }
    console.warn("当前每页长度：" + pageLength)
    if (mode == '<=') {
        console.warn("当前参数会取出前" + pageTo + "页数据")
        var res = await cloudGet(name, 'auto', pageTo * pageLength)
        para = false
    }
    if (para) {
        console.warn("当前参数会取出第" + pageTo + "页数据")
        if (pageTo <= 0) {
            console.error("pageTo参数不合法")
            return {
                code: 500,
                message: '不合法参数',
                info: 'pageTo不合法'
            }
        }
        var res = await db.collection(name).skip((pageTo - 1) * pageLength).limit(pageLength).get()
        return res.data
    } else {
        // console.log(res)
        return res
    }
}
//根据id删除数据（支持传入id数组）
async function cloudDelByID(name, id) {
    let arr = [],
        promiseID = [],
        flag = true
    var lowerror = false
    if (typeof id == 'string') {
        arr.push(id)
    } else {
        arr = id
    }
    arr.map((item) => {
        const res = db.collection(name).where({
            _id: item,
        }).remove().then(res => {
            if (res.stats.removed == 0) {
                flag = false
            }
        }).catch(res => {
            console.error("数据库名字写错")
            lowerror = true
        })
        promiseID.push(res)
    })
    await Promise.all(promiseID)
    if (flag) {
        if (!lowerror) {
            return {
                code: 200,
                message: 'Successfully deleted ' + arr.length + ' data'
            }
        } else {
            return {
                code: 500,
                message: 'The database name is wrong'
            }
        }
    } else {
        return {
            code: 404,
            message: "Some of these ids are not exist in the database",
            info: '请检查id是否存在，也有可能是数据库权限问题，请在云开发调整数据库权限！！！'
        }
    }
}

//根据条件批量删除数据
async function cloudDelByQuery(name, where) {
    let len = 0,
        promiseID = [],
        finish = false
    var lowerror = false
    const datalenth = await db.collection(name).count()
    let length = datalenth.total
    //数据类型判断
    if (typeof where != 'object' && where.length != 'undefined') {
        console.error("必须传入JSON格式数据")
        return {
            code: 500,
            message: 'JSON object is required',
            info: 'Not pass in ' + typeof where + ' type of data. check out please!'
        }
    }
    let cont = 0
    // console.log(length)
    //循环删除
    for (let i = 0; i < length; i++) {
        await db.collection(name).where(where).remove().then(res => {
            cont++
            // console.log(res)
            len += res.stats.removed
            if (res.stats.removed == 0) {
                finish = true
            }
        }).catch(res => {
            console.error("数据库名字写错")
            lowerror = true
        })
        if (finish) {
            break;
        }
    }
    if (lowerror) {
        return {
            code: 500,
            message: 'The database name is wrong'
        }
    }
    // console.log(cont)
    if (length == 0) {
        return {
            code: 400,
            message: '数据库中没有任何数据'
        }
    }
    if (cont == 1) {
        return {
            code: 404,
            message: "Some of query params values are not exist in the database",
            info: '整个数据库中没有符合查询条件的数据'
        }
    } else {
        return {
            code: 200,
            message: 'Successfully deleted ' + len + ' data'
        }
    }
}
async function cloudQuery(name, where, mode = 'clear') {
    console.warn("查询语句，最多只能获取20条符合条件的数据！")
    if(typeof where != "object"){
        console.error("查询条件（第二个参数）不是json对象，请检查！")
        return {
            code:500,
            mesaage:'param is invalid!'
        }
    }
    if (mode == 'clear') {
        where = where
        var res = await db.collection(name).where(where).get()
    } else{
        let keys = Object.keys(where)
        let len=keys.length
        let paras=[]
        for(let i=0;i<len;i++){
            let key=keys[i]
            let para={
                [key]:db.RegExp({
                    regexp:where[key],
                    options:'i'
                })
            }
            paras.push(para)
        }
        var res= await db.collection(name).where(_command.or(paras)).get()
    }
    return res.data
}
//根据id修改数据库
async function cloudUpdateByID(name,id,update={}){
    // console.log(name,id)
    if(typeof update!="object"){
        console.error("第三个参数必须是json对象！")
        return {
            code:500,
            message:'第三个参数格式不合法'
        }
    }
    const res2=await db.collection(name).where({
        _id:id
    }).update({
        data:update
    })
    return {
        code:200,
        message:'database '+name+" update sucessfull!",
        info:"1 data was successfully updated"
    }
}

//根据查询条件修改数据库的修改
async function cloudUpdateByQuery(name,where,update){
    if(typeof where != "object" || typeof update !="object"){
        console.error("第二个参数、第三个参数必须是json对象！")
        return{
            code:500,
            message:'2,3参数必须是json对象！'
        }
    }
    const res= await db.collection(name).where(where).update({
        data:update
    })
    // console.log(res.stats.updated)
    let cont=res.stats.updated
    return {
        code:200,
        message:'database '+name+" update sucessfull!",
        info:cont+" data was successfully updated"
    }
}
module.exports = {
    cloudAdd,
    cloudGet,
    cloudGetToPage,
    cloudQuery,
    cloudDelByID,
    cloudDelByQuery,
    cloudUpdateByID,
    cloudUpdateByQuery
}