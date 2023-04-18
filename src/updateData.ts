import axios from "axios";
import fs from 'fs'
import { iFields, iModifyProfile, iXueqiuApiKline } from "./Interface";
import { STOCKS } from "./Symbols";

const COOKIE = `device_id=7aba93ff3e883fde881c41189c2177e3; s=bs11o4e8su; bid=0cb4d5daf93ad17128b32853f90d3be5_l9gowu4v; _ga=GA1.2.1152287702.1666247803; xq_is_login=1; u=3629171097; Hm_lvt_1db88642e346389874251b5a1eded6e3=1679986408,1679987081,1679991429,1680141316; xq_a_token=f27d7ad625536450279fe8135603cb1c1132b0c6; xqat=f27d7ad625536450279fe8135603cb1c1132b0c6; xq_id_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ1aWQiOjM2MjkxNzEwOTcsImlzcyI6InVjIiwiZXhwIjoxNjg0Mzg3NzkzLCJjdG0iOjE2ODE3OTU3OTMxNzksImNpZCI6ImQ5ZDBuNEFadXAifQ.AjpXrz8CTxlLOljO6dR9AGd8wzY7tKJ_OgyAYBhlP8Wm8JD-AHN8EpWWRpaEvhQaAFsEQydNXY6XrjPT97HnChaH1LphGhpwX0014VQ5vIx-0EADJJIHVdv-Hx-GQC8ISDwPMgj4p7m5fycVFTKVfV5-8yYbWxcVY6-gysBtrboTo__1fab_2bEWabCogVA7wMvJdM_qcwRymvC1oWy4DyRnPVADTxY_7tlkuC5p8zaRP7Ri6r4WgiJelA7li4r4ihuJLiqqKpD0sDjLmvAnUUIDOwDQwCGuAqF5YY_Y2xu-G2z2o7OXW29P4PMdAaul17xKHXHQeBtanjKwAk93mA; xq_r_token=4d1f218a6b3a505ff531b4c6b95a05a90c0b0b46; is_overseas=1; Hm_lpvt_1db88642e346389874251b5a1eded6e3=1681795801`




const API = "https://stock.xueqiu.com/v5/stock/chart/kline.json";
const Fields = "kline,pe,pb,ps,pcf,market_capital,agt,ggt,balance";


interface iJsonObj {
    stockCode: string;
    stockName: string;
    lastUpdate: string;
    stockData: {
        [key in iFields]: string | number;
    }[],
    modifyProfile: iModifyProfile
}

const getXueqiuKline = (stockName: string, stockCode: string, Begin: string, modifyProfile: iModifyProfile) => new Promise(async (resolve, reject) => {
    const begin = new Date(Begin).getTime()
    let url = `${API}?symbol=${stockCode}&begin=${begin}&period=day&type=begin&count=25000&indicator=${Fields}`;
    let response = await axios.get<iXueqiuApiKline>(url, {
        headers: {
            cookie: COOKIE
        }
    });
    let rawData = response.data;
    rawData.data.fmtItem = [];
    for (let index in rawData.data.item) {
        let item = rawData.data.item[index];
        let obj: any = {};
        for (let keyIndex in rawData.data.column) {
            let key = rawData.data.column[keyIndex];
            if (typeof item[keyIndex] !== "object") { // 排除null值
                obj[key] = item[keyIndex];
            }
        }
        rawData.data.fmtItem.push(obj);
    }


    let JsonObj: iJsonObj = {
        stockCode,
        stockName,
        lastUpdate: (new Date()).toLocaleString(),
        stockData: rawData.data.fmtItem,
        modifyProfile,
    };

    JsonObj.stockData = processModifyPE(JsonObj.stockData, JsonObj.modifyProfile);
    JsonObj.stockData = JsonObj.stockData.filter(v => v.modifyPE !== 0);

    fs.writeFile(`./assets/${stockName}.json`, JSON.stringify(JsonObj), () => {
        console.log(`Have Written ${stockName}.json`);
    })
})

// 以年为单位修正静态PE
function processModifyPE(dataArr: { [key in iFields]: string | number; }[], mp: iModifyProfile): any {
    return dataArr.map((item, index) => {
        let { timestamp, market_capital } = item;
        let d = new Date(timestamp);
        let year = d.getFullYear(),
            smp = mp[year]; 

        if (smp) {
            item.modifyPE = Number((Number(market_capital) / 10000 / 10000 / smp).toFixed(2));
        } else {
            item.modifyPE = 0;
        }
        return item;
    });
}

function main() {
    for (let index in STOCKS) {
        let item = STOCKS[index];
        let { stockName, stockCode, begin, modifyProfile } = item;
        getXueqiuKline(stockName, stockCode, begin, modifyProfile)
    }
}

main();

// https://stock.xueqiu.com/v5/stock/chart/kline.json?symbol=SZ000895&begin=1681804950195&period=day&type=after&count=25000&indicator=kline,pe,pb,ps,pcf,market_capital,agt,ggt,balance