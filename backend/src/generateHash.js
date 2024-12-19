const bcrypt = require('bcrypt');

async function generateHash() {
    const password = 'MicaAli090800!';
    const hash = await bcrypt.hash(password, 10);
    console.log('Password hash:', hash);
}

generateHash();
