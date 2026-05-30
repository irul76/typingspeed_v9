// ================================================================
// PYTHON TYPING TRAINER — Complete Module
// Paste this entire script at the bottom of your HTML file,
// just BEFORE </body> — it replaces/extends the Python Trainer page.
// ================================================================
'use strict';

// ================================================================
// RANDOM UTILITIES
// ================================================================
const PyRng = {
  pick: (arr) => arr[Math.floor(Math.random() * arr.length)],
  range: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
  float: (min, max, dec = 1) => parseFloat((Math.random() * (max - min) + min).toFixed(dec)),
  shuffle: (arr) => [...arr].sort(() => Math.random() - 0.5),
  bool: () => Math.random() > 0.5,
  weighted: (choices) => {
    // choices = [{val, w}, ...]
    const total = choices.reduce((s, c) => s + c.w, 0);
    let r = Math.random() * total;
    for (const c of choices) { r -= c.w; if (r <= 0) return c.val; }
    return choices[choices.length - 1].val;
  },
};

// ================================================================
// NAME / VALUE BANKS
// ================================================================
const PyBank = {
  varNames:  ['count', 'total', 'score', 'value', 'result', 'data', 'name', 'age', 'price', 'item', 'number', 'amount', 'temp', 'index', 'size', 'limit', 'rate', 'level', 'flag', 'mode'],
  strVals:   ['hello', 'world', 'python', 'typing', 'code', 'learn', 'skill', 'data', 'open', 'close', 'user', 'admin', 'file', 'path', 'test'],
  funcNames: ['calculate', 'process', 'check', 'get_total', 'find_max', 'is_valid', 'convert', 'display', 'fetch', 'update', 'filter_data', 'sort_items', 'count_words', 'reverse_str', 'compute'],
  listNames: ['numbers', 'items', 'scores', 'names', 'values', 'words', 'fruits', 'colors', 'tasks', 'data'],
  dictNames: ['person', 'config', 'record', 'info', 'profile', 'settings', 'stats', 'entry', 'payload', 'meta'],
  classNames:['Animal', 'Person', 'Vehicle', 'Shape', 'Product', 'Account', 'Node', 'Task', 'Item', 'Player'],
  fruits:    ['apple', 'banana', 'cherry', 'mango', 'orange', 'grape', 'kiwi', 'melon'],
  colors:    ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'white'],
  mathOps:   ['+', '-', '*'],
  compOps:   ['>', '<', '>=', '<=', '==', '!='],
  logicOps:  ['and', 'or'],
  modules:   ['math', 'random', 'os', 'sys', 'datetime', 'json', 're'],
  exceptions:['ValueError', 'TypeError', 'ZeroDivisionError', 'IndexError', 'KeyError', 'FileNotFoundError'],

  v: () => PyRng.pick(PyBank.varNames),
  f: () => PyRng.pick(PyBank.funcNames),
  n: () => PyRng.range(1, 20),
  s: () => PyRng.pick(PyBank.strVals),
  lst: () => PyRng.pick(PyBank.listNames),
  dct: () => PyRng.pick(PyBank.dictNames),
  cls: () => PyRng.pick(PyBank.classNames),
  op: () => PyRng.pick(PyBank.mathOps),
  cmp: () => PyRng.pick(PyBank.compOps),
  exc: () => PyRng.pick(PyBank.exceptions),
};

// ================================================================
// ANTI-REPETITION SYSTEM
// ================================================================
const RecentCache = {
  history: [],
  maxSize: 8,
  add(code) {
    this.history.push(code.slice(0, 60));
    if (this.history.length > this.maxSize) this.history.shift();
  },
  isDuplicate(code) {
    const snippet = code.slice(0, 60);
    return this.history.some(h => h === snippet);
  },
};

// ================================================================
// LEVEL DEFINITIONS
// ================================================================
const PY_LEVELS = [
  { id: 1, name: 'Basic',         label: 'Level 1 — Basic',          diff: 'easy',   color: '#5de0a0', topics: ['print', 'variable', 'input', 'string', 'number'] },
  { id: 2, name: 'Conditional',   label: 'Level 2 — Conditional',    diff: 'easy',   color: '#60a5fa', topics: ['if', 'elif', 'else', 'comparison', 'operator'] },
  { id: 3, name: 'Loop',          label: 'Level 3 — Loop',           diff: 'easy',   color: '#a78bfa', topics: ['for', 'while', 'nested loop', 'enumerate', 'break'] },
  { id: 4, name: 'Function',      label: 'Level 4 — Function',       diff: 'medium', color: '#f7d96a', topics: ['def', 'parameter', 'return', 'default arg', 'scope'] },
  { id: 5, name: 'Data Struct',   label: 'Level 5 — Data Structures',diff: 'medium', color: '#f7b96a', topics: ['list', 'tuple', 'dict', 'set', 'comprehension'] },
  { id: 6, name: 'File & Error',  label: 'Level 6 — File & Error',   diff: 'medium', color: '#f76a6a', topics: ['try/except', 'open', 'read', 'write', 'raise'] },
  { id: 7, name: 'OOP',           label: 'Level 7 — OOP',            diff: 'hard',   color: '#c084fc', topics: ['class', 'method', '__init__', 'self', 'inheritance'] },
  { id: 8, name: 'Advanced',      label: 'Level 8 — Advanced',       diff: 'hard',   color: '#f472b6', topics: ['lambda', 'comprehension', 'json', 'async', 'decorator'] },
  { id: 9, name: 'Professional',  label: 'Level 9 — Professional',   diff: 'expert', color: '#e879f9', topics: ['recursion', 'algorithm', 'sorting', 'searching', 'OOP+'] },
];

// ================================================================
// QUESTION MODE DEFINITIONS
// ================================================================
const PY_MODES = {
  retype:   { id: 'retype',   label: 'Ketik Ulang Code',    icon: '⌨️', desc: 'Ketik ulang code Python di bawah ini dengan tepat.' },
  predict:  { id: 'predict',  label: 'Tebak Output',        icon: '🔮', desc: 'Prediksi output yang dihasilkan code ini.' },
  mcq:      { id: 'mcq',      label: 'Pilihan Ganda',       icon: '📋', desc: 'Pilih jawaban yang benar.' },
  arrange:  { id: 'arrange',  label: 'Susun Code',          icon: '🔀', desc: 'Susun potongan code dalam urutan yang benar.' },
  debug:    { id: 'debug',    label: 'Cari Bug',            icon: '🐛', desc: 'Temukan dan ketik baris yang salah.' },
  complete: { id: 'complete', label: 'Lengkapi Syntax',     icon: '✏️', desc: 'Lengkapi bagian yang kosong dengan syntax Python yang tepat.' },
};

