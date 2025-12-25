const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting MandalApp Development Server...\n');

const vite = spawn('npx', ['vite'], {
    cwd: __dirname,
    stdio: 'inherit',
    shell: true
});

vite.on('error', (error) => {
    console.error('❌ Error starting server:', error);
});

vite.on('close', (code) => {
    console.log(`\n⚠️  Server exited with code ${code}`);
});
