const fs = require('fs');
const path = 'src/app/admin/page.tsx';
let content = fs.readFileSync(path, 'utf8');

const s = content.indexOf('{activeSection === "settings" && (');
const e = content.indexOf('</section>', s);
console.log('start', s, 'end', e, 'len', e - s);
