#!/usr/bin/env node
/**
 * Minify CSS + JS for production
 * Usage: node scripts/minify.js
 */

const fs = require('fs');
const path = require('path');
const { minify } = require('terser');
const postcss = require('postcss');
const cssnano = require('cssnano');

async function minifyCSS(inputFile, outputFile) {
  try {
    const css = fs.readFileSync(inputFile, 'utf8');
    const result = await postcss([cssnano()]).process(css, { from: inputFile });
    fs.writeFileSync(outputFile, result.css);
    
    const originalSize = Buffer.byteLength(css);
    const minifiedSize = Buffer.byteLength(result.css);
    const savings = (((originalSize - minifiedSize) / originalSize) * 100).toFixed(1);
    
    console.log(`✅ CSS minified: ${inputFile}`);
    console.log(`   ${originalSize} → ${minifiedSize} bytes (${savings}% reduction)`);
  } catch (error) {
    console.error(`❌ CSS minify error: ${inputFile}`, error.message);
  }
}

async function minifyJS(inputFile, outputFile) {
  try {
    const code = fs.readFileSync(inputFile, 'utf8');
    const result = await minify(code, {
      compress: {
        dead_code: true,
        drop_console: false,
        unused: true,
      },
      mangle: true,
    });
    
    if (result.error) throw result.error;
    
    fs.writeFileSync(outputFile, result.code);
    
    const originalSize = Buffer.byteLength(code);
    const minifiedSize = Buffer.byteLength(result.code);
    const savings = (((originalSize - minifiedSize) / originalSize) * 100).toFixed(1);
    
    console.log(`✅ JS minified: ${inputFile}`);
    console.log(`   ${originalSize} → ${minifiedSize} bytes (${savings}% reduction)`);
  } catch (error) {
    console.error(`❌ JS minify error: ${inputFile}`, error.message);
  }
}

async function main() {
  console.log('🔨 Starting minification...\n');
  
  // Minify CSS
  await minifyCSS('css/style.css', 'css/style.min.css');
  await minifyCSS('css/tailwind.css', 'css/tailwind.min.css');
  
  // Minify JS
  const jsFiles = [
    'js/components.js',
    'js/enhancements.js',
    'js/zalo-modal.js',
  ];
  
  for (const file of jsFiles) {
    if (fs.existsSync(file)) {
      const minFile = file.replace('.js', '.min.js');
      await minifyJS(file, minFile);
    }
  }
  
  console.log('\n✅ Minification complete!');
}

main().catch(console.error);
