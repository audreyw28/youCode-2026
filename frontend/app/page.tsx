'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ResidentQR } from './components/ResidentQR';
import { communityCentres } from '../lib/data/communityData';
import { childcarePrograms } from '../lib/data/childcareData';
import { shelters } from '../lib/data/shelterData';

type ResourceType = 'all' | 'shelter' | 'food' | 'community';

type ResourceItem = {
  id: string;
  name: string;
  address: string;
  printAddress: string;
  phone: string | null;
  category: Exclude<ResourceType, 'all'>;
  hasChild: boolean;
  hasWheelchair: boolean;
  lat?: number | null;
  lng?: number | null;
  extra?: string | null;
  transitSteps: string[];
  transitRoute: string;
  estimatedTime: string;
  stopName: string;
  appointmentLabel: string;
  residentId?: string;
};

type Language = 'en' | 'zh' | 'pa' | 'tl';

const categoryMeta: Record<Exclude<ResourceType, 'all'>, { label: string; eyebrow: string }> = {
  shelter: { label: 'Shelter', eyebrow: 'Dignity' },
  food: { label: 'Emergency Childcare', eyebrow: 'Childcare' },
  community: { label: 'Career', eyebrow: 'Career Transition' },
};

const translations: Record<Language, {
  title: string;
  welcomeHome: string;
  slogan: string;
  navFeatures: string;
  navResources: string;
  navContact: string;
  quickStart: string;
  findSafeSupport: string;
  translationGuidance: string;
  needLabel: string;
  childrenWelcomeLabel: string;
  strollerAccess: string;
  filterStroller: string;
  availablePlaces: string;
  totalVerifiedSpots: string;
  placesLoaded: string;
  bestNextStep: string;
  searchSummary: string;
  findPlaceNow: string;
  browseWithLogin: string;
  pickALane: string;
  browseByNeed: string;
  showingCount: string;
  allResources: string;
  useFiltersHelper: string;
  handPickedList: string;
  placesToCheckNext: string;
  cardsVisible: string;
  noMatch: string;
  noMatchTitle: string;
  noMatchCopy: string;
  childrenProgram: string;
  wheelchairAccess: string;
  call: string;
  phoneNotListed: string;
  getDirections: string;
  stayConnected: string;
  needHelpGettingStarted: string;
  contactHelper: string;
  userLogin: string;
  adminLogin: string;
  languageLabel: string;
  shelter: string;
  childcare: string;
  career: string;
  printVisitSheet: string;
}> = {
  en: {
    title: 'Free me',
    welcomeHome: 'Welcome home',
    slogan: 'Find calm, clear next steps with trusted shelter, childcare, and career support.',
    navFeatures: 'Features',
    navResources: 'Resources',
    navContact: 'Contact',
    quickStart: 'Quick start',
    findSafeSupport: 'Find safe support near you',
    translationGuidance: 'Translation-friendly guidance',
    needLabel: 'Need',
    childrenWelcomeLabel: 'Children welcome',
    strollerAccess: 'Stroller access',
    filterStroller: 'Stroller access',
    availablePlaces: 'Available places',
    totalVerifiedSpots: 'Total verified spots',
    placesLoaded: 'places loaded',
    bestNextStep: 'Best next step',
    searchSummary: 'Browse the cards below and print a visit sheet',
    findPlaceNow: 'Find a place now',
    browseWithLogin: 'Browse with user login',
    shelter: 'Shelter',
    childcare: 'Emergency Childcare',
    career: 'Career',
    printVisitSheet: 'Print visit sheet',
    pickALane: 'Pick a lane',
    browseByNeed: 'Browse by need',
    showingCount: '{count} showing',
    allResources: 'All resources',
    useFiltersHelper: 'Use the filters to narrow the list, then print a transit-ready visit sheet when you need one.',
    handPickedList: 'Hand-picked list',
    placesToCheckNext: 'Places to check next',
    cardsVisible: 'Each card keeps the basics visible at a glance.',
    noMatch: 'No match',
    noMatchTitle: 'Nothing fits those filters yet.',
    noMatchCopy: 'Try opening up one filter and we’ll refill the page with nearby options.',
    childrenProgram: "Children's program",
    wheelchairAccess: 'Wheelchair access',
    call: 'Call',
    phoneNotListed: 'Phone not listed',
    getDirections: 'Get directions',
    stayConnected: 'Stay connected',
    needHelpGettingStarted: 'Need help getting started?',
    contactHelper: 'Use the logins above or print a visit sheet once you find a match.',
    userLogin: 'User log in',
    adminLogin: 'Admin log in',
    languageLabel: 'Language',
  },
  zh: {
    title: 'Free me',
    welcomeHome: '欢迎回家',
    slogan: '通过可信赖的收容所、托儿和职业支持，找到宁静、清晰的下一步。',
    navFeatures: '功能',
    navResources: '资源',
    navContact: '联系',
    quickStart: '快速开始',
    findSafeSupport: '查找安全支持',
    translationGuidance: '翻译友好指南',
    needLabel: '需求',
    childrenWelcomeLabel: '欢迎儿童',
    strollerAccess: '婴儿车通道',
    filterStroller: '婴儿车通道',
    availablePlaces: '可用地点',
    totalVerifiedSpots: '已验证地点总数',
    placesLoaded: '地点已加载',
    bestNextStep: '最佳下一步',
    searchSummary: '浏览卡片并打印访问单。',
    findPlaceNow: '立即寻找地点',
    browseWithLogin: '使用登录浏览',
    shelter: '庇护所',
    childcare: '紧急托儿服务',
    career: '职业',
    printVisitSheet: '打印访问单',
    pickALane: '选择一个路线',
    browseByNeed: '按需求浏览',
    showingCount: '显示 {count} 个',
    allResources: '所有资源',
    useFiltersHelper: '使用筛选器缩小列表，然后在需要时打印交通就绪访问单。',
    handPickedList: '精选列表',
    placesToCheckNext: '下一个要检查的地点',
    cardsVisible: '每张卡片都能让基本信息一目了然。',
    noMatch: '无匹配',
    noMatchTitle: '没有符合这些筛选的内容。',
    noMatchCopy: '尝试打开一个筛选器，我们将重新填充附近的选项。',
    childrenProgram: '儿童项目',
    wheelchairAccess: '轮椅通道',
    call: '电话',
    phoneNotListed: '未列出电话号码',
    getDirections: '获取路线',
    stayConnected: '保持联系',
    needHelpGettingStarted: '需要帮助开始吗？',
    contactHelper: '请使用上方登录或找到匹配项后打印访问单。',
    userLogin: '用户登录',
    adminLogin: '管理员登录',
    languageLabel: '语言',
  },
  pa: {
    title: 'Free me',
    welcomeHome: 'ਘਰ ਆਓ',
    slogan: 'ਭਰੋਸੇਯੋਗ ਸ਼ੈਲਟਰ, ਚਾਈਲਡਕੇਅਰ ਅਤੇ ਕਰੀਅਰ ਸਹਾਇਤਾ ਨਾਲ ਸ਼ਾਂਤ, ਸਪਸ਼ਟ ਅਗਲੇ ਕਦਮ ਖੋਜੋ।',
    navFeatures: 'ਫੀਚਰ',
    navResources: 'ਸੰਸਾਧਨ',
    navContact: 'ਸੰਪਰਕ',
    quickStart: 'ਤੁਰੰਤ ਸ਼ੁਰੂ ਕਰੋ',
    findSafeSupport: 'ਸੁਰੱਖਿਅਤ ਸਹਾਇਤਾ ਲੱਭੋ',
    translationGuidance: 'ਅਨੁਵਾਦ-ਮਿੱਤਰ ਦਿਸ਼ਾ-ਨਿਰਦੇਸ਼',
    needLabel: 'ਲੋੜ',
    childrenWelcomeLabel: 'ਬੱਚਿਆਂ ਦਾ ਸੁਆਗਤ',
    strollerAccess: 'ਸਟ੍ਰੋਲਰ ਐਕਸੇਸ',
    filterStroller: 'ਸਟ੍ਰੋਲਰ ਐਕਸੇਸ',
    availablePlaces: 'ਉਪਲਬਧ ਥਾਵਾਂ',
    totalVerifiedSpots: 'ਮੋਧਲਤ ਥਾਵਾਂ',
    placesLoaded: 'ਥਾਵਾਂ ਲੋਡ ਕੀਤੀਆਂ',
    bestNextStep: 'ਸਭ ਤੋਂ ਵਧੀਆ ਅਗਲਾ ਕਦਮ',
    searchSummary: 'ਕਾਰਡ ਵੇਖੋ ਅਤੇ ਦੌਰੇ ਵਾਚਕ ਪ੍ਰਿੰਟ ਕਰੋ।',
    findPlaceNow: 'ਹੁਣ ਥਾਂ ਲੱਭੋ',
    browseWithLogin: 'ਲੌਗਇਨ ਨਾਲ ਬ੍ਰਾਊਜ਼ ਕਰੋ',
    shelter: 'ਸ਼ੈਲਟਰ',
    childcare: 'ਐਮਰਜੈਂਸੀ ਚਾਈਲਡਕੇਅਰ',
    career: 'ਕੈਰੀਅਰ',
    printVisitSheet: 'ਦੌਰੇ ਦਾ ਸ਼ੀਟ ਪ੍ਰਿੰਟ ਕਰੋ',
    pickALane: 'ਇੱਕ ਲੈਨ ਚੁਣੋ',
    browseByNeed: 'ਲੋੜ ਅਨੁਸਾਰ ਵੇਖੋ',
    showingCount: '{count} ਦਿਖਾ ਰਹੇ',
    allResources: 'ਸਾਰੇ ਸਰੋਤ',
    useFiltersHelper: "ਲਿਸਟ ਨੂੰ ਸੁਕਣਾ ਕਰਨ ਲਈ ਫਿਲਟਰ ਵਰਤੋ, ਫਿਰ ਜ਼ਰੂਰਤ ਹੋਣ 'ਤੇ ਟ੍ਰਾਂਜ਼ਿਟ ਤਿਆਰ ਦੌਰਾ ਸੀਟ ਪ੍ਰਿੰਟ ਕਰੋ।",
    handPickedList: 'ਚੁਣੀ ਗਈ ਸੂਚੀ',
    placesToCheckNext: 'ਅਗਲੇ ਜਾਂਚ ਲਈ ਥਾਵਾਂ',
    cardsVisible: 'ਹਰ ਕਾਰਡ ਮੁੱਢਲੀ ਜਾਣਕਾਰੀ ਨੂੰ ਇੱਕ ਨਜ਼ਰ ਵਿੱਚ ਦਿਖਾਉਂਦਾ ਹੈ।',
    noMatch: 'ਕੋਈ ਮਿਲਾਪ ਨਹੀਂ',
    noMatchTitle: 'ਉਹ ਫਿਲਟਰ ਫਿਲਹਾਲ ਕਿਸੇ ਵੀ ਚੀਜ਼ ਨਾਲ ਨਹੀਂ ਬੈਠਦੇ।',
    noMatchCopy: 'ਕੋਈ ਫਿਲਟਰ ਖੋਲ੍ਹੋ ਅਤੇ ਅਸੀਂ ਨੇੜਲੇ ਵਿਕਲਪ ਮੁੜ ਭਰਾਂਗੇ।',
    childrenProgram: 'ਬੱਚਿਆਂ ਦੀ ਪ੍ਰੋਗ੍ਰਾਮ',
    wheelchairAccess: 'ਵ੍ਹੀਲਚੇਅਰ ਐਕਸੇਸ',
    call: 'ਕਾਲ',
    phoneNotListed: 'ਫ਼ੋਨ ਨਹੀਂ ਦਰਸਾਇਆ',
    getDirections: 'ਦਿਸ਼ਾ ਪ੍ਰਾਪਤ ਕਰੋ',
    stayConnected: 'ਜੁੜੇ ਰਹੋ',
    needHelpGettingStarted: 'ਸ਼ੁਰੂ ਕਰਨ ਵਿੱਚ ਮਦਦ ਦੀ ਲੋੜ ਹੈ?',
    contactHelper: "ਉੱਪਰ ਦਿੱਤੇ ਲੌਗਿਨ ਦੀ ਵਰਤੋਂ ਕਰੋ ਜਾਂ ਮਿਲਾਪ ਮਿਲਣ 'ਤੇ ਦੌਰਾ ਸੀਟ ਪ੍ਰਿੰਟ ਕਰੋ।",
    userLogin: 'ਉਪਭੋਗਤਾ ਲੌਗਿਨ',
    adminLogin: 'ਐਡਮਿਨ ਲੌਗਿਨ',
    languageLabel: 'ਭਾਸ਼ਾ',
  },
  tl: {
    title: 'Free me',
    welcomeHome: 'Maligayang pag-uwi',
    slogan: 'Maghanap ng tahimik, malinaw na susunod na hakbang na may maaasahang tirahan, pangangalaga sa bata, at tulong sa trabaho.',
    navFeatures: 'Mga Tampok',
    navResources: 'Mga Mapagkukunan',
    navContact: 'Makipag-ugnay',
    quickStart: 'Mabilis na pagsisimula',
    findSafeSupport: 'Maghanap ng ligtas na tulong',
    translationGuidance: 'Patnubay na madaling isalin',
    needLabel: 'Kailangan',
    childrenWelcomeLabel: 'Malugod ang mga bata',
    strollerAccess: 'Access sa stroller',
    filterStroller: 'Access sa stroller',
    availablePlaces: 'Magagamit na mga lugar',
    totalVerifiedSpots: 'Kabuuang beripikadong lugar',
    placesLoaded: 'mga lugar na na-load',
    bestNextStep: 'Pinakamainam na susunod na hakbang',
    searchSummary: 'Mag-browse ng mga card at i-print ang visit sheet.',
    findPlaceNow: 'Hanapin ang lugar ngayon',
    browseWithLogin: 'Mag-browse gamit ang pag-login',
    shelter: 'Tirahan',
    childcare: 'Emergency Childcare',
    career: 'Career',
    printVisitSheet: 'I-print ang visit sheet',
    pickALane: 'Pumili ng lane',
    browseByNeed: 'Mag-browse ayon sa pangangailangan',
    showingCount: 'Ipinapakita ang {count}',
    allResources: 'Lahat ng mapagkukunan',
    useFiltersHelper: 'Gamitin ang mga filter upang paliitin ang listahan, pagkatapos i-print ang visit sheet kapag kailangan.',
    handPickedList: 'Piniling listahan',
    placesToCheckNext: 'Mga lugar na susuriin susunod',
    cardsVisible: 'Pinapanatili ng bawat card ang mga pangunahing impormasyon na madaling makita.',
    noMatch: 'Walang tugma',
    noMatchTitle: 'Wala sa mga ito ang tumutugma sa mga filter.',
    noMatchCopy: 'Subukang buksan ang isang filter at muling pupunan namin ang mga kalapit na pagpipilian.',
    childrenProgram: 'Programa para sa mga bata',
    wheelchairAccess: 'Accessibility ng wheelchair',
    call: 'Tumawag',
    phoneNotListed: 'Walang nakalistang telepono',
    getDirections: 'Kumuha ng direksyon',
    stayConnected: 'Manatiling konektado',
    needHelpGettingStarted: 'Kailangan ng tulong sa pagsisimula?',
    contactHelper: 'Gamitin ang mga login sa itaas o i-print ang visit sheet kapag may nahanap na tugma.',
    userLogin: 'Mag-log in',
    adminLogin: 'Admin Mag-log in',
    languageLabel: 'Wika',
  },
};

