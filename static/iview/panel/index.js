Component({
  externalClasses: ['i-class'],
  options: {
    addGlobalClass: true
  },
  properties: {
    title: {
      type: String,
      value: ''
    },
    // 标题顶部距离
    hideTop: {
      type: Boolean,
      value: false
    },
    hideBorder: {
      type: Boolean,
      value: false
    }
  }
})
