// ================================================================
// ENGLISH TRAINER v3.0 — Super Complete Module
// Platform belajar Bahasa Inggris A1→C2
// ================================================================
'use strict';
if(window._ETv3Loaded){}else{
window._ETv3Loaded=true;

const ET={
  rng:{
    pick:(a)=>a[Math.floor(Math.random()*a.length)],
    shuffle:(a)=>[...a].sort(()=>Math.random()-.5),
    range:(min,max)=>Math.floor(Math.random()*(max-min+1))+min,
  },
  save:(k,v)=>{try{localStorage.setItem('et3_'+k,JSON.stringify(v));}catch(e){}},
  load:(k,d)=>{try{const v=localStorage.getItem('et3_'+k);return v!==null?JSON.parse(v):d;}catch(e){return d;}},
  speak:(text,rate=0.85)=>{
    if(!window.speechSynthesis)return;
    const u=new SpeechSynthesisUtterance(text);
    u.lang='en-US';u.rate=rate;u.pitch=1;
    speechSynthesis.cancel();speechSynthesis.speak(u);
  },
  norm:(s)=>(s||'').toLowerCase().replace(/[^\w\s]/g,'').trim(),
  today:()=>new Date().toDateString(),
  el:(id)=>document.getElementById(id),
};

let etState={
  section:'dashboard',xp:0,level:1,streak:0,lastDay:null,
  totalAnswered:0,totalCorrect:0,achievements:[],
  dailyDone:false,dailyProgress:0,dailyGoal:10,
  combo:1,sessionCorrect:0,sessionWrong:0,
  vocabLevel:'A1',vocabMode:'en2id',vocabCat:'all',
  currentVocab:null,ttsEnabled:true,customWords:[],
};

const ET_LEVELS=[
  {min:0,   max:200,  label:'A1 Beginner',         icon:'🌱'},
  {min:200, max:500,  label:'A2 Elementary',        icon:'📗'},
  {min:500, max:1000, label:'B1 Intermediate',      icon:'⭐'},
  {min:1000,max:1800, label:'B2 Upper Intermediate',icon:'🔥'},
  {min:1800,max:3000, label:'C1 Advanced',          icon:'💎'},
  {min:3000,max:99999,label:'C2 Professional',      icon:'👑'},
];
function etGetLevel(xp){return ET_LEVELS.find(l=>xp>=l.min&&xp<l.max)||ET_LEVELS[ET_LEVELS.length-1];}

function etAddXP(n,reason){
  etState.xp+=n;etState.totalAnswered++;
  ET.save('xp',etState.xp);etCheckAch();etUpdateTopStats();
  const el=document.createElement('div');
  el.style.cssText='position:fixed;top:38%;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,#7c6af7,#5de0c5);color:#fff;padding:8px 20px;border-radius:99px;font-weight:800;font-size:15px;z-index:99999;pointer-events:none;animation:etXpFloat 1.2s ease forwards';
  el.textContent='+'+n+' XP'+(reason?' · '+reason:'');
  document.body.appendChild(el);setTimeout(()=>el.remove(),1300);
}
function etUpdateTopStats(){
  const lvl=etGetLevel(etState.xp);
  const x=ET.el('et-top-xp');if(x)x.textContent=etState.xp+' XP';
  const l=ET.el('et-top-level');if(l)l.textContent=lvl.icon+' '+lvl.label;
}

const ET_ACH=[
  {id:'first',  icon:'🎯',name:'Langkah Pertama', desc:'Jawab pertanyaan pertama', cond:s=>s.totalAnswered>=1},
  {id:'combo5', icon:'🔥',name:'On Fire!',         desc:'Combo 5x berturut',        cond:s=>s.combo>=5},
  {id:'combo10',icon:'💥',name:'Unstoppable',      desc:'Combo 10x berturut',       cond:s=>s.combo>=10},
  {id:'xp100',  icon:'⭐',name:'Rising Star',      desc:'Kumpulkan 100 XP',         cond:s=>s.xp>=100},
  {id:'xp500',  icon:'💎',name:'Diamond Learner',  desc:'Kumpulkan 500 XP',         cond:s=>s.xp>=500},
  {id:'xp1000', icon:'👑',name:'Master Learner',   desc:'Kumpulkan 1000 XP',        cond:s=>s.xp>=1000},
  {id:'xp3000', icon:'🚀',name:'English Champion', desc:'Kumpulkan 3000 XP',        cond:s=>s.xp>=3000},
  {id:'ans50',  icon:'📚',name:'Bookworm',          desc:'Jawab 50 soal',            cond:s=>s.totalAnswered>=50},
  {id:'ans200', icon:'🎓',name:'Scholar',           desc:'Jawab 200 soal',           cond:s=>s.totalAnswered>=200},
  {id:'streak7',icon:'📅',name:'Weekly Warrior',   desc:'Streak 7 hari',            cond:s=>s.streak>=7},
  {id:'acc80',  icon:'🦉',name:'Wise Owl',          desc:'Akurasi 80%+',             cond:s=>s.totalAnswered>=20&&(s.totalCorrect/s.totalAnswered)>=0.8},
];
function etCheckAch(){
  ET_ACH.forEach(a=>{
    if(!etState.achievements.includes(a.id)&&a.cond(etState)){
      etState.achievements.push(a.id);ET.save('achievements',etState.achievements);
      const el=document.createElement('div');
      el.style.cssText='position:fixed;top:70px;right:20px;background:linear-gradient(135deg,#7c6af7,#5de0c5);color:#fff;padding:14px 20px;border-radius:16px;font-size:14px;font-weight:700;z-index:99999;box-shadow:0 8px 32px rgba(124,106,247,.5);animation:etSlideIn .4s ease';
      el.innerHTML=a.icon+' Achievement Unlocked!<br><span style="font-size:12px;opacity:.9">'+a.name+' — '+a.desc+'</span>';
      document.body.appendChild(el);setTimeout(()=>el.remove(),4000);
    }
  });
}
// ── VOCAB DATABASE ──────────────────────────────────────────────
const ET_VOCAB={
A1:[
  {en:'Hello',id:'Halo',cat:'Daily',ex:'Hello! How are you?'},
  {en:'Goodbye',id:'Sampai jumpa',cat:'Daily',ex:'Goodbye! See you tomorrow.'},
  {en:'Thank you',id:'Terima kasih',cat:'Daily',ex:'Thank you for your help.'},
  {en:'Please',id:'Tolong / Silakan',cat:'Daily',ex:'Please sit down.'},
  {en:'Sorry',id:'Maaf',cat:'Daily',ex:'Sorry, I am late.'},
  {en:'Yes',id:'Ya',cat:'Daily',ex:'Yes, I understand.'},
  {en:'No',id:'Tidak',cat:'Daily',ex:'No, that is wrong.'},
  {en:'Maybe',id:'Mungkin',cat:'Daily',ex:'Maybe I will come tomorrow.'},
  {en:'Good',id:'Baik / Bagus',cat:'Adjective',ex:'This food is very good.'},
  {en:'Bad',id:'Buruk / Jelek',cat:'Adjective',ex:'That was a bad idea.'},
  {en:'Big',id:'Besar',cat:'Adjective',ex:'That is a big house.'},
  {en:'Small',id:'Kecil',cat:'Adjective',ex:'I have a small cat.'},
  {en:'Hot',id:'Panas',cat:'Adjective',ex:'This coffee is very hot.'},
  {en:'Cold',id:'Dingin',cat:'Adjective',ex:'The water is cold.'},
  {en:'Fast',id:'Cepat',cat:'Adjective',ex:'He is a fast runner.'},
  {en:'New',id:'Baru',cat:'Adjective',ex:'I bought a new phone.'},
  {en:'Old',id:'Lama / Tua',cat:'Adjective',ex:'This building is very old.'},
  {en:'Easy',id:'Mudah',cat:'Adjective',ex:'This question is easy.'},
  {en:'Difficult',id:'Sulit',cat:'Adjective',ex:'Math is difficult for me.'},
  {en:'Happy',id:'Bahagia',cat:'Emotion',ex:'I am very happy today.'},
  {en:'Sad',id:'Sedih',cat:'Emotion',ex:'Why are you sad?'},
  {en:'Hungry',id:'Lapar',cat:'Emotion',ex:'I am so hungry right now.'},
  {en:'Tired',id:'Lelah',cat:'Emotion',ex:'I feel tired after work.'},
  {en:'Angry',id:'Marah',cat:'Emotion',ex:'She is angry today.'},
  {en:'Excited',id:'Bersemangat',cat:'Emotion',ex:'I am excited about the trip.'},
  {en:'Go',id:'Pergi',cat:'Verb',ex:'I go to school every day.'},
  {en:'Come',id:'Datang',cat:'Verb',ex:'Please come here.'},
  {en:'Eat',id:'Makan',cat:'Verb',ex:'I eat rice for lunch.'},
  {en:'Drink',id:'Minum',cat:'Verb',ex:'I drink water every morning.'},
  {en:'Sleep',id:'Tidur',cat:'Verb',ex:'I sleep at 10 PM.'},
  {en:'Work',id:'Bekerja',cat:'Verb',ex:'She works at a hospital.'},
  {en:'Study',id:'Belajar',cat:'Verb',ex:'I study English every day.'},
  {en:'Read',id:'Membaca',cat:'Verb',ex:'I like to read books.'},
  {en:'Write',id:'Menulis',cat:'Verb',ex:'Please write your name here.'},
  {en:'Buy',id:'Membeli',cat:'Verb',ex:'I want to buy a new bag.'},
  {en:'Help',id:'Membantu',cat:'Verb',ex:'Can you help me?'},
  {en:'Know',id:'Tahu / Mengetahui',cat:'Verb',ex:'I do not know the answer.'},
  {en:'Like',id:'Suka',cat:'Verb',ex:'I like playing soccer.'},
  {en:'Love',id:'Cinta / Mencintai',cat:'Verb',ex:'I love my family.'},
  {en:'Want',id:'Ingin / Mau',cat:'Verb',ex:'I want a glass of water.'},
  {en:'Today',id:'Hari ini',cat:'Time',ex:'Today is Monday.'},
  {en:'Tomorrow',id:'Besok',cat:'Time',ex:'I will call you tomorrow.'},
  {en:'Yesterday',id:'Kemarin',cat:'Time',ex:'Yesterday was Sunday.'},
  {en:'Morning',id:'Pagi',cat:'Time',ex:'I wake up in the morning.'},
  {en:'Night',id:'Malam',cat:'Time',ex:'Good night, sleep well.'},
  {en:'Week',id:'Minggu',cat:'Time',ex:'I work five days a week.'},
  {en:'What',id:'Apa',cat:'Question',ex:'What is your name?'},
  {en:'Who',id:'Siapa',cat:'Question',ex:'Who is that person?'},
  {en:'Where',id:'Di mana',cat:'Question',ex:'Where do you live?'},
  {en:'When',id:'Kapan',cat:'Question',ex:'When will you arrive?'},
  {en:'Why',id:'Mengapa',cat:'Question',ex:'Why are you sad?'},
  {en:'How',id:'Bagaimana',cat:'Question',ex:'How are you doing?'},
  {en:'House',id:'Rumah',cat:'Noun',ex:'My house is near the school.'},
  {en:'School',id:'Sekolah',cat:'Noun',ex:'I go to school every day.'},
  {en:'Food',id:'Makanan',cat:'Noun',ex:'This food is delicious.'},
  {en:'Water',id:'Air',cat:'Noun',ex:'Please give me water.'},
  {en:'Book',id:'Buku',cat:'Noun',ex:'I read a book every night.'},
  {en:'Friend',id:'Teman',cat:'Noun',ex:'She is my best friend.'},
  {en:'Family',id:'Keluarga',cat:'Noun',ex:'I love my family.'},
  {en:'Money',id:'Uang',cat:'Noun',ex:'I need some money.'},
  {en:'Car',id:'Mobil',cat:'Noun',ex:'My father has a new car.'},
  {en:'Phone',id:'Ponsel / HP',cat:'Noun',ex:'My phone is out of battery.'},
],
A2:[
  {en:'How are you?',id:'Apa kabar?',cat:'Greeting',ex:'Hello! How are you today?'},
  {en:'Nice to meet you.',id:'Senang bertemu denganmu.',cat:'Greeting',ex:'Hello! Nice to meet you.'},
  {en:'See you later.',id:'Sampai ketemu lagi.',cat:'Greeting',ex:'I have to go. See you later!'},
  {en:'Have a nice day.',id:'Semoga harimu menyenangkan.',cat:'Greeting',ex:'Bye! Have a nice day.'},
  {en:'Can you help me?',id:'Bisakah kamu membantu saya?',cat:'Conversation',ex:'Excuse me, can you help me?'},
  {en:'I do not understand.',id:'Saya tidak mengerti.',cat:'Conversation',ex:'Sorry, I do not understand.'},
  {en:'Can you repeat that?',id:'Bisakah kamu mengulanginya?',cat:'Conversation',ex:'I missed that. Can you repeat?'},
  {en:'Of course!',id:'Tentu saja!',cat:'Conversation',ex:'Can you help? Of course!'},
  {en:'No problem.',id:'Tidak masalah.',cat:'Conversation',ex:'No problem! I can help you.'},
  {en:'I agree.',id:'Saya setuju.',cat:'Conversation',ex:'I think we should go early. I agree.'},
  {en:'I disagree.',id:'Saya tidak setuju.',cat:'Conversation',ex:'That plan is good. I disagree, actually.'},
  {en:'Homework',id:'Pekerjaan rumah (PR)',cat:'School',ex:'I forgot to do my homework.'},
  {en:'Exam',id:'Ujian',cat:'School',ex:'I have an exam tomorrow.'},
  {en:'Teacher',id:'Guru',cat:'School',ex:'My teacher is very kind.'},
  {en:'Grade',id:'Nilai / Tingkat',cat:'School',ex:'I got a good grade on my exam.'},
  {en:'Go / Went / Gone',id:'Pergi (lampau)',cat:'Irregular Verb',ex:'She went to Bali last year.'},
  {en:'Come / Came / Come',id:'Datang (lampau)',cat:'Irregular Verb',ex:'She came early this morning.'},
  {en:'See / Saw / Seen',id:'Melihat (lampau)',cat:'Irregular Verb',ex:'I saw a beautiful sunset.'},
  {en:'Take / Took / Taken',id:'Mengambil (lampau)',cat:'Irregular Verb',ex:'She took my pen.'},
  {en:'Give / Gave / Given',id:'Memberi (lampau)',cat:'Irregular Verb',ex:'He gave me a gift.'},
  {en:'Make / Made / Made',id:'Membuat (lampau)',cat:'Irregular Verb',ex:'She made a delicious cake.'},
  {en:'Buy / Bought / Bought',id:'Membeli (lampau)',cat:'Irregular Verb',ex:'I bought a new shirt.'},
  {en:'Write / Wrote / Written',id:'Menulis (lampau)',cat:'Irregular Verb',ex:'I wrote a letter yesterday.'},
  {en:'Know / Knew / Known',id:'Mengetahui (lampau)',cat:'Irregular Verb',ex:'I knew the answer.'},
  {en:'Think / Thought / Thought',id:'Berpikir (lampau)',cat:'Irregular Verb',ex:'He thought carefully.'},
  {en:'Nervous',id:'Gugup',cat:'Emotion',ex:'I feel nervous before the interview.'},
  {en:'Confident',id:'Percaya diri',cat:'Emotion',ex:'Be confident in yourself.'},
  {en:'Proud',id:'Bangga',cat:'Emotion',ex:'I am proud of my achievement.'},
  {en:'Worried',id:'Khawatir',cat:'Emotion',ex:'She is worried about the exam.'},
  {en:'Bored',id:'Bosan',cat:'Emotion',ex:'I am bored at home.'},
],
B1:[
  {en:'Software',id:'Perangkat lunak',cat:'Tech',ex:'This software updates automatically.'},
  {en:'Hardware',id:'Perangkat keras',cat:'Tech',ex:'We need to upgrade the hardware.'},
  {en:'Database',id:'Basis data',cat:'Tech',ex:'The database stores user information.'},
  {en:'Algorithm',id:'Algoritma',cat:'Tech',ex:'The algorithm sorts data efficiently.'},
  {en:'Bug',id:'Kesalahan dalam program',cat:'Tech',ex:'The developer found a bug in the code.'},
  {en:'Debug',id:'Memperbaiki kesalahan kode',cat:'Tech',ex:'I need to debug this function.'},
  {en:'Deploy',id:'Menerapkan / Meluncurkan',cat:'Tech',ex:'We will deploy the app next Monday.'},
  {en:'Framework',id:'Kerangka kerja',cat:'Tech',ex:'React is a popular JavaScript framework.'},
  {en:'Repository',id:'Tempat penyimpanan kode',cat:'Tech',ex:'Push your code to the repository.'},
  {en:'Meeting',id:'Rapat',cat:'Business',ex:'We have a meeting at 9 AM.'},
  {en:'Deadline',id:'Batas waktu',cat:'Business',ex:'The deadline is tomorrow.'},
  {en:'Project',id:'Proyek',cat:'Business',ex:'Our project is on schedule.'},
  {en:'Client',id:'Klien',cat:'Business',ex:'The client approved our proposal.'},
  {en:'Budget',id:'Anggaran',cat:'Business',ex:'We need to cut the budget.'},
  {en:'Strategy',id:'Strategi',cat:'Business',ex:'We need a new marketing strategy.'},
  {en:'Revenue',id:'Pendapatan',cat:'Business',ex:'Our revenue increased by 30%.'},
  {en:'Proposal',id:'Proposal / Usulan',cat:'Business',ex:'I submitted the proposal yesterday.'},
  {en:'Passport',id:'Paspor',cat:'Travel',ex:'Do not forget your passport.'},
  {en:'Boarding pass',id:'Kartu naik pesawat',cat:'Travel',ex:'Please show your boarding pass.'},
  {en:'Luggage',id:'Bagasi',cat:'Travel',ex:'My luggage got lost at the airport.'},
  {en:'Symptom',id:'Gejala',cat:'Health',ex:'What are your symptoms?'},
  {en:'Prescription',id:'Resep dokter',cat:'Health',ex:'Take this prescription to the pharmacy.'},
  {en:'Appointment',id:'Janji temu',cat:'Health',ex:'I have a doctor appointment at 3 PM.'},
  {en:'Present Simple',id:'Waktu sekarang - kebiasaan',cat:'Grammar',ex:'I work at a tech company.'},
  {en:'Present Continuous',id:'Sedang berlangsung sekarang',cat:'Grammar',ex:'I am working on a project right now.'},
  {en:'Past Simple',id:'Waktu lampau - selesai',cat:'Grammar',ex:'She visited Bali last year.'},
  {en:'Present Perfect',id:'Sudah pernah / baru saja',cat:'Grammar',ex:'I have finished my report.'},
],
B2:[
  {en:'Hypothesis',id:'Hipotesis',cat:'Academic',ex:'The researcher formed a hypothesis.'},
  {en:'Methodology',id:'Metodologi',cat:'Academic',ex:'Explain your research methodology.'},
  {en:'Analysis',id:'Analisis',cat:'Academic',ex:'The analysis shows a clear pattern.'},
  {en:'Conclusion',id:'Kesimpulan',cat:'Academic',ex:'Draw a conclusion from the data.'},
  {en:'Abstract',id:'Abstrak - ringkasan',cat:'Academic',ex:'Write a 150-word abstract.'},
  {en:'Stakeholder',id:'Pemangku kepentingan',cat:'Business',ex:'Inform all stakeholders of the change.'},
  {en:'ROI',id:'Keuntungan atas investasi',cat:'Business',ex:'The ROI is higher than expected.'},
  {en:'KPI',id:'Indikator kinerja utama',cat:'Business',ex:'We met all our KPIs this quarter.'},
  {en:'Scalable',id:'Dapat berkembang dengan beban',cat:'Business',ex:'The model is highly scalable.'},
  {en:'Pivot',id:'Mengubah arah bisnis',cat:'Business',ex:'The startup decided to pivot its strategy.'},
  {en:'Hit the nail on the head',id:'Tepat sasaran',cat:'Idiom',ex:'You hit the nail on the head with that idea.'},
  {en:'Break a leg',id:'Semoga berhasil',cat:'Idiom',ex:'Break a leg at your presentation today!'},
  {en:'Beat around the bush',id:'Tidak langsung ke intinya',cat:'Idiom',ex:'Stop beating around the bush.'},
  {en:'Under the weather',id:'Sedang tidak enak badan',cat:'Idiom',ex:'I am feeling under the weather today.'},
  {en:'On the same page',id:'Sepemahaman / Satu pikiran',cat:'Idiom',ex:'Let us make sure we are on the same page.'},
  {en:'Burn the midnight oil',id:'Bekerja sampai larut malam',cat:'Idiom',ex:'I burned the midnight oil to finish the report.'},
  {en:'Conditional Type 1',id:'Jika ... maka ... (real future)',cat:'Grammar',ex:'If it rains, I will stay home.'},
  {en:'Conditional Type 2',id:'Jika (tidak nyata sekarang)',cat:'Grammar',ex:'If I were rich, I would travel the world.'},
  {en:'Passive Voice',id:'Kalimat pasif',cat:'Grammar',ex:'The report was written by the manager.'},
  {en:'Reported Speech',id:'Kalimat tidak langsung',cat:'Grammar',ex:'She said that she was tired.'},
  {en:'API',id:'Antarmuka pemrograman aplikasi',cat:'Tech',ex:'The app connects to the server via API.'},
  {en:'Agile',id:'Metode pengembangan iteratif',cat:'Tech',ex:'We use Agile methodology in our team.'},
  {en:'Frontend',id:'Bagian tampilan website',cat:'Tech',ex:'She works as a frontend developer.'},
  {en:'Backend',id:'Bagian server dan logika website',cat:'Tech',ex:'The backend handles data processing.'},
  {en:'Machine Learning',id:'Pembelajaran mesin',cat:'Tech',ex:'Machine learning powers recommendation systems.'},
  {en:'Cloud Computing',id:'Komputasi awan',cat:'Tech',ex:'We moved our servers to cloud computing.'},
],
C1:[
  {en:'Paradigm shift',id:'Perubahan cara pandang fundamental',cat:'Academic',ex:'AI represents a paradigm shift in computing.'},
  {en:'Nuanced',id:'Bernuansa - memiliki banyak aspek halus',cat:'Academic',ex:'The topic requires nuanced understanding.'},
  {en:'Empirical',id:'Berdasarkan data dan pengamatan nyata',cat:'Academic',ex:'We need empirical evidence to support the theory.'},
  {en:'Mitigate',id:'Mengurangi / meringankan risiko',cat:'Business',ex:'We must mitigate the financial risk.'},
  {en:'Synergy',id:'Sinergi - efek gabungan yang lebih besar',cat:'Business',ex:'The merger created great synergy.'},
  {en:'Catalyst',id:'Katalis / pemicu perubahan',cat:'Academic',ex:'Education is the catalyst for development.'},
  {en:'Ghosting',id:'Tiba-tiba menghilang / tidak membalas',cat:'Slang',ex:'He ghosted her after three dates.'},
  {en:'FOMO',id:'Takut ketinggalan (Fear of Missing Out)',cat:'Slang',ex:'I have serious FOMO about the concert.'},
  {en:'No-brainer',id:'Keputusan sangat mudah / sudah jelas',cat:'Slang',ex:'Taking that job offer was a no-brainer.'},
  {en:'Lowkey',id:'Diam-diam / sedikit',cat:'Slang',ex:'I am lowkey excited about the new season.'},
  {en:'Reach out',id:'Menghubungi / berkomunikasi',cat:'Slang',ex:'Feel free to reach out if you need help.'},
  {en:'Circle back',id:'Kembali membahas nanti',cat:'Slang',ex:'Let us circle back to this after lunch.'},
  {en:'Deep dive',id:'Mempelajari secara mendalam',cat:'Slang',ex:'We need to deep dive into the analytics.'},
  {en:'Nevertheless',id:'Meskipun demikian',cat:'TOEFL',ex:'It was difficult; nevertheless, she persisted.'},
  {en:'Subsequently',id:'Kemudian / selanjutnya',cat:'TOEFL',ex:'The experiment failed; subsequently, it was revised.'},
  {en:'Consequently',id:'Akibatnya / oleh karena itu',cat:'TOEFL',ex:'He failed to study; consequently, he failed.'},
  {en:'Predominantly',id:'Terutama / sebagian besar',cat:'TOEFL',ex:'The population is predominantly urban.'},
  {en:'Inherent',id:'Melekat / bawaan secara alami',cat:'TOEFL',ex:'There are inherent risks in every business.'},
  {en:'Albeit',id:'Meskipun / walaupun',cat:'TOEFL',ex:'The project succeeded, albeit with some delays.'},
],
C2:[
  {en:'Obfuscate',id:'Mempersulit pemahaman / mengaburkan',cat:'Advanced',ex:'The politician tried to obfuscate the truth.'},
  {en:'Perspicacious',id:'Sangat jeli melihat hal tersembunyi',cat:'Advanced',ex:'A perspicacious leader anticipates problems early.'},
  {en:'Magnanimous',id:'Murah hati / lapang dada',cat:'Advanced',ex:'She was magnanimous in accepting defeat.'},
  {en:'Zeitgeist',id:'Semangat / jiwa zaman',cat:'Advanced',ex:'Social media defines the zeitgeist of our era.'},
  {en:'Hubris',id:'Kesombongan berlebihan yang berakhir buruk',cat:'Advanced',ex:'His hubris led to his eventual downfall.'},
  {en:'Serendipity',id:'Keberuntungan tidak terduga',cat:'Advanced',ex:'Meeting her was pure serendipity.'},
  {en:'Ephemeral',id:'Sesaat / sementara / tidak abadi',cat:'Advanced',ex:'Fame can be ephemeral in the social media age.'},
  {en:'Pragmatic',id:'Pragmatis / fokus pada hasil nyata',cat:'Advanced',ex:'Take a pragmatic approach to problem-solving.'},
  {en:'Rhetoric',id:'Retorika / seni persuasi berbicara',cat:'Advanced',ex:'His speech was full of empty rhetoric.'},
  {en:'Ubiquitous',id:'Ada di mana-mana / sangat umum',cat:'Advanced',ex:'Smartphones have become ubiquitous in modern life.'},
  {en:'Ostensibly',id:'Seolah-olah / secara lahiriah',cat:'Advanced',ex:'He was ostensibly helping, but had other motives.'},
  {en:'Equivocal',id:'Ambigu / bisa ditafsirkan dua cara',cat:'Advanced',ex:'His answer was deliberately equivocal.'},
],
Business:[
  {en:'Quarterly report',id:'Laporan triwulanan',cat:'Business',ex:'The quarterly report showed strong growth.'},
  {en:'Due diligence',id:'Uji tuntas / pemeriksaan menyeluruh',cat:'Business',ex:'Always conduct due diligence before investing.'},
  {en:'Value proposition',id:'Nilai yang ditawarkan bisnis',cat:'Business',ex:'Our value proposition is quality at low cost.'},
  {en:'Cash flow',id:'Arus kas',cat:'Business',ex:'Maintaining positive cash flow is critical.'},
  {en:'Equity',id:'Ekuitas / kepemilikan saham',cat:'Business',ex:'She has 20% equity in the company.'},
  {en:'Venture capital',id:'Modal ventura',cat:'Business',ex:'The startup raised venture capital funding.'},
  {en:'Disruption',id:'Gangguan / perubahan besar industri',cat:'Business',ex:'Ride-sharing caused disruption in taxi industry.'},
  {en:'Onboarding',id:'Proses orientasi karyawan baru',cat:'Business',ex:'The onboarding process takes two weeks.'},
  {en:'Churn rate',id:'Tingkat kehilangan pelanggan',cat:'Business',ex:'We need to reduce our churn rate.'},
  {en:'Burn rate',id:'Kecepatan penggunaan dana startup',cat:'Business',ex:'At this burn rate, we have 6 months left.'},
  {en:'B2B',id:'Bisnis ke bisnis',cat:'Business',ex:'We operate in the B2B market segment.'},
  {en:'B2C',id:'Bisnis ke konsumen',cat:'Business',ex:'Our B2C sales grew 40% this year.'},
  {en:'Market penetration',id:'Penetrasi pasar',cat:'Business',ex:'We need a strong market penetration strategy.'},
  {en:'Leverage',id:'Memanfaatkan / mendongkrak',cat:'Business',ex:'We can leverage social media for growth.'},
  {en:'Benchmark',id:'Tolok ukur / patokan',cat:'Business',ex:'Use industry benchmarks for comparison.'},
],
Tech:[
  {en:'Open source',id:'Kode terbuka - gratis dimodifikasi',cat:'Tech',ex:'Linux is an open source operating system.'},
  {en:'Version control',id:'Kontrol versi kode',cat:'Tech',ex:'Use version control for all your projects.'},
  {en:'CI/CD',id:'Integrasi dan penerapan otomatis',cat:'Tech',ex:'CI/CD pipelines automate the deployment process.'},
  {en:'Docker',id:'Platform containerisasi aplikasi',cat:'Tech',ex:'Run the app in a Docker container.'},
  {en:'Microservices',id:'Arsitektur layanan kecil independen',cat:'Tech',ex:'We split the monolith into microservices.'},
  {en:'Latency',id:'Latensi / waktu jeda',cat:'Tech',ex:'High latency affects user experience.'},
  {en:'Encryption',id:'Enkripsi / pengamanan data',cat:'Tech',ex:'All passwords are stored with encryption.'},
  {en:'Pull request',id:'Permintaan penggabungan kode',cat:'Tech',ex:'Submit a pull request for code review.'},
  {en:'Refactoring',id:'Memperbaiki struktur kode tanpa ubah fungsi',cat:'Tech',ex:'Refactoring improved the code readability.'},
  {en:'Technical debt',id:'Utang teknis - kode yang perlu diperbaiki',cat:'Tech',ex:'We need to address the technical debt.'},
  {en:'Load balancing',id:'Pembagian beban server',cat:'Tech',ex:'Load balancing prevents server overload.'},
  {en:'Cache',id:'Penyimpanan sementara untuk akses cepat',cat:'Tech',ex:'Clear the cache if the page does not update.'},
  {en:'Endpoint',id:'Titik akhir API / URL layanan',cat:'Tech',ex:'Call the /users endpoint to get user data.'},
  {en:'Sprint',id:'Siklus kerja pendek 1-2 minggu',cat:'Tech',ex:'We deliver features every sprint.'},
],
Slang:[
  {en:'GOAT',id:'Yang terbaik (Greatest Of All Time)',cat:'Slang',ex:'Lionel Messi is the GOAT of football.'},
  {en:'Lit',id:'Seru / keren banget',cat:'Slang',ex:'That party was absolutely lit!'},
  {en:'Slay',id:'Tampil luar biasa / sangat keren',cat:'Slang',ex:'She slayed her presentation today.'},
  {en:'Vibe',id:'Suasana / perasaan yang dirasakan',cat:'Slang',ex:'I love the vibe of this cafe.'},
  {en:'Flex',id:'Pamer / menunjukkan sesuatu dengan bangga',cat:'Slang',ex:'He is always flexing his new gadgets.'},
  {en:'Chill',id:'Santai / tenang',cat:'Slang',ex:'Let us just chill at home tonight.'},
  {en:'Sus',id:'Mencurigakan (suspicious)',cat:'Slang',ex:'That behavior is really sus.'},
  {en:'No cap',id:'Serius / tidak bohong',cat:'Slang',ex:'This is the best pizza ever, no cap.'},
  {en:'NGL',id:'Jujur nih (Not Gonna Lie)',cat:'Slang',ex:'NGL, that was the hardest exam ever.'},
  {en:'FYI',id:'Sekadar informasi (For Your Information)',cat:'Slang',ex:'FYI, the meeting was moved to 3 PM.'},
  {en:'ASAP',id:'Sesegera mungkin (As Soon As Possible)',cat:'Slang',ex:'Please send the report ASAP.'},
  {en:'TBH',id:'Sejujurnya (To Be Honest)',cat:'Slang',ex:'TBH, I do not like this design.'},
  {en:'IMO',id:'Menurut saya (In My Opinion)',cat:'Slang',ex:'IMO, this solution is better.'},
  {en:'Hit different',id:'Terasa berbeda / lebih berkesan',cat:'Slang',ex:'Music hits different with headphones.'},
],
};

function etGetVocabPool(level,cat){
  let pool=ET_VOCAB[level]||ET_VOCAB.A1;
  if(cat&&cat!=='all')pool=pool.filter(w=>w.cat===cat);
  const custom=etState.customWords.filter(w=>!w.level||w.level===level);
  return[...pool,...custom];
}
// ── GRAMMAR DATABASE ────────────────────────────────────────────
const ET_GRAMMAR={
tobe:{title:'To Be (am/is/are)',
  explanation:'<b>To Be</b> menyatakan keadaan/identitas.<br><br><table class="et-table"><tr><th>Subject</th><th>To Be</th><th>Contoh</th></tr><tr><td>I</td><td><b>am</b></td><td>I am a student.</td></tr><tr><td>He/She/It</td><td><b>is</b></td><td>She is happy.</td></tr><tr><td>You/We/They</td><td><b>are</b></td><td>They are friends.</td></tr><tr><td>I/He/She (past)</td><td><b>was</b></td><td>I was tired yesterday.</td></tr><tr><td>You/We/They (past)</td><td><b>were</b></td><td>They were late.</td></tr></table>',
  questions:[
    {q:'I ___ a software engineer.',opts:['am','is','are','be'],ans:'am',ex:'I am a software engineer.'},
    {q:'She ___ very talented.',opts:['am','is','are','were'],ans:'is',ex:'She is very talented.'},
    {q:'We ___ ready for the meeting.',opts:['am','is','are','be'],ans:'are',ex:'We are ready for the meeting.'},
    {q:'The dogs ___ very playful.',opts:['am','is','are','was'],ans:'are',ex:'The dogs are very playful.'},
    {q:'He ___ my best friend.',opts:['am','is','are','were'],ans:'is',ex:'He is my best friend.'},
    {q:'They ___ from Jakarta.',opts:['am','is','are','was'],ans:'are',ex:'They are from Jakarta.'},
    {q:'Yesterday, I ___ very tired.',opts:['am','is','was','were'],ans:'was',ex:'Yesterday, I was very tired.'},
    {q:'The students ___ late this morning.',opts:['was','is','are','were'],ans:'were',ex:'The students were late this morning.'},
]},
present_simple:{title:'Present Simple',
  explanation:'<b>Present Simple</b> untuk kebiasaan, fakta umum.<br><b>Rumus:</b> Subject + V1 (tambah s/es untuk He/She/It)<br><br><table class="et-table"><tr><th>Positive</th><th>Negative</th><th>Question</th></tr><tr><td>I work.</td><td>I do not work.</td><td>Do I work?</td></tr><tr><td>She works.</td><td>She does not work.</td><td>Does she work?</td></tr></table>',
  questions:[
    {q:'She ___ to work by bus every day.',opts:['go','goes','going','went'],ans:'goes',ex:'She goes to work by bus every day.'},
    {q:'They ___ football every weekend.',opts:['play','plays','playing','played'],ans:'play',ex:'They play football every weekend.'},
    {q:'The sun ___ in the east.',opts:['rise','rises','rising','rose'],ans:'rises',ex:'The sun rises in the east.'},
    {q:'I ___ English every morning.',opts:['study','studies','studying','studied'],ans:'study',ex:'I study English every morning.'},
    {q:'He ___ not like spicy food.',opts:['do','does','did','is'],ans:'does',ex:'He does not like spicy food.'},
    {q:'___ you speak English?',opts:['Do','Does','Did','Are'],ans:'Do',ex:'Do you speak English?'},
    {q:'Water ___ at 100 degrees C.',opts:['boil','boils','boiling','boiled'],ans:'boils',ex:'Water boils at 100 degrees Celsius.'},
    {q:'My sister ___ in a hospital.',opts:['work','works','working','worked'],ans:'works',ex:'My sister works in a hospital.'},
]},
past_simple:{title:'Past Simple',
  explanation:'<b>Past Simple</b> untuk kejadian selesai di waktu lampau.<br><b>Rumus:</b> Subject + V2 (Regular: +ed / Irregular: bentuk khusus)<br><table class="et-table"><tr><th>Positive</th><th>Negative</th></tr><tr><td>I worked.</td><td>I did not work.</td></tr><tr><td>She went.</td><td>She did not go.</td></tr></table>',
  questions:[
    {q:'I ___ a great movie last night.',opts:['watch','watches','watched','watching'],ans:'watched',ex:'I watched a great movie last night.'},
    {q:'She ___ to Bali last summer.',opts:['go','goes','went','gone'],ans:'went',ex:'She went to Bali last summer.'},
    {q:'They ___ the project yesterday.',opts:['finish','finishes','finished','finishing'],ans:'finished',ex:'They finished the project yesterday.'},
    {q:'He ___ not come to the party.',opts:['do','does','did','was'],ans:'did',ex:'He did not come to the party.'},
    {q:'___ you see that movie?',opts:['Do','Does','Did','Were'],ans:'Did',ex:'Did you see that movie?'},
    {q:'We ___ dinner together last Friday.',opts:['have','has','had','having'],ans:'had',ex:'We had dinner together last Friday.'},
    {q:'She ___ the report in one hour.',opts:['write','writes','wrote','written'],ans:'wrote',ex:'She wrote the report in one hour.'},
    {q:'The meeting ___ at 9 AM.',opts:['start','starts','started','starting'],ans:'started',ex:'The meeting started at 9 AM.'},
]},
present_perfect:{title:'Present Perfect',
  explanation:'<b>Present Perfect</b> untuk pengalaman, baru saja terjadi.<br><b>Rumus:</b> Subject + have/has + V3<br><table class="et-table"><tr><th>Contoh</th><th>Arti</th></tr><tr><td>I have visited Japan.</td><td>Saya pernah ke Jepang.</td></tr><tr><td>She has just finished.</td><td>Dia baru saja selesai.</td></tr><tr><td>I have not eaten yet.</td><td>Saya belum makan.</td></tr></table>',
  questions:[
    {q:'I ___ just finished my report.',opts:['have','has','had','am'],ans:'have',ex:'I have just finished my report.'},
    {q:'She ___ never been to Europe.',opts:['have','has','had','is'],ans:'has',ex:'She has never been to Europe.'},
    {q:'They ___ already eaten dinner.',opts:['have','has','had','were'],ans:'have',ex:'They have already eaten dinner.'},
    {q:'___ you ever tried sushi?',opts:['Have','Has','Had','Did'],ans:'Have',ex:'Have you ever tried sushi?'},
    {q:'He ___ worked here for 5 years.',opts:['have','has','had','is'],ans:'has',ex:'He has worked here for 5 years.'},
    {q:'I have not ___ the movie yet.',opts:['watch','watches','watched','watching'],ans:'watched',ex:'I have not watched the movie yet.'},
    {q:'We ___ just arrived at the hotel.',opts:['have','has','had','are'],ans:'have',ex:'We have just arrived at the hotel.'},
]},
modal:{title:'Modal Verbs',
  explanation:'<b>Modal Verbs</b> — kemampuan, izin, kewajiban, kemungkinan.<br><table class="et-table"><tr><th>Modal</th><th>Fungsi</th><th>Contoh</th></tr><tr><td><b>can</b></td><td>Kemampuan</td><td>I can speak English.</td></tr><tr><td><b>must</b></td><td>Kewajiban</td><td>You must wear a seatbelt.</td></tr><tr><td><b>should</b></td><td>Saran</td><td>You should exercise daily.</td></tr><tr><td><b>may</b></td><td>Izin formal</td><td>May I come in?</td></tr><tr><td><b>might</b></td><td>Kemungkinan kecil</td><td>It might rain today.</td></tr><tr><td><b>would</b></td><td>Sopan/kondisional</td><td>Would you like coffee?</td></tr></table>',
  questions:[
    {q:'You ___ wear a seatbelt in a car.',opts:['can','must','might','would'],ans:'must',ex:'You must wear a seatbelt in a car.'},
    {q:'___ you help me with this?',opts:['Can','Must','Will','Might'],ans:'Can',ex:'Can you help me with this?'},
    {q:'I ___ be late; I am not sure.',opts:['might','can','must','will'],ans:'might',ex:'I might be late; I am not sure.'},
    {q:'You ___ see a doctor if you feel sick.',opts:['can','must','should','might'],ans:'should',ex:'You should see a doctor if you feel sick.'},
    {q:'___ I use your phone?',opts:['Must','May','Will','Should'],ans:'May',ex:'May I use your phone?'},
    {q:'She ___ speak three languages as a child.',opts:['must','could','should','might'],ans:'could',ex:'She could speak three languages as a child.'},
    {q:'I ___ finish this report by tomorrow.',opts:['should','might','will','could'],ans:'will',ex:'I will finish this report by tomorrow.'},
    {q:'___ you like some tea?',opts:['Must','Could','Would','Can'],ans:'Would',ex:'Would you like some tea?'},
]},
conditional:{title:'Conditional Sentences',
  explanation:'<b>Conditional</b> — Kalimat bersyarat<br><table class="et-table"><tr><th>Type</th><th>Rumus</th><th>Contoh</th></tr><tr><td>Type 0</td><td>If + Present, Present</td><td>If you heat water, it boils.</td></tr><tr><td>Type 1</td><td>If + Present, will+V1</td><td>If it rains, I will stay home.</td></tr><tr><td>Type 2</td><td>If + Past, would+V1</td><td>If I were rich, I would travel.</td></tr><tr><td>Type 3</td><td>If + Past Perfect, would have+V3</td><td>If I had studied, I would have passed.</td></tr></table>',
  questions:[
    {q:'If it rains, I ___ stay home.',opts:['will','would','had','am'],ans:'will',ex:'If it rains, I will stay home. (Type 1)'},
    {q:'If I ___ rich, I would travel the world.',opts:['am','is','were','will be'],ans:'were',ex:'If I were rich, I would travel. (Type 2)'},
    {q:'If you heat water to 100C, it ___.',opts:['boil','boils','would boil','will boil'],ans:'boils',ex:'If you heat water to 100C, it boils. (Type 0)'},
    {q:'If I had studied harder, I ___ passed.',opts:['will have','would have','had','could'],ans:'would have',ex:'If I had studied harder, I would have passed. (Type 3)'},
    {q:'If she ___ earlier, she would catch the train.',opts:['leave','leaves','left','had left'],ans:'left',ex:'If she left earlier, she would catch the train. (Type 2)'},
    {q:'If you ___ harder, you will succeed.',opts:['work','works','worked','will work'],ans:'work',ex:'If you work harder, you will succeed. (Type 1)'},
]},
passive:{title:'Passive Voice',
  explanation:'<b>Passive Voice</b> — fokus pada objek/hasil.<br><b>Rumus:</b> Subject + to be + V3<br><table class="et-table"><tr><th>Aktif</th><th>Pasif</th></tr><tr><td>The chef cooks the food.</td><td>The food <b>is cooked</b> by the chef.</td></tr><tr><td>She wrote the report.</td><td>The report <b>was written</b> by her.</td></tr></table>',
  questions:[
    {q:'The report ___ written by the manager.',opts:['is','was','has','were'],ans:'was',ex:'The report was written by the manager.'},
    {q:'English ___ spoken all over the world.',opts:['is','was','were','has'],ans:'is',ex:'English is spoken all over the world.'},
    {q:'The car ___ repaired last week.',opts:['is','was','were','be'],ans:'was',ex:'The car was repaired last week.'},
    {q:'The cake has ___ eaten by the children.',opts:['eat','ate','eaten','eating'],ans:'eaten',ex:'The cake has been eaten by the children.'},
    {q:'New offices ___ being built in the city.',opts:['is','was','are','were'],ans:'are',ex:'New offices are being built in the city.'},
    {q:'The email ___ sent yesterday.',opts:['is','was','were','had'],ans:'was',ex:'The email was sent yesterday.'},
]},
reported:{title:'Reported Speech',
  explanation:'<b>Reported Speech</b> — tenses mundur satu tingkat.<br><table class="et-table"><tr><th>Direct</th><th>Reported</th></tr><tr><td>"I am tired."</td><td>She said she <b>was</b> tired.</td></tr><tr><td>"I will come."</td><td>She said she <b>would</b> come.</td></tr><tr><td>"I have finished."</td><td>He said he <b>had finished</b>.</td></tr></table>',
  questions:[
    {q:'"I am tired." She said she ___ tired.',opts:['is','was','were','be'],ans:'was',ex:'She said she was tired.'},
    {q:'"I will come." He said he ___ come.',opts:['will','would','could','should'],ans:'would',ex:'He said he would come.'},
    {q:'"I work here." She said she ___ there.',opts:['work','works','worked','was working'],ans:'worked',ex:'She said she worked there.'},
    {q:'"I have finished." He said he ___ finished.',opts:['has','have','had','was'],ans:'had',ex:'He said he had finished.'},
    {q:'"We are leaving." They said they ___ leaving.',opts:['are','is','were','was'],ans:'were',ex:'They said they were leaving.'},
]},
};

// ── READING DATABASE ─────────────────────────────────────────────
const ET_READING=[
{level:'A1',title:'My Daily Routine',
 text:'My name is Budi. I wake up at 6 AM every day. I brush my teeth and take a shower. Then I eat breakfast with rice and eggs. After breakfast, I go to work by bus. I work at an office from 9 AM to 5 PM. In the evening, I watch TV or read a book. I go to bed at 10 PM.',
 questions:[
  {q:'What time does Budi wake up?',opts:['5 AM','6 AM','7 AM','8 AM'],ans:'6 AM'},
  {q:'What does Budi eat for breakfast?',opts:['Bread and milk','Rice and eggs','Noodles','Fruit'],ans:'Rice and eggs'},
  {q:'How does Budi go to work?',opts:['By car','By bicycle','By bus','By train'],ans:'By bus'},
  {q:'What time does Budi finish work?',opts:['4 PM','5 PM','6 PM','7 PM'],ans:'5 PM'},
]},
{level:'B1',title:'The Rise of Remote Work',
 text:'Remote work has transformed the modern workplace significantly. Since the COVID-19 pandemic, millions of employees worldwide shifted from traditional office environments to working from home.\n\nOn the positive side, employees enjoy greater flexibility, reduced commute time, and a better work-life balance. Companies also benefit from lower operational costs and access to a global talent pool.\n\nHowever, remote work also presents challenges. Many employees struggle with isolation and communication barriers. Collaboration can be harder without face-to-face interaction.\n\nDespite these challenges, many companies have adopted hybrid models — a combination of remote and office work — as a long-term solution.',
 questions:[
  {q:'What major event accelerated remote work?',opts:['World War II','COVID-19 pandemic','Financial crisis','Tech boom'],ans:'COVID-19 pandemic'},
  {q:'Which is NOT mentioned as an advantage?',opts:['Flexibility','Better salary','Reduced commute','Lower office costs'],ans:'Better salary'},
  {q:'What challenge do remote workers face?',opts:['Too much exercise','Isolation','Better food','More vacation'],ans:'Isolation'},
  {q:'What is a "hybrid model"?',opts:['Only remote','Only office','Combination of remote and office','Working on weekends'],ans:'Combination of remote and office'},
]},
{level:'C1',title:'AI and the Future of Work',
 text:'The rapid advancement of AI is fundamentally reshaping the global economy. Unlike previous technological revolutions that primarily displaced manual labor, AI threatens to automate cognitive tasks previously considered exclusively human.\n\nAccording to McKinsey Global Institute, up to 375 million workers worldwide may need to switch occupations or acquire new skills by 2030. Roles involving routine cognitive tasks face the greatest displacement risk.\n\nParadoxically, AI also creates new employment categories. Roles in AI development, prompt engineering, and data science are experiencing exponential demand.\n\nEconomists argue this transition requires a tripartite effort: governments must invest in retraining, corporations must upskill their workforce, and individuals must cultivate a growth mindset.',
 questions:[
  {q:'What makes current AI different from previous revolutions?',opts:['It is cheaper','It affects cognitive not just manual labor','It only impacts developing countries','It is slower'],ans:'It affects cognitive not just manual labor'},
  {q:'How many workers may need to change jobs by 2030?',opts:['37.5 million','375 million','3.75 billion','75 million'],ans:'375 million'},
  {q:'What does "tripartite effort" mean here?',opts:['Three-part effort by governments, corporations, and individuals','A type of AI system','A training program','An economic theory'],ans:'Three-part effort by governments, corporations, and individuals'},
  {q:'What mindset does the author recommend?',opts:['Competitive','Passive','Growth','Fixed'],ans:'Growth'},
]},
];

// ── LISTENING DATABASE ───────────────────────────────────────────
const ET_LISTENING=[
{level:'A1',title:'Weather Forecast',
 text:'Today will be sunny and warm. The temperature will be around 30 degrees Celsius. Tomorrow, expect some rain in the afternoon. Stay hydrated and carry an umbrella just in case. Have a great day!',
 questions:[
  {q:'What is today weather?',opts:['Rainy','Sunny','Cloudy','Windy'],ans:'Sunny'},
  {q:'When will it rain?',opts:['Today morning','Today evening','Tomorrow afternoon','Tomorrow morning'],ans:'Tomorrow afternoon'},
]},
{level:'B1',title:'Office Announcement',
 text:'Good morning, everyone. This is a reminder that our quarterly review meeting is scheduled for this Thursday at 2 PM in Conference Room B. Please bring your project updates and last quarter performance data. Lunch will be provided. If you cannot attend, please inform your manager by tomorrow noon. Thank you for your cooperation.',
 questions:[
  {q:'When is the meeting?',opts:['Monday','Wednesday','Thursday','Friday'],ans:'Thursday'},
  {q:'What should attendees bring?',opts:['Nothing','Just pens','Project updates and performance data','Lunch'],ans:'Project updates and performance data'},
  {q:'What will be provided?',opts:['Coffee','Lunch','Bonuses','Notebooks'],ans:'Lunch'},
]},
{level:'B2',title:'Tech Podcast Excerpt',
 text:'Today we are discussing the intersection of artificial intelligence and cybersecurity. As AI systems become more sophisticated, they are being used both to defend against cyberattacks and to launch them. Security researchers warn that AI-powered phishing attacks are increasingly difficult to detect, as they generate highly personalized messages. Companies are responding by developing AI-based detection systems that analyze communication patterns to identify potential threats before they cause damage.',
 questions:[
  {q:'What is the main topic?',opts:['Social media','AI and cybersecurity','Space exploration','Cryptocurrency'],ans:'AI and cybersecurity'},
  {q:'What makes AI phishing attacks harder to detect?',opts:['They are slower','They use personalized messages','They target only companies','They are sent at night'],ans:'They use personalized messages'},
  {q:'How are companies responding?',opts:['Shutting down email','Developing AI detection systems','Hiring more staff','Using older technology'],ans:'Developing AI detection systems'},
]},
];

// ── WRITING PROMPTS ──────────────────────────────────────────────
const ET_WRITING=[
{level:'A1',type:'Email',title:'Simple Introduction',prompt:'Write a short email introducing yourself. Include: name, hometown, and hobbies (3-4 sentences).',minWords:30,tips:['Use "My name is..."','Use "I am from..."','Use "I like..."']},
{level:'A2',type:'Story',title:'My Best Day',prompt:'Write about your best day ever. What happened? Why was it special? (50-70 words)',minWords:50,tips:['Use past tense (was, went, ate)','Add details: who, where, what','Show feelings: I felt...']},
{level:'B1',type:'Email',title:'Formal Email to Client',prompt:'Write a professional email rescheduling a meeting. Include: reason, proposed new time, apology. (80-100 words)',minWords:80,tips:['Open: Dear Mr./Ms.','Be polite: "I apologize for..."','Close: Best regards,']},
{level:'B1',type:'Opinion',title:'Social Media Opinion',prompt:'Do you think social media has more positive or negative effects? Give 2 reasons. (100-150 words)',minWords:100,tips:['State opinion: "I believe..."','Use connectors: firstly, moreover, however','Give specific examples']},
{level:'B2',type:'Essay',title:'Technology and Education',prompt:'Write a structured essay on how technology changed education. (intro + 2 body paragraphs + conclusion, 150-200 words)',minWords:150,tips:['Strong thesis in intro','Use topic sentences','Balance pros and cons','Strong conclusion']},
{level:'C1',type:'Report',title:'Business Proposal',prompt:'Write a business proposal for a new English learning app. Include: problem, solution, target market, competitive advantage. (200-250 words)',minWords:200,tips:['Professional vocabulary','Quantify claims','Persuasive language','Clear structure']},
];

// ── PRONUNCIATION DATABASE ───────────────────────────────────────
const ET_PRON=[
{word:'Comfortable',phonetic:'/ˈkʌmftəbl/',tips:'Say "COMF-ter-ble" (3 syllables), not "com-FOR-ta-ble".',level:'B1'},
{word:'Wednesday',phonetic:'/ˈwɛnzdeɪ/',tips:'Say "WENZ-day". The "d" in the middle is completely silent.',level:'A2'},
{word:'February',phonetic:'/ˈfebruˌɛri/',tips:'Try to say both R\'s: "FEB-roo-er-ee". Often mispronounced "Feb-you-ary".',level:'A2'},
{word:'Entrepreneur',phonetic:'/ˌɒntrəprəˈnɜːr/',tips:'ON-truh-pruh-NER. French origin — tricky stress!',level:'B2'},
{word:'Specific',phonetic:'/spəˈsɪfɪk/',tips:'NOT "pacific". Starts with "sp" sound: spuh-SIF-ik.',level:'B1'},
{word:'Pronunciation',phonetic:'/prəˌnʌnsiˈeɪʃən/',tips:'"pro-NUN-ci-a-tion" NOT "pro-NOUN-ci-a-tion". Note the difference!',level:'B1'},
{word:'Colonel',phonetic:'/ˈkɜːrnəl/',tips:'Sounds like "KER-nel". The L is silent and "ol" sounds like "el".',level:'B2'},
{word:'Subtle',phonetic:'/ˈsʌtəl/',tips:'The "b" is completely silent. Say "SUT-ul".',level:'B2'},
{word:'Worcestershire',phonetic:'/ˈwʊstəʃɪr/',tips:'Native speakers say "WOOS-ter-sher". Most letters are silent!',level:'C1'},
{word:'Hierarchy',phonetic:'/ˈhaɪərɑːrki/',tips:'HI-er-ar-key (4 syllables). Stress on first syllable.',level:'C1'},
{word:'Particularly',phonetic:'/pərˈtɪkjʊlərli/',tips:'par-TIK-you-lar-lee. 5 syllables, stress on second.',level:'B2'},
{word:'Mischievous',phonetic:'/ˈmɪstʃɪvəs/',tips:'MIS-chiv-us (3 syllables), NOT "mis-CHEE-vee-us".',level:'C1'},
];

// ── CONVERSATION DATABASE ────────────────────────────────────────
const ET_CONV={
daily:{icon:'☀️',title:'Daily Conversation',scenarios:[{title:'Morning at the Office',lines:[
  {role:'other',speaker:'Colleague',text:'Good morning! How was your weekend?'},
  {role:'user',prompt:'Balas sapaan dan ceritakan weekendmu',hint:'Good morning! It was great! I went to...'},
  {role:'other',speaker:'Colleague',text:'That sounds fun! By the way, there is a team meeting at 10 AM.'},
  {role:'user',prompt:'Tunjukkan kamu sudah tahu atau baru tahu',hint:'Oh, I did not know that. Thanks for reminding me!'},
  {role:'other',speaker:'Colleague',text:'Great. See you there. Have a productive day!'},
  {role:'user',prompt:'Balas dengan sopan dan semangat',hint:'Thank you! You too. See you at the meeting!'},
]}]},
interview:{icon:'💼',title:'Job Interview',scenarios:[{title:'Software Developer Interview',lines:[
  {role:'other',speaker:'Interviewer',text:'Good morning! Thank you for coming. Please tell me about yourself.'},
  {role:'user',prompt:'Perkenalkan dirimu secara profesional',hint:'Good morning! My name is ___, I am a software developer with X years of experience...'},
  {role:'other',speaker:'Interviewer',text:'Great! What programming languages are you most comfortable with?'},
  {role:'user',prompt:'Sebutkan bahasa pemrograman yang kamu kuasai',hint:'I am most comfortable with JavaScript and Python. I have also worked with...'},
  {role:'other',speaker:'Interviewer',text:'Can you describe a challenging project you have worked on?'},
  {role:'user',prompt:'Ceritakan proyek menantang dan solusimu',hint:'One of the most challenging projects was when I had to build...'},
  {role:'other',speaker:'Interviewer',text:'Where do you see yourself in 5 years?'},
  {role:'user',prompt:'Ceritakan ambisi kariermu secara profesional',hint:'In 5 years, I hope to be a senior developer leading a team...'},
  {role:'other',speaker:'Interviewer',text:'Do you have any questions for us?'},
  {role:'user',prompt:'Tanyakan hal profesional tentang perusahaan',hint:'Yes, could you tell me more about the team culture and growth opportunities here?'},
]}]},
travel:{icon:'✈️',title:'Travel English',scenarios:[{title:'Airport Check-In',lines:[
  {role:'other',speaker:'Staff',text:'Good afternoon. Can I see your passport and ticket, please?'},
  {role:'user',prompt:'Berikan dokumenmu dengan sopan',hint:'Of course! Here is my passport and booking confirmation.'},
  {role:'other',speaker:'Staff',text:'Are you checking in any luggage today?'},
  {role:'user',prompt:'Jawab tentang bagasimu',hint:'Yes, I have one checked bag. It weighs about 20 kg.'},
  {role:'other',speaker:'Staff',text:'Would you prefer a window or aisle seat?'},
  {role:'user',prompt:'Pilih kursi dan berikan alasan',hint:'I would prefer a window seat please. I love looking at the view.'},
  {role:'other',speaker:'Staff',text:'Here is your boarding pass. Boarding starts at gate 12 at 2:30 PM.'},
  {role:'user',prompt:'Ucapkan terima kasih dan konfirmasi',hint:'Thank you so much! Gate 12 at 2:30. Got it. Have a great day!'},
]}]},
presentation:{icon:'🎤',title:'Presentation',scenarios:[{title:'Business Presentation',lines:[
  {role:'other',speaker:'Host',text:'The floor is yours. Please begin your presentation.'},
  {role:'user',prompt:'Buka presentasi dengan percaya diri',hint:'Good morning, everyone. Thank you for having me. Today, I will be presenting...'},
  {role:'other',speaker:'Audience',text:'Could you briefly explain what problem you are solving?'},
  {role:'user',prompt:'Jelaskan masalah yang kamu selesaikan',hint:'Great question. The core problem we are addressing is...'},
  {role:'other',speaker:'Audience',text:'How is your solution different from existing products?'},
  {role:'user',prompt:'Jelaskan keunggulan solusimu',hint:'What sets us apart is our unique approach to... Unlike existing solutions, we...'},
  {role:'other',speaker:'Host',text:'We are almost out of time. Could you give us a quick conclusion?'},
  {role:'user',prompt:'Simpulkan dengan kuat dan call-to-action',hint:'To conclude, our solution offers X, Y, and Z. We would love to have you on board.'},
]}]},
};

// ── TOEFL DATABASE ───────────────────────────────────────────────
const ET_TOEFL=[
{type:'RC',level:'B2',
 passage:'Urbanization is the process by which rural areas transform into urban centers. Over the past century, this phenomenon has accelerated dramatically due to industrialization, economic opportunities, and improved transportation. Today, more than half of the world population lives in cities, a proportion expected to rise to two-thirds by 2050.',
 q:'What does the passage primarily discuss?',opts:['The history of agriculture','The process and impact of urbanization','Problems in rural communities','Global transportation'],ans:'The process and impact of urbanization',ex:'The passage defines urbanization and discusses its acceleration and statistics.'},
{type:'Vocab',level:'B2',
 q:'In academic writing, "empirical" most closely means:',opts:['Based on theory','Based on observation and data','Relating to the empire','Extremely complex'],ans:'Based on observation and data',ex:'Empirical research relies on evidence gathered through direct observation and experimentation.'},
{type:'Grammar',level:'B2',
 q:'Choose the grammatically correct sentence:',opts:['Despite of the rain, we went out.','Despite the rain, we went out.','Despite that it rained, we went out.','Although of the rain, we went out.'],ans:'Despite the rain, we went out.',ex:'"Despite" is followed directly by a noun phrase — not "of" or a full clause.'},
{type:'Vocab',level:'C1',
 q:'The word "albeit" is best replaced by:',opts:['because','although','therefore','meanwhile'],ans:'although',ex:'"Albeit" means "even though". E.g., "The plan worked, albeit slowly."'},
{type:'Grammar',level:'C1',
 q:'Identify the correct use of the subjunctive:',opts:['It is essential that he goes immediately.','It is essential that he go immediately.','It is essential that he will go immediately.','It is essential that he is going immediately.'],ans:'It is essential that he go immediately.',ex:'After "essential that", use the base form (subjunctive): "he go" not "he goes".'},
{type:'RC',level:'B2',
 passage:'Renewable energy sources are gaining prominence as the world seeks to reduce dependence on fossil fuels. Solar energy has seen dramatic cost reductions, with the price per kilowatt-hour falling over 90% since 2010. Critics argue, however, that intermittency — the fact that the sun does not always shine — remains a significant challenge for grid reliability.',
 q:'What is the main criticism of renewable energy?',opts:['It is too expensive','It cannot be exported','It is intermittent and unreliable at times','It causes environmental damage'],ans:'It is intermittent and unreliable at times',ex:'The passage states "intermittency remains a significant challenge for grid reliability".'},
{type:'Vocab',level:'C1',
 q:'Choose the best meaning of "mitigate":',opts:['To worsen','To reduce or lessen','To ignore completely','To celebrate'],ans:'To reduce or lessen',ex:'"Mitigate" means to make something less severe. "We must mitigate the risks."'},
{type:'Grammar',level:'B2',
 q:'Which sentence uses the correct article?',opts:['She is a honest person.','She is an honest person.','She is the honest person.','She is honest a person.'],ans:'She is an honest person.',ex:'Use "an" before words starting with a vowel sound. "Honest" starts with silent h, so vowel sound /ɒ/.'},
];
// ── CSS INJECTION ────────────────────────────────────────────────
function etInjectCSS(){
  if(document.getElementById('et3-styles'))return;
  const s=document.createElement('style');s.id='et3-styles';
  s.textContent=`
@keyframes etXpFloat{0%{opacity:1;transform:translateX(-50%) translateY(0)}100%{opacity:0;transform:translateX(-50%) translateY(-60px)}}
@keyframes etSlideIn{from{opacity:0;transform:translateX(30px)}to{opacity:1;transform:translateX(0)}}
@keyframes etFadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
@keyframes etPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
@keyframes etShake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-6px)}40%,80%{transform:translateX(6px)}}
#page-entrainer{animation:etFadeIn .3s ease}
.et-wrap{display:flex;min-height:calc(100vh - 56px);background:var(--bg,#0d0f14)}
.et-sidebar{width:210px;background:var(--bg2,#13161e);border-right:1px solid var(--border,rgba(255,255,255,.06));padding:12px 0;flex-shrink:0;overflow-y:auto}
.et-sidebar-label{font-size:10px;font-weight:700;color:var(--text3,#545872);text-transform:uppercase;letter-spacing:.08em;padding:8px 14px 3px}
.et-nav-item{display:flex;align-items:center;gap:9px;padding:8px 14px;cursor:pointer;transition:all .15s;font-size:13px;color:var(--text2,#9399b2);border-left:2px solid transparent;white-space:nowrap}
.et-nav-item:hover{background:var(--bg3,#1a1e2a);color:var(--text,#e8eaf0)}
.et-nav-item.active{background:rgba(124,106,247,.1);color:var(--accent,#7c6af7);border-left-color:var(--accent,#7c6af7);font-weight:600}
.et-nav-icon{font-size:15px;width:18px;text-align:center;flex-shrink:0}
.et-content{flex:1;overflow:auto;padding:24px 28px;animation:etFadeIn .3s ease}
@media(max-width:700px){.et-sidebar{display:none}.et-content{padding:14px}}
.et-card{background:var(--bg2,#13161e);border:1px solid var(--border,rgba(255,255,255,.06));border-radius:16px;padding:20px;margin-bottom:16px;transition:border-color .2s}
.et-card-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:12px;margin-bottom:20px}
.et-stat-card{background:var(--bg2,#13161e);border:1px solid var(--border,rgba(255,255,255,.06));border-radius:14px;padding:16px;text-align:center;transition:all .2s}
.et-stat-card:hover{transform:translateY(-2px);border-color:rgba(124,106,247,.3)}
.et-stat-val{font-size:2rem;font-weight:800;color:var(--accent,#7c6af7)}
.et-stat-label{font-size:11px;color:var(--text3,#545872);text-transform:uppercase;letter-spacing:.05em;margin-top:4px}
.et-btn{display:inline-flex;align-items:center;gap:6px;padding:9px 18px;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer;border:none;transition:all .2s;font-family:inherit}
.et-btn-primary{background:var(--accent,#7c6af7);color:#fff}
.et-btn-primary:hover{background:#9080ff;transform:translateY(-1px);box-shadow:0 4px 16px rgba(124,106,247,.4)}
.et-btn-ghost{background:transparent;color:var(--text2,#9399b2);border:1px solid var(--border,rgba(255,255,255,.08))}
.et-btn-ghost:hover{background:var(--bg3,#1a1e2a);color:var(--text,#e8eaf0)}
.et-btn-success{background:#5de0a0;color:#0d1117}
.et-btn-danger{background:#f76a6a;color:#fff}
.et-btn-sm{padding:6px 12px;font-size:12px}
.et-btn:disabled{opacity:.4;cursor:not-allowed;transform:none!important}
.et-input{width:100%;background:var(--bg3,#1a1e2a);border:1px solid var(--border,rgba(255,255,255,.06));border-radius:10px;color:var(--text,#e8eaf0);font-size:15px;padding:11px 14px;outline:none;transition:border .2s;box-sizing:border-box;font-family:inherit}
.et-input:focus{border-color:var(--accent,#7c6af7);box-shadow:0 0 0 3px rgba(124,106,247,.1)}
.et-textarea{resize:vertical;min-height:140px;line-height:1.7;font-size:14px}
.et-select{background:var(--bg3,#1a1e2a);border:1px solid var(--border,rgba(255,255,255,.06));border-radius:8px;color:var(--text,#e8eaf0);padding:7px 10px;font-size:12px;outline:none;cursor:pointer}
.et-xp-bar-bg{background:var(--bg3,#1a1e2a);border-radius:99px;height:8px;overflow:hidden}
.et-xp-bar-fill{height:100%;background:linear-gradient(90deg,var(--accent,#7c6af7),#5de0c5);border-radius:99px;transition:width .6s ease}
.et-badge{display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border-radius:99px;font-size:11px;font-weight:600}
.et-badge-purple{background:rgba(124,106,247,.15);color:var(--accent,#7c6af7);border:1px solid rgba(124,106,247,.3)}
.et-badge-green{background:rgba(93,224,160,.12);color:#5de0a0;border:1px solid rgba(93,224,160,.25)}
.et-badge-yellow{background:rgba(247,185,106,.12);color:#f7b96a;border:1px solid rgba(247,185,106,.25)}
.et-badge-red{background:rgba(247,106,106,.12);color:#f76a6a;border:1px solid rgba(247,106,106,.25)}
.et-badge-blue{background:rgba(96,165,250,.12);color:#60a5fa;border:1px solid rgba(96,165,250,.25)}
.et-feedback{padding:14px 16px;border-radius:12px;font-size:14px;font-weight:600;margin-top:14px;animation:etFadeIn .2s ease}
.et-fb-ok{background:rgba(93,224,160,.1);border:1px solid rgba(93,224,160,.3);color:#5de0a0}
.et-fb-bad{background:rgba(247,106,106,.1);border:1px solid rgba(247,106,106,.25);color:#f76a6a;animation:etShake .4s ease}
.et-fb-info{background:rgba(96,165,250,.08);border:1px solid rgba(96,165,250,.2);color:#60a5fa}
.et-mcq-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:14px}
@media(max-width:480px){.et-mcq-grid{grid-template-columns:1fr}}
.et-mcq-btn{display:flex;align-items:center;gap:10px;background:var(--bg3,#1a1e2a);border:1px solid var(--border,rgba(255,255,255,.06));border-radius:12px;color:var(--text,#e8eaf0);padding:12px 14px;font-size:13px;cursor:pointer;text-align:left;transition:all .2s;font-family:inherit;width:100%}
.et-mcq-btn:hover:not(:disabled){border-color:var(--accent,#7c6af7);background:rgba(124,106,247,.08)}
.et-mcq-btn.correct{background:rgba(93,224,160,.15);border-color:#5de0a0;color:#5de0a0}
.et-mcq-btn.wrong{background:rgba(247,106,106,.12);border-color:#f76a6a;color:#f76a6a;animation:etShake .4s ease}
.et-mcq-idx{width:26px;height:26px;border-radius:50%;background:rgba(255,255,255,.06);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0}
.et-table{width:100%;border-collapse:collapse;font-size:13px;margin:10px 0}
.et-table th{background:rgba(124,106,247,.1);color:var(--accent,#7c6af7);padding:8px 10px;text-align:left;border-bottom:1px solid var(--border,rgba(255,255,255,.06))}
.et-table td{padding:8px 10px;border-bottom:1px solid var(--border,rgba(255,255,255,.06));color:var(--text2,#9399b2)}
.et-table tr:last-child td{border-bottom:none}
.et-fc-scene{width:100%;height:220px;perspective:1000px;cursor:pointer;margin:20px 0}
.et-fc-inner{width:100%;height:100%;position:relative;transform-style:preserve-3d;transition:transform .6s cubic-bezier(.4,0,.2,1)}
.et-fc-scene.flipped .et-fc-inner{transform:rotateY(180deg)}
.et-fc-face{position:absolute;width:100%;height:100%;backface-visibility:hidden;border-radius:20px;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;box-sizing:border-box}
.et-fc-front{background:linear-gradient(135deg,rgba(124,106,247,.15),rgba(93,224,197,.08));border:1px solid rgba(124,106,247,.3)}
.et-fc-back{background:linear-gradient(135deg,rgba(93,224,160,.1),rgba(96,165,250,.08));border:1px solid rgba(93,224,160,.3);transform:rotateY(180deg)}
.et-fc-word{font-size:2rem;font-weight:800;color:var(--text,#e8eaf0);margin-bottom:8px;text-align:center}
.et-fc-sub{font-size:13px;color:var(--text3,#545872);text-align:center}
.et-conv-bbl{display:flex;gap:10px;margin-bottom:14px;animation:etFadeIn .3s ease}
.et-conv-bbl.user{flex-direction:row-reverse}
.et-conv-av{width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0}
.et-conv-av.ai{background:linear-gradient(135deg,#7c6af7,#5de0c5)}
.et-conv-av.user{background:linear-gradient(135deg,#f7b96a,#f76a6a)}
.et-conv-txt{background:var(--bg3,#1a1e2a);border:1px solid var(--border,rgba(255,255,255,.06));border-radius:16px;padding:11px 15px;font-size:13px;max-width:80%;color:var(--text2,#9399b2);line-height:1.6}
.et-conv-bbl.user .et-conv-txt{background:rgba(124,106,247,.12);border-color:rgba(124,106,247,.25);color:var(--text,#e8eaf0)}
.et-letter-tile{width:40px;height:46px;background:var(--bg3,#1a1e2a);border:2px solid var(--border,rgba(255,255,255,.06));border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:1.3rem;font-weight:700;cursor:pointer;transition:all .2s;color:var(--text,#e8eaf0);user-select:none}
.et-letter-tile:hover{border-color:var(--accent,#7c6af7);background:rgba(124,106,247,.1);transform:translateY(-2px)}
.et-letter-tile.used{opacity:.2;cursor:default;transform:none!important}
.et-answer-slot{min-width:40px;height:46px;border-bottom:3px solid var(--accent,#7c6af7);display:flex;align-items:center;justify-content:center;font-size:1.3rem;font-weight:700;color:var(--accent,#7c6af7);padding:0 4px;cursor:pointer;transition:all .2s}
.et-tabs{display:flex;gap:4px;background:var(--bg2,#13161e);padding:4px;border-radius:12px;border:1px solid var(--border,rgba(255,255,255,.06));margin-bottom:20px;flex-wrap:wrap}
.et-tab{padding:7px 14px;border-radius:9px;font-size:12px;font-weight:600;cursor:pointer;transition:all .2s;color:var(--text2,#9399b2);border:none;background:transparent;font-family:inherit}
.et-tab.active{background:var(--accent,#7c6af7);color:#fff}
.et-hero{background:linear-gradient(135deg,rgba(124,106,247,.1),rgba(93,224,197,.04));border:1px solid rgba(124,106,247,.2);border-radius:20px;padding:28px;margin-bottom:24px;position:relative;overflow:hidden}
.et-hero::before{content:'';position:absolute;top:-40%;right:-5%;width:260px;height:260px;border-radius:50%;background:radial-gradient(circle,rgba(124,106,247,.08) 0%,transparent 70%);pointer-events:none}
.et-hero h2{font-size:1.6rem;font-weight:800;margin-bottom:6px}
.et-hero h2 span{background:linear-gradient(135deg,var(--accent,#7c6af7),#5de0c5);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.et-hero p{font-size:13px;color:var(--text2,#9399b2);line-height:1.6;margin-bottom:18px;max-width:480px}
.et-section-title{font-size:1rem;font-weight:700;color:var(--text,#e8eaf0);margin-bottom:12px;display:flex;align-items:center;gap:8px}
.et-section-sub{font-size:12px;color:var(--text3,#545872);margin-bottom:14px;margin-top:-8px}
.et-divider{border:none;border-top:1px solid var(--border,rgba(255,255,255,.06));margin:20px 0}
.et-reading-text{background:var(--bg3,#1a1e2a);border-radius:12px;padding:20px 24px;font-size:14px;line-height:1.9;color:var(--text2,#9399b2);margin-bottom:20px;border-left:3px solid var(--accent,#7c6af7)}
.et-reading-text p{margin:0 0 14px}
.et-reading-text p:last-child{margin-bottom:0}
.et-pron-word{font-size:2.5rem;font-weight:800;color:var(--text,#e8eaf0);margin-bottom:6px}
.et-phonetic{font-size:1.2rem;color:var(--accent,#7c6af7);font-family:monospace;margin-bottom:8px}
.et-pron-tip{background:rgba(247,185,106,.06);border:1px solid rgba(247,185,106,.2);border-radius:10px;padding:12px 16px;font-size:13px;color:#f7b96a;line-height:1.6;margin-top:12px}
.et-timer{font-size:2rem;font-weight:800;color:var(--accent,#7c6af7);text-align:center}
.et-timer.danger{color:#f76a6a;animation:etPulse .5s infinite}
.et-wc-badge{font-size:12px;color:var(--text3,#545872);margin-top:6px;text-align:right}
.et-wc-badge.ok{color:#5de0a0}
.et-ach-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px}
.et-ach-item{background:var(--bg3,#1a1e2a);border:1px solid var(--border,rgba(255,255,255,.06));border-radius:14px;padding:14px;text-align:center;transition:all .2s}
.et-ach-item.unlocked{border-color:rgba(247,185,106,.4);background:rgba(247,185,106,.04)}
.et-ach-item:not(.unlocked){opacity:.35;filter:grayscale(1)}
.et-ach-icon{font-size:2rem;margin-bottom:6px}
.et-ach-name{font-size:12px;font-weight:700;color:var(--text,#e8eaf0);margin-bottom:2px}
.et-ach-desc{font-size:10px;color:var(--text3,#545872);line-height:1.4}
.et-cw-item{display:flex;justify-content:space-between;align-items:center;background:var(--bg3,#1a1e2a);border-radius:10px;padding:10px 14px;font-size:13px;margin-bottom:6px}
.et-streak-cal{display:flex;gap:4px;flex-wrap:wrap}
.et-streak-day{width:18px;height:18px;border-radius:4px;background:var(--bg3,#1a1e2a)}
.et-streak-day.active{background:var(--accent,#7c6af7)}
.et-content::-webkit-scrollbar,.et-sidebar::-webkit-scrollbar{width:3px}
.et-content::-webkit-scrollbar-thumb,.et-sidebar::-webkit-scrollbar-thumb{background:rgba(255,255,255,.06);border-radius:2px}
@media(max-width:700px){.et-card-grid{grid-template-columns:1fr 1fr}.et-hero h2{font-size:1.2rem}.et-fc-word{font-size:1.5rem}}
`;
  document.head.appendChild(s);
}
// ── RENDER PAGE & NAVIGATION ─────────────────────────────────────
function etRenderPage(){
  const page=ET.el('page-entrainer');if(!page)return;
  page.innerHTML=`<div class="et-wrap" id="et-wrap">
<nav class="et-sidebar">
  <div class="et-sidebar-label">English Trainer</div>
  <div style="padding:8px 10px;margin:4px 8px 8px;background:rgba(124,106,247,.08);border-radius:10px;border:1px solid rgba(124,106,247,.2)">
    <div id="et-top-level" style="font-size:11px;font-weight:700;color:var(--accent,#7c6af7)">🌱 A1 Beginner</div>
    <div id="et-top-xp" style="font-size:10px;color:var(--text3)">0 XP</div>
  </div>
  <div class="et-nav-item active" onclick="etNav('dashboard')" data-p="dashboard"><span class="et-nav-icon">🏠</span>Dashboard</div>
  <div class="et-sidebar-label">Vocabulary</div>
  <div class="et-nav-item" onclick="etNav('vocab')" data-p="vocab"><span class="et-nav-icon">📚</span>Vocab Trainer</div>
  <div class="et-nav-item" onclick="etNav('flashcard')" data-p="flashcard"><span class="et-nav-icon">🃏</span>Flashcard</div>
  <div class="et-nav-item" onclick="etNav('pronunciation')" data-p="pronunciation"><span class="et-nav-icon">🔊</span>Pronunciation</div>
  <div class="et-sidebar-label">Grammar</div>
  <div class="et-nav-item" onclick="etNav('grammar')" data-p="grammar"><span class="et-nav-icon">📐</span>Grammar</div>
  <div class="et-sidebar-label">4 Skills</div>
  <div class="et-nav-item" onclick="etNav('reading')" data-p="reading"><span class="et-nav-icon">📖</span>Reading</div>
  <div class="et-nav-item" onclick="etNav('listening')" data-p="listening"><span class="et-nav-icon">🎧</span>Listening</div>
  <div class="et-nav-item" onclick="etNav('writing')" data-p="writing"><span class="et-nav-icon">✍️</span>Writing</div>
  <div class="et-nav-item" onclick="etNav('conversation')" data-p="conversation"><span class="et-nav-icon">💬</span>Conversation</div>
  <div class="et-sidebar-label">Practice</div>
  <div class="et-nav-item" onclick="etNav('quiz')" data-p="quiz"><span class="et-nav-icon">🧠</span>Quiz Challenge</div>
  <div class="et-nav-item" onclick="etNav('games')" data-p="games"><span class="et-nav-icon">🎮</span>Mini Games</div>
  <div class="et-nav-item" onclick="etNav('daily')" data-p="daily"><span class="et-nav-icon">🎯</span>Daily Challenge</div>
  <div class="et-sidebar-label">Specialized</div>
  <div class="et-nav-item" onclick="etNav('business')" data-p="business"><span class="et-nav-icon">💼</span>Business English</div>
  <div class="et-nav-item" onclick="etNav('toefl')" data-p="toefl"><span class="et-nav-icon">🎓</span>TOEFL / IELTS</div>
  <div class="et-sidebar-label">Progress</div>
  <div class="et-nav-item" onclick="etNav('achievements')" data-p="achievements"><span class="et-nav-icon">🏆</span>Achievements</div>
  <div class="et-nav-item" onclick="etNav('custom')" data-p="custom"><span class="et-nav-icon">➕</span>Kata Custom</div>
</nav>
<div class="et-content" id="et-content"><div id="et-sc"></div></div>
</div>`;
  etNav('dashboard');
}

function etNav(s){
  etState.section=s;
  document.querySelectorAll('.et-nav-item').forEach(el=>el.classList.toggle('active',el.dataset.p===s));
  const c=ET.el('et-sc');if(!c)return;
  c.innerHTML='<div style="text-align:center;padding:60px 0;color:var(--text3)">⏳</div>';
  const m={dashboard:etRenderDash,vocab:etRenderVocab,grammar:etRenderGrammar,flashcard:etRenderFlashcard,pronunciation:etRenderPron,reading:etRenderReading,listening:etRenderListening,writing:etRenderWriting,conversation:etRenderConv,quiz:etRenderQuiz,games:etRenderGames,daily:etRenderDaily,business:etRenderBiz,toefl:etRenderTOEFL,achievements:etRenderAch,custom:etRenderCustom};
  setTimeout(()=>{if(m[s])m[s]();else c.innerHTML='<div class="et-card"><p>Dalam pengembangan.</p></div>';},50);
}

// ── DASHBOARD ────────────────────────────────────────────────────
function etRenderDash(){
  const lvl=etGetLevel(etState.xp);const nl=ET_LEVELS[ET_LEVELS.indexOf(lvl)+1];
  const pct=nl?Math.round(((etState.xp-lvl.min)/(nl.min-lvl.min))*100):100;
  const acc=etState.totalAnswered>0?Math.round((etState.totalCorrect/etState.totalAnswered)*100):0;
  ET.el('et-sc').innerHTML=`
<div class="et-hero"><h2>${lvl.icon} Welcome to <span>English Trainer</span></h2>
<p>Platform belajar Bahasa Inggris A1 hingga C2. Vocab, Grammar, Reading, Listening, Writing, Conversation, Games, TOEFL — semua dalam satu tempat!</p>
<div style="display:flex;gap:10px;flex-wrap:wrap"><button class="et-btn et-btn-primary" onclick="etNav('vocab')">📚 Mulai Belajar</button><button class="et-btn et-btn-ghost" onclick="etNav('daily')">🎯 Daily Challenge</button><button class="et-btn et-btn-ghost" onclick="etNav('quiz')">🧠 Quick Quiz</button></div></div>
<div class="et-card" style="margin-bottom:16px">
  <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;margin-bottom:12px">
    <div><div style="font-weight:700;color:var(--text)">${lvl.icon} ${lvl.label}</div><div style="font-size:12px;color:var(--text3)">${etState.xp} XP${nl?' · '+(nl.min-etState.xp)+' to next':' · Max!'}</div></div>
    <div style="display:flex;gap:8px;flex-wrap:wrap"><span class="et-badge et-badge-purple">🔥 ${etState.streak} streak</span><span class="et-badge et-badge-${etState.dailyDone?'green':'yellow'}">${etState.dailyDone?'✅ Done':'⏰ Study Today!'}</span></div>
  </div>
  <div class="et-xp-bar-bg"><div class="et-xp-bar-fill" style="width:${pct}%"></div></div>
  <div style="font-size:11px;color:var(--text3);text-align:right;margin-top:4px">${pct}% → ${nl?nl.label:'Max'}</div>
</div>
<div class="et-card-grid" style="grid-template-columns:repeat(4,1fr);margin-bottom:20px">
  <div class="et-stat-card"><div class="et-stat-val">${etState.xp}</div><div class="et-stat-label">Total XP</div></div>
  <div class="et-stat-card"><div class="et-stat-val" style="color:#5de0a0">${etState.totalAnswered}</div><div class="et-stat-label">Dijawab</div></div>
  <div class="et-stat-card"><div class="et-stat-val" style="color:#f7b96a">${acc}%</div><div class="et-stat-label">Akurasi</div></div>
  <div class="et-stat-card"><div class="et-stat-val" style="color:#f76a6a">${etState.achievements.length}</div><div class="et-stat-label">Achievements</div></div>
</div>
<div class="et-section-title">🎮 Mulai Belajar</div>
<div class="et-card-grid">${[
  {i:'📚',n:'Vocab Trainer',d:'400+ kata A1-C2, Business, Tech, Slang',p:'vocab',c:'#7c6af7'},
  {i:'📐',n:'Grammar',d:'Tenses, Modal, Conditional, Passive',p:'grammar',c:'#5de0c5'},
  {i:'🃏',n:'Flashcard',d:'Spaced repetition — flip and review',p:'flashcard',c:'#f7b96a'},
  {i:'🔊',n:'Pronunciation',d:'Cara ucap benar + Text-to-Speech',p:'pronunciation',c:'#60a5fa'},
  {i:'📖',n:'Reading',d:'Artikel A1-C1 + comprehension quiz',p:'reading',c:'#5de0a0'},
  {i:'🎧',n:'Listening',d:'Simulasi audio + transcript',p:'listening',c:'#a78bfa'},
  {i:'✍️',n:'Writing',d:'Prompt berbagai level + evaluasi',p:'writing',c:'#f76a6a'},
  {i:'💬',n:'Conversation',d:'Dialog — interview, travel, dll',p:'conversation',c:'#f7b96a'},
  {i:'🧠',n:'Quiz Challenge',d:'Mixed quiz dengan countdown timer',p:'quiz',c:'#7c6af7'},
  {i:'🎮',n:'Mini Games',d:'Word scramble, fill blank, typing blitz',p:'games',c:'#5de0c5'},
  {i:'💼',n:'Business English',d:'Email, frasa meeting, negosiasi',p:'business',c:'#60a5fa'},
  {i:'🎓',n:'TOEFL / IELTS',d:'Soal akademik standar internasional',p:'toefl',c:'#f76a6a'},
].map(m=>`<div class="et-card" style="cursor:pointer;transition:all .2s" onclick="etNav('${m.p}')" onmouseover="this.style.borderColor='${m.c}55';this.style.transform='translateY(-3px)'" onmouseout="this.style.borderColor='';this.style.transform=''"><div style="font-size:1.8rem;margin-bottom:8px">${m.i}</div><div style="font-size:13px;font-weight:700;color:var(--text);margin-bottom:4px">${m.n}</div><div style="font-size:11px;color:var(--text3);line-height:1.4">${m.d}</div></div>`).join('')}</div>
<div class="et-card" style="background:linear-gradient(135deg,rgba(124,106,247,.08),rgba(93,224,197,.04));border-color:rgba(124,106,247,.2)">
  <div style="font-size:13px;font-weight:700;color:var(--accent);margin-bottom:10px">🤖 AI Tutor Recommendation</div>
  <div style="font-size:13px;color:var(--text2);line-height:1.7">${etState.totalAnswered<10?'👋 Mulai dengan <strong>Vocabulary A1</strong> — bangun fondasi kosakata dasar dulu!':etState.xp<200?'📚 Kamu berkembang! Coba <strong>Flashcard</strong> untuk mempercepat hafalan.':etState.xp<500?'💡 Sudah A2! Belajar <strong>Grammar Tenses</strong> dan coba <strong>Conversation</strong>.':etState.xp<1000?'🔥 Bagus! Tantang dirimu dengan <strong>Reading B1</strong> dan <strong>Quiz Challenge</strong>.':'👑 Kamu sudah advanced! Coba <strong>TOEFL Practice</strong> dan <strong>Business English</strong>.'}</div>
</div>`;
}
// ── VOCABULARY TRAINER ───────────────────────────────────────────
let _voc={pool:[],idx:0,answered:false,sC:0,sW:0};
function etRenderVocab(){
  const levels=['A1','A2','B1','B2','C1','C2','Business','Tech','Slang'];
  const cats=['all','Daily','Adjective','Verb','Noun','Emotion','Time','Question','Tech','Business','Grammar','Idiom','Conversation','Slang','TOEFL','Academic','Advanced','Irregular Verb'];
  ET.el('et-sc').innerHTML=`
<div class="et-section-title">📚 Vocabulary Trainer</div>
<div class="et-section-sub">400+ kata dari A1 Beginner hingga C2 Professional</div>
<div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:14px;align-items:flex-end">
  <div><div style="font-size:11px;color:var(--text3);margin-bottom:4px">Level</div>
    <select class="et-select" onchange="etVocLevel(this.value)">${levels.map(l=>`<option value="${l}"${l===etState.vocabLevel?' selected':''}>${l}</option>`).join('')}</select></div>
  <div><div style="font-size:11px;color:var(--text3);margin-bottom:4px">Mode</div>
    <select class="et-select" onchange="etVocMode(this.value)">
      <option value="en2id"${etState.vocabMode==='en2id'?' selected':''}>🇬🇧→🇮🇩 English to Indo</option>
      <option value="id2en"${etState.vocabMode==='id2en'?' selected':''}>🇮🇩→🇬🇧 Indo to English</option>
      <option value="mcq"${etState.vocabMode==='mcq'?' selected':''}>🎯 Pilihan Ganda</option>
      <option value="fill"${etState.vocabMode==='fill'?' selected':''}>📝 Fill in the Blank</option>
    </select></div>
  <div><div style="font-size:11px;color:var(--text3);margin-bottom:4px">Kategori</div>
    <select class="et-select" onchange="etVocCat(this.value)">${cats.map(c=>`<option value="${c}"${c===etState.vocabCat?' selected':''}>${c==='all'?'🔀 All':c}</option>`).join('')}</select></div>
  <button class="et-btn et-btn-ghost et-btn-sm" onclick="etVocSpeak()">🔊 TTS</button>
</div>
<div style="display:flex;gap:8px;margin-bottom:14px;flex-wrap:wrap">
  <span class="et-badge et-badge-purple">⚡ Combo: <span id="vc-combo">x1</span></span>
  <span class="et-badge et-badge-green">✅ <span id="vc-ok">0</span></span>
  <span class="et-badge et-badge-red">❌ <span id="vc-bad">0</span></span>
  <span class="et-badge et-badge-blue">📊 <span id="vc-pool">0</span> kata</span>
</div>
<div class="et-card" id="vc-card" style="min-height:220px"></div>
<div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap">
  <button class="et-btn et-btn-ghost et-btn-sm" onclick="etVocHint()">💡 Hint</button>
  <button class="et-btn et-btn-ghost et-btn-sm" onclick="etVocSkip()">⏭ Lewati</button>
  <button class="et-btn et-btn-ghost et-btn-sm" onclick="etVocSpeak()">🔊 Dengar</button>
</div>`;
  etVocInit();
}
function etVocInit(){
  _voc.pool=ET.rng.shuffle(etGetVocabPool(etState.vocabLevel,etState.vocabCat));
  _voc.idx=0;_voc.answered=false;_voc.sC=0;_voc.sW=0;
  const p=ET.el('vc-pool');if(p)p.textContent=_voc.pool.length;
  etVocNext();
}
function etVocLevel(v){etState.vocabLevel=v;etVocInit();}
function etVocMode(v){etState.vocabMode=v;etVocInit();}
function etVocCat(v){etState.vocabCat=v;etVocInit();}
function etVocNext(){
  if(!_voc.pool.length){etVocInit();return;}
  const item=_voc.pool[_voc.idx%_voc.pool.length];_voc.idx++;
  _voc.answered=false;etState.currentVocab=item;
  if(etState.vocabMode==='mcq')etVocMCQ(item);
  else if(etState.vocabMode==='fill')etVocFill(item);
  else etVocTyping(item);
}
function etVocTyping(item){
  const isEN=etState.vocabMode==='en2id';
  const card=ET.el('vc-card');if(!card)return;
  card.innerHTML=`
<div style="font-size:11px;color:var(--text3);margin-bottom:10px">Terjemahkan ke ${isEN?'🇮🇩 Bahasa Indonesia':'🇬🇧 Bahasa Inggris'} <span class="et-badge et-badge-purple" style="margin-left:6px">${item.cat}</span></div>
<div style="font-size:2rem;font-weight:800;color:var(--text);margin-bottom:6px">${isEN?item.en:item.id}</div>
<div id="vc-hint" style="display:none" class="et-feedback et-fb-info">💡 ${item.ex||'-'}</div>
<div style="display:flex;gap:8px;margin-top:16px">
  <input id="vc-in" class="et-input" placeholder="Ketik jawaban..." autocomplete="off" autocorrect="off" spellcheck="false" onkeydown="if(event.key==='Enter')etVocCheck()">
  <button class="et-btn et-btn-primary" onclick="etVocCheck()">Cek ✓</button>
</div>
<input type="hidden" id="vc-ans" value="${(isEN?item.id:item.en).replace(/"/g,'&quot;')}">
<div id="vc-fb"></div>`;
  setTimeout(()=>{const i=ET.el('vc-in');if(i)i.focus();},80);
  if(etState.ttsEnabled&&etState.vocabMode==='en2id')ET.speak(item.en);
}
function etVocMCQ(item){
  const isEN=Math.random()>.5;const prompt=isEN?item.en:item.id;const correct=isEN?item.id:item.en;
  const others=ET.rng.shuffle(_voc.pool.filter(w=>w.en!==item.en)).slice(0,3);
  const choices=ET.rng.shuffle([correct,...others.map(w=>isEN?w.id:w.en)]);
  const card=ET.el('vc-card');if(!card)return;
  card.innerHTML=`<div style="font-size:11px;color:var(--text3);margin-bottom:10px">Apa artinya? <span class="et-badge et-badge-purple" style="margin-left:6px">${item.cat}</span></div>
<div style="font-size:2rem;font-weight:800;color:var(--text);margin-bottom:16px">${prompt}</div>
<div class="et-mcq-grid">${choices.map((c,i)=>`<button class="et-mcq-btn" onclick="etVocMCQCheck(this,${JSON.stringify(c)},${JSON.stringify(correct)})"><span class="et-mcq-idx">${['A','B','C','D'][i]}</span><span>${c}</span></button>`).join('')}</div>
<div id="vc-fb"></div>`;
  if(etState.ttsEnabled)ET.speak(item.en);
}
function etVocFill(item){
  const kw=item.en.split('/')[0].trim();
  const ex=item.ex||item.en;
  const masked=ex.replace(new RegExp('\\b'+kw.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'\\b','i'),'______');
  const card=ET.el('vc-card');if(!card)return;
  card.innerHTML=`<div style="font-size:11px;color:var(--text3);margin-bottom:10px">📝 Lengkapi kalimat:</div>
<div style="font-size:1.1rem;font-weight:600;color:var(--text);margin-bottom:6px;line-height:1.6;font-family:monospace">${masked}</div>
<div style="font-size:12px;color:var(--text3);margin-bottom:14px">💡 Arti: ${item.id}</div>
<div style="display:flex;gap:8px"><input id="vc-in" class="et-input" placeholder="Ketik kata..." autocomplete="off" spellcheck="false" onkeydown="if(event.key==='Enter')etVocCheck()">
<button class="et-btn et-btn-primary" onclick="etVocCheck()">Cek ✓</button></div>
<input type="hidden" id="vc-ans" value="${kw.replace(/"/g,'&quot;')}"><div id="vc-fb"></div>`;
  setTimeout(()=>{const i=ET.el('vc-in');if(i)i.focus();},80);
}
function etVocCheck(){
  if(_voc.answered)return;const inp=ET.el('vc-in');if(!inp)return;
  const user=inp.value.trim();const correct=ET.el('vc-ans')?.value||'';
  const n=ET.norm;
  const ok=n(user)===n(correct)||n(correct).split('/').some(p=>n(user)===n(p.trim()))||(n(correct).length>4&&n(user).length>3&&n(correct).startsWith(n(user).substring(0,4))&&n(user).length>=n(correct).length*.65);
  if(ok)etVocOK(correct);else etVocBAD(correct);
}
function etVocMCQCheck(btn,sel,correct){
  if(_voc.answered)return;_voc.answered=true;
  document.querySelectorAll('#vc-card .et-mcq-btn').forEach(b=>b.disabled=true);
  if(sel===correct){btn.classList.add('correct');etVocOK(correct,true);}
  else{btn.classList.add('wrong');document.querySelectorAll('#vc-card .et-mcq-btn').forEach(b=>{if(b.querySelector('span:last-child')?.textContent===correct)b.classList.add('correct');});etVocBAD(correct,true);}
}
function etVocOK(correct,mcq=false){
  _voc.answered=true;etState.combo=Math.min(etState.combo+1,10);_voc.sC++;etState.totalCorrect++;
  const bonus={'A1':0,'A2':2,'B1':5,'B2':8,'C1':12,'C2':15,'Business':8,'Tech':8,'Slang':5};
  const xp=(5+(bonus[etState.vocabLevel]||5))*Math.min(etState.combo,3);
  etAddXP(xp,'Vocab');etCheckDaily();
  const item=etState.currentVocab;
  const fb=ET.el('vc-fb');if(fb)fb.innerHTML=`<div class="et-feedback et-fb-ok">✅ Benar! +${xp} XP · Combo x${etState.combo}${item?.ex?`<div style="font-size:12px;margin-top:6px;font-weight:400">📖 ${item.ex}</div>`:''}</div>`;
  if(!mcq){const i=ET.el('vc-in');if(i)i.disabled=true;}
  etVocStats();setTimeout(()=>etVocNext(),2200);
}
function etVocBAD(correct,mcq=false){
  _voc.answered=true;etState.combo=1;_voc.sW++;
  const item=etState.currentVocab;
  const fb=ET.el('vc-fb');if(fb)fb.innerHTML=`<div class="et-feedback et-fb-bad">❌ Jawaban: <strong>${correct}</strong>${item?.ex?`<div style="font-size:12px;margin-top:6px;font-weight:400">📖 ${item.ex}</div>`:''}</div>`;
  if(!mcq){const i=ET.el('vc-in');if(i)i.disabled=true;}
  etVocStats();setTimeout(()=>etVocNext(),2600);
}
function etVocHint(){const h=ET.el('vc-hint');if(h)h.style.display=h.style.display==='none'?'block':'none';}
function etVocSkip(){etState.combo=1;etVocNext();}
function etVocSpeak(){if(etState.currentVocab)ET.speak(etState.currentVocab.en);}
function etVocStats(){
  const c=ET.el('vc-combo');if(c)c.textContent='x'+etState.combo;
  const ok=ET.el('vc-ok');if(ok)ok.textContent=_voc.sC;
  const bd=ET.el('vc-bad');if(bd)bd.textContent=_voc.sW;
}

// ── GRAMMAR ──────────────────────────────────────────────────────
let _gram={key:'tobe',idx:0,score:0,total:0,answered:false,showEx:true};
function etRenderGrammar(){
  const topics=Object.entries(ET_GRAMMAR).map(([k,v])=>({k,title:v.title}));
  const cur=ET_GRAMMAR[_gram.key]||ET_GRAMMAR.tobe;
  ET.el('et-sc').innerHTML=`
<div class="et-section-title">📐 Grammar Trainer</div>
<div class="et-section-sub">Tata bahasa dari dasar hingga mahir</div>
<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px">${topics.map(t=>`<button class="et-btn ${t.k===_gram.key?'et-btn-primary':'et-btn-ghost'} et-btn-sm" onclick="etGramTopic('${t.k}')">${t.title}</button>`).join('')}</div>
<div class="et-card" style="background:rgba(124,106,247,.04);border-color:rgba(124,106,247,.2);margin-bottom:14px">
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
    <div style="font-weight:700;font-size:14px;color:var(--accent)">${cur.title}</div>
    <button class="et-btn et-btn-ghost et-btn-sm" onclick="etGramToggle()">📋 Penjelasan</button>
  </div>
  <div id="gram-ex" style="${_gram.showEx?'':'display:none'}">${cur.explanation}</div>
</div>
<div style="display:flex;gap:8px;margin-bottom:12px">
  <span class="et-badge et-badge-green">✅ ${_gram.score}/${_gram.total}</span>
  <span class="et-badge et-badge-purple">Soal ${_gram.idx+1}/${cur.questions.length}</span>
</div>
<div class="et-card" id="gram-card" style="min-height:200px"></div>
<div style="display:flex;gap:8px;margin-top:10px">
  <button class="et-btn et-btn-ghost et-btn-sm" onclick="etGramSkip()">⏭ Lewati</button>
  <button class="et-btn et-btn-ghost et-btn-sm" onclick="etGramReset()">🔄 Reset</button>
</div>`;
  etGramRender();
}
function etGramTopic(k){_gram.key=k;_gram.idx=0;_gram.score=0;_gram.total=0;_gram.answered=false;etRenderGrammar();}
function etGramToggle(){_gram.showEx=!_gram.showEx;const el=ET.el('gram-ex');if(el)el.style.display=_gram.showEx?'':'none';}
function etGramReset(){_gram.idx=0;_gram.score=0;_gram.total=0;_gram.answered=false;etGramRender();}
function etGramSkip(){_gram.idx++;_gram.answered=false;etGramRender();}
function etGramRender(){
  const cur=ET_GRAMMAR[_gram.key];if(!cur)return;
  const q=cur.questions[_gram.idx%cur.questions.length];_gram.answered=false;
  const c=ET.el('gram-card');if(!c)return;
  c.innerHTML=`<div style="font-size:11px;color:var(--text3);margin-bottom:10px">Pilih jawaban yang tepat:</div>
<div style="font-size:1.1rem;font-weight:600;color:var(--text);margin-bottom:18px;line-height:1.6;font-family:monospace">${q.q}</div>
<div class="et-mcq-grid">${q.opts.map((o,i)=>`<button class="et-mcq-btn" onclick="etGramCheck(this,${JSON.stringify(o)},${JSON.stringify(q.ans)},${JSON.stringify(q.ex)})"><span class="et-mcq-idx">${['A','B','C','D'][i]}</span><span>${o}</span></button>`).join('')}</div>
<div id="gram-fb"></div>`;
}
function etGramCheck(btn,sel,correct,ex){
  if(_gram.answered)return;_gram.answered=true;_gram.total++;
  document.querySelectorAll('#gram-card .et-mcq-btn').forEach(b=>b.disabled=true);
  const ok=sel===correct;btn.classList.add(ok?'correct':'wrong');
  if(!ok)document.querySelectorAll('#gram-card .et-mcq-btn').forEach(b=>{if(b.querySelector('span:last-child')?.textContent===correct)b.classList.add('correct');});
  if(ok){_gram.score++;etAddXP(15,'Grammar');etCheckDaily();}
  const fb=ET.el('gram-fb');if(fb)fb.innerHTML=`<div class="et-feedback ${ok?'et-fb-ok':'et-fb-bad'}">${ok?'✅ Benar! +15 XP':'❌ Jawaban: <strong>'+correct+'</strong>'}<br><span style="font-size:12px;font-weight:400">📖 ${ex}</span></div>`;
  setTimeout(()=>{
    _gram.idx++;const tl=ET_GRAMMAR[_gram.key]?.questions.length||1;
    if(_gram.idx>=tl){_gram.idx=0;const c=ET.el('gram-card');if(c)c.innerHTML=`<div style="text-align:center;padding:30px"><div style="font-size:2rem">🎉</div><div style="font-size:1.2rem;font-weight:700;color:var(--accent);margin:8px 0">Selesai! ${_gram.score}/${_gram.total} benar</div><button class="et-btn et-btn-primary" onclick="etGramReset()">🔄 Ulangi</button></div>`;}
    else etGramRender();
  },2200);
}

// ── FLASHCARD ────────────────────────────────────────────────────
let _fl={deck:[],idx:0,flipped:false,known:0,review:0};
function etRenderFlashcard(){
  const levels=['A1','A2','B1','B2','C1','C2','Business','Tech','Slang'];
  ET.el('et-sc').innerHTML=`
<div class="et-section-title">🃏 Flashcard — Spaced Repetition</div>
<div class="et-section-sub">Klik kartu untuk membalik. Tandai apakah kamu tahu atau perlu ulang.</div>
<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px">${levels.map(l=>`<button class="et-btn ${l===etState.vocabLevel?'et-btn-primary':'et-btn-ghost'} et-btn-sm" onclick="etFlLevel('${l}')">${l}</button>`).join('')}</div>
<div style="display:flex;gap:8px;margin-bottom:10px;justify-content:center">
  <span class="et-badge et-badge-green">✅ Tahu: <span id="fl-k">0</span></span>
  <span class="et-badge et-badge-red">🔄 Ulang: <span id="fl-r">0</span></span>
  <span class="et-badge et-badge-purple">Total: <span id="fl-t">0</span></span>
</div>
<div id="fl-scene" class="et-fc-scene" onclick="etFlFlip()">
  <div class="et-fc-inner">
    <div class="et-fc-face et-fc-front"><div class="et-fc-word" id="fl-front">...</div><div class="et-fc-sub">Klik untuk melihat arti</div></div>
    <div class="et-fc-face et-fc-back"><div class="et-fc-word" id="fl-back" style="font-size:1.5rem;color:#5de0a0">...</div><div class="et-fc-sub" id="fl-ex" style="margin-top:8px"></div></div>
  </div>
</div>
<div id="fl-actions" style="display:none;justify-content:center;gap:12px;margin-top:10px">
  <button class="et-btn et-btn-danger" onclick="etFlMark('review')">😟 Perlu Ulang</button>
  <button class="et-btn et-btn-ghost" onclick="etFlMark('skip')">⏭ Lewati</button>
  <button class="et-btn et-btn-success" onclick="etFlMark('known')">😊 Tahu! ✓</button>
</div>
<div style="text-align:center;margin-top:14px;display:flex;gap:8px;justify-content:center">
  <button class="et-btn et-btn-ghost et-btn-sm" onclick="etFlShuffle()">🔀 Shuffle</button>
  <button class="et-btn et-btn-ghost et-btn-sm" onclick="etFlSpeak()">🔊 Dengar</button>
</div>
<div id="fl-prog" style="text-align:center;font-size:12px;color:var(--text3);margin-top:10px"></div>`;
  etFlInit();
}
function etFlInit(){_fl.deck=ET.rng.shuffle([...etGetVocabPool(etState.vocabLevel,'all')]);_fl.idx=0;_fl.known=0;_fl.review=0;etFlStats();etFlShow();}
function etFlLevel(l){etState.vocabLevel=l;etFlInit();}
function etFlShow(){
  if(!_fl.deck.length)return;
  const item=_fl.deck[_fl.idx%_fl.deck.length];
  const f=ET.el('fl-front');if(f)f.textContent=item.en;
  const b=ET.el('fl-back');if(b)b.textContent=item.id;
  const ex=ET.el('fl-ex');if(ex)ex.textContent=item.ex||'';
  const sc=ET.el('fl-scene');if(sc)sc.classList.remove('flipped');
  _fl.flipped=false;const fa=ET.el('fl-actions');if(fa)fa.style.display='none';
  const pr=ET.el('fl-prog');if(pr)pr.textContent=`Kartu ${(_fl.idx%_fl.deck.length)+1} / ${_fl.deck.length}`;
}
function etFlFlip(){
  const sc=ET.el('fl-scene');if(!sc)return;
  _fl.flipped=!_fl.flipped;sc.classList.toggle('flipped',_fl.flipped);
  const fa=ET.el('fl-actions');if(fa)fa.style.display=_fl.flipped?'flex':'none';
  if(_fl.flipped&&etState.ttsEnabled){const item=_fl.deck[_fl.idx%_fl.deck.length];ET.speak(item.en);}
}
function etFlMark(t){
  if(t==='known'){_fl.known++;etAddXP(3,'Flashcard');}
  if(t==='review')_fl.review++;
  _fl.idx++;etFlStats();
  if(_fl.idx>=_fl.deck.length){
    const c=ET.el('et-sc');if(c)c.insertAdjacentHTML('afterbegin',`<div class="et-card et-feedback et-fb-ok" style="text-align:center">🎉 Selesai! <strong>${_fl.known}/${_fl.deck.length}</strong> kartu diketahui.<br><button class="et-btn et-btn-primary" style="margin-top:10px" onclick="etFlInit()">🔄 Ulangi</button></div>`);return;
  }
  etFlShow();
}
function etFlShuffle(){_fl.deck=ET.rng.shuffle(_fl.deck);_fl.idx=0;etFlShow();}
function etFlSpeak(){const item=_fl.deck[_fl.idx%_fl.deck.length];if(item)ET.speak(item.en);}
function etFlStats(){
  const k=ET.el('fl-k');if(k)k.textContent=_fl.known;
  const r=ET.el('fl-r');if(r)r.textContent=_fl.review;
  const t=ET.el('fl-t');if(t)t.textContent=_fl.deck.length;
}

// ── PRONUNCIATION ────────────────────────────────────────────────
let _pronIdx=0;
function etRenderPron(){
  ET.el('et-sc').innerHTML=`
<div class="et-section-title">🔊 Pronunciation Trainer</div>
<div class="et-section-sub">Kata-kata yang sering salah diucapkan oleh pelajar Indonesia</div>
<div class="et-card" style="text-align:center;padding:32px">
  <div class="et-pron-word" id="pron-w">-</div>
  <div class="et-phonetic" id="pron-ph">-</div>
  <span class="et-badge et-badge-purple" id="pron-lv">-</span>
  <div style="margin:16px 0;display:flex;gap:10px;justify-content:center;flex-wrap:wrap">
    <button class="et-btn et-btn-primary" onclick="etPronSpeak(0.85)">🔊 Normal</button>
    <button class="et-btn et-btn-ghost" onclick="etPronSpeak(0.55)">🐢 Pelan</button>
    <button class="et-btn et-btn-ghost" onclick="etPronSpeak(0.35)">🐌 Sangat Pelan</button>
  </div>
  <div class="et-pron-tip" id="pron-tip"></div>
</div>
<div style="display:flex;gap:8px;justify-content:center;margin-top:16px;align-items:center">
  <button class="et-btn et-btn-ghost" onclick="etPronPrev()">← Sebelumnya</button>
  <span style="padding:9px 14px;font-size:13px;color:var(--text3)" id="pron-cnt">1/${ET_PRON.length}</span>
  <button class="et-btn et-btn-ghost" onclick="etPronNext()">Selanjutnya →</button>
</div>
<div style="margin-top:24px">
  <div class="et-section-title">🎤 Shadowing Practice</div>
  <div class="et-section-sub">Dengarkan dan langsung ulangi — teknik terbaik untuk pronunciation</div>
  <div class="et-card">
    <p style="font-size:13px;color:var(--text2);line-height:1.7;margin-bottom:14px">Shadowing adalah teknik mendengarkan audio dan langsung mengulang kata/kalimat hampir bersamaan. Metode paling efektif yang digunakan language learner profesional di seluruh dunia.</p>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <button class="et-btn et-btn-ghost et-btn-sm" onclick="ET.speak('Hello, how are you today? I am doing great, thank you for asking.')">🔊 Greeting</button>
      <button class="et-btn et-btn-ghost et-btn-sm" onclick="ET.speak('The project deadline is next Friday. We need to finalize all deliverables before that.')">🔊 Business</button>
      <button class="et-btn et-btn-ghost et-btn-sm" onclick="ET.speak('The algorithm processes the data and returns the result in milliseconds.')">🔊 Tech</button>
      <button class="et-btn et-btn-ghost et-btn-sm" onclick="ET.speak('Despite the challenges, she persevered and ultimately achieved her goals.')">🔊 Advanced</button>
      <button class="et-btn et-btn-ghost et-btn-sm" onclick="ET.speak('Could you please repeat that? I did not quite catch what you said.')">🔊 Clarification</button>
    </div>
  </div>
</div>`;
  etPronShow();
}
function etPronShow(){
  const p=ET_PRON[_pronIdx];
  const w=ET.el('pron-w');if(w)w.textContent=p.word;
  const ph=ET.el('pron-ph');if(ph)ph.textContent=p.phonetic;
  const lv=ET.el('pron-lv');if(lv)lv.textContent=p.level;
  const tip=ET.el('pron-tip');if(tip)tip.textContent='💡 '+p.tips;
  const cnt=ET.el('pron-cnt');if(cnt)cnt.textContent=(_pronIdx+1)+'/'+ET_PRON.length;
}
function etPronSpeak(rate){
  const p=ET_PRON[_pronIdx];if(!window.speechSynthesis)return;
  const u=new SpeechSynthesisUtterance(p.word);u.lang='en-US';u.rate=rate;speechSynthesis.cancel();speechSynthesis.speak(u);
}
function etPronNext(){_pronIdx=(_pronIdx+1)%ET_PRON.length;etPronShow();}
function etPronPrev(){_pronIdx=(_pronIdx-1+ET_PRON.length)%ET_PRON.length;etPronShow();}
// ── READING ──────────────────────────────────────────────────────
let _ri=0,_ra=[];
function etRenderReading(){
  const txt=ET_READING[_ri];
  ET.el('et-sc').innerHTML=`
<div class="et-section-title">📖 Reading Comprehension</div>
<div class="et-section-sub">Baca artikel dan jawab pertanyaan untuk melatih pemahaman membaca</div>
<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px">${ET_READING.map((t,i)=>`<button class="et-btn ${i===_ri?'et-btn-primary':'et-btn-ghost'} et-btn-sm" onclick="etReadSet(${i})">${t.level}: ${t.title}</button>`).join('')}</div>
<div class="et-card">
  <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
    <span class="et-badge et-badge-${txt.level==='A1'?'green':txt.level==='B1'?'yellow':'red'}">${txt.level}</span>
    <span style="font-size:1rem;font-weight:700;color:var(--text)">${txt.title}</span>
  </div>
  <div class="et-reading-text" id="read-txt">${txt.text.split('\n\n').map(p=>`<p>${p}</p>`).join('')}</div>
  <div style="display:flex;gap:8px;margin-bottom:16px">
    <button class="et-btn et-btn-ghost et-btn-sm" onclick="ET.speak(ET.el('read-txt').innerText)">🔊 Listen</button>
    <button class="et-btn et-btn-ghost et-btn-sm" onclick="speechSynthesis.cancel()">⏹ Stop</button>
  </div>
  <hr class="et-divider">
  <div class="et-section-title" style="font-size:14px">🧠 Comprehension Questions</div>
  ${txt.questions.map((q,qi)=>`<div style="margin-bottom:18px">
    <div style="font-size:13px;font-weight:600;color:var(--text);margin-bottom:10px">${qi+1}. ${q.q}</div>
    <div class="et-mcq-grid">${q.opts.map((o,oi)=>`<button class="et-mcq-btn" id="rqb${qi}_${oi}" onclick="etReadCheck(${qi},${JSON.stringify(o)},${JSON.stringify(q.ans)},${oi})"><span class="et-mcq-idx">${['A','B','C','D'][oi]}</span><span>${o}</span></button>`).join('')}</div>
    <div id="rq-fb${qi}"></div>
  </div>`).join('')}
  <button class="et-btn et-btn-ghost et-btn-sm" onclick="etReadReset()">🔄 Reset</button>
</div>`;
}
function etReadSet(i){_ri=i;_ra=[];etRenderReading();}
function etReadReset(){_ra=[];etRenderReading();}
function etReadCheck(qi,sel,correct,oi){
  if(_ra.includes(qi))return;_ra.push(qi);
  const ok=sel===correct;const txt=ET_READING[_ri];
  document.querySelectorAll(`[id^="rqb${qi}_"]`).forEach(b=>b.disabled=true);
  const btn=ET.el(`rqb${qi}_${oi}`);if(btn)btn.classList.add(ok?'correct':'wrong');
  if(!ok){const ci=txt.questions[qi].opts.indexOf(correct);const cb=ET.el(`rqb${qi}_${ci}`);if(cb)cb.classList.add('correct');}
  const fb=ET.el(`rq-fb${qi}`);if(fb)fb.innerHTML=`<div class="et-feedback ${ok?'et-fb-ok':'et-fb-bad'}" style="padding:8px 12px;font-size:12px">${ok?'✅ Benar!':'❌ '+correct}</div>`;
  if(ok){etAddXP(20,'Reading');etCheckDaily();}
}

// ── LISTENING ────────────────────────────────────────────────────
let _li=0,_la=[],_ltr=false;
function etRenderListening(){
  const item=ET_LISTENING[_li];
  ET.el('et-sc').innerHTML=`
<div class="et-section-title">🎧 Listening Trainer</div>
<div class="et-section-sub">Latih kemampuan mendengar dengan simulasi audio berbagai konteks</div>
<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px">${ET_LISTENING.map((l,i)=>`<button class="et-btn ${i===_li?'et-btn-primary':'et-btn-ghost'} et-btn-sm" onclick="etLisSet(${i})">${l.level}: ${l.title}</button>`).join('')}</div>
<div class="et-card">
  <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px">
    <span class="et-badge et-badge-${item.level==='A1'?'green':item.level==='B1'?'yellow':'red'}">${item.level}</span>
    <span style="font-weight:700;color:var(--text)">${item.title}</span>
  </div>
  <div style="background:var(--bg3);border-radius:12px;padding:16px 20px;margin-bottom:14px;display:flex;align-items:center;gap:14px;flex-wrap:wrap">
    <div style="font-size:2rem">🎙️</div>
    <div style="flex:1"><div style="font-size:12px;color:var(--text3)">Audio Simulation (TTS)</div></div>
    <div style="display:flex;gap:8px">
      <button class="et-btn et-btn-primary" onclick="ET.speak(${JSON.stringify(item.text)})">▶ Play</button>
      <button class="et-btn et-btn-ghost" onclick="etLisSlow()">🐢 Slow</button>
      <button class="et-btn et-btn-ghost" onclick="speechSynthesis.cancel()">⏹ Stop</button>
    </div>
  </div>
  <button class="et-btn et-btn-ghost et-btn-sm" style="margin-bottom:14px" onclick="etLisToggle()">👁 ${_ltr?'Sembunyikan':'Tampilkan'} Transcript</button>
  <div id="lis-tr" style="${_ltr?'':'display:none'}" class="et-reading-text">${item.text}</div>
  <hr class="et-divider">
  <div class="et-section-title" style="font-size:14px">❓ Comprehension</div>
  ${item.questions.map((q,qi)=>`<div style="margin-bottom:16px">
    <div style="font-size:13px;font-weight:600;color:var(--text);margin-bottom:10px">${qi+1}. ${q.q}</div>
    <div class="et-mcq-grid">${q.opts.map((o,oi)=>`<button class="et-mcq-btn" id="lqb${qi}_${oi}" onclick="etLisCheck(${qi},${JSON.stringify(o)},${JSON.stringify(q.ans)},${oi})"><span class="et-mcq-idx">${['A','B','C','D'][oi]}</span><span>${o}</span></button>`).join('')}</div>
    <div id="lq-fb${qi}"></div>
  </div>`).join('')}
</div>`;
}
function etLisSet(i){_li=i;_la=[];_ltr=false;etRenderListening();}
function etLisSlow(){const u=new SpeechSynthesisUtterance(ET_LISTENING[_li].text);u.lang='en-US';u.rate=0.55;speechSynthesis.cancel();speechSynthesis.speak(u);}
function etLisToggle(){_ltr=!_ltr;const t=ET.el('lis-tr');if(t)t.style.display=_ltr?'':'none';}
function etLisCheck(qi,sel,correct,oi){
  if(_la.includes(qi))return;_la.push(qi);
  const ok=sel===correct;const item=ET_LISTENING[_li];
  document.querySelectorAll(`[id^="lqb${qi}_"]`).forEach(b=>b.disabled=true);
  const btn=ET.el(`lqb${qi}_${oi}`);if(btn)btn.classList.add(ok?'correct':'wrong');
  if(!ok){const ci=item.questions[qi].opts.indexOf(correct);const cb=ET.el(`lqb${qi}_${ci}`);if(cb)cb.classList.add('correct');}
  const fb=ET.el(`lq-fb${qi}`);if(fb)fb.innerHTML=`<div class="et-feedback ${ok?'et-fb-ok':'et-fb-bad'}" style="padding:8px 12px;font-size:12px">${ok?'✅ Benar!':'❌ '+correct}</div>`;
  if(ok){etAddXP(20,'Listening');etCheckDaily();}
}

// ── WRITING ──────────────────────────────────────────────────────
let _wp=null;
function etRenderWriting(){
  ET.el('et-sc').innerHTML=`
<div class="et-section-title">✍️ Writing Trainer</div>
<div class="et-section-sub">Latihan menulis email, opini, esai, dan proposal profesional</div>
<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px">${ET_WRITING.map((p,i)=>`<button class="et-btn et-btn-ghost et-btn-sm" onclick="etWriteLoad(${i})">${p.level}: ${p.title}</button>`).join('')}</div>
<div id="wp-box" style="background:rgba(96,165,250,.06);border:1px solid rgba(96,165,250,.2);border-radius:12px;padding:16px 20px;margin-bottom:16px">
  <div style="display:flex;gap:8px;align-items:center;margin-bottom:8px">
    <span class="et-badge et-badge-blue">${ET_WRITING[0].level}</span>
    <span class="et-badge et-badge-purple">${ET_WRITING[0].type}</span>
    <span style="font-size:13px;font-weight:700;color:#60a5fa">${ET_WRITING[0].title}</span>
  </div>
  <p style="font-size:13px;color:var(--text2);margin:0 0 10px">${ET_WRITING[0].prompt}</p>
  <div style="display:flex;gap:6px;flex-wrap:wrap">${ET_WRITING[0].tips.map(t=>`<span class="et-badge et-badge-yellow">💡 ${t}</span>`).join('')}</div>
  <div style="font-size:11px;color:var(--text3);margin-top:8px">✍️ Min: ${ET_WRITING[0].minWords} kata</div>
</div>
<textarea id="wr-in" class="et-input et-textarea" placeholder="Mulai menulis di sini..." oninput="etWriteCount(this)"></textarea>
<div class="et-wc-badge" id="wr-wc">0 kata</div>
<div style="display:flex;gap:10px;margin-top:14px;flex-wrap:wrap">
  <button class="et-btn et-btn-primary" onclick="etWriteEval()">📊 Evaluasi</button>
  <button class="et-btn et-btn-ghost" onclick="()=>{ET.el('wr-in').value='';ET.el('wr-wc').textContent='0 kata';}">🗑 Hapus</button>
  <button class="et-btn et-btn-ghost" onclick="()=>{const i=ET.el('wr-in');if(i&&i.value)ET.speak(i.value);}">🔊 Baca</button>
</div>
<div id="wr-fb" style="margin-top:16px"></div>`;
  _wp=ET_WRITING[0];
}
function etWriteLoad(i){
  _wp=ET_WRITING[i];const p=_wp;
  const b=ET.el('wp-box');if(b)b.innerHTML=`<div style="display:flex;gap:8px;align-items:center;margin-bottom:8px"><span class="et-badge et-badge-blue">${p.level}</span><span class="et-badge et-badge-purple">${p.type}</span><span style="font-size:13px;font-weight:700;color:#60a5fa">${p.title}</span></div><p style="font-size:13px;color:var(--text2);margin:0 0 10px">${p.prompt}</p><div style="display:flex;gap:6px;flex-wrap:wrap">${p.tips.map(t=>`<span class="et-badge et-badge-yellow">💡 ${t}</span>`).join('')}</div><div style="font-size:11px;color:var(--text3);margin-top:8px">✍️ Min: ${p.minWords} kata</div>`;
  const inp=ET.el('wr-in');if(inp)inp.value='';const wc=ET.el('wr-wc');if(wc)wc.textContent='0 kata';
  ET.el('wr-fb').innerHTML='';
}
function etWriteCount(el){
  const words=el.value.trim().split(/\s+/).filter(w=>w.length>0).length;
  const wc=ET.el('wr-wc');if(wc){wc.textContent=words+' kata';wc.className='et-wc-badge'+(_wp&&words>=_wp.minWords?' ok':'');}
}
function etWriteEval(){
  const inp=ET.el('wr-in');if(!inp||!inp.value.trim()){alert('Tulis dulu sesuatu!');return;}
  const text=inp.value.trim();const words=text.split(/\s+/).filter(w=>w.length>0).length;
  const minOk=_wp?words>=_wp.minWords:words>=30;
  const checks=[
    {ok:words>20,msg:`Panjang: ${words} kata ${minOk?'✅ memadai':'⚠️ perlu lebih panjang'}`},
    {ok:/[.!?]/.test(text),msg:'Tanda baca kalimat'},
    {ok:text[0]===text[0].toUpperCase(),msg:'Huruf kapital di awal'},
    {ok:/\b(because|however|therefore|moreover|although|furthermore|consequently|firstly|secondly)\b/i.test(text),msg:'Kata penghubung (connector)'},
    {ok:/\b(I am|I have|I will|She is|He is|They are|We are)\b/i.test(text),msg:'Subject + verb agreement'},
    {ok:/[,;:]/.test(text),msg:'Penggunaan tanda baca tambahan'},
  ];
  const xp=minOk?Math.min(Math.round(words*.5),100):10;
  etAddXP(xp,'Writing');etCheckDaily();
  const fb=ET.el('wr-fb');if(fb)fb.innerHTML=`<div class="et-card"><div style="font-size:14px;font-weight:700;color:var(--accent);margin-bottom:12px">📊 Evaluasi Tulisanmu</div><div style="display:flex;gap:8px;margin-bottom:14px;flex-wrap:wrap"><span class="et-badge et-badge-${minOk?'green':'yellow'}">${words} kata</span><span class="et-badge et-badge-purple">+${xp} XP</span></div>${checks.map(c=>`<div style="font-size:13px;color:${c.ok?'#5de0a0':'#f7b96a'};margin-bottom:6px">${c.ok?'✅':'⚠️'} ${c.msg}</div>`).join('')}<div style="margin-top:14px;padding:12px 16px;background:rgba(247,185,106,.06);border:1px solid rgba(247,185,106,.2);border-radius:10px;font-size:12px;color:#f7b96a;line-height:1.7">💡 <strong>AI Tutor:</strong> ${minOk?'Tulisanmu sudah memenuhi target! Variasikan struktur kalimat untuk meningkatkan kualitas lebih lanjut.':'Tambahkan lebih banyak detail, contoh konkret, dan gunakan kata penghubung untuk memperkuat tulisanmu.'}</div></div>`;
}

// ── CONVERSATION ─────────────────────────────────────────────────
let _cv={scenario:null,lineIdx:0};
function etRenderConv(){
  ET.el('et-sc').innerHTML=`
<div class="et-section-title">💬 Conversation Simulator</div>
<div class="et-section-sub">Latih percakapan nyata — interview, daily, presentation, travel</div>
<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:20px">${Object.entries(ET_CONV).map(([k,s])=>`<button class="et-btn et-btn-ghost" onclick="etConvSel('${k}')">${s.icon} ${s.title}</button>`).join('')}</div>
<div id="cv-main"><div class="et-card" style="text-align:center;padding:40px;background:linear-gradient(135deg,rgba(124,106,247,.06),rgba(93,224,197,.04));border-color:rgba(124,106,247,.2)"><div style="font-size:3rem;margin-bottom:12px">💬</div><div style="font-size:1.1rem;font-weight:700;color:var(--text);margin-bottom:8px">Pilih Skenario</div><div style="font-size:13px;color:var(--text3)">Pilih topik di atas untuk memulai simulasi percakapan interaktif.</div></div></div>`;
}
function etConvSel(k){
  _cv.scenario=ET_CONV[k].scenarios[0];_cv.lineIdx=0;
  const main=ET.el('cv-main');if(!main)return;
  main.innerHTML=`<div style="font-size:1rem;font-weight:700;color:var(--text);margin-bottom:16px">🎭 ${_cv.scenario.title}</div><div id="cv-chat" style="max-height:400px;overflow-y:auto;margin-bottom:16px"></div><div id="cv-inp"></div>`;
  etConvStep();
}
function etConvStep(){
  const sc=_cv.scenario;if(!sc)return;
  const chat=ET.el('cv-chat');const inp=ET.el('cv-inp');if(!chat||!inp)return;
  const idx=_cv.lineIdx;
  if(idx>=sc.lines.length){
    inp.innerHTML=`<div class="et-feedback et-fb-ok" style="text-align:center">🎉 Percakapan selesai! +30 XP<br><button class="et-btn et-btn-primary" style="margin-top:10px" onclick="_cv.lineIdx=0;etConvStep()">🔄 Ulangi</button></div>`;
    etAddXP(30,'Conversation');etCheckDaily();return;
  }
  const line=sc.lines[idx];
  if(line.role!=='user'){
    chat.innerHTML+=`<div class="et-conv-bbl"><div class="et-conv-av ai">🤖</div><div><div style="font-size:11px;color:var(--text3);margin-bottom:4px">${line.speaker||'NPC'}</div><div class="et-conv-txt">${line.text}</div></div></div>`;
    if(etState.ttsEnabled)ET.speak(line.text);
    _cv.lineIdx++;chat.scrollTop=chat.scrollHeight;
    const next=sc.lines[_cv.lineIdx];
    if(next&&next.role!=='user')setTimeout(()=>etConvStep(),1500);
    else etConvStep();
  }else{
    chat.scrollTop=chat.scrollHeight;
    inp.innerHTML=`<div style="background:rgba(247,185,106,.06);border:1px solid rgba(247,185,106,.2);border-radius:10px;padding:10px 14px;font-size:12px;color:#f7b96a;margin-bottom:10px">🎯 ${line.prompt}</div><div style="font-size:11px;color:var(--text3);margin-bottom:8px">💡 Contoh: "${line.hint}"</div><div style="display:flex;gap:8px"><input id="cv-in" class="et-input" placeholder="Ketik responmu dalam Bahasa Inggris..." autocomplete="off" onkeydown="if(event.key==='Enter')etConvSend()"><button class="et-btn et-btn-primary" onclick="etConvSend()">Kirim ➤</button></div><button class="et-btn et-btn-ghost et-btn-sm" style="margin-top:8px" onclick="ET.el('cv-in').value=${JSON.stringify(line.hint)}">💡 Gunakan Contoh</button>`;
    setTimeout(()=>{const i=ET.el('cv-in');if(i)i.focus();},80);
  }
}
function etConvSend(){
  const inp=ET.el('cv-in');if(!inp||!inp.value.trim())return;
  const text=inp.value.trim();const chat=ET.el('cv-chat');
  if(chat)chat.innerHTML+=`<div class="et-conv-bbl user"><div class="et-conv-av user">👤</div><div><div class="et-conv-txt">${text}</div></div></div>`;
  etAddXP(8,'Conversation');_cv.lineIdx++;
  ET.el('cv-inp').innerHTML='<div style="text-align:center;padding:10px;color:var(--text3);font-size:13px">⏳</div>';
  setTimeout(()=>etConvStep(),700);
}
// ── QUIZ CHALLENGE ───────────────────────────────────────────────
let _qz={qs:[],idx:0,score:0,timer:null,timeLeft:30,mode:'mixed'};
function etRenderQuiz(){
  ET.el('et-sc').innerHTML=`
<div class="et-section-title">🧠 Quiz Challenge</div>
<div class="et-section-sub">Test vocab + grammar dengan countdown timer</div>
<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:20px">
  <button class="et-btn et-btn-primary et-btn-sm" onclick="etQzStart('vocab')">📚 Vocab Quiz</button>
  <button class="et-btn et-btn-ghost et-btn-sm" onclick="etQzStart('grammar')">📐 Grammar Quiz</button>
  <button class="et-btn et-btn-ghost et-btn-sm" onclick="etQzStart('mixed')">🎯 Mixed (15 soal)</button>
  <button class="et-btn et-btn-ghost et-btn-sm" onclick="etQzStart('blitz')">⚡ Speed Blitz (5s)</button>
</div>
<div id="qz-area"><div class="et-card" style="text-align:center;padding:40px;background:linear-gradient(135deg,rgba(124,106,247,.06),rgba(93,224,197,.04));border-color:rgba(124,106,247,.2)"><div style="font-size:3rem;margin-bottom:12px">🧠</div><div style="font-size:1.1rem;font-weight:700;color:var(--text)">Pilih Mode Quiz</div><div style="font-size:13px;color:var(--text3);margin-top:8px">Soal pilihan ganda dengan batas waktu. Jawab secepat dan setepat mungkin!</div></div></div>`;
}
function etQzStart(mode){
  _qz.mode=mode;_qz.idx=0;_qz.score=0;clearInterval(_qz.timer);
  const allV=[...Object.values(ET_VOCAB).flat()];
  let qs=[];
  if(mode==='vocab'||mode==='mixed'||mode==='blitz'){
    ET.rng.shuffle(allV).slice(0,mode==='blitz'?10:20).forEach(item=>{
      const isEN=Math.random()>.5;const prompt=isEN?item.en:item.id;const correct=isEN?item.id:item.en;
      const others=ET.rng.shuffle(allV.filter(w=>w.en!==item.en)).slice(0,3).map(w=>isEN?w.id:w.en);
      qs.push({type:'vocab',q:`Arti: "${prompt}"?`,opts:ET.rng.shuffle([correct,...others]),ans:correct,ex:item.ex||''});
    });
  }
  if(mode==='grammar'||mode==='mixed'){
    Object.values(ET_GRAMMAR).forEach(g=>g.questions.slice(0,2).forEach(gq=>qs.push({type:'grammar',q:gq.q,opts:gq.opts,ans:gq.ans,ex:gq.ex})));
  }
  _qz.qs=ET.rng.shuffle(qs).slice(0,mode==='blitz'?10:15);
  etQzRenderQ();
}
function etQzRenderQ(){
  if(_qz.idx>=_qz.qs.length){etQzResult();return;}
  const q=_qz.qs[_qz.idx];const tl=_qz.mode==='blitz'?5:30;
  _qz.timeLeft=tl;
  const area=ET.el('qz-area');if(!area)return;
  area.innerHTML=`<div class="et-card"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px"><div><span class="et-badge et-badge-purple">Soal ${_qz.idx+1}/${_qz.qs.length}</span><span class="et-badge et-badge-green" style="margin-left:6px">✅ ${_qz.score}</span></div><div class="et-timer" id="qz-t">${tl}</div></div><div class="et-xp-bar-bg" style="margin-bottom:16px"><div class="et-xp-bar-fill" style="width:${(_qz.idx/_qz.qs.length*100)}%"></div></div><div style="font-size:11px;color:var(--text3);margin-bottom:6px">${q.type==='grammar'?'📐 Grammar':'📚 Vocabulary'}</div><div style="font-size:1.1rem;font-weight:600;color:var(--text);margin-bottom:18px;line-height:1.5;font-family:monospace">${q.q}</div><div class="et-mcq-grid">${q.opts.map((o,i)=>`<button class="et-mcq-btn" onclick="etQzCheck(this,${JSON.stringify(o)},${JSON.stringify(q.ans)},${JSON.stringify(q.ex||'')})"><span class="et-mcq-idx">${['A','B','C','D'][i]}</span><span>${o}</span></button>`).join('')}</div><div id="qz-fb"></div></div>`;
  clearInterval(_qz.timer);
  _qz.timer=setInterval(()=>{
    _qz.timeLeft--;const t=ET.el('qz-t');
    if(t){t.textContent=_qz.timeLeft;t.classList.toggle('danger',_qz.timeLeft<=5);}
    if(_qz.timeLeft<=0){
      clearInterval(_qz.timer);
      document.querySelectorAll('#qz-area .et-mcq-btn').forEach(b=>{b.disabled=true;if(b.querySelector('span:last-child')?.textContent===q.ans)b.classList.add('correct');});
      const fb=ET.el('qz-fb');if(fb)fb.innerHTML=`<div class="et-feedback et-fb-bad">⏰ Waktu habis! Jawaban: <strong>${q.ans}</strong></div>`;
      setTimeout(()=>{_qz.idx++;etQzRenderQ();},1500);
    }
  },1000);
}
function etQzCheck(btn,sel,correct,ex){
  clearInterval(_qz.timer);document.querySelectorAll('#qz-area .et-mcq-btn').forEach(b=>b.disabled=true);
  const ok=sel===correct;btn.classList.add(ok?'correct':'wrong');
  if(!ok)document.querySelectorAll('#qz-area .et-mcq-btn').forEach(b=>{if(b.querySelector('span:last-child')?.textContent===correct)b.classList.add('correct');});
  if(ok){_qz.score++;const sp=_qz.timeLeft>20?5:_qz.timeLeft>10?3:0;etAddXP(10+sp,'Quiz');etCheckDaily();}
  const fb=ET.el('qz-fb');if(fb)fb.innerHTML=`<div class="et-feedback ${ok?'et-fb-ok':'et-fb-bad'}">${ok?'✅ Benar!':'❌ '+correct}${ex?`<br><span style="font-size:12px;font-weight:400">📖 ${ex}</span>`:''}</div>`;
  setTimeout(()=>{_qz.idx++;etQzRenderQ();},2000);
}
function etQzResult(){
  clearInterval(_qz.timer);const pct=Math.round(_qz.score/_qz.qs.length*100);const g=pct>=90?'A':pct>=75?'B':pct>=60?'C':pct>=50?'D':'F';
  const area=ET.el('qz-area');if(!area)return;
  area.innerHTML=`<div class="et-card" style="text-align:center;padding:40px"><div style="font-size:4rem;margin-bottom:8px">${pct>=75?'🎉':pct>=50?'👍':'💪'}</div><div style="font-size:2rem;font-weight:800;color:var(--accent)">${pct}%</div><div style="font-size:1.5rem;font-weight:700;color:${pct>=75?'#5de0a0':pct>=50?'#f7b96a':'#f76a6a'};margin:6px 0">Grade ${g}</div><div style="font-size:14px;color:var(--text2);margin-bottom:20px">${_qz.score} dari ${_qz.qs.length} benar</div><div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap"><button class="et-btn et-btn-primary" onclick="etQzStart('mixed')">🔄 Quiz Lagi</button><button class="et-btn et-btn-ghost" onclick="etNav('vocab')">📚 Belajar Lagi</button><button class="et-btn et-btn-ghost" onclick="etNav('dashboard')">🏠 Dashboard</button></div></div>`;
}

// ── MINI GAMES ───────────────────────────────────────────────────
function etRenderGames(){
  ET.el('et-sc').innerHTML=`
<div class="et-section-title">🎮 Mini Games</div>
<div class="et-section-sub">Belajar sambil bermain — seru dan efektif!</div>
<div class="et-card-grid" style="margin-bottom:20px">
  <div class="et-card" style="cursor:pointer;text-align:center" onclick="etGScramble()"><div style="font-size:2.5rem;margin-bottom:8px">🔤</div><div style="font-weight:700;color:var(--text);margin-bottom:4px">Word Scramble</div><div style="font-size:12px;color:var(--text3)">Susun huruf acak menjadi kata</div></div>
  <div class="et-card" style="cursor:pointer;text-align:center" onclick="etGFill()"><div style="font-size:2.5rem;margin-bottom:8px">📝</div><div style="font-weight:700;color:var(--text);margin-bottom:4px">Fill in the Blank</div><div style="font-size:12px;color:var(--text3)">Isi bagian kalimat yang kosong</div></div>
  <div class="et-card" style="cursor:pointer;text-align:center" onclick="etGBlitz()"><div style="font-size:2.5rem;margin-bottom:8px">⚡</div><div style="font-weight:700;color:var(--text);margin-bottom:4px">Typing Blitz</div><div style="font-size:12px;color:var(--text3)">Ketik kata secepat mungkin (60s)</div></div>
  <div class="et-card" style="cursor:pointer;text-align:center" onclick="etGMatch()"><div style="font-size:2.5rem;margin-bottom:8px">🔗</div><div style="font-weight:700;color:var(--text);margin-bottom:4px">Word Match</div><div style="font-size:12px;color:var(--text3)">Cocokkan kata English dengan artinya</div></div>
</div>
<div id="game-area"></div>`;
}

// Word Scramble
const SC_WORDS=['hello','world','study','computer','english','language','practice','grammar','vocabulary','achievement','pronunciation','professional','technology','university','conversation'];
let _sc={word:'',shuffled:[],selected:[],score:0,wIdx:0,wordList:[]};
function etGScramble(){
  _sc.wordList=ET.rng.shuffle([...SC_WORDS]);_sc.score=0;_sc.wIdx=0;etScNext();
}
function etScNext(){
  const w=_sc.wordList[_sc.wIdx%_sc.wordList.length];
  _sc.word=w;_sc.shuffled=ET.rng.shuffle(w.split(''));_sc.selected=[];_sc.wIdx++;etScRender();
}
function etScRender(){
  const a=ET.el('game-area');if(!a)return;
  a.innerHTML=`<div class="et-card"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px"><div style="font-weight:700;color:var(--accent)">🔤 Word Scramble</div><span class="et-badge et-badge-yellow">Skor: ${_sc.score}</span></div>
<div style="font-size:12px;color:var(--text3);margin-bottom:14px">Susun huruf-huruf berikut menjadi kata yang benar:</div>
<div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin:16px 0" id="sc-ans">${_sc.selected.map((l,i)=>`<div class="et-answer-slot" onclick="etScRemove(${i})">${l}</div>`).join('')}${Array(_sc.word.length-_sc.selected.length).fill(0).map(()=>'<div class="et-answer-slot" style="opacity:.3">_</div>').join('')}</div>
<div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin:16px 0">${_sc.shuffled.map((l,i)=>`<div class="et-letter-tile ${_sc.selected.includes(i+'')?'used':''}" onclick="etScSel(${i},'${l}')">${l.toUpperCase()}</div>`).join('')}</div>
<div id="sc-fb" style="min-height:40px"></div>
<div style="display:flex;gap:8px;margin-top:10px"><button class="et-btn et-btn-ghost et-btn-sm" onclick="_sc.selected=[];etScRender()">🗑 Clear</button><button class="et-btn et-btn-ghost et-btn-sm" onclick="etScHint()">💡 Hint</button><button class="et-btn et-btn-ghost et-btn-sm" onclick="etScNext()">⏭ Skip</button></div></div>`;
}
function etScSel(idx,l){
  if(_sc.selected.includes(idx+''))return;_sc.selected.push(idx+'');
  if(_sc.selected.length===_sc.word.length){
    const formed=_sc.selected.map(i=>_sc.shuffled[parseInt(i)]).join('');etScRender();
    const fb=ET.el('sc-fb');
    if(formed.toLowerCase()===_sc.word){if(fb)fb.innerHTML=`<div class="et-feedback et-fb-ok">✅ Benar! +10 XP</div>`;_sc.score++;etAddXP(10,'Game');setTimeout(()=>etScNext(),1500);}
    else{if(fb)fb.innerHTML=`<div class="et-feedback et-fb-bad">❌ "${formed}" tidak tepat. Coba lagi!</div>`;setTimeout(()=>{_sc.selected=[];etScRender();},1500);}
  }else etScRender();
}
function etScRemove(i){_sc.selected.splice(i,1);etScRender();}
function etScHint(){const fb=ET.el('sc-fb');if(fb)fb.innerHTML=`<div class="et-feedback et-fb-info">💡 Huruf pertama: <strong>${_sc.word[0].toUpperCase()}</strong> · ${_sc.word.length} huruf</div>`;}

// Fill in the Blank
const FILL_S=[
  {s:'She ___ to work every day by bus.',ans:'goes',hint:'Present simple He/She/It'},
  {s:'I ___ just finished my homework.',ans:'have',hint:'Present perfect'},
  {s:'If it rains, I ___ stay home.',ans:'will',hint:'Conditional Type 1'},
  {s:'The report ___ written by the manager.',ans:'was',hint:'Passive voice, past'},
  {s:'You ___ exercise regularly for good health.',ans:'should',hint:'Modal — advice'},
  {s:'She said she ___ tired.',ans:'was',hint:'Reported speech'},
  {s:'___ you help me with this task?',ans:'Can',hint:'Modal — ability'},
  {s:'I have not ___ the movie yet.',ans:'watched',hint:'Present perfect + V3'},
  {s:'Water ___ at 100 degrees Celsius.',ans:'boils',hint:'Present simple — fact'},
  {s:'They ___ dinner when he called.',ans:'were having',hint:'Past continuous'},
];
let _fi={idx:0,score:0,ans:false,ss:[]};
function etGFill(){_fi.ss=ET.rng.shuffle([...FILL_S]);_fi.idx=0;_fi.score=0;etFiRender();}
function etFiRender(){
  const a=ET.el('game-area');if(!a)return;
  if(_fi.idx>=_fi.ss.length){a.innerHTML=`<div class="et-card" style="text-align:center;padding:40px"><div style="font-size:3rem">🎉</div><div style="font-size:1.3rem;font-weight:700;color:var(--accent);margin:10px 0">Selesai! ${_fi.score}/${_fi.ss.length}</div><button class="et-btn et-btn-primary" onclick="etGFill()">🔄 Ulang</button></div>`;return;}
  const s=_fi.ss[_fi.idx];_fi.ans=false;
  a.innerHTML=`<div class="et-card"><div style="display:flex;justify-content:space-between;margin-bottom:14px"><div style="font-weight:700;color:var(--accent)">📝 Fill in the Blank</div><span class="et-badge et-badge-purple">${_fi.idx+1}/${_fi.ss.length} · ${_fi.score} benar</span></div>
<div style="font-size:1rem;font-weight:600;color:var(--text);margin-bottom:6px;font-family:monospace">${s.s}</div>
<div style="font-size:11px;color:var(--text3);margin-bottom:14px">💡 ${s.hint}</div>
<div style="display:flex;gap:8px"><input id="fi-in" class="et-input" placeholder="Isi ___..." autocomplete="off" spellcheck="false" onkeydown="if(event.key==='Enter')etFiCheck()"><button class="et-btn et-btn-primary" onclick="etFiCheck()">Cek ✓</button></div>
<div id="fi-fb" style="min-height:40px;margin-top:10px"></div>
<button class="et-btn et-btn-ghost et-btn-sm" style="margin-top:8px" onclick="_fi.idx++;etFiRender()">⏭ Lewati</button></div>`;
  setTimeout(()=>{const i=ET.el('fi-in');if(i)i.focus();},80);
}
function etFiCheck(){
  if(_fi.ans)return;const inp=ET.el('fi-in');if(!inp)return;
  const u=inp.value.trim().toLowerCase();const c=_fi.ss[_fi.idx].ans.toLowerCase();
  _fi.ans=true;const ok=u===c;if(ok){_fi.score++;etAddXP(12,'Game');}
  const fb=ET.el('fi-fb');if(fb)fb.innerHTML=`<div class="et-feedback ${ok?'et-fb-ok':'et-fb-bad'}">${ok?'✅ Benar!':'❌ Jawaban: <strong>'+c+'</strong>'}</div>`;
  if(inp)inp.disabled=true;setTimeout(()=>{_fi.idx++;etFiRender();},1800);
}

// Typing Blitz
const BL_WORDS=['apple','book','computer','developer','english','framework','grammar','hello','internet','javascript','keyboard','language','morning','notebook','office','python','quickly','running','software','technology','university','vocabulary','website','excellent','programming'];
let _bl={active:false,score:0,timer:null,timeLeft:60,wIdx:0,words:[]};
function etGBlitz(){
  _bl.active=false;_bl.score=0;_bl.timeLeft=60;_bl.words=ET.rng.shuffle([...BL_WORDS]);_bl.wIdx=0;
  const a=ET.el('game-area');if(!a)return;
  a.innerHTML=`<div class="et-card"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px"><div style="font-weight:700;color:var(--accent)">⚡ Typing Blitz</div><div style="display:flex;gap:10px"><span class="et-badge et-badge-yellow">Skor: <span id="bl-s">0</span></span><div class="et-timer" id="bl-t">60</div></div></div><div style="font-size:2.5rem;font-weight:800;text-align:center;color:var(--text);margin:20px 0;font-family:monospace" id="bl-w">${_bl.words[0]}</div><input id="bl-in" class="et-input" placeholder="Ketik kata di atas..." autocomplete="off" autocorrect="off" spellcheck="false" oninput="etBlCheck(event)" onfocus="etBlStart()" style="text-align:center;font-size:1.1rem"><div id="bl-fb" style="text-align:center;min-height:28px;margin-top:10px;font-size:13px;color:var(--text3)">Klik input untuk mulai!</div></div>`;
  setTimeout(()=>{const i=ET.el('bl-in');if(i)i.focus();},100);
}
function etBlStart(){
  if(_bl.active)return;_bl.active=true;
  _bl.timer=setInterval(()=>{
    _bl.timeLeft--;const t=ET.el('bl-t');if(t){t.textContent=_bl.timeLeft;t.classList.toggle('danger',_bl.timeLeft<=10);}
    if(_bl.timeLeft<=0){
      clearInterval(_bl.timer);_bl.active=false;
      const a=ET.el('game-area');if(a)a.innerHTML=`<div class="et-card" style="text-align:center;padding:40px"><div style="font-size:3rem">⚡</div><div style="font-size:1.5rem;font-weight:800;color:var(--accent);margin:8px 0">${_bl.score} kata!</div><div style="font-size:13px;color:var(--text3);margin-bottom:16px">+${_bl.score*2} XP diperoleh</div><button class="et-btn et-btn-primary" onclick="etGBlitz()">🔄 Main Lagi</button></div>`;
      etAddXP(_bl.score*2,'Game');
    }
  },1000);
}
function etBlCheck(e){
  const inp=e.target;const w=_bl.words[_bl.wIdx%_bl.words.length];
  if(inp.value.trim().toLowerCase()===w.toLowerCase()){
    _bl.score++;_bl.wIdx++;inp.value='';
    const s=ET.el('bl-s');if(s)s.textContent=_bl.score;
    const wEl=ET.el('bl-w');if(wEl)wEl.textContent=_bl.words[_bl.wIdx%_bl.words.length];
    const fb=ET.el('bl-fb');if(fb){fb.textContent='✅ Benar!';fb.style.color='#5de0a0';setTimeout(()=>{if(fb){fb.textContent='';fb.style.color='';}},400);}
  }
}

// Word Match
function etGMatch(){
  const pool=ET.rng.shuffle(ET_VOCAB.A1).slice(0,5);
  const lefts=pool.map(w=>w.en);const rights=ET.rng.shuffle(pool.map(w=>w.id));
  let selL=null,selR=null,matched=[],score=0;
  function render(){
    const a=ET.el('game-area');if(!a)return;
    a.innerHTML=`<div class="et-card"><div style="display:flex;justify-content:space-between;margin-bottom:16px"><div style="font-weight:700;color:var(--accent)">🔗 Word Match</div><span class="et-badge et-badge-yellow">Cocok: <span id="wm-s">0</span>/${pool.length}</span></div>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
  <div>${lefts.map((w,i)=>`<button id="wml${i}" class="et-mcq-btn" style="margin-bottom:8px;${matched.includes(i)?'opacity:.25;pointer-events:none':''}" onclick="etWML(${i},${JSON.stringify(w)})">${w}</button>`).join('')}</div>
  <div>${rights.map((w,i)=>`<button id="wmr${i}" class="et-mcq-btn" style="margin-bottom:8px;${matched.some(m=>pool[m]&&rights[i]===pool[m].id)?'opacity:.25;pointer-events:none':''}" onclick="etWMR(${i},${JSON.stringify(w)})">${w}</button>`).join('')}</div>
</div><div id="wm-fb" style="min-height:30px;margin-top:10px"></div></div>`;
  }
  window.etWML=(i,w)=>{
    document.querySelectorAll('[id^="wml"]').forEach(b=>b.style.borderColor='');
    selL={i,w};const b=ET.el('wml'+i);if(b)b.style.borderColor='var(--accent)';check();
  };
  window.etWMR=(i,w)=>{
    document.querySelectorAll('[id^="wmr"]').forEach(b=>b.style.borderColor='');
    selR={i,w};const b=ET.el('wmr'+i);if(b)b.style.borderColor='#5de0c5';check();
  };
  function check(){
    if(!selL||!selR)return;
    const pair=pool.find(p=>p.en===selL.w&&p.id===selR.w);const fb=ET.el('wm-fb');
    if(pair){
      if(fb)fb.innerHTML=`<div class="et-feedback et-fb-ok" style="padding:8px 12px">✅ Match! ${selL.w} = ${selR.w}</div>`;
      matched.push(pool.indexOf(pair));score++;const s=ET.el('wm-s');if(s)s.textContent=score;
      etAddXP(15,'Game');selL=null;selR=null;
      setTimeout(()=>{if(score>=pool.length){const a=ET.el('game-area');if(a)a.innerHTML=`<div class="et-card" style="text-align:center;padding:40px"><div style="font-size:3rem">🎉</div><div style="font-size:1.3rem;font-weight:700;color:var(--accent);margin:10px 0">Semua cocok! +${pool.length*15} XP</div><button class="et-btn et-btn-primary" onclick="etGMatch()">🔄 Main Lagi</button></div>`;}else render();},700);
    }else{
      if(fb)fb.innerHTML=`<div class="et-feedback et-fb-bad" style="padding:8px 12px">❌ Tidak cocok. Coba lagi!</div>`;
      setTimeout(()=>{selL=null;selR=null;render();},800);
    }
  }
  render();
}
// ── DAILY CHALLENGE ──────────────────────────────────────────────
function etCheckDaily(){
  const today=ET.today();
  if(etState.lastDay!==today){
    const y=new Date(Date.now()-86400000).toDateString();
    etState.streak=etState.lastDay===y?etState.streak+1:1;
    etState.lastDay=today;etState.dailyProgress=0;etState.dailyDone=false;
  }
  etState.dailyProgress++;
  if(etState.dailyProgress>=etState.dailyGoal&&!etState.dailyDone){
    etState.dailyDone=true;etAddXP(100,'Daily Challenge');
    const el=document.createElement('div');
    el.style.cssText='position:fixed;top:70px;right:20px;background:linear-gradient(135deg,#f7b96a,#f76a6a);color:#fff;padding:14px 20px;border-radius:16px;font-size:14px;font-weight:700;z-index:99999;box-shadow:0 8px 32px rgba(247,185,106,.5);animation:etSlideIn .4s ease';
    el.innerHTML='🎯 Daily Challenge Complete!<br><span style="font-size:12px;opacity:.9">Tantangan hari ini selesai! +100 XP</span>';
    document.body.appendChild(el);setTimeout(()=>el.remove(),4000);
  }
  ET.save('state',{xp:etState.xp,streak:etState.streak,lastDay:etState.lastDay,totalAnswered:etState.totalAnswered,totalCorrect:etState.totalCorrect,achievements:etState.achievements,dailyProgress:etState.dailyProgress,dailyDone:etState.dailyDone});
}
function etRenderDaily(){
  const today=ET.today();if(etState.lastDay!==today){etState.dailyProgress=0;etState.dailyDone=false;}
  const pct=Math.min(Math.round(etState.dailyProgress/etState.dailyGoal*100),100);
  ET.el('et-sc').innerHTML=`
<div class="et-section-title">🎯 Daily Challenge</div>
<div class="et-section-sub">Selesaikan tantangan harian untuk bonus XP dan menjaga streak!</div>
<div class="et-card" style="background:linear-gradient(135deg,rgba(247,185,106,.08),rgba(93,224,160,.04));border-color:rgba(247,185,106,.25);margin-bottom:16px">
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;flex-wrap:wrap;gap:10px">
    <div><div style="font-size:1.1rem;font-weight:800;color:#f7b96a">🔥 ${etState.streak} Day Streak</div><div style="font-size:12px;color:var(--text3)">${today}</div></div>
    <span class="et-badge et-badge-${etState.dailyDone?'green':'yellow'}" style="font-size:13px;padding:6px 14px">${etState.dailyDone?'✅ Selesai Hari Ini!':etState.dailyProgress+'/'+etState.dailyGoal+' soal'}</span>
  </div>
  <div class="et-xp-bar-bg"><div class="et-xp-bar-fill" style="width:${pct}%;background:linear-gradient(90deg,#f7b96a,#f76a6a)"></div></div>
  <div style="font-size:11px;color:var(--text3);text-align:right;margin-top:4px">${pct}% · Reward: +100 XP</div>
</div>
<div class="et-section-title">📋 Daily Tasks</div>
<div style="display:flex;flex-direction:column;gap:10px;margin-bottom:20px">
${[
  {icon:'📚',name:'Vocabulary',desc:'Jawab 3 soal vocab',done:etState.dailyProgress>=3,p:'vocab'},
  {icon:'📐',name:'Grammar',desc:'Jawab 2 soal grammar',done:etState.dailyProgress>=5,p:'grammar'},
  {icon:'🃏',name:'Flashcard',desc:'Review 3 flashcard',done:etState.dailyProgress>=7,p:'flashcard'},
  {icon:'🧠',name:'Quiz',desc:'Selesaikan 1 quiz session',done:etState.dailyDone,p:'quiz'},
].map(t=>`<div class="et-card" style="display:flex;align-items:center;gap:14px;padding:14px 18px;${t.done?'border-color:rgba(93,224,160,.3);background:rgba(93,224,160,.04)':''}"><div style="font-size:1.8rem">${t.icon}</div><div style="flex:1"><div style="font-weight:700;color:${t.done?'#5de0a0':'var(--text)'};">${t.name} ${t.done?'✅':''}</div><div style="font-size:12px;color:var(--text3)">${t.desc}</div></div>${!t.done?`<button class="et-btn et-btn-primary et-btn-sm" onclick="etNav('${t.p}')">Mulai →</button>`:'<span style="font-size:1.2rem">✅</span>'}</div>`).join('')}
</div>
<div class="et-section-title">📅 Streak Calendar</div>
<div class="et-card">
  <div class="et-streak-cal">${Array(30).fill(0).map((_,i)=>{const d=new Date(Date.now()-(29-i)*86400000).toDateString();return`<div class="et-streak-day ${d===today&&etState.dailyDone?'active':''}" title="${d}"></div>`;}).join('')}</div>
  <div style="font-size:11px;color:var(--text3);margin-top:8px">🟣 = Hari belajar</div>
</div>`;
}

// ── BUSINESS ENGLISH ─────────────────────────────────────────────
function etRenderBiz(){
  ET.el('et-sc').innerHTML=`
<div class="et-section-title">💼 Business English</div>
<div class="et-section-sub">Email profesional, frasa meeting, kosakata bisnis, dan simulasi interview</div>
<div class="et-tabs">
  <button class="et-tab active" onclick="etBizTab(this,'email')">📧 Email Templates</button>
  <button class="et-tab" onclick="etBizTab(this,'phrases')">💬 Frasa Profesional</button>
  <button class="et-tab" onclick="etBizTab(this,'vocab')">📚 Business Vocab</button>
  <button class="et-tab" onclick="etBizTab(this,'interview')">🎤 Interview</button>
</div>
<div id="biz-c">${etBizEmail()}</div>`;
}
function etBizTab(btn,tab){
  document.querySelectorAll('.et-tabs .et-tab').forEach(t=>t.classList.remove('active'));btn.classList.add('active');
  const c=ET.el('biz-c');if(!c)return;
  if(tab==='email')c.innerHTML=etBizEmail();
  else if(tab==='phrases')c.innerHTML=etBizPhrases();
  else if(tab==='vocab')c.innerHTML=etBizVocab();
  else if(tab==='interview')c.innerHTML=etBizInterview();
}
function etBizEmail(){
  const em=[
    {title:'Meeting Request',body:'Subject: Meeting Request — Project Review\n\nDear Mr./Ms. [Name],\n\nI hope this email finds you well. I would like to schedule a meeting to discuss the progress of our project.\n\nWould you be available on Thursday at 2:00 PM? The meeting should take approximately 45 minutes.\n\nPlease let me know if this time works for you.\n\nBest regards,\n[Your Name]'},
    {title:'Follow-up Email',body:'Subject: Follow-up: Our Meeting on [Date]\n\nDear [Name],\n\nThank you for taking the time to meet with me. As discussed, I will complete [action item] by [date].\n\nPlease do not hesitate to reach out if you have any questions.\n\nBest regards,\n[Your Name]'},
    {title:'Apology Email',body:'Subject: Apology for [Issue]\n\nDear [Name],\n\nI sincerely apologize for the inconvenience caused by [specific issue].\n\nTo resolve this, I have already [action taken]. We are committed to ensuring this does not happen again.\n\nThank you for your patience.\n\nSincerely,\n[Your Name]'},
    {title:'Job Application',body:'Subject: Application for [Position] — [Your Name]\n\nDear Hiring Manager,\n\nI am writing to express my interest in the [Position] role at [Company]. With [X] years of experience in [field], I am confident I would be a valuable addition to your team.\n\nI have attached my CV for your review. I would welcome the opportunity to discuss how my skills align with your needs.\n\nSincerely,\n[Your Name]'},
  ];
  return em.map(e=>`<div class="et-card" style="margin-bottom:12px"><div style="font-weight:700;color:var(--accent);margin-bottom:12px">📧 ${e.title}</div><pre style="font-family:monospace;font-size:12px;color:var(--text2);line-height:1.7;white-space:pre-wrap;background:var(--bg3);border-radius:8px;padding:14px">${e.body}</pre><button class="et-btn et-btn-ghost et-btn-sm" style="margin-top:8px" onclick="ET.speak(this.previousElementSibling.textContent)">🔊 Dengar</button></div>`).join('');
}
function etBizPhrases(){
  const ps=[
    {en:"Let's circle back on this.",id:'Mari kita kembali bahas ini nanti.',ctx:'Meeting'},
    {en:"Let's take this offline.",id:'Mari bahas ini di luar rapat.',ctx:'Meeting'},
    {en:"Let's align on the next steps.",id:'Mari sepakati langkah selanjutnya.',ctx:'Meeting'},
    {en:"I'll loop you in.",id:'Saya akan ikutsertakan kamu.',ctx:'Email'},
    {en:'Please advise.',id:'Mohon sarannya.',ctx:'Email'},
    {en:'I am reaching out regarding...',id:'Saya menghubungi berkaitan dengan...',ctx:'Email'},
    {en:'As per our agreement...',id:'Sesuai dengan kesepakatan kita...',ctx:'Email'},
    {en:'Moving forward...',id:'Ke depannya...',ctx:'General'},
    {en:'The bottom line is...',id:'Intinya adalah...',ctx:'General'},
    {en:'To put it in perspective...',id:'Untuk memberikan gambaran...',ctx:'Presentation'},
    {en:'We need to leverage our strengths.',id:'Kita perlu memanfaatkan kekuatan kita.',ctx:'Strategy'},
    {en:'I would like to table that.',id:'Saya ingin menunda itu untuk saat ini.',ctx:'Meeting'},
  ];
  const ctx=[...new Set(ps.map(p=>p.ctx))];
  return ctx.map(c=>`<div class="et-card" style="margin-bottom:12px"><div style="font-weight:700;color:var(--accent);margin-bottom:12px">📌 ${c}</div>${ps.filter(p=>p.ctx===c).map(p=>`<div style="border-bottom:1px solid var(--border);padding:10px 0;display:flex;justify-content:space-between;align-items:flex-start;gap:10px"><div><div style="font-size:13px;font-weight:600;color:var(--text)">"${p.en}"</div><div style="font-size:12px;color:var(--text3);margin-top:2px">${p.id}</div></div><button class="et-btn et-btn-ghost et-btn-sm" onclick="ET.speak(${JSON.stringify(p.en)})">🔊</button></div>`).join('')}</div>`).join('');
}
function etBizVocab(){
  const bw=ET_VOCAB.Business||[];
  return`<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:10px">${bw.map(w=>`<div class="et-card" style="padding:14px"><div style="font-size:13px;font-weight:700;color:var(--text)">${w.en}</div><div style="font-size:12px;color:var(--text3);margin-top:2px">${w.id}</div><div style="font-size:11px;color:#5de0c5;margin-top:6px;line-height:1.4">"${w.ex}"</div><button class="et-btn et-btn-ghost et-btn-sm" style="margin-top:8px" onclick="ET.speak(${JSON.stringify(w.en)})">🔊</button></div>`).join('')}</div>`;
}
function etBizInterview(){
  const qa=[
    {q:'Tell me about yourself.',a:'I am a [position] with [X] years of experience in [field]. I have [key achievement] and I am particularly skilled in [skill]. I am excited about this opportunity because [reason].'},
    {q:'What are your strengths?',a:'One of my key strengths is [strength]. For example, in my previous role I [specific achievement]. This has consistently helped me [positive outcome].'},
    {q:'What is your greatest weakness?',a:'I tend to [weakness], however, I have been actively working on this by [solution]. I have seen significant improvement since [timeframe].'},
    {q:'Where do you see yourself in 5 years?',a:'In 5 years, I hope to have grown into a [senior/leadership role] where I can [contribute value]. I see this position as an excellent foundation for that journey.'},
    {q:'Why do you want to work here?',a:'I admire [company] for [specific reason]. Your [product/culture/mission] particularly resonates with me. I believe my skills in [skill] would be a strong contribution to your team.'},
    {q:'Do you have any questions?',a:'Yes! Could you tell me more about the team culture and how success is measured in this role? Also, what does the typical career trajectory look like for someone in this position?'},
  ];
  return`<div style="display:flex;flex-direction:column;gap:12px">${qa.map(item=>`<div class="et-card" style="padding:16px"><div style="font-size:13px;font-weight:700;color:var(--accent);margin-bottom:10px">❓ ${item.q}</div><div style="font-size:13px;color:var(--text2);line-height:1.7;border-left:3px solid var(--accent);padding-left:12px">${item.a}</div><button class="et-btn et-btn-ghost et-btn-sm" style="margin-top:10px" onclick="ET.speak(this.previousElementSibling.textContent)">🔊 Dengar</button></div>`).join('')}</div>`;
}

// ── TOEFL / IELTS ────────────────────────────────────────────────
let _toefl={idx:0,score:0,answered:[]};
function etRenderTOEFL(){
  ET.el('et-sc').innerHTML=`
<div class="et-section-title">🎓 TOEFL / IELTS Practice</div>
<div class="et-section-sub">Soal standar akademik: Reading, Vocabulary, Grammar</div>
<div style="display:flex;gap:10px;margin-bottom:20px;align-items:center">
  <span class="et-badge et-badge-purple">Soal ${_toefl.idx+1}/${ET_TOEFL.length}</span>
  <span class="et-badge et-badge-green">✅ Benar: ${_toefl.score}</span>
  <button class="et-btn et-btn-ghost et-btn-sm" onclick="etToeflReset()">🔄 Reset</button>
</div>
<div id="toefl-area">${etToeflQ()}</div>`;
}
function etToeflReset(){_toefl.idx=0;_toefl.score=0;_toefl.answered=[];etRenderTOEFL();}
function etToeflQ(){
  if(_toefl.idx>=ET_TOEFL.length){
    const pct=Math.round(_toefl.score/ET_TOEFL.length*100);
    return`<div class="et-card" style="text-align:center;padding:40px"><div style="font-size:3rem">🎓</div><div style="font-size:1.5rem;font-weight:800;color:var(--accent);margin:10px 0">Score: ${_toefl.score}/${ET_TOEFL.length} (${pct}%)</div><div style="font-size:13px;color:var(--text3);margin-bottom:16px">Estimasi TOEFL: ${pct>=75?'550-600+':pct>=50?'450-550':'350-450'}</div><button class="et-btn et-btn-primary" onclick="etToeflReset()">🔄 Coba Lagi</button></div>`;
  }
  const q=ET_TOEFL[_toefl.idx];
  return`<div class="et-card"><div style="display:flex;gap:8px;align-items:center;margin-bottom:14px"><span class="et-badge et-badge-${q.type==='RC'?'blue':q.type==='Vocab'?'purple':'yellow'}">${q.type==='RC'?'📖 Reading':q.type==='Vocab'?'📚 Vocabulary':'📐 Grammar'}</span><span class="et-badge et-badge-${q.level==='B2'?'yellow':'red'}">${q.level}</span></div>${q.passage?`<div class="et-reading-text" style="font-size:13px;margin-bottom:16px">${q.passage}</div>`:''}<div style="font-size:13px;font-weight:600;color:var(--text);margin-bottom:16px;line-height:1.5">${q.q}</div><div class="et-mcq-grid">${q.opts.map((o,i)=>`<button class="et-mcq-btn" onclick="etToeflCheck(this,${JSON.stringify(o)},${JSON.stringify(q.ans)},${JSON.stringify(q.ex||'')})"><span class="et-mcq-idx">${['A','B','C','D'][i]}</span><span>${o}</span></button>`).join('')}</div><div id="toefl-fb"></div></div>`;
}
function etToeflCheck(btn,sel,correct,ex){
  if(_toefl.answered.includes(_toefl.idx))return;_toefl.answered.push(_toefl.idx);
  document.querySelectorAll('#toefl-area .et-mcq-btn').forEach(b=>b.disabled=true);
  const ok=sel===correct;btn.classList.add(ok?'correct':'wrong');
  if(!ok)document.querySelectorAll('#toefl-area .et-mcq-btn').forEach(b=>{if(b.querySelector('span:last-child')?.textContent===correct)b.classList.add('correct');});
  if(ok){_toefl.score++;etAddXP(25,'TOEFL');etCheckDaily();}
  const fb=ET.el('toefl-fb');if(fb)fb.innerHTML=`<div class="et-feedback ${ok?'et-fb-ok':'et-fb-bad'}">${ok?'✅ Benar! +25 XP':'❌ Jawaban: <strong>'+correct+'</strong>'}<br><span style="font-size:12px;font-weight:400">📖 ${ex}</span></div>`;
  setTimeout(()=>{_toefl.idx++;const a=ET.el('toefl-area');if(a)a.innerHTML=etToeflQ();},2500);
}

// ── ACHIEVEMENTS ─────────────────────────────────────────────────
function etRenderAch(){
  const acc=etState.totalAnswered>0?Math.round(etState.totalCorrect/etState.totalAnswered*100):0;
  ET.el('et-sc').innerHTML=`
<div class="et-section-title">🏆 Achievements</div>
<div class="et-section-sub">Kumpulkan semua achievement dengan terus belajar!</div>
<div class="et-card" style="margin-bottom:20px">
  <div style="display:flex;gap:20px;flex-wrap:wrap;justify-content:center">
    <div style="text-align:center"><div style="font-size:2rem;font-weight:800;color:var(--accent)">${etState.xp}</div><div style="font-size:11px;color:var(--text3)">Total XP</div></div>
    <div style="text-align:center"><div style="font-size:2rem;font-weight:800;color:#5de0a0">${etState.streak}</div><div style="font-size:11px;color:var(--text3)">Day Streak</div></div>
    <div style="text-align:center"><div style="font-size:2rem;font-weight:800;color:#f7b96a">${etState.totalAnswered}</div><div style="font-size:11px;color:var(--text3)">Dijawab</div></div>
    <div style="text-align:center"><div style="font-size:2rem;font-weight:800;color:#f76a6a">${acc}%</div><div style="font-size:11px;color:var(--text3)">Akurasi</div></div>
    <div style="text-align:center"><div style="font-size:2rem;font-weight:800;color:var(--accent)">${etState.achievements.length}/${ET_ACH.length}</div><div style="font-size:11px;color:var(--text3)">Achievements</div></div>
  </div>
</div>
<div class="et-ach-grid">
${ET_ACH.map(a=>`<div class="et-ach-item ${etState.achievements.includes(a.id)?'unlocked':''}"><div class="et-ach-icon">${a.icon}</div><div class="et-ach-name">${a.name}</div><div class="et-ach-desc">${a.desc}</div>${etState.achievements.includes(a.id)?'<div style="font-size:10px;color:#5de0a0;margin-top:6px">✅ Unlocked</div>':''}</div>`).join('')}
</div>`;
}

// ── CUSTOM WORDS ─────────────────────────────────────────────────
function etRenderCustom(){
  ET.el('et-sc').innerHTML=`
<div class="et-section-title">➕ Kata Custom</div>
<div class="et-section-sub">Tambahkan kata atau frasa yang ingin kamu pelajari sendiri</div>
<div class="et-card" style="margin-bottom:16px">
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px">
    <div><label style="font-size:11px;color:var(--text3);display:block;margin-bottom:4px">Bahasa Inggris *</label><input id="cw-en" class="et-input" placeholder="Contoh: Perseverance"></div>
    <div><label style="font-size:11px;color:var(--text3);display:block;margin-bottom:4px">Arti Indonesia *</label><input id="cw-id" class="et-input" placeholder="Contoh: Ketekunan"></div>
    <div><label style="font-size:11px;color:var(--text3);display:block;margin-bottom:4px">Kategori</label><input id="cw-cat" class="et-input" placeholder="Contoh: Kata Sifat"></div>
    <div><label style="font-size:11px;color:var(--text3);display:block;margin-bottom:4px">Contoh Kalimat</label><input id="cw-ex" class="et-input" placeholder="Contoh: Perseverance is key."></div>
  </div>
  <div style="display:flex;gap:8px;align-items:center">
    <button class="et-btn et-btn-primary" onclick="etCwSave()">💾 Simpan Kata</button>
    <div id="cw-msg" style="font-size:13px;color:#5de0a0"></div>
  </div>
</div>
<div class="et-section-title" style="font-size:14px">📋 Kata yang ditambahkan (<span id="cw-cnt">${etState.customWords.length}</span>)</div>
<div id="cw-list"></div>`;
  etCwRender();
}
function etCwSave(){
  const en=ET.el('cw-en')?.value.trim();const id=ET.el('cw-id')?.value.trim();
  if(!en||!id){alert('Isi kata English dan artinya!');return;}
  const all=[...Object.values(ET_VOCAB).flat(),...etState.customWords];
  if(all.some(w=>w.en.toLowerCase()===en.toLowerCase())){alert(`"${en}" sudah ada!`);return;}
  etState.customWords.push({en,id,cat:ET.el('cw-cat')?.value.trim()||'Custom',ex:ET.el('cw-ex')?.value.trim()||''});
  ET.save('customWords',etState.customWords);
  ['cw-en','cw-id','cw-cat','cw-ex'].forEach(i=>{const el=ET.el(i);if(el)el.value='';});
  const msg=ET.el('cw-msg');if(msg){msg.textContent=`✅ "${en}" ditambahkan!`;setTimeout(()=>msg.textContent='',3000);}
  etCwRender();
}
function etCwDelete(i){etState.customWords.splice(i,1);ET.save('customWords',etState.customWords);etCwRender();}
function etCwRender(){
  const list=ET.el('cw-list');const cnt=ET.el('cw-cnt');if(cnt)cnt.textContent=etState.customWords.length;
  if(!list)return;
  if(!etState.customWords.length){list.innerHTML='<div style="color:var(--text3);font-size:13px;text-align:center;padding:16px">Belum ada kata custom. Tambahkan kata favoritmu!</div>';return;}
  list.innerHTML=etState.customWords.map((w,i)=>`<div class="et-cw-item"><div><span style="color:#60a5fa;font-weight:600">${w.en}</span><span style="margin:0 8px;color:var(--text3)">→</span><span style="color:var(--text)">${w.id}</span><span style="color:var(--text3);font-size:11px;margin-left:6px">[${w.cat}]</span></div><button onclick="etCwDelete(${i})" style="background:none;border:none;color:#f76a6a;cursor:pointer;font-size:14px;padding:2px 8px;border-radius:6px;transition:background .2s" onmouseover="this.style.background='rgba(247,106,106,.12)'" onmouseout="this.style.background='none'">✕</button></div>`).join('');
}

// ── LOAD STATE & INIT ─────────────────────────────────────────────
function etLoadState(){
  const s=ET.load('state',{});
  etState.xp=s.xp||0;etState.streak=s.streak||0;etState.lastDay=s.lastDay||null;
  etState.totalAnswered=s.totalAnswered||0;etState.totalCorrect=s.totalCorrect||0;
  etState.achievements=s.achievements||[];etState.dailyProgress=s.dailyProgress||0;
  etState.dailyDone=s.dailyDone||false;
  etState.customWords=ET.load('customWords',[]);
}

// ── MAIN INIT ─────────────────────────────────────────────────────
function enInitTrainer(){
  etLoadState();etInjectCSS();etRenderPage();
}

// Navigation hook — support calling from parent index.html
(function(){
  const orig=typeof navigate==='function'?navigate:null;
  if(orig){
    window.navigate=function(page){
      orig(page);
      if(page==='entrainer'){setTimeout(()=>{if(!ET.el('et-wrap'))enInitTrainer();},100);}
    };
  }
  window.addEventListener('load',()=>{
    if(document.getElementById('page-entrainer')?.classList.contains('active'))enInitTrainer();
  });
  document.addEventListener('DOMContentLoaded',()=>{
    document.querySelectorAll('[onclick*="entrainer"]').forEach(el=>{
      el.addEventListener('click',()=>setTimeout(()=>{if(!ET.el('et-wrap'))enInitTrainer();},150));
    });
  });
})();

// ── EXPOSE ALL FUNCTIONS TO GLOBAL SCOPE ─────────────────────────
// Required because onclick="etNav(...)" in HTML needs window-level access
// All functions are declared inside the namespace guard, so we export them here.
window.enInitTrainer = enInitTrainer;
window.etNav = etNav;
// Vocab
window.etVocLevel = etVocLevel;
window.etVocMode = etVocMode;
window.etVocCat = etVocCat;
window.etVocCheck = etVocCheck;
window.etVocMCQCheck = etVocMCQCheck;
window.etVocHint = etVocHint;
window.etVocSkip = etVocSkip;
window.etVocSpeak = etVocSpeak;
// Grammar
window.etGramTopic = etGramTopic;
window.etGramToggle = etGramToggle;
window.etGramReset = etGramReset;
window.etGramSkip = etGramSkip;
window.etGramCheck = etGramCheck;
// Flashcard
window.etFlLevel = etFlLevel;
window.etFlFlip = etFlFlip;
window.etFlMark = etFlMark;
window.etFlShuffle = etFlShuffle;
window.etFlSpeak = etFlSpeak;
// Pronunciation
window.etPronSpeak = etPronSpeak;
window.etPronNext = etPronNext;
window.etPronPrev = etPronPrev;
// Reading
window.etReadSet = etReadSet;
window.etReadReset = etReadReset;
window.etReadCheck = etReadCheck;
// Listening
window.etLisSet = etLisSet;
window.etLisSlow = etLisSlow;
window.etLisToggle = etLisToggle;
window.etLisCheck = etLisCheck;
// Writing
window.etWriteLoad = etWriteLoad;
window.etWriteCount = etWriteCount;
window.etWriteEval = etWriteEval;
// Conversation
window.etConvSel = etConvSel;
window.etConvSend = etConvSend;
// Quiz
window.etQzStart = etQzStart;
window.etQzCheck = etQzCheck;
// Games
window.etGScramble = etGScramble;
window.etScSel = etScSel;
window.etScRemove = etScRemove;
window.etScHint = etScHint;
window.etScNext = etScNext;
window.etGFill = etGFill;
window.etFiCheck = etFiCheck;
window.etGBlitz = etGBlitz;
window.etBlStart = etBlStart;
window.etBlCheck = etBlCheck;
window.etGMatch = etGMatch;
// Business
window.etBizTab = etBizTab;
// TOEFL
window.etToeflReset = etToeflReset;
window.etToeflCheck = etToeflCheck;
// Achievements
window.etCwSave = etCwSave;
window.etCwDelete = etCwDelete;

} // end namespace guard
