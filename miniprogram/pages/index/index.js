const STORAGE_KEY = 'boyfriend-order-cart'

const services = [
  { id: 'movie', emoji: '🎬', name: '陪你看一部电影', description: '准备好零食，选你喜欢的片子', detail: '约 2 小时 · 适合周末', category: '娱乐互动', tag: '快乐加倍' },
  { id: 'walk', emoji: '🌇', name: '晚饭后散步', description: '牵手走走，听你分享今天的小事', detail: '约 40 分钟 · 晚饭后', category: '异地陪伴', tag: '治愈散步' },
  { id: 'listen', emoji: '👂', name: '认真听你说话', description: '放下手机，只听你说，不插嘴', detail: '随时可用 · 情绪低落时', category: '异地陪伴', tag: '专注倾听' },
  { id: 'tea', emoji: '🍵', name: '端茶递水服务', description: '热饮、温水和一条暖暖的毛毯', detail: '约 10 分钟 · 需要被照顾时', category: '贴心照顾', tag: '温柔照料' },
  { id: 'massage', emoji: '💆‍♀️', name: '肩颈按摩', description: '把积攒的疲惫，轻轻按走一点点', detail: '约 20 分钟 · 加班后', category: '贴心照顾', tag: '辛苦啦' },
  { id: 'breakfast', emoji: '🥞', name: '爱心早餐', description: '早起为你做一份喜欢的早餐', detail: '约 30 分钟 · 早晨专享', category: '贴心照顾', tag: '早安吻' },
  { id: 'flowers', emoji: '💐', name: '突然出现的小花', description: '没有理由，就是想让你今天开心', detail: '约 1 小时 · 想要惊喜时', category: '仪式感', tag: '惊喜一下' },
  { id: 'letter', emoji: '💌', name: '手写一封情书', description: '把说不完的喜欢，写成一封信给你', detail: '约 1 天 · 纪念日适用', category: '仪式感', tag: '只给你看' },
  { id: 'date', emoji: '🕯️', name: '安排一场约会', description: '地点和行程都交给我，你只管漂亮', detail: '半天起 · 特别日子', category: '仪式感', tag: '心动预告' },
  { id: 'video-call', emoji: '📱', name: '睡前视频通话', description: '不赶时间，陪你聊到想睡为止', detail: '约 30 分钟 · 想念彼此时', category: '异地陪伴', tag: '隔空抱抱' },
  { id: 'morning-message', emoji: '🌤️', name: '定制早安语音', description: '用你的专属昵称，把新的一天叫醒', detail: '约 5 分钟 · 每天早晨', category: '异地陪伴', tag: '元气上线' },
  { id: 'photo-checkin', emoji: '📸', name: '交换今日照片', description: '分享一张此刻的风景，像在同一个城市', detail: '约 10 分钟 · 想分享日常时', category: '异地陪伴', tag: '同频生活' },
  { id: 'countdown', emoji: '📅', name: '见面倒计时卡片', description: '算好剩余的日子，做一张可爱倒计时', detail: '约 15 分钟 · 见面前', category: '仪式感', tag: '期待见面' },
  { id: 'playlist', emoji: '🎧', name: '专属晚安歌单', description: '挑三首歌送给你，今晚戴上耳机听', detail: '约 20 分钟 · 睡前时光', category: '仪式感', tag: '耳朵收下' },
  { id: 'quiz', emoji: '❓', name: '情侣默契小测试', description: '准备十道小问题，看看谁更懂谁', detail: '约 20 分钟 · 周末晚上', category: '娱乐互动', tag: '默契挑战' },
  { id: 'game', emoji: '🎮', name: '线上双人小游戏', description: '选一款轻松小游戏，一起笑到停不下来', detail: '约 1 小时 · 无聊的时候', category: '娱乐互动', tag: '一起玩呀' },
  { id: 'story', emoji: '📖', name: '轮流讲故事', description: '你一句我一句，编一个只属于我们的故事', detail: '约 30 分钟 · 睡前适用', category: '娱乐互动', tag: '想象起飞' },
  { id: 'takeout', emoji: '🥡', name: '异地点同款晚餐', description: '各自点一份同样的食物，打开视频一起吃', detail: '约 1 小时 · 晚餐时间', category: '异地陪伴', tag: '云端干杯' },
  { id: 'remote-breakfast', emoji: '🥣', name: '远程早餐陪伴', description: '各自端上早餐，开着语音一起迎接早晨', detail: '约 30 分钟 · 工作日早晨', category: '异地陪伴', tag: '一起开饭' },
  { id: 'remote-lunch', emoji: '🍱', name: '远程午餐约会', description: '午休不孤单，边吃边交换上午的小发现', detail: '约 40 分钟 · 午休时间', category: '异地陪伴', tag: '午间见面' },
  { id: 'sync-exercise', emoji: '🏃‍♀️', name: '同步运动打卡', description: '各自完成一组拉伸或散步，拍照互相鼓励', detail: '约 30 分钟 · 下班后', category: '贴心照顾', tag: '健康相伴' },
  { id: 'gift-shopping', emoji: '🛍️', name: '线上逛街挑礼物', description: '分享屏幕一起选一件小礼物，不超预算也开心', detail: '约 1 小时 · 想送心意时', category: '仪式感', tag: '一起挑选' },
  { id: 'study-work', emoji: '💻', name: '远程学习工作陪伴', description: '开着视频各自专注，休息时给彼此一个拥抱', detail: '约 90 分钟 · 需要专注时', category: '异地陪伴', tag: '并肩努力' },
  { id: 'travel-plan', emoji: '🗺️', name: '旅行攻略共创', description: '一起查路线、收藏小店，做一份下次见面的计划', detail: '约 1 小时 · 期待旅行时', category: '仪式感', tag: '未来地图' },
  { id: 'voice-diary', emoji: '🎙️', name: '照片语音日记交换', description: '各录一段今天的声音，再配一张照片互相收藏', detail: '约 15 分钟 · 睡前交换', category: '异地陪伴', tag: '保存此刻' },
  { id: 'comfort-kit', emoji: '🧸', name: '情绪急救包', description: '准备安慰语音、喜欢的歌和一个可执行的小计划', detail: '约 20 分钟 · 心情低落时', category: '贴心照顾', tag: '先抱一下' },
  { id: 'praise-random', emoji: '🌷', name: '随机夸夸十连', description: '认真说出十个喜欢你的理由，让今天亮晶晶', detail: '约 10 分钟 · 需要自信时', category: '贴心照顾', tag: '夸到心里' },
  { id: 'sunrise-sunset', emoji: '🌅', name: '线上看日出日落', description: '约好同一时刻打开镜头，把两边天空拼在一起', detail: '约 20 分钟 · 清晨或傍晚', category: '仪式感', tag: '共享天空' },
  { id: 'map-postcard', emoji: '📍', name: '地图足迹明信片', description: '从地图上选一个今天走过的地方，写一句小明信片', detail: '约 15 分钟 · 分享日常时', category: '仪式感', tag: '寄一段路' },
  { id: 'podcast', emoji: '🎙️', name: '共同歌单或播客', description: '各推荐一首歌或一期播客，交换后聊聊感受', detail: '约 30 分钟 · 通勤路上', category: '娱乐互动', tag: '耳朵约会' },
  { id: 'stretching', emoji: '🧘‍♀️', name: '远程拉伸教学', description: '跟着游杰慢慢活动肩颈和腰背，轻松一点点', detail: '约 15 分钟 · 久坐之后', category: '贴心照顾', tag: '舒展一下' },
  { id: 'weekly-review', emoji: '📝', name: '周计划温柔复盘', description: '一起回顾本周三件开心事，再安排下周的小期待', detail: '约 30 分钟 · 周日晚间', category: '贴心照顾', tag: '把日子过好' },
  { id: 'blind-box', emoji: '🎁', name: '异地盲盒任务', description: '轮流发一个低成本小任务，完成后交换照片或语音', detail: '约 20 分钟 · 想玩点新鲜的', category: '娱乐互动', tag: '打开惊喜' },
  { id: 'poem', emoji: '🌙', name: '睡前读诗给你听', description: '挑一首短诗或故事，用声音把晚安送到你耳边', detail: '约 15 分钟 · 睡前时光', category: '仪式感', tag: '温柔入梦' }
]

