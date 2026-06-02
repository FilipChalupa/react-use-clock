module.exports = {
  "stories": [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions"
  ],
  "framework": "@storybook/react",
  "core": {
    "builder": "@storybook/builder-webpack5"
  },
  // Storybook 6.5's react-docgen-typescript plugin uses TS factory APIs removed
  // in TypeScript 5/6. Use the AST-based react-docgen instead to stay compatible.
  "typescript": {
    "reactDocgen": "react-docgen"
  }
}