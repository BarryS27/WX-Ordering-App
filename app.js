App({
  onLaunch() {
    this.globalData = {
      orders: [],
      userType: wx.getStorageSync('userType') || 'customer'
    }
  },
  saveOrders() {
    wx.setStorageSync('orders', this.globalData.orders)
  },
  loadOrders() {
    const orders = wx.getStorageSync('orders') || []
    this.globalData.orders = orders
    return orders
  }
})
