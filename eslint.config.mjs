import nextVitals from 'eslint-config-next/core-web-vitals';

const config = [
  ...nextVitals,
  {
    rules: {
      'react/no-unescaped-entities': 'off',
      // advisory React-Compiler rules: flagged patterns are intentional in the animation helpers
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/static-components': 'warn',
      // tech-stack logos are remote SVGs; next/image adds nothing there
      '@next/next/no-img-element': 'off',
    },
  },
];
export default config;
