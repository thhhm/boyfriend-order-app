import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'

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
  { id: 'movie', emoji: '🎬', name: '一起看一部电影', description: '选一部都想看的片子，边看边聊两句', detail: '约 2 小时 · 适合周末', category: '娱乐互动', tag: '今晚一起看', tone: 'peach' },
  { id: 'walk', emoji: '🌇', name: '晚饭后散步', description: '各自在附近走走，通着电话聊聊今天', detail: '约 40 分钟 · 晚饭后', category: '异地陪伴', tag: '饭后走走', tone: 'lavender' },
  { id: 'listen', emoji: '👂', name: '留时间听你说', description: '先把手边的事放一放，好好听你讲完', detail: '约 30 分钟 · 想聊聊时', category: '异地陪伴', tag: '我在听', tone: 'blue' },
  { id: 'tea', emoji: '🍵', name: '提醒你喝水休息', description: '记得喝点水，也别忘了给自己留几分钟', detail: '约 10 分钟 · 忙了一上午后', category: '贴心照顾', tag: '休息一下', tone: 'mint' },
  { id: 'massage', emoji: '💆‍♀️', name: '肩颈放松时间', description: '跟着简单动作活动一下肩颈，缓解久坐疲劳', detail: '约 20 分钟 · 加班或久坐后', category: '贴心照顾', tag: '放松一下', tone: 'pink' },
  { id: 'breakfast', emoji: '🥞', name: '一起吃早餐', description: '各自准备喜欢的早餐，开着视频慢慢吃', detail: '约 30 分钟 · 早晨', category: '贴心照顾', tag: '早上见', tone: 'yellow' },
  { id: 'flowers', emoji: '💐', name: '寄一份小花心意', description: '挑一束简单的小花，给普通的一天添点颜色', detail: '约 1 小时 · 想表达心意时', category: '仪式感', tag: '送点小心意', tone: 'rose' },
  { id: 'letter', emoji: '💌', name: '写一封信给你', description: '把最近想说的话写下来，不急着说得完美', detail: '约 1 天 · 纪念日或想念时', category: '仪式感', tag: '写几句话', tone: 'peach' },
  { id: 'date', emoji: '🕯️', name: '一起安排约会', description: '把地点和行程一起定好，留一点见面的期待', detail: '半天起 · 下次见面前', category: '仪式感', tag: '计划见面', tone: 'lavender' },
  { id: 'video-call', emoji: '📱', name: '睡前视频聊会儿', description: '不设主题，聊到困了就互道晚安', detail: '约 30 分钟 · 睡前', category: '异地陪伴', tag: '睡前聊聊', tone: 'blue' },
  { id: 'morning-message', emoji: '🌤️', name: '早安语音', description: '留一段简短语音，告诉你今天也会想起你', detail: '约 5 分钟 · 早晨', category: '异地陪伴', tag: '早安留言', tone: 'yellow' },
  { id: 'photo-checkin', emoji: '📸', name: '交换一张今日照片', description: '拍下眼前的小事，分享彼此今天看到的风景', detail: '约 10 分钟 · 分享日常时', category: '异地陪伴', tag: '分享日常', tone: 'mint' },
  { id: 'countdown', emoji: '📅', name: '做一张见面倒计时', description: '算好还有几天见面，做一张简单的倒计时卡片', detail: '约 15 分钟 · 见面前', category: '仪式感', tag: '记下日期', tone: 'rose' },
  { id: 'playlist', emoji: '🎧', name: '分享一份晚安歌单', description: '选几首今晚想分享的歌，听完交换感受', detail: '约 20 分钟 · 睡前', category: '仪式感', tag: '今晚听歌', tone: 'lavender' },
  { id: 'quiz', emoji: '❓', name: '做个情侣小测试', description: '准备几道轻松的问题，看看答案是不是一样', detail: '约 20 分钟 · 周末晚上', category: '娱乐互动', tag: '看看答案', tone: 'pink' },
  { id: 'game', emoji: '🎮', name: '一起玩个小游戏', description: '挑一款不用花钱的线上小游戏，轻松玩一会儿', detail: '约 1 小时 · 有空时', category: '娱乐互动', tag: '玩一会儿', tone: 'blue' },
  { id: 'story', emoji: '📖', name: '轮流讲个故事', description: '你一句我一句，随手编一个小故事', detail: '约 30 分钟 · 睡前', category: '娱乐互动', tag: '讲个故事', tone: 'peach' },
  { id: 'takeout', emoji: '🥡', name: '异地点同款晚餐', description: '各自点一份同样的食物，打开视频一起吃', detail: '约 1 小时 · 晚餐时间', category: '异地陪伴', tag: '云端干杯', tone: 'mint' },
  { id: 'remote-breakfast', emoji: '🥣', name: '远程早餐时间', description: '各自端上早餐，开着语音一起吃几口', detail: '约 30 分钟 · 工作日早晨', category: '异地陪伴', tag: '一起吃早饭', tone: 'yellow' },
  { id: 'remote-lunch', emoji: '🍱', name: '远程午餐时间', description: '午休一起吃饭，交换上午遇到的小事', detail: '约 40 分钟 · 午休', category: '异地陪伴', tag: '午休见面', tone: 'peach' },
  { id: 'sync-exercise', emoji: '🏃‍♀️', name: '同步运动打卡', description: '各自散步或拉伸，结束后发张照片报个到', detail: '约 30 分钟 · 下班后', category: '贴心照顾', tag: '一起动一动', tone: 'mint' },
  { id: 'gift-shopping', emoji: '🛍️', name: '线上逛街选礼物', description: '一起看看喜欢的小物，选一件预算内的礼物', detail: '约 1 小时 · 想送礼物时', category: '仪式感', tag: '一起挑礼物', tone: 'rose' },
  { id: 'study-work', emoji: '💻', name: '远程学习工作陪伴', description: '开着视频各自专注，休息时互相报个平安', detail: '约 90 分钟 · 需要专注时', category: '异地陪伴', tag: '各自努力', tone: 'blue' },
  { id: 'travel-plan', emoji: '🗺️', name: '一起做旅行攻略', description: '查路线、收藏小店，慢慢列一份下次见面的计划', detail: '约 1 小时 · 计划旅行时', category: '仪式感', tag: '计划下一次见面', tone: 'lavender' },
  { id: 'voice-diary', emoji: '🎙️', name: '交换照片和语音日记', description: '各发一张照片和一段语音，记录今天的小片段', detail: '约 15 分钟 · 晚上交换', category: '异地陪伴', tag: '记录今天', tone: 'blue' },
  { id: 'comfort-kit', emoji: '🧸', name: '准备一份情绪小帮手', description: '发一段安慰语音、几首歌，陪你把眼前的事理清楚', detail: '约 20 分钟 · 心情低落时', category: '贴心照顾', tag: '陪你缓一缓', tone: 'pink' },
  { id: 'praise-random', emoji: '🌷', name: '说十句具体的夸奖', description: '认真说说你最近做得好的地方，不用客气', detail: '约 10 分钟 · 想听点好话时', category: '贴心照顾', tag: '说点好听的', tone: 'rose' },
  { id: 'sunrise-sunset', emoji: '🌅', name: '一起看日出或日落', description: '约好同一时间拍下天空，交换两边的颜色', detail: '约 20 分钟 · 清晨或傍晚', category: '仪式感', tag: '看看今天的天', tone: 'yellow' },
  { id: 'map-postcard', emoji: '📍', name: '地图上的小明信片', description: '从今天走过的地方选一个点，写几句话发给对方', detail: '约 15 分钟 · 分享日常时', category: '仪式感', tag: '从地图写信', tone: 'mint' },
  { id: 'podcast', emoji: '🎙️', name: '交换歌单或播客', description: '各推荐一首歌或一期播客，听完聊聊为什么喜欢', detail: '约 30 分钟 · 通勤或晚上', category: '娱乐互动', tag: '分享一段声音', tone: 'lavender' },
  { id: 'stretching', emoji: '🧘‍♀️', name: '一起做远程拉伸', description: '跟着简单动作活动肩颈和腰背，别一直坐着', detail: '约 15 分钟 · 久坐之后', category: '贴心照顾', tag: '活动一下', tone: 'mint' },
  { id: 'weekly-review', emoji: '📝', name: '一起复盘这一周', description: '聊三件开心的事，也看看下周想留出什么时间', detail: '约 30 分钟 · 周日晚间', category: '贴心照顾', tag: '聊聊这一周', tone: 'peach' },
  { id: 'blind-box', emoji: '🎁', name: '异地小任务交换', description: '轮流出一个不花钱的小任务，完成后发照片或语音', detail: '约 20 分钟 · 想换个玩法时', category: '娱乐互动', tag: '抽个小任务', tone: 'pink' },
  { id: 'poem', emoji: '🌙', name: '睡前读一首诗', description: '挑一首短诗或一小段故事，读完再说晚安', detail: '约 15 分钟 · 睡前', category: '仪式感', tag: '安静听一会儿', tone: 'lavender' },
]