// ================================================================
// CODE GENERATORS — per level
// ================================================================
const PY_GENERATORS = {

  // --- LEVEL 1: BASIC ---
  level1() {
    const generators = [
      () => {
        const v = PyBank.v(), val = PyRng.range(1, 100);
        return { code: `${v} = ${val}\nprint(${v})`, topic: 'Variable & Print', output: String(val), hint: 'Deklarasi variabel lalu print nilainya.' };
      },
      () => {
        const name = PyRng.pick(['Alice', 'Bob', 'Diana', 'Eko', 'Fira']);
        return { code: `name = "${name}"\nprint("Hello, " + name + "!")`, topic: 'String', output: `Hello, ${name}!`, hint: 'Gabungkan string dengan operator +.' };
      },
      () => {
        const a = PyRng.range(1, 9), b = PyRng.range(1, 9);
        return { code: `a = ${a}\nb = ${b}\nresult = a + b\nprint(result)`, topic: 'Arithmetic', output: String(a + b), hint: 'Penjumlahan dua variabel.' };
      },
      () => {
        const v = PyBank.v(), s = PyBank.s();
        return { code: `${v} = "${s}"\nprint(len(${v}))`, topic: 'String len()', output: String(s.length), hint: 'len() mengembalikan panjang string.' };
      },
      () => {
        const a = PyRng.range(2, 9), b = PyRng.range(2, 9);
        return { code: `x = ${a}\ny = ${b}\nprint(x * y)\nprint(x - y)`, topic: 'Multiple Print', output: `${a * b}\n${a - b}`, hint: 'Beberapa operasi aritmatika.' };
      },
      () => {
        const v = PyBank.v(), f = PyRng.float(1, 9);
        return { code: `${v} = ${f}\nprint(type(${v}))`, topic: 'Float & Type', output: `<class 'float'>`, hint: 'type() mengembalikan tipe data variabel.' };
      },
      () => {
        const msg = PyRng.pick(['Selamat datang!', 'Halo Python!', 'Belajar coding!', 'Ayo mulai!']);
        return { code: `print("${msg}")`, topic: 'Print String', output: msg, hint: 'print() mencetak teks ke layar.' };
      },
      () => {
        const a = PyRng.range(10, 50), b = PyRng.range(2, 9);
        return { code: `total = ${a}\ndiskon = ${b}\nharga = total - diskon\nprint(f"Harga: {harga}")`, topic: 'f-string', output: `Harga: ${a - b}`, hint: 'f-string menginterpolasi variabel di dalam {}.' };
      },
    ];
    return PyRng.pick(generators)();
  },

  // --- LEVEL 2: CONDITIONAL ---
  level2() {
    const generators = [
      () => {
        const n = PyRng.range(1, 20);
        const out = n % 2 === 0 ? 'Genap' : 'Ganjil';
        return { code: `n = ${n}\nif n % 2 == 0:\n    print("Genap")\nelse:\n    print("Ganjil")`, topic: 'If-Else', output: out, hint: 'Operator % menghitung sisa bagi.' };
      },
      () => {
        const score = PyRng.range(50, 100);
        const grade = score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : 'D';
        return {
          code: `score = ${score}\nif score >= 90:\n    print("A")\nelif score >= 80:\n    print("B")\nelif score >= 70:\n    print("C")\nelse:\n    print("D")`,
          topic: 'If-Elif-Else', output: grade, hint: 'elif = else if, cek kondisi berantai.' };
      },
      () => {
        const a = PyRng.range(1, 10), b = PyRng.range(1, 10);
        const bigger = a > b ? a : b;
        return { code: `a = ${a}\nb = ${b}\nif a > b:\n    print(a)\nelse:\n    print(b)`, topic: 'Comparison', output: String(bigger), hint: 'Bandingkan dua nilai dan cetak yang lebih besar.' };
      },
      () => {
        const age = PyRng.range(10, 25);
        const out = age >= 17 ? 'Boleh mengemudi' : 'Belum boleh';
        return { code: `age = ${age}\nif age >= 17:\n    print("Boleh mengemudi")\nelse:\n    print("Belum boleh")`, topic: 'Real-world If', output: out, hint: 'Kondisi nyata menggunakan if-else.' };
      },
      () => {
        const x = PyRng.range(1, 10), y = PyRng.range(1, 10);
        const out = (x > 5 && y > 5) ? 'Keduanya > 5' : 'Tidak keduanya';
        return { code: `x = ${x}\ny = ${y}\nif x > 5 and y > 5:\n    print("Keduanya > 5")\nelse:\n    print("Tidak keduanya")`, topic: 'Logical and', output: out, hint: 'and: kedua kondisi harus True.' };
      },
    ];
    return PyRng.pick(generators)();
  },

  // --- LEVEL 3: LOOP ---
  level3() {
    const generators = [
      () => {
        const n = PyRng.range(3, 7);
        const out = Array.from({ length: n }, (_, i) => i).join('\n');
        return { code: `for i in range(${n}):\n    print(i)`, topic: 'For Range', output: out, hint: 'range(n) menghasilkan 0 sampai n-1.' };
      },
      () => {
        const fruits = PyRng.shuffle(PyBank.fruits).slice(0, 3);
        const out = fruits.join('\n');
        return { code: `fruits = ${JSON.stringify(fruits)}\nfor fruit in fruits:\n    print(fruit)`, topic: 'For List', output: out, hint: 'Iterasi langsung elemen list.' };
      },
      () => {
        const n = PyRng.range(2, 5);
        const items = PyRng.shuffle(PyBank.fruits).slice(0, n);
        const out = items.map((item, i) => `${i}: ${item}`).join('\n');
        return { code: `items = ${JSON.stringify(items)}\nfor i, item in enumerate(items):\n    print(f"{i}: {item}")`, topic: 'Enumerate', output: out, hint: 'enumerate() memberikan index + nilai sekaligus.' };
      },
      () => {
        const start = PyRng.range(1, 5);
        const lines = [];
        let i = start;
        while (i < start + 4) { lines.push(String(i)); i++; }
        return { code: `i = ${start}\nwhile i < ${start + 4}:\n    print(i)\n    i += 1`, topic: 'While Loop', output: lines.join('\n'), hint: 'while terus berjalan selama kondisi True.' };
      },
      () => {
        const rows = PyRng.range(2, 4), cols = PyRng.range(2, 3);
        const lines = [];
        for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) lines.push(`${r},${c}`);
        return { code: `for r in range(${rows}):\n    for c in range(${cols}):\n        print(f"{r},{c}")`, topic: 'Nested Loop', output: lines.join('\n'), hint: 'Nested loop: loop di dalam loop.' };
      },
      () => {
        const n = PyRng.range(3, 8);
        const stop = PyRng.range(1, n - 1);
        const lines = [];
        for (let i = 0; i < n; i++) { if (i === stop) break; lines.push(String(i)); }
        return { code: `for i in range(${n}):\n    if i == ${stop}:\n        break\n    print(i)`, topic: 'Break', output: lines.join('\n'), hint: 'break menghentikan loop lebih awal.' };
      },
      () => {
        const n = PyRng.range(5, 10);
        const skip = PyRng.range(1, n - 1);
        const lines = [];
        for (let i = 0; i < n; i++) { if (i === skip) continue; lines.push(String(i)); }
        return { code: `for i in range(${n}):\n    if i == ${skip}:\n        continue\n    print(i)`, topic: 'Continue', output: lines.join('\n'), hint: 'continue melompati iterasi saat ini.' };
      },
    ];
    return PyRng.pick(generators)();
  },

  // --- LEVEL 4: FUNCTION ---
  level4() {
    const generators = [
      () => {
        const fn = PyBank.f(), a = PyRng.range(2, 9), b = PyRng.range(2, 9);
        const out = a + b;
        return { code: `def ${fn}(a, b):\n    return a + b\n\nresult = ${fn}(${a}, ${b})\nprint(result)`, topic: 'Function Return', output: String(out), hint: 'def mendefinisikan fungsi, return mengembalikan nilai.' };
      },
      () => {
        const fn = PyBank.f(), name = PyRng.pick(['Alice', 'Bob', 'Citra']);
        return { code: `def ${fn}(name="World"):\n    print(f"Hello, {name}!")\n\n${fn}("${name}")\n${fn}()`, topic: 'Default Param', output: `Hello, ${name}!\nHello, World!`, hint: 'Parameter dengan nilai default menggunakan =.' };
      },
      () => {
        const a = PyRng.range(2, 9), b = PyRng.range(2, 9);
        const fn = PyRng.pick(['multiply', 'compute', 'calc']);
        return { code: `def ${fn}(x, y):\n    product = x * y\n    return product\n\nprint(${fn}(${a}, ${b}))`, topic: 'Function Scope', output: String(a * b), hint: 'Variabel di dalam fungsi bersifat lokal.' };
      },
      () => {
        const fn = PyRng.pick(['is_even', 'is_positive', 'check_num']);
        const n = PyRng.range(1, 20);
        const out = n % 2 === 0 ? 'True' : 'False';
        return { code: `def ${fn}(n):\n    return n % 2 == 0\n\nprint(${fn}(${n}))`, topic: 'Return Boolean', output: out, hint: 'Fungsi bisa mengembalikan nilai boolean.' };
      },
      () => {
        const a = PyRng.range(2, 9), b = PyRng.range(2, 9), c = PyRng.range(2, 9);
        const sum = a + b + c;
        return { code: `def add(*args):\n    return sum(args)\n\nprint(add(${a}, ${b}, ${c}))`, topic: '*args', output: String(sum), hint: '*args menerima jumlah argumen tak terbatas.' };
      },
    ];
    return PyRng.pick(generators)();
  },

  // --- LEVEL 5: DATA STRUCTURES ---
  level5() {
    const generators = [
      () => {
        const items = PyRng.shuffle(PyBank.fruits).slice(0, 4);
        const idx = PyRng.range(0, items.length - 1);
        return { code: `fruits = ${JSON.stringify(items)}\nprint(fruits[${idx}])\nprint(len(fruits))`, topic: 'List Index', output: `${items[idx]}\n${items.length}`, hint: 'List di-index dari 0, len() mengembalikan panjang.' };
      },
      () => {
        const lst = PyBank.lst();
        const items = Array.from({ length: PyRng.range(3, 5) }, () => PyRng.range(1, 20));
        const out = [...items].sort((a, b) => a - b).join(', ');
        return { code: `${lst} = ${JSON.stringify(items)}\n${lst}.sort()\nprint(${lst})`, topic: 'List Sort', output: `[${out}]`, hint: '.sort() mengurutkan list secara in-place.' };
      },
      () => {
        const name = PyRng.pick(['Alice', 'Budi', 'Citra']);
        const age = PyRng.range(18, 35);
        const city = PyRng.pick(['Jakarta', 'Bandung', 'Surabaya', 'Bali']);
        return { code: `person = {\n    "name": "${name}",\n    "age": ${age},\n    "city": "${city}"\n}\nprint(person["name"])\nprint(person["age"])`, topic: 'Dictionary', output: `${name}\n${age}`, hint: 'Dictionary mengakses nilai via key string.' };
      },
      () => {
        const nums = Array.from({ length: 5 }, () => PyRng.range(1, 10));
        const out = nums.filter(n => n % 2 === 0).join(', ');
        return { code: `numbers = ${JSON.stringify(nums)}\nevens = [n for n in numbers if n % 2 == 0]\nprint(evens)`, topic: 'List Comprehension', output: `[${out}]`, hint: '[expr for var in list if cond] — filter + transform.' };
      },
      () => {
        const a = [PyRng.range(1,5), PyRng.range(1,5), PyRng.range(1,5)];
        const b = [PyRng.range(1,5), PyRng.range(1,5)];
        const union = [...new Set([...a, ...b])].sort((x,y)=>x-y).join(', ');
        return { code: `a = {${a.join(', ')}}\nb = {${b.join(', ')}}\nprint(a | b)`, topic: 'Set Union', output: `{${union}}`, hint: '| operator menggabungkan dua set (union).' };
      },
      () => {
        const t = [PyRng.range(1,9), PyRng.range(1,9), PyRng.range(1,9)];
        return { code: `coords = (${t.join(', ')})\nx, y, z = coords\nprint(f"x={x}, y={y}, z={z}")`, topic: 'Tuple Unpack', output: `x=${t[0]}, y=${t[1]}, z=${t[2]}`, hint: 'Tuple bisa di-unpack ke beberapa variabel.' };
      },
    ];
    return PyRng.pick(generators)();
  },

  // --- LEVEL 6: FILE & ERROR ---
  level6() {
    const generators = [
      () => {
        const exc = PyRng.pick(['ValueError', 'ZeroDivisionError', 'TypeError']);
        const val = exc === 'ZeroDivisionError' ? '1 / 0' : exc === 'ValueError' ? 'int("abc")' : '"a" + 1';
        const msg = { 'ValueError': 'Cannot convert', 'ZeroDivisionError': 'Cannot divide', 'TypeError': 'Type error' }[exc];
        return { code: `try:\n    result = ${val}\n    print(result)\nexcept ${exc}:\n    print("${msg}")`, topic: 'Try-Except', output: msg, hint: 'try-except menangkap error agar program tidak crash.' };
      },
      () => {
        return { code: `try:\n    x = int(input("Masukkan angka: "))\n    print(f"Kuadrat: {x**2}")\nexcept ValueError:\n    print("Bukan angka!")`, topic: 'Input Validation', output: '(bergantung input)', hint: 'Validasi input dengan try-except ValueError.' };
      },
      () => {
        return { code: `try:\n    with open("data.txt", "r") as f:\n        content = f.read()\n        print(content)\nexcept FileNotFoundError:\n    print("File tidak ditemukan")`, topic: 'File Read', output: 'File tidak ditemukan', hint: 'with open() otomatis menutup file setelah selesai.' };
      },
      () => {
        return { code: `try:\n    result = 10 / 0\nexcept ZeroDivisionError as e:\n    print(f"Error: {e}")\nfinally:\n    print("Selesai")`, topic: 'Finally', output: 'Error: division by zero\nSelesai', hint: 'finally selalu dieksekusi, bahkan jika ada error.' };
      },
      () => {
        const n = PyRng.range(-5, 5);
        const out = n < 0 ? 'Error: Negatif' : String(n);
        return { code: `def check(n):\n    if n < 0:\n        raise ValueError("Negatif")\n    return n\n\ntry:\n    print(check(${n}))\nexcept ValueError as e:\n    print(f"Error: {e}")`, topic: 'Raise Exception', output: out, hint: 'raise melempar exception secara manual.' };
      },
    ];
    return PyRng.pick(generators)();
  },

  // --- LEVEL 7: OOP ---
  level7() {
    const generators = [
      () => {
        const cls = PyBank.cls(), name = PyRng.pick(['Alice', 'Budi']), age = PyRng.range(18, 35);
        return {
          code: `class ${cls}:\n    def __init__(self, name, age):\n        self.name = name\n        self.age = age\n\n    def greet(self):\n        print(f"Hi, I'm {self.name}, {self.age} years old")\n\np = ${cls}("${name}", ${age})\np.greet()`,
          topic: 'Class & Method', output: `Hi, I'm ${name}, ${age} years old`, hint: '__init__ adalah constructor, self adalah referensi objek.' };
      },
      () => {
        const base = PyRng.pick(['Animal', 'Vehicle', 'Shape']);
        const child = PyRng.pick(['Dog', 'Car', 'Circle']);
        return {
          code: `class ${base}:\n    def speak(self):\n        return "..."\n\nclass ${child}(${base}):\n    def speak(self):\n        return "Woof!"\n\nd = ${child}()\nprint(d.speak())`,
          topic: 'Inheritance', output: 'Woof!', hint: 'Child class mewarisi method parent dan bisa override.' };
      },
      () => {
        const cls = PyBank.cls(), items = PyRng.range(2, 8);
        return {
          code: `class ${cls}:\n    count = 0\n\n    def __init__(self):\n        ${cls}.count += 1\n\nfor _ in range(${items}):\n    ${cls}()\nprint(${cls}.count)`,
          topic: 'Class Variable', output: String(items), hint: 'Class variable dibagi oleh semua instance.' };
      },
      () => {
        const cls = PyBank.cls(), a = PyRng.range(2, 9), b = PyRng.range(2, 9);
        return {
          code: `class ${cls}:\n    def __init__(self, value):\n        self.value = value\n\n    def __str__(self):\n        return f"${cls}({self.value})"\n\nobj = ${cls}(${a})\nprint(obj)`,
          topic: '__str__', output: `${cls}(${a})`, hint: '__str__ mengontrol bagaimana objek ditampilkan sebagai string.' };
      },
    ];
    return PyRng.pick(generators)();
  },

  // --- LEVEL 8: ADVANCED ---
  level8() {
    const generators = [
      () => {
        const nums = Array.from({ length: 5 }, () => PyRng.range(1, 10));
        const out = nums.map(n => n * n).join(', ');
        return { code: `numbers = ${JSON.stringify(nums)}\nsquares = list(map(lambda x: x**2, numbers))\nprint(squares)`, topic: 'Lambda + Map', output: `[${out}]`, hint: 'lambda adalah fungsi anonim; map() menerapkannya ke setiap elemen.' };
      },
      () => {
        const nums = Array.from({ length: 6 }, () => PyRng.range(1, 10));
        const out = nums.filter(n => n > 5).join(', ');
        return { code: `numbers = ${JSON.stringify(nums)}\nbig = list(filter(lambda x: x > 5, numbers))\nprint(big)`, topic: 'Lambda + Filter', output: `[${out}]`, hint: 'filter() menyaring elemen; True = simpan.' };
      },
      () => {
        return {
          code: `import json\n\ndata = {"name": "Alice", "age": 25}\njson_str = json.dumps(data)\nprint(json_str)\n\nparsed = json.loads(json_str)\nprint(parsed["name"])`,
          topic: 'JSON', output: '{"name": "Alice", "age": 25}\nAlice', hint: 'json.dumps() → dict ke string, json.loads() → string ke dict.' };
      },
      () => {
        const n = PyRng.range(3, 6);
        const out = Array.from({ length: n }, (_, i) => `${i * i}`).join(', ');
        return { code: `squares = [x**2 for x in range(${n})]\nprint(squares)`, topic: 'List Comprehension', output: `[${out}]`, hint: '[expr for x in range(n)] menghasilkan list.' };
      },
      () => {
        return {
          code: `import asyncio\n\nasync def fetch():\n    await asyncio.sleep(0)\n    return "Data ready"\n\nasync def main():\n    result = await fetch()\n    print(result)\n\nasyncio.run(main())`,
          topic: 'Async/Await', output: 'Data ready', hint: 'async def mendefinisikan coroutine; await menunggu hasilnya.' };
      },
      () => {
        const fn = PyBank.f();
        return {
          code: `def decorator(func):\n    def wrapper(*args):\n        print("Before")\n        result = func(*args)\n        print("After")\n        return result\n    return wrapper\n\n@decorator\ndef ${fn}():\n    print("Running")\n\n${fn}()`,
          topic: 'Decorator', output: 'Before\nRunning\nAfter', hint: '@decorator membungkus fungsi dengan fungsi lain.' };
      },
    ];
    return PyRng.pick(generators)();
  },

  // --- LEVEL 9: PROFESSIONAL ---
  level9() {
    const generators = [
      () => {
        const n = PyRng.range(5, 8);
        const out = Array.from({ length: n + 1 }, (_, i) => String(i)).join('\n');
        return {
          code: `def countdown(n):\n    if n < 0:\n        return\n    print(n)\n    countdown(n - 1)\n\ncountdown(${n})`,
          topic: 'Recursion', output: out, hint: 'Fungsi rekursif memanggil dirinya sendiri dengan kasus basis.' };
      },
      () => {
        const arr = Array.from({ length: 5 }, () => PyRng.range(10, 99));
        const sorted = [...arr].sort((a, b) => a - b);
        return {
          code: `def bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        for j in range(n - i - 1):\n            if arr[j] > arr[j + 1]:\n                arr[j], arr[j+1] = arr[j+1], arr[j]\n    return arr\n\nprint(bubble_sort(${JSON.stringify(arr)}))`,
          topic: 'Bubble Sort', output: `[${sorted.join(', ')}]`, hint: 'Bubble sort membandingkan elemen bersebelahan berulang kali.' };
      },
      () => {
        const arr = Array.from({ length: 6 }, () => PyRng.range(1, 20));
        const target = PyRng.pick(arr);
        const idx = arr.indexOf(target);
        return {
          code: `def linear_search(arr, target):\n    for i, val in enumerate(arr):\n        if val == target:\n            return i\n    return -1\n\ndata = ${JSON.stringify(arr)}\nprint(linear_search(data, ${target}))`,
          topic: 'Linear Search', output: String(idx), hint: 'Linear search iterasi tiap elemen untuk mencari target.' };
      },
      () => {
        const n = PyRng.range(5, 8);
        const fibs = [0, 1];
        while (fibs.length < n) fibs.push(fibs[fibs.length - 1] + fibs[fibs.length - 2]);
        return {
          code: `def fib(n):\n    if n <= 1:\n        return n\n    return fib(n-1) + fib(n-2)\n\nfor i in range(${n}):\n    print(fib(i))`,
          topic: 'Fibonacci', output: fibs.slice(0, n).join('\n'), hint: 'Fibonacci: fib(n) = fib(n-1) + fib(n-2), basis fib(0)=0, fib(1)=1.' };
      },
      () => {
        const items = PyRng.shuffle(PyBank.fruits).slice(0, 4).map(f => ({ name: f, price: PyRng.range(5, 20) }));
        const cheapest = items.reduce((a, b) => a.price < b.price ? a : b);
        return {
          code: `products = [\n${items.map(i => `    {"name": "${i.name}", "price": ${i.price}}`).join(',\n')}\n]\n\nresult = min(products, key=lambda p: p["price"])\nprint(result["name"])`,
          topic: 'Min with Key', output: cheapest.name, hint: 'min() dengan key=lambda memilih elemen minimum berdasarkan kriteria.' };
      },
    ];
    return PyRng.pick(generators)();
  },
};

