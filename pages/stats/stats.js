const app = getApp()

Page({
  data: {
    stats: {},
    exportData: []
  },

  onLoad() {
    this.calculateStats()
  },

  calculateStats() {
    app.loadOrders()
    const orders = app.globalData.orders
    const stats = {
      totalOrders: orders.length,
      pendingCount: orders.filter(o => o.status === 'pending').length,
      approvedCount: orders.filter(o => o.status === 'approved').length,
      rejectedCount: orders.filter(o => o.status === 'rejected').length,
      totalAmount: orders.reduce((sum, o) => sum + o.totalPrice, 0).toFixed(2)
    }

    this.setData({
      stats,
      exportData: orders.map(order => ({
        id: order.id,
        date: order.date,
        customer: order.customer,
        status: this.getStatusText(order.status),
        totalPrice: order.totalPrice,
        items: order.items.map(i => `${i.name}x${i.count}`).join(',')
      }))
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

  exportData() {
    const csvContent = this.generateCSV()
    wx.downloadFile({
      url: 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent),
      name: `点餐统计_${this.formatDate(new Date())}.csv`,
      success: res => {
        wx.showToast({ title: '导出成功' })
      }
    })
  },

  generateCSV() {
    const headers = ['订单ID,日期,客户,状态,总金额,菜品']
    const rows = this.data.exportData.map(order => 
      `${order.id},${order.date},${order.customer},"${order.status}",${order.totalPrice},"${order.items}"`
    )
    return [headers, ...rows].join('\n')
  },

  formatDate(date) {
    return date.toISOString().split('T')[0]
  }
})
