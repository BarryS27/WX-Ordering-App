const app = getApp()

Page({
  data: {
    currentDate: '',
    filteredOrders: [],
    selectedOrders: [],
    allOrders: []
  },

  onLoad() {
    this.setData({
      currentDate: this.formatDate(new Date())
    })
    this.loadOrders()
  },

  loadOrders() {
    app.loadOrders()
    this.setData({
      allOrders: app.globalData.orders,
      filteredOrders: app.globalData.orders.filter(order => order.date === this.data.currentDate)
    })
  },

  formatDate(date) {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
  },

  onDateChange(e) {
    this.setData({
      currentDate: e.detail.value,
      filteredOrders: this.data.allOrders.filter(order => order.date === e.detail.value)
    })
  },

  getStatusText(status) {
    const statusMap = {
      'pending': '待审核',
      'approved': '已通过',
      'rejected': '已驳回'
    }
    return statusMap[status] || status
  },

  viewOrderDetail(e) {
    const orderId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/orderDetail/orderDetail?id=${orderId}`
    })
  },

  batchApprove() {
    const updatedOrders = this.data.allOrders.map(order => {
      if (this.data.selectedOrders.includes(order.id)) {
        return { ...order, status: 'approved' }
      }
      return order
    })
    app.globalData.orders = updatedOrders
    app.saveOrders()
    this.loadOrders()
    this.setData({ selectedOrders: [] })
    wx.showToast({ title: '批量通过成功' })
  },

  batchReject() {
    const updatedOrders = this.data.allOrders.map(order => {
      if (this.data.selectedOrders.includes(order.id)) {
        return { ...order, status: 'rejected' }
      }
      return order
    })
    app.globalData.orders = updatedOrders
    app.saveOrders()
    this.loadOrders()
    this.setData({ selectedOrders: [] })
    wx.showToast({ title: '批量驳回成功' })
  }
})