// ================================================================
// MCQ GENERATOR
// ================================================================
function generateMCQ(level) {
  const pool = [
    {
      q: 'Apa output dari: print(type(3.14))?',
      correct: "<class 'float'>",
      opts: ["<class 'float'>", "<class 'int'>", "<class 'str'>", "<class 'double'>"],
      hint: 'type() mengembalikan tipe data dari suatu nilai.',
    },
    {
      q: 'Manakah cara benar membuat list di Python?',
      correct: 'my_list = [1, 2, 3]',
      opts: ['my_list = [1, 2, 3]', 'my_list = (1, 2, 3)', 'my_list = {1, 2, 3}', 'my_list = <1, 2, 3>'],
      hint: 'List dibuat dengan tanda kurung siku [].',
    },
    {
      q: `Apa output dari:\nnums = [${PyRng.range(1,5)}, ${PyRng.range(6,9)}, ${PyRng.range(10,15)}]\nprint(nums[-1])`,
      get correct() {
        const nums = [parseInt(this.opts[0])];
        return this._nums[this._nums.length - 1].toString();
      },
      _nums: (() => { const n = [PyRng.range(1,5), PyRng.range(6,9), PyRng.range(10,15)]; return n; })(),
      get opts() { const n = this._nums; const c = String(n[2]); return PyRng.shuffle([c, String(n[0]), String(n[1]), String(n[0]+n[2])]); },
      hint: 'Index -1 mengakses elemen terakhir list.',
    },
    {
      q: 'Keyword mana yang digunakan untuk mewarisi class di Python?',
      correct: 'class Child(Parent):',
      opts: ['class Child(Parent):', 'class Child extends Parent:', 'class Child inherits Parent:', 'class Child :: Parent:'],
      hint: 'Inheritance di Python: class Child(Parent):',
    },
    {
      q: 'Apa perbedaan list dan tuple di Python?',
      correct: 'List bisa diubah (mutable), tuple tidak (immutable)',
      opts: [
        'List bisa diubah (mutable), tuple tidak (immutable)',
        'Tuple bisa diubah, list tidak bisa',
        'Keduanya sama, hanya sintaks berbeda',
        'List menggunakan {}, tuple menggunakan []',
      ],
      hint: 'Tuple dibuat dengan () dan bersifat immutable.',
    },
    {
      q: 'Manakah cara benar menulis fungsi rekursif dengan kasus basis?',
      correct: 'if n == 0:\n    return 1\nreturn n * func(n-1)',
      opts: [
        'if n == 0:\n    return 1\nreturn n * func(n-1)',
        'while n > 0:\n    return func(n-1)',
        'for i in range(n):\n    return func(i)',
        'if n > 0:\n    func(n)',
      ],
      hint: 'Rekursi wajib punya kasus basis agar tidak infinite loop.',
    },
    {
      q: 'Apa fungsi dari keyword "yield" di Python?',
      correct: 'Mengembalikan nilai sementara dan menjeda eksekusi fungsi',
      opts: [
        'Mengembalikan nilai sementara dan menjeda eksekusi fungsi',
        'Sama persis dengan return',
        'Menghentikan loop',
        'Membuat variabel global',
      ],
      hint: 'yield membuat generator — fungsi yang bisa di-pause/resume.',
    },
    {
      q: 'Bagaimana cara membaca semua baris dari file di Python?',
      correct: 'f.readlines()',
      opts: ['f.readlines()', 'f.read_all()', 'f.getlines()', 'f.lines()'],
      hint: 'readlines() mengembalikan list berisi setiap baris file.',
    },
  ];

  const q = PyRng.pick(pool);
  let correct = q.correct;
  let opts = q.opts;

  // Ensure correct is in opts
  const shuffledOpts = typeof opts === 'function' ? opts : PyRng.shuffle([...new Set([correct, ...opts])]).slice(0, 4);
  if (!shuffledOpts.includes(correct)) shuffledOpts[0] = correct;

  return {
    question: q.q,
    correct,
    options: PyRng.shuffle(shuffledOpts.slice(0, 4)),
    hint: q.hint,
    topic: 'Pilihan Ganda',
  };
}

