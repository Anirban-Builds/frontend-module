import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  pluginReact.configs.flat.recommended,
  js.configs.recommended,
  { files: ["**/*.{js,mjs,cjs,jsx}"],
    plugins: { js,
      react : pluginReact
     },
    languageOptions: { globals: globals.browser },
    rules : {
      "react/react-in-jsx-scope": "off",
      "react/prop-types" : "off"
    }
  },
  {
    files: ["tests/**/*.js"],
    languageOptions: {
      globals: globals.node
    }
  }

]);
