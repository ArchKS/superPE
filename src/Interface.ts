export type iFields = 'timestamp' | 'volume' | 'open' | 'high' | 'low' | 'close' | 'chg' | 'percent' |
    'turnoverrate' | 'amount' | 'volume_post' | 'amount_post' | 'pe' | 'pb' | 'ps' |
    'pcf' | 'market_capital' | 'balance' | 'hold_volume_cn' | 'hold_ratio_cn' | 'net_volume_cn' |
    'hold_volume_hk' | 'hold_ratio_hk' | 'net_volume_hk' | 'modifyPE';

export type iModifyProfile = { [key: string]: number }

export interface iXueqiuApiKline {
    data: {
        symbol: string;
        column: Array<iFields>;
        item: Array<string | number>[][];
        fmtItem?: {
            [key in iFields]: number | string;
        }[];
    },
    error_code: number;
    error_description: string;
}


// 实例
/*
    "timestamp":1681401600000, // 2023/4/14
    "volume": 6255856,
    "open": 25.79,
    "high": 25.9,
    "low": 25.68,
    "close": 25.7,
    "chg": -0.08,
    "percent": -0.31,
    "turnoverrate": 0.18,
    "amount": 161114545,
    "volume_post": null,
    "amount_post": null,
    "pe": 15.8412,
    "pb": 4.0746,
    "ps": 1.4194,
    "pcf": 11.7695,
    "market_capital": 89041793174.1,
    "balance": 669313661,
    "hold_volume_cn": 116732816,
    "hold_ratio_cn": 3.36,
    "net_volume_cn": -1069628,
    "hold_volume_hk": null,
    "hold_ratio_hk": null,
    "net_volume_hk: null"
*/



// ------------------------------