// ================================================================
// DEBUG GENERATOR
// ================================================================
function generateDebug(level) {
  const pool = [
    {
      buggy: `def add(a, b)\n    return a + b\n\nprint(add(3, 4))`,
      fixed: `def add(a, b):\n    return a + b\n\nprint(add(3, 4))`,
      bug: 'Baris 1: tanda : setelah parameter tidak ada.',
      topic: 'Missing Colon',
      hint: 'Definisi fungsi harus diakhiri dengan titik dua :',
    },
    {
      buggy: `for i in range(5):\nprint(i)`,
      fixed: `for i in range(5):\n    print(i)`,
      bug: 'Baris 2: indentasi hilang.',
      topic: 'Indentation Error',
      hint: 'Python menggunakan indentasi (4 spasi) untuk blok kode.',
    },
    {
      buggy: `x = 10\ny = "5"\nprint(x + y)`,
      fixed: `x = 10\ny = 5\nprint(x + y)`,
      bug: 'Baris 2: y seharusnya integer, bukan string.',
      topic: 'Type Error',
      hint: 'Tidak bisa menjumlahkan int dan str langsung.',
    },
    {
      buggy: `numbers = [1, 2, 3]\nprint(numbers[5])`,
      fixed: `numbers = [1, 2, 3]\nprint(numbers[2])`,
      bug: 'Baris 2: index 5 melebihi panjang list (max index: 2).',
      topic: 'Index Error',
      hint: 'Index list dimulai dari 0 hingga len-1.',
    },
    {
      buggy: `def greet(name):\n    print("Hello " + name)\n\ngreet()`,
      fixed: `def greet(name):\n    print("Hello " + name)\n\ngreet("Alice")`,
      bug: 'Baris 4: fungsi dipanggil tanpa argumen wajib.',
      topic: 'Missing Argument',
      hint: 'Fungsi greet() membutuhkan 1 argumen: name.',
    },
  ];
  const q = PyRng.pick(pool);
  return { ...q, code: q.buggy };
}