const categories = ['全部', '异地陪伴', '仪式感', '贴心照顾', '娱乐互动']

function readCart() {
  try {
    return wx.getStorageSync(STORAGE_KEY) || []
  } catch (error) {
    return []
  }
}

function getVisibleServices(category, query) {
  const keyword = query.trim().toLowerCase()
  return services.filter((service) => {
    const matchesCategory = category === '全部' || service.category === category
    const matchesQuery = !keyword || `${service.name}${service.description}${service.category}`.toLowerCase().includes(keyword)
    return matchesCategory && matchesQuery
  })
}

function getCartDetails(cart) {
  return cart.map((item) => ({
    ...item,
    service: services.find((service) => service.id === item.serviceId)
  })).filter((item) => item.service)
}

Page({
  data: {
    visibleServices: getVisibleServices('全部', ''),
    categories,
    category: '全部',
    query: '',
    cart: readCart(),
    cartDetails: [],
    cartCount: 0,
    cartOpen: false,
    note: '',
    time: '',
    error: '',
    submitted: false
  },

  onLoad() {
    this.syncCart(this.data.cart)
  },

  syncCart(cart) {
    wx.setStorageSync(STORAGE_KEY, cart)
    this.setData({
      cart,
      cartDetails: getCartDetails(cart),
      cartCount: cart.reduce((total, item) => total + item.quantity, 0)
    })
  },

  selectCategory(event) {
    const category = event.currentTarget.dataset.category
    this.setData({ category, visibleServices: getVisibleServices(category, this.data.query) })
  },

  onSearch(event) {
    const query = event.detail.value
    this.setData({ query, visibleServices: getVisibleServices(this.data.category, query) })
  },

  addService(event) {
    const serviceId = event.currentTarget.dataset.id
    const cart = this.data.cart.slice()
    const item = cart.find((entry) => entry.serviceId === serviceId)
    if (item) item.quantity += 1
    else cart.push({ serviceId, quantity: 1 })
    this.syncCart(cart)
  },

  changeQuantity(event) {
    const { id, delta } = event.currentTarget.dataset
    const cart = this.data.cart
      .map((item) => item.serviceId === id ? { ...item, quantity: item.quantity + Number(delta) } : item)
      .filter((item) => item.quantity > 0)
    this.syncCart(cart)
  },

  openCart() {
    this.setData({ cartOpen: true })
  },

  closeCart() {
    this.setData({ cartOpen: false })
  },

  onTimeInput(event) {
    this.setData({ time: event.detail.value, error: '' })
  },

  onNoteInput(event) {
    this.setData({ note: event.detail.value })
  },

  submitOrder() {
    if (!this.data.cart.length) {
      this.setData({ error: '请先选择一份想要的服务呀～' })
      return
    }
    if (!this.data.time.trim()) {
      this.setData({ error: '请告诉我希望在什么时候为你安排呀～' })
      return
    }
    this.setData({
      submitted: true,
      cartOpen: false,
      error: ''
    })
  },

  closeSuccess() {
    this.setData({ submitted: false })
  },

})
