/* ==========================================================================
   Gaming Station — Combined Dev Runner (Node.js API + Vite React Frontend)
   Run with: npm run dev
   ========================================================================== */

import { spawn } from 'node:child_process';
import { createServer } from './index.js';

const PORT = Number(process.env.PORT) || 4000;
const apiServer = createServer();

apiServer.listen(PORT, () => {
  console.log(`[Gaming Station Backend] Node.js API running on http://localhost:${PORT}`);
  const vite = spawn('npx', ['vite'], { stdio: 'inherit', shell: true });
  vite.on('exit', code => {
    apiServer.close();
    process.exit(code || 0);
  });
});