// ================================================================
// ARRANGE GENERATOR
// ================================================================
function generateArrange(level) {
  const pool = [
    {
      lines: ['def greet(name):', '    msg = f"Hello, {name}!"', '    return msg', 'print(greet("Alice"))'],
      topic: 'Function Arrange',
      hint: 'Susun definisi fungsi: def → body → pemanggilan.',
    },
    {
      lines: ['numbers = [3, 1, 4, 1, 5]', 'numbers.sort()', 'print(numbers)'],
      topic: 'List Sort Arrange',
      hint: 'Buat list dulu, sort, lalu print.',
    },
    {
      lines: ['for i in range(3):', '    for j in range(2):', '        print(i, j)'],
      topic: 'Nested Loop Arrange',
      hint: 'Loop luar dulu, lalu loop dalam, lalu print.',
    },
    {
      lines: ['class Dog:', '    def __init__(self, name):', '        self.name = name', '    def bark(self):', '        print(f"{self.name}: Woof!")'],
      topic: 'Class Arrange',
      hint: 'class → __init__ → method lainnya.',
    },
    {
      lines: ['try:', '    result = 10 / 0', 'except ZeroDivisionError:', '    print("Error!")'],
      topic: 'Try-Except Arrange',
      hint: 'try → kode berisiko → except → penanganan error.',
    },
  ];
  return PyRng.pick(pool);
}

// ================================================================
// MAIN QUESTION GENERATOR
// ================================================================
function pyGenerateQuestion() {
  const levelNum = pyState.level;
  const modeId = pyState.mode;
  let q = null;
  let attempts = 0;

  do {
    const genKey = `level${levelNum}`;
    if (modeId === 'mcq') {
      q = generateMCQ(levelNum);
    } else if (modeId === 'debug') {
      q = generateDebug(levelNum);
      q.isDebug = true;
    } else if (modeId === 'arrange') {
      q = generateArrange(levelNum);
    } else if (modeId === 'predict') {
      const base = PY_GENERATORS[genKey] ? PY_GENERATORS[genKey]() : PY_GENERATORS.level1();
      q = { ...base, isPredict: true };
    } else {
      // retype / complete / speed — use code generator
      q = PY_GENERATORS[genKey] ? PY_GENERATORS[genKey]() : PY_GENERATORS.level1();
    }
    attempts++;
  } while (q && q.code && RecentCache.isDuplicate(q.code) && attempts < 12);

  if (q && q.code) RecentCache.add(q.code);
  pyState.currentQ = q;
  pyState.answered = false;
  pyState.startTime = null;
  pyState.errors = 0;
  pyState.typedCorrect = 0;
  pyRenderQuestion();
}

// ================================================================
// STATE
// ================================================================
let pyState = {
  level: 1,
  mode: 'retype',
  xp: 0,
  combo: 1,
  streak: 0,
  done: 0,
  currentQ: null,
  answered: false,
  startTime: null,
  errors: 0,
  arrangeSelected: [],
  wpmInterval: null,
};

const PY_RANKS = [
  [0,    'Pemula Python'],
  [200,  'Junior Dev'],
  [500,  'Intermediate Dev'],
  [1000, 'Advanced Dev'],
  [2000, 'Senior Dev'],
  [3500, 'Python Expert'],
  [5000, 'Master Pythonista'],
];
function pyGetRank(xp) {
  let rank = PY_RANKS[0][1];
  for (const [req, name] of PY_RANKS) { if (xp >= req) rank = name; }
  return rank;
}
const PY_XP_PER_LEVEL = [0, 0, 100, 250, 500, 800, 1200, 1800, 2600, 3500];

