'use client'

import { useState } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import emailjs from '@emailjs/browser'
import { SprayCan, Sparkles, CloudRain, Phone, Mail, MapPin, Star, ArrowRight, ArrowLeftRight, ChevronLeft, ChevronRight, Check, Zap, Clock, Award, ShieldCheck, Gauge, Waves, Copy } from 'lucide-react'

const beforeAfterProjects = [
  {
    title: 'House Siding',
    detail: 'Soft wash siding restoration',
    before: '/before-after/siding-1-before.jpg',
    after: '/before-after/siding-1-after.jpg',
  },
  {
    title: 'Backyard Patio',
    detail: 'Paver and hardscape cleaning',
    before: '/before-after/patio-before.jpg',
    after: '/before-after/patio-after.jpg',
  },
  {
    title: 'Side Siding',
    detail: 'Organic growth removal',
    before: '/before-after/siding-2-before.jpg',
    after: '/before-after/siding-2-after.jpg',
  },
  {
    title: 'Shed Roof',
    detail: 'Moss and buildup removal',
    before: '/before-after/shed-roof-before.jpg',
    after: '/before-after/shed-roof-after.jpg',
  },
  {
    title: 'House Roof',
    detail: 'Roof surface restoration',
    before: '/before-after/house-roof-before.jpg',
    after: '/before-after/house-roof-after.jpg',
  },
  {
    title: 'Brick Entry',
    detail: 'Brick and stone cleaning',
    before: '/before-after/entry-before.jpg',
    after: '/before-after/entry-after.jpg',
  },
  {
    title: 'Front Steps',
    detail: 'Concrete step cleaning',
    before: '/before-after/steps-before.jpg',
    after: '/before-after/steps-after.jpg',
  },
]

const EMAIL_TO = 'trystincarpenter10@gmail.com'
const EMAIL_COPY = EMAIL_TO
const PHONE_DISPLAY = '601-506-0360'
const PHONE_COPY = '6015060360'
const emailJsConfig = {
  serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '',
  templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '',
  publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '',
}

const quoteServices = ['Power Washing', 'Window Cleaning', 'Gutter Cleaning', 'Multiple Services']

const initialQuoteForm = {
  name: '',
  email: '',
  phone: '',
  service: 'Power Washing',
  message: '',
}

