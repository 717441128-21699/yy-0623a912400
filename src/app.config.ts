export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/receipt/index',
    'pages/service/index',
    'pages/batch-detail/index',
    'pages/receipt-detail/index',
    'pages/service-detail/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#0E7C86',
    navigationBarTitleText: '冷链通',
    navigationBarTextStyle: 'white'
  },
  tabBar: {
    color: '#94A3B8',
    selectedColor: '#0E7C86',
    backgroundColor: '#FFFFFF',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '批次查询'
      },
      {
        pagePath: 'pages/receipt/index',
        text: '到货验收'
      },
      {
        pagePath: 'pages/service/index',
        text: '客户说明'
      }
    ]
  }
})
