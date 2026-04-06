const app = getApp()

Page({
  data: {
    currentDate: '',
    menuCategories: [
      {
        id: 1,
        name: '主食',
        items: [
          { id: 1, name: '米饭', price: 2, image: 'https://img-placeholder.jpg' },
          { id: 2, name: '馒头', price: 1.5, image: 'https://img-placeholder.jpg' }
        ]
      },
      {
        id: 2,
        name: '菜品',
        items: [
          { id: 3, name: '红烧肉', price: 15, image: 'https://img-placeholder.jpg' },
          { id: 4, name: '青椒炒肉', price: 12, image: 'https://img-placeholder.jpg' },
          { id: 5, name: '西红柿炒蛋', price: 8, image: 'https://img-placeholder.jpg' }
        ]
      }
    ],
    cartItems: [],
    showCart: false,
    cartTotalCount: 0,
    cartTotalPrice: 0
  },

  onLoad() {
    this.setData({
      currentDate: this.formatDate(new Date())
    })
    this.loadCart()
  },

  formatDate(date) {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
  },

  selectItem(e) {
    const item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: `/pages/itemDetail/itemDetail?id=${item.id}`
    })
  },

  addToCart(e) {
    const item = e.currentTarget.dataset.item
    let cartItems = this.data.cartItems
    const existingItem = cartItems.find(cartItem => cartItem.id === item.id)
    
    if (existingItem) {
      existingItem.count += 1
    } else {
      cartItems.push({ ...item, count: 1 })
    }
    
    this.setData({
      cartItems,
      cartTotalCount: this.calculateTotalCount(cartItems),
      cartTotalPrice: this.calculateTotalPrice(cartItems)
    })
    this.saveCart()
  },

  decreaseItem(e) {
    const id = e.currentTarget.dataset.id
    let cartItems = this.data.cartItems
    const item = cartItems.find(item => item.id === id)
    if (item && item.count > 1) {
      item.count -= 1
      this.setData({
        cartItems,
        cartTotalCount: this.calculateTotalCount(cartItems),
        cartTotalPrice: this.calculateTotalPrice(cartItems)
      })
      this.saveCart()
    }
  },

  increaseItem(e) {
    const id = e.currentTarget.dataset.id
    let cartItems = this.data.cartItems
    const item = cartItems.find(item => item.id === id)
    if (item) {
      item.count += 1
      this.setData({
        cartItems,
        cartTotalCount: this.calculateTotalCount(cartItems),
        cartTotalPrice: this.calculateTotalPrice(cartItems)
      })
      this.saveCart()
    }
  },

  removeItem(e) {
    const id = e.currentTarget.dataset.id
    const cartItems = this.data.cartItems.filter(item => item.id !== id)
    this.setData({
      cartItems,
      cartTotalCount: this.calculateTotalCount(cartItems),
      cartTotalPrice: this.calculateTotalPrice(cartItems)
    })
    this.saveCart()
  },

  toggleCart() {
    this.setData({
      showCart: !this.data.showCart
    })
  },

  calculateTotalCount(items) {
    return items.reduce((total, item) => total + item.count, 0)
  },

  calculateTotalPrice(items) {
    return items.reduce((total, item) => total + (item.price * item.count), 0).toFixed(2)
  },

  saveCart() {
    wx.setStorageSync('cart', this.data.cartItems)
  },

  loadCart() {
    const cart = wx.getStorageSync('cart') || []
    this.setData({
      cartItems: cart,
      cartTotalCount: this.calculateTotalCount(cart),
      cartTotalPrice: this.calculateTotalPrice(cart)
    })
  },

  submitOrder() {
    if (this.data.cartTotalCount === 0) return

    const order = {
      id: Date.now(),
      date: this.data.currentDate,
      items: this.data.cartItems,
      totalPrice: parseFloat(this.data.cartTotalPrice),
      status: 'pending', // pending, approved, rejected
      customer: '豆苗'
    }

    app.loadOrders()
    app.globalData.orders.unshift(order)
    app.saveOrders()

    this.setData({
      cartItems: [],
      cartTotalCount: 0,
      cartTotalPrice: 0,
      showCart: false
    })
    this.saveCart()

    wx.showToast({
      title: '订单提交成功！等待审核',
      icon: 'success'
    })
  }
})
