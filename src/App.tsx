import { useEffect, useMemo, useState } from 'react'

type Category = '全部' | '异地陪伴' | '仪式感' | '贴心照顾' | '娱乐互动'

type Service = {
  id: string
  emoji: string
  name: string
  description: string
  detail: string
  category: Exclude<Category, '全部'>
  tag: string
  tone: string
}

type CartItem = {
  serviceId: string
  quantity: number
}

const services: Service[] = [
  { id: 'movie', emoji: '🎬', name: '陪你看一部电影', description: '准备好零食，选你喜欢的片子', detail: '约 2 小时 · 适合周末', category: '娱乐互动', tag: '快乐加倍', tone: 'peach' },
  { id: 'walk', emoji: '🌇', name: '晚饭后散步', description: '牵手走走，听你分享今天的小事', detail: '约 40 分钟 · 晚饭后', category: '异地陪伴', tag: '治愈散步', tone: 'lavender' },
  { id: 'listen', emoji: '👂', name: '认真听你说话', description: '放下手机，只听你说，不插嘴', detail: '随时可用 · 情绪低落时', category: '异地陪伴', tag: '专注倾听', tone: 'blue' },
  { id: 'tea', emoji: '🍵', name: '端茶递水服务', description: '热饮、温水和一条暖暖的毛毯', detail: '约 10 分钟 · 需要被照顾时', category: '贴心照顾', tag: '温柔照料', tone: 'mint' },
  { id: 'massage', emoji: '💆‍♀️', name: '肩颈按摩', description: '把积攒的疲惫，轻轻按走一点点', detail: '约 20 分钟 · 加班后', category: '贴心照顾', tag: '辛苦啦', tone: 'pink' },
  { id: 'breakfast', emoji: '🥞', name: '爱心早餐', description: '早起为你做一份喜欢的早餐', detail: '约 30 分钟 · 早晨专享', category: '贴心照顾', tag: '早安吻', tone: 'yellow' },
  { id: 'flowers', emoji: '💐', name: '突然出现的小花', description: '没有理由，就是想让你今天开心', detail: '约 1 小时 · 想要惊喜时', category: '仪式感', tag: '惊喜一下', tone: 'rose' },
  { id: 'letter', emoji: '💌', name: '手写一封情书', description: '把说不完的喜欢，写成一封信给你', detail: '约 1 天 · 纪念日适用', category: '仪式感', tag: '只给你看', tone: 'peach' },
  { id: 'date', emoji: '🕯️', name: '安排一场约会', description: '地点和行程都交给我，你只管漂亮', detail: '半天起 · 特别日子', category: '仪式感', tag: '心动预告', tone: 'lavender' },
  { id: 'video-call', emoji: '📱', name: '睡前视频通话', description: '不赶时间，陪你聊到想睡为止', detail: '约 30 分钟 · 想念彼此时', category: '异地陪伴', tag: '隔空抱抱', tone: 'blue' },
  { id: 'morning-message', emoji: '🌤️', name: '定制早安语音', description: '用你的专属昵称，把新的一天叫醒', detail: '约 5 分钟 · 每天早晨', category: '异地陪伴', tag: '元气上线', tone: 'yellow' },
  { id: 'photo-checkin', emoji: '📸', name: '交换今日照片', description: '分享一张此刻的风景，像在同一个城市', detail: '约 10 分钟 · 想分享日常时', category: '异地陪伴', tag: '同频生活', tone: 'mint' },
  { id: 'countdown', emoji: '📅', name: '见面倒计时卡片', description: '算好剩余的日子，做一张可爱倒计时', detail: '约 15 分钟 · 见面前', category: '仪式感', tag: '期待见面', tone: 'rose' },
  { id: 'playlist', emoji: '🎧', name: '专属晚安歌单', description: '挑三首歌送给你，今晚戴上耳机听', detail: '约 20 分钟 · 睡前时光', category: '仪式感', tag: '耳朵收下', tone: 'lavender' },
  { id: 'quiz', emoji: '❓', name: '情侣默契小测试', description: '准备十道小问题，看看谁更懂谁', detail: '约 20 分钟 · 周末晚上', category: '娱乐互动', tag: '默契挑战', tone: 'pink' },
  { id: 'game', emoji: '🎮', name: '线上双人小游戏', description: '选一款轻松小游戏，一起笑到停不下来', detail: '约 1 小时 · 无聊的时候', category: '娱乐互动', tag: '一起玩呀', tone: 'blue' },
  { id: 'story', emoji: '📖', name: '轮流讲故事', description: '你一句我一句，编一个只属于我们的故事', detail: '约 30 分钟 · 睡前适用', category: '娱乐互动', tag: '想象起飞', tone: 'peach' },
  { id: 'takeout', emoji: '🥡', name: '异地点同款晚餐', description: '各自点一份同样的食物，打开视频一起吃', detail: '约 1 小时 · 晚餐时间', category: '异地陪伴', tag: '云端干杯', tone: 'mint' },
]

