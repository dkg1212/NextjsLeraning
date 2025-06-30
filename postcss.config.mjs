// postcss.config.mjs

const config = {
  plugins: [
    // Use a nested array to pass options to the @tailwindcss/postcss plugin
    // Format: [ 'plugin-name', { options } ]
    [
      '@tailwindcss/postcss',
      {
        // The configuration object that would normally go in tailwind.config.js
        config: {
          darkMode: 'class',
          content: [
            './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
            './src/components/**/*.{js,ts,jsx,tsx,mdx}',
            './src/app/**/*.{js,ts,jsx,tsx,mdx}',
          ],
        },
      },
    ],
  ],
};

export default config;