const path = require("path");
const pkg = require("./package");
const ASSET_PATH = process.env.ASSET_PATH || "/";

module.exports = {
  entry: [
    "src/polyfills.js",
    "src/index.js"
  ],
  html: {
    title: pkg.productName,
    description: pkg.description,
    template: path.join(__dirname, "index.ejs")
  },
  transformModules: ["pico-asm"],
  postcss: {
    plugins: [
      // Your postcss plugins
    ]
  },
  presets: [
    require("poi-preset-bundle-report")()
  ],
  webpack: function (config) {
    config.output.publicPath = ASSET_PATH;
    config.node = {
      module: "empty",
      net: "empty",
      fs: "empty"
    };
    return config;
  }
};
