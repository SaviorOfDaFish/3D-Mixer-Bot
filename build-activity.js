const esbuild = require("esbuild");

// Existing Discord Activity auth bundle.
esbuild.buildSync({
  entryPoints:["public/activity-auth-source.js"],
  bundle:true,
  platform:"browser",
  format:"iife",
  target:["es2020"],
  outfile:"public/activity-auth.js",
  minify:true
});

// H10.6.28: Bundle Three.js + cannon-es into Monster Hunt itself.
// Discord Activities can block third-party CDN module imports via CSP, so the
// D100 renderer must be served from the same Monster Hunt origin.
esbuild.buildSync({
  entryPoints:["monster-hunt-d100-source.js"],
  bundle:true,
  platform:"browser",
  format:"iife",
  target:["es2020"],
  outfile:"public/monster-hunt-d100-real.js",
  minify:true
});

console.log("Built public/activity-auth.js and public/monster-hunt-d100-real.js");
