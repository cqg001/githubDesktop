# Cloud框架

## 一、概述

为了简化微信小程序云的使用，写出了一个复用性比较高的框架，可以提高开发效率

## 二、官方文档

### Cloud框架下载

[Cloud框架【v1.6最新版】](https://6371-cqgg-1302842194.tcb.qcloud.la/cloud/wxcloud.rar?sign=4b71860af9edccecd1d55f88474eb017&t=1615014125)

### Cloud框架引入

**1. 解压到Pages**

解压框架到您项目的Pages文件夹

**2. config.js配置参数**

```js
  /**
   * 在这里配置相关的参数
   */
  let config={
      // 在这里填入你的环境id
      env:'cqgg',
      // 是否显示版本号
      version:true
  }
  //这里不要改变
  module.exports={
      config
  }
  
```

**3. 框架引入**

``` js
const db=require('../wxcloud/CloudDB')
```

**4.引入成功示例**

<img src="https://6371-cqgg-1302842194.tcb.qcloud.la/cloud/QQ%E6%88%AA%E5%9B%BE20210306150345.png?sign=ca2fbf5ce40d1ea0bc3d6a71f5c874c7&t=1615014254"/>

### Cloud框架学习

#### cloudAdd()

**概述：**支持向数据库中批量添加数据

**参数说明:**

| 参数名 | 参数类型 | 备注     |
| ------ | -------- | -------- |
| name   | String   | 数据库名 |
| json   | Object   | 传入数据 |

**调用示例：**

```js
let obj={
    id:'18413001',
    name:'cqg'
}
let json=[{
    id:'18413001',
    name:'cqg'
},{
    id:'18413002',
    name:'wht'
}]
/*插入单条数据*/
db.cloudAdd('test',obj).then(res=>{
    console.log(res)
})
/*批量插入数据*/
db.cloudAdd('test',array).then(res=>{
    console.log(res)
})
```



#### cloudGet()

**概述：**能够获取数据库中的数据，有两种获取模式（auto,all）

**参数说明：**

| 参数名 | 参数类型 |   备注   |
| :----: | :------: | :------: |
|  name  |  String  | 数据库名 |
|  mode  |  String  | 获取模式 |
| count  |  Number  | 获取数目 |

**注**：mode模式有两种

- auto模式下，可以自定义获取多少条数据
- all模式下，获取数据库中所有数据

**调用示例：**

``` js
//如果省略第二个、第三个参数的话--默认最多取20条数据
db.cloudGet('test').then(res=>{
    console.log(res)
})
//启动auto模式，可以自由控制取多少条数据
db.cloudGet('test','auto',12).then(res=>{
    console.log(res)
})
//启动all模式，可以取全部数据（不推荐使用all模式）
//(由于已经获取全部数据了，所以第三个参数可以省略)
db.cloudGet('test','all').then(res=>{
    console.log(res)
})
```



#### cloudGetToPage()

**概述：**能够实现分页数据的获取，能够满足分页需求

**参数说明：**

|  参数名   | 参数类型 |    备注    |
| :-------: | :------: | :--------: |
|   name    |  String  | 数据库名字 |
|  pageTo   |  Number  |    页码    |
| pageLenth |  Number  | 每页数据量 |
|   mode    |  String  |    模式    |

**注**：mode模式有两种

- `<=`模式 --- 获取前几页内容（ex:获取前2页内容）

- `==`模式 --- 获取第几页内容（ex:只获取第2页的内容）

**调用示例：**

``` js
//获取前两页数据
db.cloudGetToPage('test',2,20,'<=').then(res=>{
      console.log(res)
})
//获取第二页数据
db.cloudGetToPage('test',2,10,'<='.then(res=>{
    console.log(res)
})
```



#### cloudQuery()

**概述：**能够根据条件查询数据，最多只能返回20条符合条件的结果

**参数说明：**

| 参数名 | 参数类型 |   备注   |
| :----: | :------: | :------: |
|  name  |  String  | 数据库名 |
| where  |  Object  | 查询条件 |
|  mode  |  String  | 查询模式 |

**注：**mode模式有两种

- `clear`模式 ==> 进行精确查找
- `fuggy`模式 ==> 进行模糊查询

**调用示例：**

``` js
//精确查找
db.cloudQuery("test",{
    id:'18413001',
    name:'cqg'
}).then(res=>{
    console.log(res)
})
//模糊查找（模糊查找就是只输入一部分就能匹配到）
db.cloudQuery("test",{
    id:'1841',
    name:'cq'
},"fuggy").then(res=>{
    console.log(res)
})
```



#### cloudDelByID()

**概述：**能够根据id删除数据，支持传入id数组

**参数说明：**

| 参数名 |   参数类型    |       备注       |
| :----: | :-----------: | :--------------: |
|  name  |    String     |     数据库名     |
|   id   | String、Array | id数组或者字符串 |

**调用示例：**

``` js
//根据id删除一条数据
db.cloudDelByID('test',"043ba0325f3921610092ffb421dae65d").then(res=>{
    console.log(res)
})
//根据id数组批量删除数据
db.cloudDelByID('test',["043ba0325f3921610092ffb421dae65d","9ffb2a485f39219f009e9ee21f339b05"]).then(res=>{
    console.log(res)
})
```



#### cloudDelByQuery()

**概述：**能够根据查询条件删除数据

**参数说明：**

| 参数名 | 参数类型 |   备注   |
| :----: | :------: | :------: |
|  name  |  String  | 数据库名 |
| where  |  Object  | 查询条件 |

**调用示例：**

``` js
//根据查询条件删除数据（符合条件的数据都会被删除！）
db.cloudDelByQuery('test', {
    name:'cqg'
}).then(res=>{
    console.log(res)
})
```



#### cloudUpdateByID()

**概述：**能够根据id更新数据

**参数说明：**

| 参数名 | 参数类型 |    备注    |
| :----: | :------: | :--------: |
|  name  |  String  |  数据库名  |
|   id   |  String  | 数据条目id |
| update |  Object  |  更新后的  |

**调用示例：**

``` js
//根据id更新数据的值
db.cloudUpdateByID("test",'b00064a760431f1d0897a0d37d82c012',{
    name:'cqg'
}).then(res=>{
    console.log(res)
})
```



#### cloudUpdateByQuery()

**概述：**能够根据自定义查询条件批量修改数据

**参数说明：**

| 参数名 | 数据类型 |   备注   |
| :----: | :------: | :------: |
|  name  |  String  | 数据库名 |
| where  |  Object  | 查询条件 |
| update |  Object  | 更新后的 |

**调用示例：**

``` js
//根据自定义查询条件，找到并修改数据
db.cloudUpdateByID("test",{
    id:'18413001'
},{
    name:'cqg'
}).then(res=>{
    console.log(res)
})
```

