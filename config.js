// const URL_getCghsList = 'http://erp.tiantaigarment.com/erp/27.TS.10.30.20.60.do.ui?wsp=TT_STD_CONF&lang=zh_CN&theme=themef1';

const URL_getCghscodeInfo = 'http://erp.tiantaigarment.com/erp/27.TS.10.30.16.20.do.ui?wsp=TT_STD_CONF&lang=zh_CN&theme=themef1';

// const params_getCghsList = {
//    'command': 1,
//    'matchtype': 20,
//    '__Json_.Page._PgRows': 10,
//    '__uiid': '27.TS.10.30.20.60.02',
// }

const params_getCghscodeInfo = {
   'command': '#getCghscodeInfo',
   '__uiid': '27.TS.10.30.16.20.03',
   'cghscode': '0101210090'
}

const exportUrl = 'http://erp.tiantaigarment.com/erp/TT_STD_CONF/zh_CN/themef1/27.TS.10.30.16.20.html?sheetcode=27.TS.10.30.15&OpenSheetUIID=27.TS.10.30.16.20&action=4&theme=themef1&SHEETCODE=27.TS.10.30.15&InitValue.gicode=%3CNULL%3E&InitTable.ccode=TT0010000000000000097&InitTable.cuicode=TT001&InitTable.wname=%E7%8E%8B%E5%B2%A9&InitTable.exbcode=%3CNULL%3E&InitTable.serviceunitcode=TT0010000000000000001&InitTable.grpccode=%3CNULL%3E&InitTable.exwcode=%3CNULL%3E&InitTable.busimode=10&InitTable.trustrelaid=TT0240000000000000001&InitTable.bcode=TT001B00000020&InitTable.servicesitecode=TT0010000000000000003&InitTable.wcode=TT001W00000004&pageId=27.TS.10.30.16.20?theme=themef1.%3CNULL%3E'

const importUrl = 'http://erp.tiantaigarment.com/erp/TT_STD_CONF/zh_CN/themef1/27.TS.10.30.26.20.html?sheetcode=27.TS.10.30.25&OpenSheetUIID=27.TS.10.30.26.20&action=4&theme=themef1&SHEETCODE=27.TS.10.30.25&InitValue.gicode=%3CNULL%3E&InitTable.ccode=TT0010000000000000097&InitTable.cuicode=TT001&InitTable.wname=%E7%8E%8B%E5%B2%A9&InitTable.exbcode=%3CNULL%3E&InitTable.serviceunitcode=TT0010000000000000001&InitTable.grpccode=%3CNULL%3E&InitTable.exwcode=%3CNULL%3E&InitTable.busimode=10&InitTable.trustrelaid=TT0240000000000000001&InitTable.bcode=TT001B00000020&InitTable.servicesitecode=TT0010000000000000003&InitTable.wcode=TT001W00000004&pageId=27.TS.10.30.26.20.%3CNULL%3E'

const cookie = {
    name:'RSESSIONID',
    value:'2475953486667F7B1D009AA5370AB931',
    domain:'erp.tiantaigarment.com',
    path:'/erp',
    // expires:'2019-10-11T11:15:31.618Z'
}

module.exports={
    // listUrl:URL_getCghsList,
    // listParams:params_getCghsList,
    importUrl,
    exportUrl,
    cookie,
    // infoUrl:URL_getCghscodeInfo,
    // infoParams:params_getCghscodeInfo,
}