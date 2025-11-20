export default {
  plugins: {
    // ensure PostCSS/Tailwind reads the CJS config where `content` globs are defined
    tailwindcss: { config: './tailwind.config.cjs' },
    autoprefixer: {},
  },
}
