const chalk = require('chalk');

const colorfulLog = (color)=>(...items)=>{
    const chalkedItems = items.map(it=>chalk[color](it))
    console.log(...chalkedItems)
}

const generateLogFn = (...colors)=>{
    const result = {};
    colors.forEach(col=>result[col]=colorfulLog(col))
    return result
}

module.exports = generateLogFn('green','yellow','red','blue')
