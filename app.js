const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const qs = require('qs')
const util = require('util');
const axios = require('axios');
const log = require('./utils/log');
const CONF = require('./config');

const appendFile = util.promisify(fs.appendFile);

const getListByNum = async ({
    browser,
    url,
    pageNum,
    cookie
})=>{
    const page = await browser.newPage();
    page.setCookie({...CONF.cookie,value:cookie})
    log.green('>>>>>> 发送页面请求 ...')
    log.yellow(url.slice(0,50)+'...')

    await page.goto(url);
    log.green('>>>>>> 页面加载中 ...')
    await page.waitFor(1500);

    const inputForm = await page.$('#UIA_gcodedetail_cghscode')
    const panelBtn = await inputForm.$('.ui-input-combobtn')

    await panelBtn.click()
    await page.waitForSelector('#_PaneFrame')
    log.green('>>>>>> 解析Panel列表 ...')
    await page.$eval('#input-gopage',el=>el.value='')
    await page.type('#input-gopage',`${pageNum}`)
    const goPageBtn = await page.$('#btn-gopage');
    await goPageBtn.click();
    await page.waitFor(1500);

    log.green('>>>>>> 到达指定列表页 ...')
    const res = await page.evaluate(() => {
        const panelDom = document.querySelector('#UI_hscode');
        const tbodyDom = panelDom.querySelector('tbody');
        const trDomList = [...tbodyDom.querySelectorAll('tr')]
        const resultList = []
        trDomList.forEach(
            (trDom)=>{
                const tdDomList = [...trDom.querySelectorAll('td')];
                resultList.push({
                    code: tdDomList[1].innerText.trim(), //海关编码
                    name: tdDomList[2].innerText.trim(), //海关商品名
                    valueAddRate: tdDomList[3].innerText.trim(), //增值税率
                    exportDrawback: tdDomList[4].innerText.trim(), //出口退税
                    exportDutyCommon: tdDomList[6].innerText.trim(), //出口税率普通
                    exportDutySpecial: tdDomList[7].innerText.trim(), //出口税率特别
                    importDutyCommon: tdDomList[6].innerText.trim(), //进口税率普通
                    importDutySpecial: tdDomList[7].innerText.trim(), //进口税率特别
                    regulationConditions: tdDomList[5].innerText.trim(), //监管条件
                    // declarationElement: tdDomList[3].innerText.trim(), //报关要素
                })
            }
        )
        return resultList;
    });
    await page.close();
    log.green('>>>>>> 关闭Tab ...')
    return res;
}

const mergeList = ({
    importList,
    exportList,
})=>{
    if(importList.length === exportList.length){
        const hsList = importList.map((item,index)=>{
            item.exportDutyCommon = exportList[index].exportDutyCommon;
            item.exportDutySpecial = exportList[index].exportDutySpecial;
            return item;
        })
        return hsList || []
    }else{
        throw new Error(`
            importList:${importList.length},
            exportList:${exportList.length}
        `)
        return []
    }
}

const getHsInfo = async (cghscode,cookie)=>{
    const option = {
        url: CONF.infoUrl,
        method: "post",
        headers:{ Cookie:`${CONF.cookie.name}=${cookie}` },
        data: qs.stringify({...CONF.infoParams,cghscode}),
    }
    const rawInfo = await axios(option).then(res=>JSON.stringify(res.data))
    const reg = /(1:.+;)/g;
    const infoArr = reg.exec(rawInfo);
    return infoArr.length>0?infoArr[0]:''
}

const craw = async ({
    minPage,
    maxPage,
    cookie,
})=>{
    try {
        //打开浏览器，进入谷歌翻译网页
        const browser = await puppeteer.launch({ devtools:false, headless: false });
        const allHsInfo = [];

        for(var i=minPage; i<=maxPage; i++){

            const importList = await getListByNum({
                browser,
                url:CONF.importUrl,
                pageNum:i,
                cookie,
            })
            const exportList = await getListByNum({
                browser,
                url:CONF.exportUrl,
                pageNum:i,
                cookie,
            })
            const hsList = mergeList({
                importList,
                exportList,
            })

            for(let j = 0; j<hsList.length; j++){
                hsList[j].declarationElement = await getHsInfo(hsList[j].code,cookie)
                allHsInfo.push(hsList[j])
            }

            log.yellow('>>>>>>完成页面 '+i)
        }

        log.green('>>>>>>done')
        
        browser.close();

        return {
            minPage,
            maxPage,
            data:await allHsInfo
        }
    }catch (e) {
        console.log(e);
    }

};

craw({
    minPage:1,
    maxPage:2,
    cookie:'13B9F97FCB7E90A23336C54F61A9993D',
});

// module.exports={ craw }