import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

dirname(fileURLToPath(import.meta.url));

const cssFiles = [
  { src: './src/components/leaderboard.css', dest: './dist/components/leaderboard.css' },
  { src: './src/components/badge.css', dest: './dist/components/badge.css' },
  { src: './src/components/emblem.css', dest: './dist/components/emblem.css' },
  { src: './src/components/tooltip.css', dest: './dist/components/tooltip.css' },
  { src: './src/components/reward-card.css', dest: './dist/components/reward-card.css' },
  { src: './src/components/reward-reveal.css', dest: './dist/components/reward-reveal.css' },
  { src: './src/components/inspector-panel.css', dest: './dist/components/inspector-panel.css' },
  { src: './src/components/progress-bar.css', dest: './dist/components/progress-bar.css' },
  { src: './src/components/stat-card.css', dest: './dist/components/stat-card.css' },
  { src: './src/components/player-card.css', dest: './dist/components/player-card.css' },
  { src: './src/components/quest-list.css', dest: './dist/components/quest-list.css' },
  { src: './src/components/inventory-slot.css', dest: './dist/components/inventory-slot.css' },
  { src: './src/components/inventory-grid.css', dest: './dist/components/inventory-grid.css' },
  { src: './src/components/countdown.css', dest: './dist/components/countdown.css' }
];

const components = [
  { name: 'leaderboard', cssPath: './dist/components/leaderboard.css', jsPath: './dist/components/leaderboard.js' },
  { name: 'badge', cssPath: './dist/components/badge.css', jsPath: './dist/components/badge.js' },
  { name: 'emblem', cssPath: './dist/components/emblem.css', jsPath: './dist/components/emblem.js' },
  { name: 'tooltip', cssPath: './dist/components/tooltip.css', jsPath: './dist/components/tooltip.js' },
  { name: 'reward-card', cssPath: './dist/components/reward-card.css', jsPath: './dist/components/reward-card.js' },
  { name: 'reward-reveal', cssPath: './dist/components/reward-reveal.css', jsPath: './dist/components/reward-reveal.js' },
  { name: 'inspector-panel', cssPath: './dist/components/inspector-panel.css', jsPath: './dist/components/inspector-panel.js' },
  { name: 'progress-bar', cssPath: './dist/components/progress-bar.css', jsPath: './dist/components/progress-bar.js' },
  { name: 'stat-card', cssPath: './dist/components/stat-card.css', jsPath: './dist/components/stat-card.js' },
  { name: 'player-card', cssPath: './dist/components/player-card.css', jsPath: './dist/components/player-card.js' },
  { name: 'quest-list', cssPath: './dist/components/quest-list.css', jsPath: './dist/components/quest-list.js' },
  { name: 'inventory-slot', cssPath: './dist/components/inventory-slot.css', jsPath: './dist/components/inventory-slot.js' },
  { name: 'inventory-grid', cssPath: './dist/components/inventory-grid.css', jsPath: './dist/components/inventory-grid.js' },
  { name: 'countdown', cssPath: './dist/components/countdown.css', jsPath: './dist/components/countdown.js' }
];

mkdirSync('./dist/components', { recursive: true });

for (const { src, dest } of cssFiles) {
  copyFileSync(src, dest);
}

for (const { name, cssPath, jsPath } of components) {
  const css = readFileSync(cssPath, 'utf-8');
  const jsContent = readFileSync(jsPath, 'utf-8');

  const updatedContent = jsContent.replace(
      /const styles = ['"].*?['"];[\s]*\/\/ Will be replaced by build script/,
      `const styles = \`${css.replace(/`/g, '\\`')}\`;`
  );

  if (updatedContent === jsContent) {
    throw new Error(`CSS placeholder was not replaced for ${name}`);
  }

  writeFileSync(jsPath, updatedContent);
}

console.log(`Built ${components.length} components.`);