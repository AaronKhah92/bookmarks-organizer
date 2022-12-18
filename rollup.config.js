import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";

export default {
  input: "./client/index.js",
  output: {
    file: "./client/bundle.js",
    format: "iife",
  },
  plugins: [resolve(), commonjs()],
};
