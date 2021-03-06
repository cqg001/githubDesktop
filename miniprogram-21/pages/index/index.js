// index.js
// 获取应用实例
const app = getApp()
const db=require('../wxcloud/CloudDB')
Page({
  data: {
    motto:"Cloud框架使用",
    url:"https://thirdwx.qlogo.cn/mmopen/vi_32/py91NicIGOWNu8kGoC1g7nJcoo6b977XT7ZDc8oLibicnq6Kbco1aejLqGhuvZOrHASx9zVp0lwGyNlGelmpzVQfw/132",
  },
  onLoad() {
    let json={
      id:'18413002',
      name:'cqg'
    }
    db.cloudUpdateByID("show","b00064a760431f1d0897a0d37d82c012",{
      id:'17413201',
    }).then(res=>{
      console.log(res)
    })
    const res= db.cloudUpdateByQuery("show",{
      id:'18413001'
    },{
      name:'cqg'
    }).then(res=>{
      console.log(res)
    })
  },
})