// ================================================================
// RENDER QUESTION
// ================================================================
function pyRenderQuestion() {
  const q = pyState.currentQ;
  if (!q) return;

  // Reset UI zones
  document.getElementById('py-retype-zone').style.display = 'none';
  document.getElementById('py-predict-zone').style.display = 'none';
  document.getElementById('py-mcq-zone').style.display = 'none';
  document.getElementById('py-arrange-zone').style.display = 'none';
  document.getElementById('py-result-panel').style.display = 'none';
  document.getElementById('py-typing-area').style.display = 'block';
  document.getElementById('py-hint-panel').style.display = 'none';
  document.getElementById('py-hint-btn').textContent = '💡 Hint';

  // Update badges
  const levelInfo = PY_LEVELS[pyState.level - 1];
  const modeInfo = PY_MODES[pyState.mode] || PY_MODES.retype;
  document.getElementById('py-diff-badge').textContent = levelInfo.name;
  document.getElementById('py-diff-badge').className = 'difficulty-badge diff-' + levelInfo.diff;
  document.getElementById('py-topic-badge').textContent = q.topic || 'Python';
  document.getElementById('py-q-type-label').textContent = modeInfo.icon + ' ' + modeInfo.label.toUpperCase();
  document.getElementById('py-q-instruction').textContent = modeInfo.desc;

  // Hint text
  document.getElementById('py-hint-text-inner').textContent = q.hint || 'Perhatikan syntax Python yang benar.';

  // Reset live stats
  document.getElementById('py-wpm').textContent = '0';
  document.getElementById('py-acc').textContent = '100%';
  document.getElementById('py-progress').textContent = '0%';
  document.getElementById('py-errors').textContent = '0';

  clearInterval(pyState.wpmInterval);

  if (pyState.mode === 'mcq') {
    pyRenderMCQ(q);
  } else if (pyState.mode === 'arrange') {
    pyRenderArrange(q);
  } else if (pyState.mode === 'predict') {
    pyRenderPredict(q);
  } else if (pyState.mode === 'debug') {
    pyRenderDebug(q);
  } else {
    pyRenderRetype(q);
  }
}

// ================================================================
// RENDER: RETYPE / DEBUG / COMPLETE
// ================================================================
function pyRenderRetype(q) {
  const zone = document.getElementById('py-retype-zone');
  zone.style.display = 'block';

  const code = q.code || '';
  document.getElementById('py-filename').textContent = 'main.py';
  document.getElementById('py-char-counter').textContent = `0 / ${code.length}`;

  // Render syntax-highlighted display
  const display = document.getElementById('py-code-display');
  display.innerHTML = '';
  code.split('').forEach((ch, i) => {
    const span = document.createElement('span');
    span.className = 'char pending';
    span.textContent = ch === ' ' ? '\u00a0' : (ch === '\n' ? '↵' : ch);
    if (ch === '\n') {
      span.style.color = 'var(--text3)';
      span.style.fontSize = '11px';
    }
    span.dataset.idx = i;
    display.appendChild(span);
    if (ch === '\n') display.appendChild(document.createElement('br'));
  });
  // Mark first char as current
  const firstSpan = display.querySelector('.char');
  if (firstSpan) firstSpan.className = 'char current';

  const input = document.getElementById('py-typing-input');
  input.value = '';
  input.placeholder = 'Ketik code Python di sini...';
  input.disabled = false;
  input.focus();
}

function pyRenderPredict(q) {
  document.getElementById('py-predict-zone').style.display = 'block';
  const codeEl = document.getElementById('py-predict-code');
  codeEl.textContent = q.code || '';
  document.getElementById('py-predict-input').value = '';
  document.getElementById('py-predict-input').focus();
}

function pyRenderDebug(q) {
  const zone = document.getElementById('py-retype-zone');
  zone.style.display = 'block';
  document.getElementById('py-q-instruction').textContent = 'Ketik versi yang sudah diperbaiki dari code bermasalah ini.';

  const code = q.fixed || q.code || '';
  const display = document.getElementById('py-code-display');
  display.innerHTML = '';

  // Show buggy code first with highlight, then input for fixed version
  const buggyDiv = document.createElement('div');
  buggyDiv.style.cssText = 'background:rgba(247,106,106,0.08);border:1px solid rgba(247,106,106,0.2);border-radius:8px;padding:12px;margin-bottom:12px;font-family:var(--font-mono);font-size:13px;color:var(--text2);white-space:pre-wrap;line-height:1.85';
  buggyDiv.textContent = q.buggy || q.code || '';

  const bugLabel = document.createElement('div');
  bugLabel.style.cssText = 'font-size:11px;color:var(--red);margin-bottom:6px;font-weight:600';
  bugLabel.textContent = '🐛 Code dengan bug:';

  const fixedLabel = document.createElement('div');
  fixedLabel.style.cssText = 'font-size:11px;color:var(--green);margin-bottom:6px;font-weight:600';
  fixedLabel.textContent = '✅ Ketik versi yang benar:';

  display.appendChild(bugLabel);
  display.appendChild(buggyDiv);
  display.appendChild(fixedLabel);

  // Now render character-by-character for the fixed version
  const codeCharsDiv = document.createElement('div');
  code.split('').forEach((ch, i) => {
    const span = document.createElement('span');
    span.className = 'char ' + (i === 0 ? 'current' : 'pending');
    span.textContent = ch === ' ' ? '\u00a0' : (ch === '\n' ? '↵' : ch);
    if (ch === '\n') { span.style.color = 'var(--text3)'; span.style.fontSize = '11px'; }
    span.dataset.idx = i;
    codeCharsDiv.appendChild(span);
    if (ch === '\n') codeCharsDiv.appendChild(document.createElement('br'));
  });
  display.appendChild(codeCharsDiv);

  const input = document.getElementById('py-typing-input');
  input.value = '';
  input.placeholder = 'Ketik versi yang sudah diperbaiki...';
  input.disabled = false;
  input.focus();
}

function pyRenderMCQ(q) {
  document.getElementById('py-mcq-zone').style.display = 'block';
  const questionEl = document.getElementById('py-mcq-question');
  questionEl.style.cssText = 'font-size:14px;color:var(--text2);margin-bottom:14px;line-height:1.7;font-family:var(--font-mono);white-space:pre-wrap';
  questionEl.textContent = q.question;

  const optionsEl = document.getElementById('py-mcq-options');
  optionsEl.innerHTML = '';
  q.options.forEach(opt => {
    const btn = document.createElement('button');
    btn.style.cssText = 'text-align:left;padding:10px 16px;background:var(--bg2);border:1px solid var(--border);border-radius:8px;color:var(--text2);cursor:pointer;font-size:12px;font-family:var(--font-mono);white-space:pre-wrap;line-height:1.6;transition:all .2s;width:100%';
    btn.textContent = opt;
    btn.onmouseenter = () => { if (!pyState.answered) btn.style.background = 'var(--bg3)'; };
    btn.onmouseleave = () => { if (!pyState.answered) btn.style.background = 'var(--bg2)'; };
    btn.onclick = () => pyAnswerMCQ(opt, q.correct, btn, optionsEl);
    optionsEl.appendChild(btn);
  });
}

function pyAnswerMCQ(chosen, correct, btn, container) {
  if (pyState.answered) return;
  pyState.answered = true;

  const isCorrect = chosen === correct;
  if (isCorrect) {
    btn.style.background = 'rgba(93,224,160,0.15)';
    btn.style.borderColor = 'var(--green)';
    btn.style.color = 'var(--green)';
    pyHandleCorrect(80);
  } else {
    btn.style.background = 'rgba(247,106,106,0.1)';
    btn.style.borderColor = 'var(--red)';
    btn.style.color = 'var(--red)';
    // Highlight correct
    container.querySelectorAll('button').forEach(b => {
      if (b.textContent === correct) {
        b.style.background = 'rgba(93,224,160,0.15)';
        b.style.borderColor = 'var(--green)';
        b.style.color = 'var(--green)';
      }
    });
    pyHandleWrong();
  }
}

