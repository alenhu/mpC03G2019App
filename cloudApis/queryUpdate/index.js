// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: 'sdc03g2019-qm23k'
})
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const collectName = event.collectName
  const udata = event.udata
  const uwhere = event.where
  console.log('collectName', collectName, 'udata', udata, 'uwhere', uwhere)
  const updateData = {}
  for (const index in udata) {
    for (const a in udata[index]) {
      // eslint-disable-next-line valid-typeof
      if (Array.isArray(udata[index][a])) {
        updateData[a] = _.push(udata[index][a])
      } else {
        updateData[a] = udata[index][a]
      }
    }
  }
  console.log('updateData', updateData)
  try {
    const res = await db.collection(collectName)
      .where(uwhere).update({
        data: updateData
      }
      )
    console.log('rrrrrr', res)
    return res
  } catch (err) {
    return err
  }
  // return {
  //   sum: event.a + event.b
  // }
}
