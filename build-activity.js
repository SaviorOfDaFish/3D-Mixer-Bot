const esbuild = require("esbuild");
esbuild.buildSync({
  entryPoints:["public/activity-auth-source.js"],
  bundle:true,
  platform:"browser",
  format:"iife",
  target:["es2020"],
  outfile:"public/activity-auth.js",
  minify:true
});
console.log("Built public/activity-auth.js");