const categories: Category[] = ['全部', '异地陪伴', '仪式感', '贴心照顾', '娱乐互动']
const STORAGE_KEY = 'boyfriend-order-cart'

function App() {
  const [category, setCategory] = useState<Category>('全部')
  const [query, setQuery] = useState('')
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) as CartItem[] : []
    } catch {
      return []
    }
  })
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [note, setNote] = useState('')
  const [time, setTime] = useState('')
  const [formError, setFormError] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
  }, [cart])

  const filteredServices = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return services.filter((service) => {
      const matchesCategory = category === '全部' || service.category === category
      const matchesQuery = !normalizedQuery || `${service.name}${service.description}${service.category}`.toLowerCase().includes(normalizedQuery)
      return matchesCategory && matchesQuery
    })
  }, [category, query])

  const cartDetails = cart.map((item) => ({
    ...item,
    service: services.find((service) => service.id === item.serviceId)!,
  }))
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const addToCart = (serviceId: string) => {
    setCart((current) => {
      const found = current.find((item) => item.serviceId === serviceId)
      return found
        ? current.map((item) => item.serviceId === serviceId ? { ...item, quantity: item.quantity + 1 } : item)
        : [...current, { serviceId, quantity: 1 }]
    })
    setIsSubmitted(false)
  }

  const updateQuantity = (serviceId: string, delta: number) => {
    setCart((current) => current.flatMap((item) => {
      if (item.serviceId !== serviceId) return [item]
      const quantity = item.quantity + delta
      return quantity > 0 ? [{ ...item, quantity }] : []
    }))
  }

  const submitOrder = async () => {
    if (isSubmitting) return
    if (!time) {
      setFormError('请告诉我希望在什么时候为你安排呀～')
      return
    }
    if (cartDetails.length === 0) {
      setFormError('请先选择一份想要的服务呀～')
      return
    }

    setIsSubmitting(true)
    setFormError('')
    const orderServices = cartDetails.map(({ service, quantity }) => `${service.name} × ${quantity}`).join('、')
    const submittedAt = new Intl.DateTimeFormat('zh-CN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date())
    const formData = new URLSearchParams({
      '双方名字': '游杰 × 张雨茜',
      '订单服务': orderServices,
      '数量': String(itemCount),
      '备注': note.trim() || '无',
      '希望时间': time.trim(),
      '提交时间': submittedAt,
      _subject: '游杰 × 张雨茜的新服务订单',
      _captcha: 'false',
      _template: 'table',
    })

    try {
      const response = await fetch('https://formsubmit.co/3047292542@qq.com', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        body: formData.toString(),
      })
      if (!response.ok) {
        throw new Error(`邮件服务返回 ${response.status}`)
      }
      setIsSubmitted(true)
      setIsCartOpen(false)
    } catch {
      setFormError('订单暂时没有发送成功，请检查网络后再试一次。刚才的内容不会被伪装成已提交。')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main>
      <header className="hero">
        <div className="hero-decoration decoration-one">✦</div>
        <div className="hero-decoration decoration-two">♡</div>
        <div className="container hero-inner">
          <div className="eyebrow"><span>♡</span> boyfriend service menu</div>
          <div className="couple-names" aria-label="游杰为张雨茜准备的服务菜单">游杰 <span>×</span> 张雨茜</div>
          <h1>今天想要一份<br /><em>什么样的爱？</em></h1>
          <p>这是游杰为张雨茜准备的专属服务菜单。<br />把想要的爱温柔地告诉他，你值得被好好对待。</p>
          <button className="primary-button hero-button" onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}>
            开始点单 <span>↓</span>
          </button>
          <div className="hero-note"><span>☀</span> 今日营业中 · 游杰的无限宠爱供应</div>
        </div>
      </header>

      <section className="container service-section" id="services">
        <div className="section-heading">
          <div>
            <p className="section-kicker">TA 可以为你做的</p>
            <h2>选择你的专属服务 <span>♡</span></h2>
          </div>
          <button className="cart-trigger" onClick={() => setIsCartOpen(true)} aria-label={`打开我的订单，当前 ${itemCount} 件`}>
            <span>🛒</span> 我的订单 {itemCount > 0 && <b>{itemCount}</b>}
          </button>
        </div>

        <div className="toolbar">
          <div className="category-tabs" role="tablist" aria-label="服务分类">
            {categories.map((item) => (
              <button key={item} className={category === item ? 'active' : ''} onClick={() => setCategory(item)} role="tab" aria-selected={category === item}>{item}</button>
            ))}
          </div>
          <label className="search-box">
            <span aria-hidden="true">⌕</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索想要的服务..." aria-label="搜索服务" />
          </label>
        </div>

        {filteredServices.length > 0 ? (
          <div className="service-grid">
            {filteredServices.map((service) => {
              const inCart = cart.find((item) => item.serviceId === service.id)
              return (
                <article className={`service-card ${service.tone}`} key={service.id}>
                  <div className="card-top"><span className="service-emoji">{service.emoji}</span><span className="service-tag">{service.tag}</span></div>
                  <h3>{service.name}</h3>
                  <p>{service.description}</p>
                  <div className="card-footer"><span className="service-detail">♡ {service.detail}</span><button className="add-button" onClick={() => addToCart(service.id)}>{inCart ? `已加入 ${inCart.quantity}` : '加入订单'} <span>＋</span></button></div>
                </article>
              )
            })}
          </div>
        ) : <div className="empty-search"><span>🔎</span><h3>没有找到这个服务</h3><p>换个关键词试试看，也许爱就在下一个分类里。</p></div>}
      </section>

      <footer><div className="container"><span>♡</span> made with love, just for you <span>♡</span></div></footer>

      {isCartOpen && <div className="overlay" onClick={() => setIsCartOpen(false)}>
        <aside className="cart-panel" onClick={(event) => event.stopPropagation()} aria-label="我的订单">
          <div className="panel-header"><div><p className="section-kicker">your little wish list</p><h2>我的订单 <span>♡</span></h2></div><button className="close-button" onClick={() => setIsCartOpen(false)} aria-label="关闭订单">×</button></div>
          {cartDetails.length === 0 ? <div className="empty-cart"><div>🧺</div><h3>订单还是空空的</h3><p>挑一份今天想要的爱吧，<br />他已经准备好啦～</p><button className="primary-button" onClick={() => setIsCartOpen(false)}>去逛逛</button></div> : <>
            <div className="cart-items">{cartDetails.map(({ service, quantity }) => <div className="cart-item" key={service.id}><span className="cart-item-emoji">{service.emoji}</span><div className="cart-item-info"><strong>{service.name}</strong><small>{service.detail}</small></div><div className="quantity-control"><button onClick={() => updateQuantity(service.id, -1)} aria-label={`减少 ${service.name}`}>−</button><span>{quantity}</span><button onClick={() => updateQuantity(service.id, 1)} aria-label={`增加 ${service.name}`}>＋</button></div></div>)}</div>
            <div className="order-form"><label htmlFor="order-time">希望什么时候收到这份爱？<span>*</span></label><input id="order-time" value={time} onChange={(event) => { setTime(event.target.value); setFormError('') }} placeholder="例如：今晚 7 点 / 周六下午" /><label htmlFor="order-note">还有什么想悄悄告诉他？</label><textarea id="order-note" value={note} onChange={(event) => setNote(event.target.value)} placeholder="口味、地点，或者一句想说的话..." rows={3} />{formError && <p className="form-error" role="alert">{formError}</p>}<button className="primary-button submit-button" onClick={submitOrder} disabled={isSubmitting} aria-busy={isSubmitting}>{isSubmitting ? '正在发送…' : '确认下单'} {!isSubmitting && <span>♡</span>}</button></div>
          </>}
        </aside>
      </div>}

      {isSubmitted && <div className="success-toast" role="status"><div className="success-icon">💌</div><div><strong>订单收到啦！</strong><p>他会在「{time}」带着满满的爱来找你。</p></div><button onClick={() => setIsSubmitted(false)} aria-label="关闭提示">×</button></div>}
    </main>
  )
}

export default App