export default function Home() {
  const [sliderPosition, setSliderPosition] = useState(50)
  const [activeProject, setActiveProject] = useState(0)
  const [quoteForm, setQuoteForm] = useState(initialQuoteForm)
  const [quoteStatus, setQuoteStatus] = useState<'idle' | 'sending' | 'sent' | 'fallback' | 'error'>('idle')
  const [phoneCopyStatus, setPhoneCopyStatus] = useState<'idle' | 'copied'>('idle')
  const [emailCopyStatus, setEmailCopyStatus] = useState<'idle' | 'copied'>('idle')
  const { scrollY, scrollYProgress } = useScroll()
  const progressScale = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    restDelta: 0.001,
  })
  const currentProject = beforeAfterProjects[activeProject]

  const selectProject = (index: number) => {
    setActiveProject(index)
    setSliderPosition(50)
  }

  const updateQuoteField = (field: keyof typeof quoteForm, value: string) => {
    setQuoteForm((current) => ({ ...current, [field]: value }))
    if (quoteStatus !== 'idle') {
      setQuoteStatus('idle')
    }
  }

  const copyPhoneNumber = async () => {
    try {
      await navigator.clipboard.writeText(PHONE_COPY)
      setPhoneCopyStatus('copied')
      window.setTimeout(() => setPhoneCopyStatus('idle'), 1800)
    } catch {
      setPhoneCopyStatus('idle')
    }
  }

  const copyEmailAddress = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL_COPY)
      setEmailCopyStatus('copied')
      window.setTimeout(() => setEmailCopyStatus('idle'), 1800)
    } catch {
      setEmailCopyStatus('idle')
    }
  }

  const openMailFallback = () => {
    const subject = encodeURIComponent(`Free quote request - ${quoteForm.service}`)
    const body = encodeURIComponent(
      `Name: ${quoteForm.name}\nEmail: ${quoteForm.email}\nPhone: ${quoteForm.phone}\nService Needed: ${quoteForm.service}\n\nMessage:\n${quoteForm.message}`
    )
    window.location.href = `mailto:${EMAIL_TO}?subject=${subject}&body=${body}`
  }

  const handleQuoteSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setQuoteStatus('sending')

    const templateParams = {
      to_email: EMAIL_TO,
      from_name: quoteForm.name,
      from_email: quoteForm.email,
      phone: quoteForm.phone,
      service: quoteForm.service,
      message: quoteForm.message,
    }

    if (!emailJsConfig.serviceId || !emailJsConfig.templateId || !emailJsConfig.publicKey) {
      openMailFallback()
      setQuoteStatus('fallback')
      return
    }

    try {
      await emailjs.send(
        emailJsConfig.serviceId,
        emailJsConfig.templateId,
        templateParams,
        emailJsConfig.publicKey
      )
      setQuoteStatus('sent')
      setQuoteForm(initialQuoteForm)
    } catch {
      openMailFallback()
      setQuoteStatus('error')
    }
  }

  return (
    <div className="min-h-screen text-navy-900 overflow-x-hidden">
      <motion.div
        className="fixed inset-x-0 top-0 z-[60] h-1 origin-left bg-gradient-to-r from-carolina-400 via-cyan-300 to-emerald-400"
        style={{ scaleX: progressScale }}
      />

      <div className="fixed bottom-5 right-5 z-50 hidden sm:flex flex-col gap-3">
        <motion.button
          type="button"
          onClick={copyPhoneNumber}
          className="quick-action"
          whileHover={{ x: -4, scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          aria-label="Copy Jersey Bros Wash Co phone number"
          title={phoneCopyStatus === 'copied' ? 'Copied' : 'Copy phone number'}
        >
          {phoneCopyStatus === 'copied' ? <Check size={20} /> : <Phone size={20} />}
        </motion.button>
        <motion.a
          href="#quote"
          className="quick-action"
          whileHover={{ x: -4, scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          aria-label="Get a quote"
        >
          <Mail size={20} />
        </motion.a>
      </div>


      {/* Ambient surface treatment */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="surface-grid absolute inset-0 opacity-70" />
        <div className="absolute -top-24 left-0 h-72 w-full bg-gradient-to-r from-carolina-100/80 via-white to-emerald-100/50 blur-3xl" />

      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 px-3 py-3">
        <div className="glass-panel max-w-7xl mx-auto px-5 py-3 flex justify-between items-center rounded-lg">
          <div className="flex items-center gap-3">
            <motion.img
              src="/logo.png"
              alt="Jersey Bros Wash Co Logo"
              className="h-12 w-auto drop-shadow-sm"
              animate={{ rotate: [0, 2, -2, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-navy-900 tracking-tight">Jersey Bros Wash Co</h1>
              <p className="text-xs text-carolina-600 font-medium">Professional Exterior Cleaning</p>
            </div>
          </div>
          <div className="hidden md:flex gap-8">
            {['Services', 'Before & After', 'Reviews', 'Contact'].map((item) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase().replace(' & ', '-')}`}
                className="nav-link font-medium text-navy-700 hover:text-carolina-600 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {item}
              </motion.a>
            ))}
          </div>
          <motion.a
            href="#quote"
            className="bg-navy-900 hover:bg-carolina-700 text-white px-5 py-2 rounded-lg font-semibold transition-all shadow-lg shadow-navy-900/15"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Quote
          </motion.a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="section-transition themed-section hero-wash-bg pt-36 pb-24 px-6 relative overflow-hidden">
        <div className="water-sheen pointer-events-none" />
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1.05fr_0.95fr] gap-12 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <motion.p
              className="inline-flex items-center gap-2 rounded-lg border border-carolina-200 bg-white/80 px-4 py-2 text-sm font-bold text-carolina-700 shadow-sm"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <ShieldCheck size={18} />
              Licensed & Insured in New Jersey
            </motion.p>
            <h2 className="mt-6 text-5xl md:text-7xl font-extrabold leading-tight text-navy-900 tracking-tight">
              Exterior cleaning with a
              <span className="text-carolina-600"> precision-wash finish</span>
            </h2>
            <p className="text-xl text-navy-700 mb-8 max-w-2xl mx-auto lg:mx-0">
              New Jersey's trusted experts in power washing, window cleaning, and gutter services. Fast, reliable, and affordable.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <motion.a
                href="#quote"
                className="inline-flex items-center gap-2 bg-carolina-600 hover:bg-carolina-700 text-white px-8 py-4 rounded-lg font-semibold transition-all shadow-lg shadow-carolina-500/30"
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(25, 142, 215, 0.4)" }}
                whileTap={{ scale: 0.95 }}
              >
                Get Free Quote <ArrowRight size={20} />
              </motion.a>
              <motion.a
                href="#services"
                className="inline-flex items-center gap-2 bg-navy-900 hover:bg-navy-800 text-white px-8 py-4 rounded-lg font-semibold transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Our Services
              </motion.a>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-3 max-w-xl mx-auto lg:mx-0">
              {[
                ['24 hr', 'quote replies'],
                ['100%', 'satisfaction'],
                ['L&I', 'licensed & insured'],
              ].map(([stat, label]) => (
                <motion.div
                  key={stat}
                  className="rounded-lg border border-carolina-100 bg-white/75 p-4 shadow-sm backdrop-blur"
                  whileHover={{ y: -4 }}
                >
                  <p className="text-2xl font-extrabold text-navy-900">{stat}</p>
                  <p className="text-xs font-semibold uppercase text-navy-500">{label}</p>
                </motion.div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap justify-center lg:justify-start gap-3 text-sm font-semibold text-navy-600">
              {[
                { icon: Gauge, label: 'Fast estimates' },
                { icon: Waves, label: 'Soft-wash ready' },
                { icon: ShieldCheck, label: 'Protected work' },
              ].map((item) => (
                <motion.span
                  key={item.label}
                  className="tech-pill"
                  whileHover={{ y: -3, scale: 1.03 }}
                >
                  <item.icon size={17} />
                  {item.label}
                </motion.span>
              ))}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.92, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.9, delay: 0.15 }}
            className="relative mx-auto w-full max-w-lg"
          >
            <div className="absolute inset-8 rounded-lg bg-carolina-300/20 blur-2xl" />
            <motion.img
              src="/logo.png"
              alt="Jersey Bros Wash Co Logo"
              className="relative mx-auto w-full max-w-md rounded-lg bg-white/80 p-4 shadow-2xl shadow-navy-900/15 ring-1 ring-carolina-100"
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="section-transition themed-section services-spray-bg py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl font-bold mb-4 text-navy-900">Our Services</h3>
            <p className="text-navy-700">Professional cleaning solutions for every surface</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Power Washing */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="service-card p-8 transition-all"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="mb-6"
              >
                <SprayCan className="text-carolina-600" size={64} />
              </motion.div>
              <h4 className="text-2xl font-bold mb-3 text-navy-900">Power Washing</h4>
              <p className="text-navy-700 mb-6">
                Remove dirt, grime, and stains from driveways, sidewalks, decks, and siding with our high-pressure cleaning.
              </p>
              <ul className="space-y-2 mb-6">
                {['Driveways & Walkways', 'Deck & Patio Cleaning', 'House Exterior', 'Commercial Properties'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-navy-700">
                    <Check className="text-carolina-600" size={18} />
                    {item}
                  </li>
                ))}
              </ul>
              <motion.a
                href="#quote"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="interactive-button flex w-full items-center justify-center gap-2 bg-carolina-600 hover:bg-carolina-700 text-white py-3 rounded-lg font-semibold transition-all"
              >
                Request This Service <ArrowRight size={18} />
              </motion.a>
            </motion.div>

            {/* Window Cleaning */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="service-card p-8 transition-all"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mb-6"
              >
                <Sparkles className="text-carolina-600" size={64} />
              </motion.div>
              <h4 className="text-2xl font-bold mb-3 text-navy-900">Window Cleaning</h4>
              <p className="text-navy-700 mb-6">
                Crystal clear windows inside and out. We use professional techniques for streak-free results every time.
              </p>
              <ul className="space-y-2 mb-6">
                {['Residential Windows', 'Commercial Buildings', 'High-Rise Cleaning', 'Screen Cleaning'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-navy-700">
                    <Check className="text-carolina-600" size={18} />
                    {item}
                  </li>
                ))}
              </ul>
              <motion.a
                href="#quote"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="interactive-button flex w-full items-center justify-center gap-2 bg-carolina-600 hover:bg-carolina-700 text-white py-3 rounded-lg font-semibold transition-all"
              >
                Request This Service <ArrowRight size={18} />
              </motion.a>
            </motion.div>

            {/* Gutter Cleaning */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="service-card p-8 transition-all"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="mb-6"
              >
                <CloudRain className="text-carolina-600" size={64} />
              </motion.div>
              <h4 className="text-2xl font-bold mb-3 text-navy-900">Gutter Cleaning</h4>
              <p className="text-navy-700 mb-6">
                Protect your home from water damage with our thorough gutter cleaning and maintenance services.
              </p>
              <ul className="space-y-2 mb-6">
                {['Debris Removal', 'Downspout Cleaning', 'Gutter Inspection', 'Preventive Maintenance'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-navy-700">
                    <Check className="text-carolina-600" size={18} />
                    {item}
                  </li>
                ))}
              </ul>
              <motion.a
                href="#quote"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="interactive-button flex w-full items-center justify-center gap-2 bg-carolina-600 hover:bg-carolina-700 text-white py-3 rounded-lg font-semibold transition-all"
              >
                Request This Service <ArrowRight size={18} />
              </motion.a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Before/After Slider */}
      <section id="before-after" className="section-transition themed-section results-ripple-bg py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl font-bold mb-4">See the Difference</h3>
            <p className="text-navy-700">Drag across real Jersey Bros transformations</p>
          </motion.div>

          <div className="grid lg:grid-cols-[minmax(0,1fr)_18rem] gap-8 items-start">
            <motion.div
              key={currentProject.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              <div className="sparkle-frame relative aspect-[3/4] sm:aspect-[4/5] max-h-[760px] bg-navy-800 rounded-lg overflow-hidden shadow-2xl shadow-black/30">
                <img
                  src={currentProject.after}
                  alt={`${currentProject.title} after cleaning`}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                >
                  <img
                    src={currentProject.before}
                    alt={`${currentProject.title} before cleaning`}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>

                <div className="absolute left-4 top-4 rounded-md bg-navy-950/80 px-3 py-1.5 text-xs font-bold uppercase tracking-wide backdrop-blur">
                  Before
                </div>
                <div className="absolute right-4 top-4 rounded-md bg-carolina-600/90 px-3 py-1.5 text-xs font-bold uppercase tracking-wide backdrop-blur">
                  After
                </div>

                <div
                  className="pointer-events-none absolute inset-y-0 w-0.5 bg-white shadow-[0_0_18px_rgba(255,255,255,0.8)]"
                  style={{ left: `${sliderPosition}%` }}
                >
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center ring-4 ring-white/25">
                    <ArrowLeftRight className="text-carolina-700" size={22} />
                  </div>
                </div>

                <input
                  aria-label={`Compare before and after for ${currentProject.title}`}
                  type="range"
                  min="0"
                  max="100"
                  value={sliderPosition}
                  onChange={(event) => setSliderPosition(Number(event.target.value))}
                  className="comparison-range absolute inset-0 h-full w-full cursor-ew-resize"
                />
              </div>

              <div className="mt-5 flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-2xl font-bold">{currentProject.title}</h4>
                  <p className="text-navy-600">{currentProject.detail}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    aria-label="Previous project"
                    onClick={() => selectProject((activeProject - 1 + beforeAfterProjects.length) % beforeAfterProjects.length)}
                    className="h-11 w-11 rounded-lg border border-carolina-200 bg-white/80 text-navy-700 flex items-center justify-center hover:bg-carolina-600 hover:text-white transition-colors"
                  >
                    <ChevronLeft size={22} />
                  </button>
                  <button
                    type="button"
                    aria-label="Next project"
                    onClick={() => selectProject((activeProject + 1) % beforeAfterProjects.length)}
                    className="h-11 w-11 rounded-lg border border-carolina-200 bg-white/80 text-navy-700 flex items-center justify-center hover:bg-carolina-600 hover:text-white transition-colors"
                  >
                    <ChevronRight size={22} />
                  </button>
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
              {beforeAfterProjects.map((project, index) => (
                <button
                  key={project.title}
                  type="button"
                  onClick={() => selectProject(index)}
                  className={`project-selector group flex items-center gap-3 rounded-lg border p-2 text-left transition-all ${
                    activeProject === index
                      ? 'border-carolina-400 bg-carolina-50 text-navy-900 shadow-sm'
                      : 'border-carolina-100 bg-white/70 text-navy-800 hover:border-carolina-300 hover:bg-white'
                  }`}
                >
                  <img
                    src={project.after}
                    alt=""
                    className="sparkle-thumb h-16 w-14 shrink-0 rounded-md object-cover"
                  />
                  <span className="min-w-0">
                    <span className="block font-bold leading-tight">{project.title}</span>
                    <span className="hidden sm:block text-xs text-navy-500">{project.detail}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-transition themed-section trust-sheen-bg py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl font-bold mb-4 text-navy-900">Why Choose Jersey Bros Wash Co?</h3>
            <p className="text-navy-700">We're committed to excellence in every job</p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: Zap, title: 'Fast Service', desc: 'Same-day service available' },
              { icon: Award, title: 'Quality Guaranteed', desc: '100% satisfaction guarantee' },
              { icon: ShieldCheck, title: 'Licensed & Insured', desc: 'Professional protection on every job' },
              { icon: Clock, title: 'Flexible Scheduling', desc: 'Works around your schedule' },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="trust-tile text-center p-6"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                  className="mb-4"
                >
                  <feature.icon className="text-carolina-600 mx-auto" size={48} />
                </motion.div>
                <h4 className="text-xl font-bold mb-2 text-navy-900">{feature.title}</h4>
                <p className="text-navy-700">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="section-transition themed-section reviews-sparkle-bg py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl font-bold mb-4 text-navy-900">What Our Customers Say</h3>
            <p className="text-navy-700">5-star rated service across New Jersey</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'James R.', location: 'Jersey City', rating: 5, text: 'Amazing power washing job! My driveway looks brand new. Highly recommend Jersey Bros Wash Co!' },
              { name: 'Eon S.', location: 'Hoboken', rating: 5, text: 'Professional, punctual, and did an incredible job power washing our patio and walkways. Will definitely use again.' },
              { name: 'Dunkin Donuts', location: '', rating: 5, text: 'They did an excellent job cleaning our storefront, washing the building, and freshening up the concrete around the entrance.' },
            ].map((review, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="service-card p-8"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(review.rating)].map((_, j) => (
                    <Star key={j} className="text-yellow-400 fill-yellow-400" size={20} />
                  ))}
                </div>
                <p className="text-navy-700 mb-4 italic">"{review.text}"</p>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-carolina-600 rounded-full flex items-center justify-center text-white font-bold">
                    {review.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-navy-900">{review.name}</p>
                    {review.location && <p className="text-sm text-navy-600">{review.location}</p>}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="section-transition themed-section areas-current-bg py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl font-bold mb-4">Service Areas</h3>
            <p className="text-navy-700">Proudly serving all of New Jersey</p>
          </motion.div>

          <div className="statewide-card mx-auto max-w-5xl rounded-lg border border-carolina-100 bg-white/80 p-8 text-center backdrop-blur">
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mx-auto mb-6 grid h-24 w-24 place-items-center rounded-lg border border-carolina-300/30 bg-carolina-500/10"
            >
              <MapPin className="text-carolina-600" size={48} />
            </motion.div>
            <h4 className="text-3xl font-extrabold">All of NJ</h4>
            <p className="mx-auto mt-3 max-w-2xl text-navy-700">
              Jersey Bros Wash Co services homes and businesses across New Jersey. Send the job address and service needed, and we’ll confirm availability with your quote.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {['North Jersey', 'Central Jersey', 'South Jersey'].map((area, i) => (
                <motion.a
                  key={area}
                  href="#quote"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -5, scale: 1.03 }}
                  className="rounded-lg border border-carolina-100 bg-white/80 px-4 py-4 font-bold text-navy-800 backdrop-blur hover:border-carolina-300 hover:bg-carolina-50"
                >
                  {area}
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quote Form */}
      <section id="quote" className="section-transition themed-section quote-foam-bg py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl font-bold mb-4 text-navy-900">Get Your Free Quote</h3>
            <p className="text-navy-700">Fill out the form below and we'll get back to you within 24 hours</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-panel rounded-lg p-8"
          >
            <form className="space-y-6" onSubmit={handleQuoteSubmit}>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-navy-900 mb-2">Name</label>
                  <input
                    name="name"
                    type="text"
                    required
                    value={quoteForm.name}
                    onChange={(event) => updateQuoteField('name', event.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-navy-300 focus:border-carolina-500 focus:ring-2 focus:ring-carolina-200 outline-none transition-all"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy-900 mb-2">Email</label>
                  <input
                    name="email"
                    type="email"
                    required
                    value={quoteForm.email}
                    onChange={(event) => updateQuoteField('email', event.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-navy-300 focus:border-carolina-500 focus:ring-2 focus:ring-carolina-200 outline-none transition-all"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-navy-900 mb-2">Phone</label>
                  <input
                    name="phone"
                    type="tel"
                    required
                    value={quoteForm.phone}
                    onChange={(event) => updateQuoteField('phone', event.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-navy-300 focus:border-carolina-500 focus:ring-2 focus:ring-carolina-200 outline-none transition-all"
                    placeholder="601-506-0360"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy-900 mb-2">Service Needed</label>
                  <div className="grid grid-cols-2 gap-2">
                    {quoteServices.map((service) => (
                      <button
                        key={service}
                        type="button"
                        onClick={() => updateQuoteField('service', service)}
                        className={`quote-service-button rounded-lg border px-3 py-3 text-sm font-bold transition-all ${
                          quoteForm.service === service
                            ? 'border-carolina-500 bg-carolina-600 text-white shadow-lg shadow-carolina-500/25'
                            : 'border-navy-200 bg-white/70 text-navy-700 hover:border-carolina-300 hover:bg-carolina-50'
                        }`}
                      >
                        {service}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-900 mb-2">Message</label>
                <textarea
                  name="message"
                  rows={4}
                  required
                  value={quoteForm.message}
                  onChange={(event) => updateQuoteField('message', event.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-navy-300 focus:border-carolina-500 focus:ring-2 focus:ring-carolina-200 outline-none transition-all"
                  placeholder="Tell us about your project..."
                />
              </div>
              <div className="quote-status-panel rounded-lg border border-carolina-100 bg-white/70 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-navy-900">Quote destination</p>
                    <p className="text-sm text-navy-600">{EMAIL_TO}</p>
                  </div>
                  <div className="rounded-md bg-carolina-50 px-3 py-2 text-sm font-bold text-carolina-700">
                    {quoteForm.service}
                  </div>
                </div>
                {quoteStatus === 'sent' && (
                  <p className="mt-3 text-sm font-semibold text-emerald-700">Quote request sent. We’ll get back to you soon.</p>
                )}
                {quoteStatus === 'fallback' && (
                  <p className="mt-3 text-sm font-semibold text-carolina-700">Your email app opened with the quote ready to send.</p>
                )}
                {quoteStatus === 'error' && (
                  <p className="mt-3 text-sm font-semibold text-red-700">EmailJS was unavailable, so your email app opened instead.</p>
                )}
              </div>
              <motion.button
                type="submit"
                disabled={quoteStatus === 'sending'}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="interactive-button w-full bg-carolina-600 hover:bg-carolina-700 disabled:bg-navy-400 text-white py-4 rounded-lg font-semibold transition-all shadow-lg shadow-carolina-500/30"
              >
                {quoteStatus === 'sending' ? 'Sending Quote...' : 'Send Free Quote'}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section-transition themed-section contact-rain-bg py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl font-bold mb-4 text-navy-900">Contact Us</h3>
            <p className="text-navy-700">Ready to get started? Reach out today!</p>
            <p className="mt-3 inline-flex items-center gap-2 rounded-md bg-carolina-50 px-3 py-2 text-sm font-bold text-carolina-700">
              <ShieldCheck size={18} />
              Licensed & Insured
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.button
              type="button"
              onClick={copyPhoneNumber}
              whileHover={{ y: -8, scale: 1.02 }}
              className="contact-tile bg-white rounded-lg p-8 text-center shadow-lg border border-carolina-100"
            >
              <Phone className="text-carolina-600 mx-auto mb-4" size={48} />
              <h4 className="text-xl font-bold mb-2 text-navy-900">Call Us</h4>
              <p className="text-navy-700">{PHONE_DISPLAY}</p>
              <span className="mt-3 inline-flex items-center justify-center gap-2 rounded-md bg-carolina-50 px-3 py-2 text-sm font-bold text-carolina-700">
                {phoneCopyStatus === 'copied' ? <Check size={16} /> : <Copy size={16} />}
                {phoneCopyStatus === 'copied' ? 'Copied' : 'Copy number'}
              </span>
            </motion.button>
            <motion.button
              type="button"
              onClick={copyEmailAddress}
              whileHover={{ y: -8, scale: 1.02 }}
              className="contact-tile bg-white rounded-lg p-8 text-center shadow-lg border border-carolina-100"
            >
              <Mail className="text-carolina-600 mx-auto mb-4" size={48} />
              <h4 className="text-xl font-bold mb-2 text-navy-900">Email Us</h4>
              <p className="text-navy-700 break-all">{EMAIL_TO}</p>
              <span className="mt-3 inline-flex items-center justify-center gap-2 rounded-md bg-carolina-50 px-3 py-2 text-sm font-bold text-carolina-700">
                {emailCopyStatus === 'copied' ? <Check size={16} /> : <Copy size={16} />}
                {emailCopyStatus === 'copied' ? 'Copied' : 'Copy email'}
              </span>
            </motion.button>
            <motion.div
              whileHover={{ y: -8, scale: 1.02 }}
              className="contact-tile bg-white rounded-lg p-8 text-center shadow-lg border border-carolina-100"
            >
              <MapPin className="text-carolina-600 mx-auto mb-4" size={48} />
              <h4 className="text-xl font-bold mb-2 text-navy-900">Location</h4>
              <p className="text-navy-700">Serving All of New Jersey</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-flow-bg relative overflow-hidden py-8 px-6 text-navy-800">
        <div className="max-w-7xl mx-auto text-center">
          <p className="mb-2">&copy; 2024 Jersey Bros Wash Co. All rights reserved.</p>
          <p className="text-sm text-navy-600 mb-2">Licensed & Insured Exterior Cleaning in New Jersey</p>
          <p className="text-sm text-navy-600">Contact: Trystin Carpenter - {PHONE_DISPLAY}</p>
        </div>
      </footer>
    </div>
  )
}