function pyRenderArrange(q) {
  document.getElementById('py-arrange-zone').style.display = 'block';
  pyState.arrangeSelected = [];

  const shuffled = PyRng.shuffle([...q.lines]);
  const piecesEl = document.getElementById('py-arrange-pieces');
  piecesEl.innerHTML = '';
  shuffled.forEach((line, i) => {
    const btn = document.createElement('button');
    btn.style.cssText = 'padding:6px 12px;background:var(--bg2);border:1px solid var(--border);border-radius:8px;color:var(--text2);cursor:pointer;font-size:12px;font-family:var(--font-mono);white-space:pre;transition:all .2s';
    btn.textContent = line;
    btn.dataset.idx = i;
    btn.onclick = () => pyArrangePick(btn, line);
    piecesEl.appendChild(btn);
  });
  document.getElementById('py-arrange-result').textContent = '';
}

function pyArrangePick(btn, line) {
  if (btn.style.opacity === '0.3') {
    // Deselect
    pyState.arrangeSelected = pyState.arrangeSelected.filter(l => l !== line);
    btn.style.opacity = '1';
    btn.style.borderColor = 'var(--border)';
  } else {
    pyState.arrangeSelected.push(line);
    btn.style.opacity = '0.3';
    btn.style.borderColor = 'var(--accent)';
  }
  document.getElementById('py-arrange-result').textContent = pyState.arrangeSelected.join('\n');
}

function pyArrangeReset() {
  pyState.arrangeSelected = [];
  document.getElementById('py-arrange-pieces').querySelectorAll('button').forEach(b => {
    b.style.opacity = '1';
    b.style.borderColor = 'var(--border)';
  });
  document.getElementById('py-arrange-result').textContent = '';
}

function pyArrangeCheck() {
  const q = pyState.currentQ;
  if (!q || !q.lines) return;
  const correct = q.lines.join('\n');
  const chosen = pyState.arrangeSelected.join('\n');
  if (chosen === correct) {
    pyHandleCorrect(100);
  } else {
    pyHandleWrong();
    if (typeof showToast === 'function') showToast('❌', 'Urutan belum benar. Coba lagi!');
  }
}

// ================================================================
// TYPING INPUT HANDLER
// ================================================================
function pyHandleInput(e) {
  const q = pyState.currentQ;
  if (!q || !q.code) return;

  const code = (pyState.mode === 'debug' && q.fixed) ? q.fixed : q.code;
  const typed = e.target.value;

  if (!pyState.startTime && typed.length > 0) {
    pyState.startTime = Date.now();
    // Start WPM timer
    clearInterval(pyState.wpmInterval);
    pyState.wpmInterval = setInterval(() => pyUpdateLiveStats(typed, code), 500);
  }

  // Update character display
  const display = document.getElementById('py-code-display');
  const spans = display.querySelectorAll('.char');
  let charIdx = 0;
  let errCount = 0;

  // Map typed chars to code chars (ignoring \n display markers)
  const codeChars = code.split('');
  typed.split('').forEach((ch, ti) => {
    if (ti < codeChars.length) {
      if (ch !== codeChars[ti]) errCount++;
    }
  });

  // Re-render spans based on typed
  let spanIdx = 0;
  let typedIdx = 0;
  codeChars.forEach((ch, ci) => {
    const span = spans[spanIdx];
    if (!span) { spanIdx++; return; }
    span.className = 'char';
    if (typedIdx < typed.length) {
      if (typed[typedIdx] === ch) span.className = 'char correct';
      else span.className = 'char wrong';
      typedIdx++;
    } else if (typedIdx === typed.length) {
      span.className = 'char current';
    } else {
      span.className = 'char pending';
    }
    spanIdx++;
    if (ch === '\n') spanIdx++; // skip <br>
  });

  pyState.errors = errCount;
  const progress = Math.round((typed.length / code.length) * 100);
  document.getElementById('py-char-counter').textContent = `${typed.length} / ${code.length}`;
  document.getElementById('py-progress').textContent = Math.min(progress, 100) + '%';
  document.getElementById('py-errors').textContent = errCount;

  const acc = typed.length > 0 ? Math.round(((typed.length - errCount) / typed.length) * 100) : 100;
  document.getElementById('py-acc').textContent = acc + '%';

  // Check completion
  if (typed.length >= code.length) {
    clearInterval(pyState.wpmInterval);
    const correct = typed === code;
    if (correct) {
      pyHandleCorrect(null);
    } else {
      // Allow them to finish but count errors
      const elapsed = (Date.now() - pyState.startTime) / 60000;
      const wpm = Math.round(((code.length / 5) / elapsed));
      pyHandleCorrect(wpm, true);
    }
  }
}

function pyHandleKey(e) {
  if (e.key === 'Tab') {
    e.preventDefault();
    const inp = e.target;
    const s = inp.selectionStart;
    inp.value = inp.value.substring(0, s) + '    ' + inp.value.substring(s);
    inp.selectionStart = inp.selectionEnd = s + 4;
    pyHandleInput({ target: inp });
  }
}

function pyHandlePredictInput(e) {
  // Just visual feedback, no char-by-char
}

function pyHandlePredictKey(e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    const inp = document.getElementById('py-predict-input');
    const answer = inp.value.trim();
    const correct = (pyState.currentQ.output || '').trim();
    if (answer === correct) {
      pyHandleCorrect(60);
    } else {
      pyHandleWrong();
      if (typeof showToast === 'function') {
        showToast('💡', `Output yang benar: ${correct}`);
      }
    }
  }
}

function pyUpdateLiveStats(typed, code) {
  if (!pyState.startTime) return;
  const elapsed = (Date.now() - pyState.startTime) / 60000;
  const correct = typed.split('').filter((ch, i) => ch === code[i]).length;
  const wpm = elapsed > 0 ? Math.round((correct / 5) / elapsed) : 0;
  document.getElementById('py-wpm').textContent = wpm;
}

// ================================================================
// HANDLE CORRECT / WRONG
// ================================================================
function pyHandleCorrect(overrideWpm = null, hasErrors = false) {
  if (pyState.answered) return;
  pyState.answered = true;
  clearInterval(pyState.wpmInterval);

  const q = pyState.currentQ;
  const code = (q && q.code) ? q.code : '';
  const elapsed = pyState.startTime ? (Date.now() - pyState.startTime) / 60000 : 0.001;
  const wpm = overrideWpm !== null ? overrideWpm : Math.round(((code.length / 5) / elapsed));
  const acc = pyState.errors === 0 ? 100 : Math.max(0, Math.round(((code.length - pyState.errors) / code.length) * 100));

  // XP calculation
  const levelBonus = pyState.level * 10;
  const comboBonus = pyState.combo * 5;
  const errPenalty = pyState.errors * 2;
  const baseXp = pyState.mode === 'mcq' ? 40 : pyState.mode === 'arrange' ? 60 : 80;
  const xpEarned = Math.max(10, baseXp + levelBonus + comboBonus - errPenalty);

  pyState.combo = hasErrors ? 1 : pyState.combo + 1;
  pyState.streak++;
  pyState.done++;
  pyState.xp += xpEarned;

  // Update global userData XP if available
  if (typeof addXP === 'function') addXP(xpEarned);
  if (typeof userData !== 'undefined') {
    userData.codeCompleted = (userData.codeCompleted || 0) + 1;
    if (typeof saveUser === 'function') saveUser();
  }

  pyUpdateXPBar();
  pyUpdateComboStreak();

  // Show result panel
  document.getElementById('py-typing-area').style.display = 'none';
  const resultPanel = document.getElementById('py-result-panel');
  resultPanel.style.display = 'block';
  document.getElementById('py-result-icon').textContent = hasErrors ? '✅' : '🎉';
  document.getElementById('py-result-title').textContent = hasErrors ? 'Selesai!' : 'Benar!';
  document.getElementById('py-result-msg').textContent = hasErrors
    ? `Selesai dengan ${pyState.errors} error. Akurasi: ${acc}%`
    : `Sempurna! WPM: ${wpm} · Tidak ada error!`;
  document.getElementById('py-res-xp').textContent = '+' + xpEarned;
  document.getElementById('py-res-combo').textContent = 'x' + pyState.combo;
  document.getElementById('py-res-acc').textContent = acc + '%';

  // Explanation
  const expBox = document.getElementById('py-explanation-box');
  const expText = document.getElementById('py-explanation-text');
  expBox.style.display = 'none';
  if (q && q.hint) {
    expText.textContent = q.hint;
  } else if (q && q.bug) {
    expText.textContent = '🐛 Bug: ' + q.bug;
  }

  if (typeof showToast === 'function') {
    showToast('🐍', `Benar! +${xpEarned} XP · Combo x${pyState.combo}`);
  }
}

