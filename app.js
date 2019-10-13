const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const util = require('util');
const log = require('./utils/log');
const CONF = require('./config')
const appendFile = util.promisify(fs.appendFile);

const getListByNum = async ({
    browser,
    url,
    pageNum
})=>{
    const page = await browser.newPage();
    page.setCookie(CONF.cookie)
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
    return res;
}

const mergeList = ({
    importList,
    exportList,
})=>{
    if(importList.length === exportList.length){
        return importList.map((item,index)=>{
            item.exportDutyCommon = exportList[index].exportDutyCommon;
            item.exportDutySpecial = exportList[index].exportDutySpecial;
            return item;
        })
    }else{
        throw new Error(`
            importList:${importList.length},
            exportList:${exportList.length}
        `)
    }
}

const getHsConf = (hsList)=>{
    log.red(hsList)
}

const craw = async ()=>{
    try {
        //打开浏览器，进入谷歌翻译网页
        const browser = await puppeteer.launch({headless: false});
        const importList = await getListByNum({
            browser,
            url:CONF.importUrl,
            pageNum:2,
        })
        const exportList = await getListByNum({
            browser,
            url:CONF.exportUrl,
            pageNum:2,
        })

        const hsList = mergeList({
            importList,
            exportList,
        })

        getHsConf(hsList);

        browser.close();
    }catch (e) {
        console.log(e);
    }

};

craw();