const categories: Category[] = ['全部', '异地陪伴', '仪式感', '贴心照顾', '娱乐互动']
const STORAGE_KEY = 'boyfriend-order-cart'
const INITIAL_VISIBLE_COUNT = 9

function loadStoredCart(): CartItem[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    if (!Array.isArray(parsed)) return []
    return parsed.filter((item): item is CartItem => {
      if (!item || typeof item !== 'object') return false
      const candidate = item as Partial<CartItem>
      return typeof candidate.serviceId === 'string'
        && services.some((service) => service.id === candidate.serviceId)
        && Number.isInteger(candidate.quantity)
        && Number(candidate.quantity) > 0
        && Number(candidate.quantity) <= 20
    })
  } catch {
    return []
  }
}

function App() {
  const [category, setCategory] = useState<Category>('全部')
  const [query, setQuery] = useState('')
  const [cart, setCart] = useState<CartItem[]>(loadStoredCart)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [note, setNote] = useState('')
  const [time, setTime] = useState('')
  const [formError, setFormError] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT)
  const [lastSubmittedTime, setLastSubmittedTime] = useState('')
  const cartTriggerRef = useRef<HTMLButtonElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const cartPanelRef = useRef<HTMLElement>(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE_COUNT)
  }, [category, query])

  useEffect(() => {
    if (!isCartOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()
    const handleDialogKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsCartOpen(false)
        return
      }
      if (event.key !== 'Tab') return
      const focusable = cartPanelRef.current?.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), textarea:not(:disabled)')
      if (!focusable?.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', handleDialogKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleDialogKeyDown)
      cartTriggerRef.current?.focus()
    }
  }, [isCartOpen])

  const filteredServices = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return services.filter((service) => {
      const matchesCategory = category === '全部' || service.category === category
      const matchesQuery = !normalizedQuery || `${service.name}${service.description}${service.category}`.toLowerCase().includes(normalizedQuery)
      return matchesCategory && matchesQuery
    })
  }, [category, query])

  const categoryCounts = useMemo(() => Object.fromEntries(categories.map((item) => [
    item,
    item === '全部' ? services.length : services.filter((service) => service.category === item).length,
  ])) as Record<Category, number>, [])

  const visibleServices = filteredServices.slice(0, visibleCount)

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

  const submitOrder = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
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
      '双方姓名': '游杰 × 张雨茜',
      '服务项目': orderServices,
      '服务数量': String(itemCount),
      '备注信息': note.trim() || '未填写',
      '期望时间': time.trim(),
      '提交时间': submittedAt,
      _subject: '游杰 × 张雨茜的服务请求',
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
      setLastSubmittedTime(time.trim())
      setIsSubmitted(true)
      setIsCartOpen(false)
      setCart([])
      setNote('')
      setTime('')
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
          <p>这是游杰为张雨茜准备的服务菜单。<br />想要什么，直接告诉他就好。</p>
          <button className="primary-button hero-button" onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}>
            开始点单 <span>↓</span>
          </button>
          <div className="hero-note"><span>☀</span> 今日可点 · 游杰会按约定准备</div>
        </div>
      </header>

      <section className="container service-section" id="services">
        <div className="section-heading">
          <div>
            <p className="section-kicker">游杰可以做的事</p>
            <h2>选一项今天想要的 <span>♡</span></h2>
          </div>
          <button ref={cartTriggerRef} className="cart-trigger" onClick={() => setIsCartOpen(true)} aria-label={`打开我的订单，当前 ${itemCount} 件`}>
            <span>🛒</span> 已选服务 {itemCount > 0 && <b>{itemCount}</b>}
          </button>
        </div>

        <div className="toolbar">
          <div className="category-tabs" role="tablist" aria-label="服务分类">
            {categories.map((item) => (
              <button key={item} className={category === item ? 'active' : ''} onClick={() => setCategory(item)} role="tab" aria-selected={category === item}>
                {item}<span className="tab-count">{categoryCounts[item]}</span>
              </button>
            ))}
          </div>
          <label className="search-box">
            <span aria-hidden="true">⌕</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索服务或场景" aria-label="搜索服务" />
            {query && <button type="button" className="clear-search" onClick={() => setQuery('')} aria-label="清空搜索">×</button>}
          </label>
        </div>

        <div className="results-summary" role="status" aria-live="polite">
          <span>找到 <strong>{filteredServices.length}</strong> 项服务</span>
          {query && <span>关键词「{query.trim()}」</span>}
        </div>

        {filteredServices.length > 0 ? (
          <>
          <div className="service-grid">
            {visibleServices.map((service) => {
              const inCart = cart.find((item) => item.serviceId === service.id)
              return (
                <article className={`service-card ${service.tone}`} key={service.id}>
                  <div className="card-top"><span className="service-emoji">{service.emoji}</span><span className="service-tag">{service.tag}</span></div>
                  <h3>{service.name}</h3>
                  <p>{service.description}</p>
                  <div className="card-footer"><span className="service-detail">♡ {service.detail}</span><button className="add-button" onClick={() => addToCart(service.id)} aria-label={`${inCart ? '再加一份' : '加入订单'}：${service.name}`}>{inCart ? `已加入 ${inCart.quantity}` : '加入订单'} <span aria-hidden="true">＋</span></button></div>
                </article>
              )
            })}
          </div>
          {visibleCount < filteredServices.length && <div className="load-more-wrap">
            <button className="load-more" onClick={() => setVisibleCount((count) => count + 9)}>
              再看看更多 <span>还有 {filteredServices.length - visibleCount} 项</span>
            </button>
          </div>}
          </>
        ) : <div className="empty-search"><span>🔎</span><h3>暂时没有匹配的服务</h3><p>换个关键词，或者看看其他分类。</p></div>}
      </section>

      <footer><div className="container"><span>♡</span> made with love, just for you <span>♡</span></div></footer>

      {itemCount > 0 && !isCartOpen && <button className="mobile-cart-bar" onClick={() => setIsCartOpen(true)} aria-label={`查看已选的 ${itemCount} 项服务`}>
        <span>🛒 已选 {itemCount} 项</span><strong>查看订单 →</strong>
      </button>}

      {isCartOpen && <div className="overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) setIsCartOpen(false) }}>
        <aside ref={cartPanelRef} className="cart-panel" role="dialog" aria-modal="true" aria-labelledby="cart-title">
          <div className="panel-header"><div><p className="section-kicker">your selected services</p><h2 id="cart-title">已选服务 <span>♡</span></h2></div><button ref={closeButtonRef} className="close-button" onClick={() => setIsCartOpen(false)} aria-label="关闭已选服务">×</button></div>
          {cartDetails.length === 0 ? <div className="empty-cart"><div>🧺</div><h3>还没有选服务</h3><p>先看看菜单，选好后再告诉游杰。<br />不着急，慢慢挑。</p><button className="primary-button" onClick={() => setIsCartOpen(false)}>返回菜单</button></div> : <>
            <div className="cart-items">{cartDetails.map(({ service, quantity }) => <div className="cart-item" key={service.id}><span className="cart-item-emoji">{service.emoji}</span><div className="cart-item-info"><strong>{service.name}</strong><small>{service.detail}</small></div><div className="quantity-control"><button onClick={() => updateQuantity(service.id, -1)} aria-label={`减少 ${service.name}`}>−</button><span>{quantity}</span><button onClick={() => updateQuantity(service.id, 1)} aria-label={`增加 ${service.name}`}>＋</button></div></div>)}</div>
            <form className="order-form" onSubmit={submitOrder} noValidate><label htmlFor="order-time">希望什么时候安排？<span>*</span></label><input id="order-time" value={time} onChange={(event) => { setTime(event.target.value); setFormError('') }} placeholder="例如：今晚 7 点 / 周六下午" autoComplete="off" aria-invalid={Boolean(formError && !time)} aria-describedby={formError ? 'form-error' : undefined} /><label htmlFor="order-note">想补充几句话吗？</label><textarea id="order-note" value={note} onChange={(event) => setNote(event.target.value)} placeholder="地点、偏好，或者想告诉游杰的话..." rows={3} maxLength={300} /><div className="form-meta"><span>备注最多 300 字</span><span>{note.length}/300</span></div>{formError && <p id="form-error" className="form-error" role="alert">{formError}</p>}<p className="privacy-note">点击发送后，这份请求会通过第三方邮件服务转交给游杰。</p><button type="submit" className="primary-button submit-button" disabled={isSubmitting} aria-busy={isSubmitting}>{isSubmitting ? '正在发送…' : '发送服务请求'} {!isSubmitting && <span>♡</span>}</button></form>
          </>}
        </aside>
      </div>}

      {isSubmitted && <div className="success-toast" role="status" aria-live="polite"><div className="success-icon">💌</div><div><strong>服务请求已发送</strong><p>游杰会查看「{lastSubmittedTime}」的安排并回复你。</p></div><button onClick={() => setIsSubmitted(false)} aria-label="关闭提示">×</button></div>}
    </main>
  )
}

export default App