const languageOptions: { code: Language; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'zh', label: '中文' },
  { code: 'pa', label: 'ਪੰਜਾਬੀ' },
  { code: 'tl', label: 'Tagalog' },
];

const featureCards = [
  {
    title: 'Verified Trust',
    copy: 'Every place on this list is screened so families can start from safer, trusted options.',
    icon: 'Shield',
  },
  {
    title: 'Instant Matches',
    copy: 'Move through nearby support quickly with clear categories, directions, and printable notes.',
    icon: 'Spark',
  },
  {
    title: 'Language Support',
    copy: 'Simple labels and guided next steps help people navigate services with more confidence.',
    icon: 'Translate',
  },
];

function safeFirstAddressLine(address: string | null | undefined) {
  if (typeof address !== 'string' || address.trim().length === 0) {
    return 'the destination';
  }

  return address.split(',')[0]?.trim() || 'the destination';
}

function PencilCaseArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 360 210" className={className} aria-hidden="true">
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M28 80C16 98 13 124 24 145L47 186C55 200 72 205 90 198L314 122C331 116 340 98 336 78L328 41C325 24 308 11 288 15L63 47C48 49 36 58 28 80Z" fill="#ffbe74" stroke="#2f64d3" strokeWidth="4.5" />
        <path d="M58 42L316 113" stroke="#2f64d3" strokeWidth="4.5" />
        <path d="M42 100L276 151" stroke="#adc7ff" strokeWidth="12" />
        <path d="M44 103L274 154" stroke="#2f64d3" strokeWidth="3" />
        <path d="M84 61C98 49 121 54 133 66C150 83 144 112 126 124C101 141 68 123 67 96" fill="#fff0a6" stroke="#2f64d3" strokeWidth="3.5" />
        <path d="M97 85C104 80 114 81 120 88" stroke="#2f64d3" strokeWidth="3.5" />
        <path d="M98 102C108 108 121 107 130 99" stroke="#2f64d3" strokeWidth="3.5" />
        <path d="M97 77L98 77" stroke="#2f64d3" strokeWidth="5" />
        <path d="M121 79L122 79" stroke="#2f64d3" strokeWidth="5" />
        <path d="M185 114L203 120" stroke="#2f64d3" strokeWidth="4" />
        <path d="M209 120L245 128" stroke="#2f64d3" strokeWidth="4" />
        <path d="M73 157L154 175" stroke="#fff7d4" strokeWidth="10" />
        <path d="M232 54L290 67" stroke="#fff7d4" strokeWidth="10" />
      </g>
    </svg>
  );
}

function PencilArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 420" className={className} aria-hidden="true">
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M80 38L118 74L48 366L30 392L25 356L80 38Z" fill="#ffbb79" stroke="#2f64d3" strokeWidth="4.5" />
        <path d="M80 38C91 13 116 9 131 25C143 38 145 63 132 76L118 74L80 38Z" fill="#adc7ff" stroke="#2f64d3" strokeWidth="4.5" />
        <path d="M83 40C96 31 109 33 119 42" stroke="#2f64d3" strokeWidth="3.5" />
        <path d="M57 327L96 99" stroke="#2f64d3" strokeWidth="3.5" />
        <path d="M69 336L108 108" stroke="#2f64d3" strokeWidth="3.5" />
        <path d="M33 355L47 359L26 390" fill="#fff6be" stroke="#2f64d3" strokeWidth="3.5" />
      </g>
    </svg>
  );
}

function RulerArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 170 360" className={className} aria-hidden="true">
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M45 18L150 80L121 336L19 276L45 18Z" fill="#ffcb86" stroke="#2f64d3" strokeWidth="4.5" />
        <path d="M108 52L139 70L108 323L78 305L108 52Z" fill="#adc7ff" stroke="#adc7ff" strokeWidth="10" />
        <path d="M38 56L82 82" stroke="#fff" strokeWidth="6" />
        <path d="M53 48L41 245" stroke="#fff5ca" strokeWidth="10" />
        <path d="M54 42L57 52M60 46L63 56M66 49L69 59M72 53L75 63M78 56L81 66M84 60L87 70M90 63L93 73" stroke="#fff2bd" strokeWidth="2.8" />
        <path d="M90 118L103 126M83 171L96 179M75 224L88 232M67 277L80 285" stroke="#2f64d3" strokeWidth="4" />
        <path d="M97 255L103 260L97 266L90 260L97 255Z" fill="#fff0a6" stroke="#2f64d3" strokeWidth="3" />
      </g>
    </svg>
  );
}

function BackpackIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path
          d="M39 29C39 18 48 10 60 10C72 10 81 18 81 29"
          stroke="#2f64d3"
          strokeWidth="5"
        />
        <path
          d="M26 36C26 28 32 22 40 22H80C88 22 94 28 94 36V91C94 100 87 108 78 108H42C33 108 26 100 26 91V36Z"
          fill="#ffbe74"
          stroke="#2f64d3"
          strokeWidth="5"
        />
        <path d="M37 36H83V48C83 54 78 59 72 59H48C42 59 37 54 37 48V36Z" fill="#adc7ff" stroke="#2f64d3" strokeWidth="4" />
        <path d="M45 59H75C81 59 86 64 86 70V91C86 96 82 100 77 100H43C38 100 34 96 34 91V70C34 64 39 59 45 59Z" fill="#fffaf4" stroke="#2f64d3" strokeWidth="4" />
        <path d="M48 59V47" stroke="#2f64d3" strokeWidth="4" />
        <path d="M72 59V47" stroke="#2f64d3" strokeWidth="4" />
        <path d="M50 76C53 71 59 68 65 69C71 70 75 75 76 81" stroke="#2f64d3" strokeWidth="4" />
        <path d="M56 82L57 82" stroke="#2f64d3" strokeWidth="5" />
        <path d="M69 82L70 82" stroke="#2f64d3" strokeWidth="5" />
        <path d="M46 39L35 50" stroke="#fff0a6" strokeWidth="6" />
        <path d="M74 39L86 51" stroke="#fff0a6" strokeWidth="6" />
      </g>
    </svg>
  );
}

function StrollerIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        {/* Frame */}
        <path d="M20 70 Q50 50 80 70" stroke="#2f64d3" strokeWidth="3" />
        {/* Seat */}
        <path d="M30 50 L70 50 L65 70 L35 70 Z" fill="#ffbe74" stroke="#2f64d3" strokeWidth="2" />
        {/* Handle */}
        <path d="M50 30 L50 10 Q60 5 70 10" stroke="#2f64d3" strokeWidth="3" />
        {/* Wheels */}
        <circle cx="25" cy="75" r="8" fill="#adc7ff" stroke="#2f64d3" strokeWidth="2" />
        <circle cx="75" cy="75" r="8" fill="#adc7ff" stroke="#2f64d3" strokeWidth="2" />
        <circle cx="50" cy="75" r="6" fill="#adc7ff" stroke="#2f64d3" strokeWidth="2" />
      </g>
    </svg>
  );
}

export default function Home() {
  const [withChild, setWithChild] = useState(false);
  const [wheelchair, setWheelchair] = useState(false);
  const [activeType, setActiveType] = useState<ResourceType>('all');
  const [language, setLanguage] = useState<Language>('en');
  const [selectedForPrint, setSelectedForPrint] = useState<ResourceItem | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [qrId, setQrId] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<ResourceItem | null>(null);

  const t = translations[language];
  const categoryLabels: Record<Exclude<ResourceType, 'all'>, string> = {
    shelter: t.shelter,
    food: t.childcare,
    community: t.career,
  };

  const allResources = useMemo<ResourceItem[]>(() => {
    const shelterItems = shelters.map((s, index) => ({
      id: s.shelter_id ?? `shelter-${index}`,
      name: s.name ?? 'Unknown',
      address: s.city ?? 'Unknown address',
      printAddress: s.city ?? 'Address shared directly by shelter staff',
      phone: s.phone ?? null,
      category: 'shelter' as const,
      hasChild: s.childrens_programming === 'onsite',
      hasWheelchair: s.accessibility === 'fully',
      lat: typeof s.lat === 'number' ? s.lat : typeof s.lat === 'string' ? Number(s.lat) || null : null,
      lng: typeof s.lng === 'number' ? s.lng : typeof s.lng === 'string' ? Number(s.lng) || null : null,
      extra: s.type ?? null,
      transitSteps: [
        'Travel by bus or SkyTrain toward the city listed on this shelter card.',
        'Check in with shelter staff before sharing personal details in public.',
        'Ask the desk team for the safest arrival entrance and intake queue.',
        'Keep this printout available for staff sign-off after your visit.',
      ],
      transitRoute: `Bus 99 (Eastbound) -> Transfer to regional service toward ${s.city ?? 'the shelter city'}.`,
      estimatedTime: 'Approx. 45 mins from Walter Gage Residence.',
      stopName: `${s.city ?? 'Shelter'} main arrival stop`,
      appointmentLabel: 'Shelter intake at 10:00 AM',
    }));

    const foodItems = childcarePrograms.map((f, i) => ({
      id: `food-${i}`,
      name: f.program_name,
      address: f.location_address,
      printAddress: f.location_address,
      phone: f.signup_phone_number,
      category: 'food' as const,
      hasChild: true,
      hasWheelchair: f.wheelchair_accessible,
      lat: f.latitude,
      lng: f.longitude,
      extra: f.population_served,
      transitSteps: f.transit_steps,
      transitRoute: 'Bus 99 (Eastbound) -> Transfer to Expo Line at Commercial-Broadway.',
      estimatedTime: 'Approx. 45 mins from Walter Gage Residence.',
      stopName: `Exit at the stop nearest ${safeFirstAddressLine(f.location_address)}.`,
      appointmentLabel: 'Job interview at 10:00 AM',
    }));

    const communityItems = communityCentres.map((c, i) => ({
      id: `cc-${i}`,
      name: c.name ?? 'Unknown',
      address: c.address ?? c.area ?? 'Unknown address',
      printAddress:
        c.address && c.area
          ? `${c.address}, ${c.area}, Vancouver, BC`
          : c.address ?? c.area ?? 'Unknown address',
      phone: null,
      category: 'community' as const,
      hasChild: false,
      hasWheelchair: false,
      lat: c.lat,
      lng: c.lng,
      extra: c.area ? `${c.area} career transition hub` : 'Career transition support',
      transitSteps: [
        `Ride transit toward ${c.area ?? 'the neighbourhood service hub'}.`,
        `Exit near ${c.address ?? c.name ?? 'the centre entrance'}.`,
        'Check the front desk for employment coaching, resume help, and intake hours.',
        'Ask staff to sign the Proof of Visit section before you leave.',
      ],
      transitRoute: `Bus 99 (Eastbound) -> Transfer to local service for ${c.area ?? 'the destination neighbourhood'}.`,
      estimatedTime: 'Approx. 45 mins from Walter Gage Residence.',
      stopName: `Get off at ${c.address ?? c.name ?? 'the closest stop'}.`,
      appointmentLabel: 'Career appointment at 10:00 AM',
    }));

    return [...shelterItems, ...foodItems, ...communityItems];
  }, []);

  const filtered = useMemo(() => {
    return allResources.filter((item) => {
      if (activeType !== 'all' && item.category !== activeType) return false;
      if (withChild && !item.hasChild) return false;
      if (wheelchair && !item.hasWheelchair) return false;
      return true;
    });
  }, [activeType, allResources, wheelchair, withChild]);

  const handlePrint = (item: ResourceItem) => {
    const id = `RES-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setQrId(id);
    setSelectedItem(item);
    setShowQR(true);

    // Save to localStorage
    const residents = JSON.parse(localStorage.getItem('incomingResidents') || '[]');
    residents.push({
      id,
      timestamp: Date.now(),
      resource: item.name,
      address: item.address,
      category: item.category
    });
    localStorage.setItem('incomingResidents', JSON.stringify(residents));
  };

  return (
    <main className="home-page">
      <section className="hero-section">
        <div className="hero-backdrop hero-backdrop-left">
          <PencilCaseArt className="supply-art case-art" />
        </div>
        <div className="hero-backdrop hero-backdrop-right">
          <PencilArt className="supply-art pencil-art" />
          <RulerArt className="supply-art ruler-art" />
        </div>

        <div className="landing-shell">
          <header className="landing-nav">
            <Link href="/" className="landing-brand">
              <span className="landing-brand__badge">
                <BackpackIcon className="landing-brand__icon" />
              </span>
              <span className="landing-brand__label">freeme!</span>
            </Link>

            <nav className="landing-nav__links" aria-label="Primary">
              <a href="#features">{t.navFeatures}</a>
              <a href="#resources">{t.navResources}</a>
              <a href="#contact">{t.navContact}</a>
            </nav>

            <div className="landing-nav__actions">
              <label htmlFor="language-select" className="sr-only">{t.languageLabel}</label>
              <select
                id="language-select"
                value={language}
                onChange={(event) => setLanguage(event.target.value as Language)}
                className="landing-nav__language"
              >
                {languageOptions.map((option) => (
                  <option key={option.code} value={option.code}>
                    {option.label}
                  </option>
                ))}
              </select>

              <Link href="/login" className="landing-nav__secondary">
                {t.userLogin}
              </Link>
              <Link href="/admin" className="landing-nav__primary">
                {t.adminLogin}
              </Link>
            </div>
          </header>

          <section className="landing-hero">
            <p className="landing-hero__eyebrow">{t.welcomeHome}</p>
            <h1>{t.title}</h1>
            <div className="landing-hero__message">
              <p>{t.slogan}</p>
            </div>
          </section>

          <section className="landing-features">
            {featureCards.map((card) => (
              <article key={card.title} className="landing-feature-card">
                <div className="landing-feature-card__icon" aria-hidden="true">
                  {card.icon}
                </div>
                <h2>{card.title}</h2>
                <p>{card.copy}</p>
              </article>
            ))}
          </section>

          <section className="landing-search-panel">
            <div className="landing-search-panel__head">
              <div>
                <p className="landing-search-panel__kicker">{t.quickStart}</p>
                <h2>{t.findSafeSupport}</h2>
              </div>
              <div className="landing-search-panel__assist">{t.translationGuidance}</div>
            </div>

            <div className="landing-search-grid">
              <div className="landing-search-field">
                <span>{t.needLabel}</span>
                <div className="landing-search-field__value">{t.shelter}, {t.childcare}, or {t.career} help</div>
              </div>
              <div className="landing-search-field">
                <span>{t.childrenWelcomeLabel}</span>
                <div className="landing-search-field__value">{withChild ? 'Yes, currently filtered' : 'Optional filter available'}</div>
              </div>
              <div className="landing-search-field">
                <span>{t.filterStroller}</span>
                <div className="landing-search-field__value">{wheelchair ? 'Yes, currently filtered' : 'Optional filter available'}</div>
              </div>
              <div className="landing-search-field">
                <span>{t.availablePlaces}</span>
                <div className="landing-search-field__value">{filtered.length} {t.showingCount.replace('{count}', String(filtered.length))}</div>
              </div>
              <div className="landing-search-field">
                <span>{t.totalVerifiedSpots}</span>
                <div className="landing-search-field__value">{allResources.length} {t.placesLoaded ?? 'places loaded'}</div>
              </div>
              <div className="landing-search-field">
                <span>{t.bestNextStep}</span>
                <div className="landing-search-field__value">{t.searchSummary}</div>
              </div>
            </div>

            <div className="landing-search-panel__actions">
              <a href="#resources" className="landing-search-panel__primary">
                {t.findPlaceNow}
              </a>
              <Link href="/login" className="landing-search-panel__secondary">
                {t.browseWithLogin}
              </Link>
            </div>
          </section>
        </div>
      </section>

      <section id="resources" className="content-shell">
        <div className="panel-card panel-card--filters">
          <div className="panel-heading">
            <div>
              <p className="panel-kicker">{t.pickALane}</p>
              <h2>{t.browseByNeed}</h2>
            </div>
            <div className="count-pill">{filtered.length} {t.showingCount.replace('{count}', String(filtered.length))}</div>
          </div>

          <div className="pill-row">
            {(['all', 'shelter', 'food', 'community'] as ResourceType[]).map((type) => (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className={`pill-button ${activeType === type ? 'is-active' : ''}`}
              >
                {type === 'all' ? t.allResources : categoryMeta[type].label}
              </button>
            ))}
          </div>

          <div className="toggle-row">
            <button
              onClick={() => setWithChild(!withChild)}
              className={`toggle-chip ${withChild ? 'is-on' : ''}`}
            >
              Children welcome
            </button>
            <button
              onClick={() => setWheelchair(!wheelchair)}
              className={`toggle-chip alt ${wheelchair ? 'is-on' : ''}`}
            >
              <StrollerIcon className="toggle-chip__icon" />
              {t.filterStroller}
            </button>
          </div>

          <p className="helper-text">
            {t.useFiltersHelper}
          </p>
        </div>

        <div className="panel-card panel-card--results">
          <div className="panel-heading panel-heading--results">
            <div>
              <p className="panel-kicker">{t.handPickedList}</p>
              <h2>{t.placesToCheckNext}</h2>
            </div>
            <p className="helper-text">{t.cardsVisible}</p>
          </div>

          {filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state__badge">{t.noMatch}</div>
              <h3>{t.noMatchTitle}</h3>
              <p>{t.noMatchCopy}</p>
            </div>
          ) : (
            <div className="resource-grid">
              {filtered.map((item) => {
                const cat = categoryMeta[item.category];
                const mapsTarget =
                  typeof item.lat === 'number' && typeof item.lng === 'number'
                    ? `${item.lat},${item.lng}`
                    : `${item.address}, Vancouver, BC`;
                const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mapsTarget)}&travelmode=transit`;

                return (
                  <article key={item.id} className={`resource-card resource-card--${item.category}`}>
                    <div className="resource-card__top">
                      <span className="resource-card__eyebrow">{cat.eyebrow}</span>
                      <span className="resource-card__tag">{categoryLabels[item.category]}</span>
                    </div>

                    <h3>{item.name}</h3>
                    <p className="resource-card__address">{item.address}</p>

                    {item.extra && <p className="resource-card__detail">{item.extra}</p>}

                    <div className="resource-card__chips">
                      {item.hasChild && <span className="mini-chip">{t.childrenProgram}</span>}
                      {item.hasWheelchair && <span className="mini-chip mini-chip--blue">{t.wheelchairAccess}</span>}
                    </div>

                    {item.phone ? (
                      <a href={`tel:${item.phone}`} className="resource-card__phone">
                        {t.call} {item.phone}
                      </a>
                    ) : (
                      <p className="resource-card__phone resource-card__phone--muted">{t.phoneNotListed}</p>
                    )}

                    <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="direction-button">
                      {t.getDirections}
                    </a>
                    <button type="button" className="print-button" onClick={() => handlePrint(item)}>
                      {t.printVisitSheet}
                    </button>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        <div id="contact" className="panel-card landing-contact-card">
          <div className="panel-heading panel-heading--results">
            <div>
              <p className="panel-kicker">{t.stayConnected}</p>
              <h2>{t.needHelpGettingStarted}</h2>
            </div>
            <p className="helper-text">{t.contactHelper}</p>
          </div>

          <div className="landing-contact-card__actions">
            <Link href="/login" className="note-sheet__admin-link">
              {t.userLogin}
            </Link>
            <Link href="/admin" className="note-sheet__admin-link">
              {t.adminLogin}
            </Link>
          </div>
        </div>

        <section
          className={`print-sheet print-only-section ${selectedForPrint ? 'print-sheet--ready' : ''}`}
          aria-hidden={!selectedForPrint}
        >
          {selectedForPrint ? (
            <div className="print-sheet__page">
              <div className="print-sheet__destination-head">
                <p className="print-sheet__eyebrow">{categoryMeta[selectedForPrint.category].eyebrow}</p>
                <h1>
                  <span className="print-sheet__icon" aria-hidden="true">
                    🚶
                  </span>
                  {selectedForPrint.name}
                </h1>
                <p className="print-sheet__category">
                  <span className="print-sheet__icon" aria-hidden="true">
                    📅
                  </span>
                  {selectedForPrint.appointmentLabel}
                </p>
              </div>

              <div className="print-sheet__block">
                <h2>Destination</h2>
                <p className="print-sheet__address">{selectedForPrint.printAddress}</p>
              </div>

              <div className="print-sheet__postit">
                <p className="print-sheet__postit-label">Transit Guide Post-it</p>
                <div className="print-sheet__postit-row">
                  <span>Route</span>
                  <strong>{selectedForPrint.transitRoute}</strong>
                </div>
                <div className="print-sheet__postit-row">
                  <span>Estimated Time</span>
                  <strong>{selectedForPrint.estimatedTime}</strong>
                </div>
                <div className="print-sheet__postit-row">
                  <span>Stop Name</span>
                  <strong>{selectedForPrint.stopName}</strong>
                </div>
                <div className="print-sheet__timeline" aria-label="Transit timeline">
                  <div className="print-sheet__timeline-step">
                    <div className="print-sheet__timeline-icon" aria-hidden="true">
                      🚌
                    </div>
                    <div>
                      <strong>Start</strong>
                      <p>UBC (Walter Gage)</p>
                      <p>#99 B-Line Bus</p>
                    </div>
                  </div>
                  <div className="print-sheet__timeline-arrow" aria-hidden="true">
                    -&gt;
                  </div>
                  <div className="print-sheet__timeline-step">
                    <div className="print-sheet__timeline-icon" aria-hidden="true">
                      🚇
                    </div>
                    <div>
                      <strong>Transfer</strong>
                      <p>Commercial-Broadway Stn</p>
                      <p>Expo Line Train</p>
                    </div>
                  </div>
                  <div className="print-sheet__timeline-arrow" aria-hidden="true">
                    -&gt;
                  </div>
                  <div className="print-sheet__timeline-step">
                    <div className="print-sheet__timeline-icon" aria-hidden="true">
                      🚶
                    </div>
                    <div>
                      <strong>End</strong>
                      <p>{selectedForPrint.stopName}</p>
                      <p>{selectedForPrint.printAddress}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="print-sheet__help-card">
                <h2>Help Me</h2>
                <div className="print-sheet__help-copy">
                  <p>
                    Lost. No Phone. Going to: {selectedForPrint.printAddress}. Please Help.
                  </p>
                </div>
                <div className="print-sheet__line-group">
                  <span>Emergency Shelter Contact</span>
                  <span className="print-sheet__line">{selectedForPrint.phone ?? ''}</span>
                </div>
              </div>

              <div className="print-sheet__qr">
                <ResidentQR residentId={selectedForPrint.residentId || selectedForPrint.id} size={112} />
              </div>
            </div>
          ) : null}
        </section>
      </section>

      {showQR && selectedItem && (
        <div className="qr-modal-overlay" onClick={() => setShowQR(false)}>
          <div className="qr-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Your Resident ID for {selectedItem.name}</h3>
            <ResidentQR residentId={qrId} size={200} />
            <p>Show this QR code at the location for check-in.</p>
            <button onClick={() => {
              setSelectedForPrint({...selectedItem, residentId: qrId});
              setShowQR(false);
              requestAnimationFrame(() => window.print());
            }}>{t.printVisitSheet}</button>
            <button onClick={() => setShowQR(false)}>Close</button>
          </div>
        </div>
      )}
    </main>
  );
}
