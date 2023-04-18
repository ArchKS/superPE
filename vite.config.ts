import { defineConfig, FSWatcher } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})

// https://stock.xueqiu.com/v5/stock/chart/kline.json?symbol=SZ000895&begin=1681804950195&period=day&type=before&count=-284&indicator=kline,pe,pb,ps,pcf,market_capital,agt,ggt,balance