function pyHandleWrong() {
  pyState.combo = 1;
  pyState.streak = 0;
  pyUpdateComboStreak();
  if (typeof showToast === 'function') showToast('❌', 'Belum tepat! Coba lagi.');
}

function pyNextQuestion() {
  document.getElementById('py-result-panel').style.display = 'none';
  document.getElementById('py-typing-area').style.display = 'block';
  pyGenerateQuestion();
}

function pyToggleExplanation() {
  const box = document.getElementById('py-explanation-box');
  box.style.display = box.style.display === 'none' ? 'block' : 'none';
}

function pyToggleHint() {
  const panel = document.getElementById('py-hint-panel');
  const btn = document.getElementById('py-hint-btn');
  const showing = panel.style.display !== 'none';
  panel.style.display = showing ? 'none' : 'block';
  btn.textContent = showing ? '💡 Hint' : '🙈 Sembunyikan';
}

// ================================================================
// XP & COMBO UPDATE
// ================================================================
function pyUpdateXPBar() {
  document.getElementById('py-xp-display').textContent = pyState.xp;
  document.getElementById('py-rank-label').textContent = pyGetRank(pyState.xp);
  const levelXpMin = PY_XP_PER_LEVEL[pyState.level - 1] || 0;
  const levelXpMax = PY_XP_PER_LEVEL[pyState.level] || 5000;
  const pct = Math.min(Math.round(((pyState.xp - levelXpMin) / (levelXpMax - levelXpMin)) * 100), 100);
  document.getElementById('py-xp-bar').style.width = pct + '%';
  document.getElementById('py-xp-bar-pct').textContent = pct + '%';
}

function pyUpdateComboStreak() {
  document.getElementById('py-combo-display').textContent = 'x' + pyState.combo;
  document.getElementById('py-streak-display').textContent = pyState.streak;
  document.getElementById('py-done-display').textContent = pyState.done;
}

// ================================================================
// LEVEL MODAL
// ================================================================
function pyOpenLevelModal() {
  const modal = document.getElementById('py-level-modal');
  modal.style.display = 'flex';
  const list = document.getElementById('py-level-list');
  list.innerHTML = '';
  PY_LEVELS.forEach(lv => {
    const btn = document.createElement('button');
    btn.style.cssText = `padding:12px 16px;border-radius:10px;border:1px solid var(--border);background:${pyState.level === lv.id ? 'rgba(124,106,247,0.15)' : 'var(--bg3)'};color:${pyState.level === lv.id ? 'var(--accent)' : 'var(--text2)'};cursor:pointer;text-align:left;font-size:13px;font-family:var(--font-ui);transition:all .2s;display:flex;align-items:center;gap:10px`;
    btn.innerHTML = `<span style="width:12px;height:12px;border-radius:50%;background:${lv.color};display:inline-block;flex-shrink:0"></span><div><div style="font-weight:600">${lv.label}</div><div style="font-size:11px;color:var(--text3);margin-top:2px">${lv.topics.join(' · ')}</div></div>`;
    btn.onclick = () => {
      pyState.level = lv.id;
      document.getElementById('py-level-btn').textContent = `📊 ${lv.label}`;
      modal.style.display = 'none';
      pyGenerateQuestion();
    };
    list.appendChild(btn);
  });
}
function pyCloseLevelModal() { document.getElementById('py-level-modal').style.display = 'none'; }

// ================================================================
// MODE MODAL
// ================================================================
function pyOpenModeModal() {
  const modal = document.getElementById('py-mode-modal');
  modal.style.display = 'flex';
  const list = document.getElementById('py-mode-list');
  list.innerHTML = '';
  Object.values(PY_MODES).forEach(mode => {
    const btn = document.createElement('button');
    btn.style.cssText = `padding:12px 14px;border-radius:10px;border:1px solid var(--border);background:${pyState.mode === mode.id ? 'rgba(124,106,247,0.15)' : 'var(--bg3)'};color:${pyState.mode === mode.id ? 'var(--accent)' : 'var(--text2)'};cursor:pointer;text-align:left;font-size:12px;font-family:var(--font-ui);transition:all .2s`;
    btn.innerHTML = `<div style="font-size:20px;margin-bottom:4px">${mode.icon}</div><div style="font-weight:600">${mode.label}</div><div style="font-size:10px;color:var(--text3);margin-top:2px;line-height:1.4">${mode.desc}</div>`;
    btn.onclick = () => {
      pyState.mode = mode.id;
      document.getElementById('py-mode-label').textContent = `⚙️ Mode: ${mode.label}`;
      modal.style.display = 'none';
      pyGenerateQuestion();
    };
    list.appendChild(btn);
  });
}
function pyCloseModeModal() { document.getElementById('py-mode-modal').style.display = 'none'; }

// ================================================================
// INIT PYTHON TRAINER
// ================================================================
function pyInitTrainer() {
  pyState.xp = 0;
  pyState.combo = 1;
  pyState.streak = 0;
  pyState.done = 0;
  pyUpdateXPBar();
  pyUpdateComboStreak();
  pyGenerateQuestion();
}

// ================================================================
// HOOK INTO NAVIGATION
// ================================================================
const _origNavigate = typeof navigate === 'function' ? navigate : null;
if (_origNavigate) {
  window.navigate = function(page) {
    _origNavigate(page);
    if (page === 'pytrainer') {
      setTimeout(() => {
        if (!pyState.currentQ) pyInitTrainer();
      }, 100);
    }
  };
} else {
  // Fallback: auto-init on page load if pytrainer is default visible
  window.addEventListener('load', () => {
    if (document.getElementById('page-pytrainer').classList.contains('active')) {
      pyInitTrainer();
    }
  });
}

// Also expose for manual nav-item click
document.addEventListener('DOMContentLoaded', () => {
  const pyNavItem = [...document.querySelectorAll('.nav-item')].find(n => n.getAttribute('onclick') && n.getAttribute('onclick').includes('pytrainer'));
  if (pyNavItem) {
    const orig = pyNavItem.getAttribute('onclick');
    pyNavItem.setAttribute('onclick', orig + '; if(!pyState.currentQ) pyInitTrainer();');
  }
  // Also auto-init when entering Python Trainer page from dashboard
  document.querySelectorAll('[onclick*="pytrainer"]').forEach(el => {
    el.addEventListener('click', () => setTimeout(() => { if (!pyState.currentQ) pyInitTrainer(); }, 150));
  });
});
