import { ReportHandler, getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

export const reportWebVitals = () => {
  getCLS(sendToAnalytics)
  getFID(sendToAnalytics)
  getFCP(sendToAnalytics)
  getLCP(sendToAnalytics)
  getTTFB(sendToAnalytics)
}

const sendToAnalytics: ReportHandler = (metric) => {
  console.log('Web Vitals', { name: metric.name, value: metric.value })
}
