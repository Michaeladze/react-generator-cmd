const commonStylesTemplate = (name) => {
  return `//@font-face {
//  font-weight: 400;
//  font-family: 'Roboto';
//  font-style: normal;
//  src: url('../assets/fonts/Roboto/Roboto-Regular.ttf') format('truetype');
//}
//
//@font-face {
//  font-weight: 500;
//  font-family: 'Roboto';
//  font-style: normal;
//  src: url('../assets/fonts/Roboto/Roboto-Medium.ttf') format('truetype');
//}
//
//@font-face {
//  font-weight: 700;
//  font-family: 'Roboto';
//  font-style: normal;
//  src: url('../assets/fonts/Roboto/Roboto-Bold.ttf') format('truetype');
//}
//
//@font-face {
//  font-weight: 900;
//  font-family: 'Roboto';
//  font-style: normal;
//  src: url('../assets/fonts/Roboto/Roboto-Black.ttf') format('truetype');
//}

html {
  height: 100%;
  font-size: 16px;
}

body {
  height: 100%;
  min-width: 420px;
  min-height: 700px;
  margin: 0;
  padding: 0;
  font-family: 'Roboto', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #fefefe;
  cursor: default;
}

// Safari bounce fix
@media (max-width: 768px) {
  html,
  body {
    width: 100%;
    height: 100%;
    position: fixed;
    overflow: hidden;
  }
}

* {
  box-sizing: border-box;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}

h1,
h2,
h3,
h4,
h5,
h6,
ul,
p,
input,
button,
textarea {
  margin: 0;
  padding: 0;
  font-family: inherit;
}

input,
textarea {
  font-family: sans-serif;
}

// кастомный скролл
::-webkit-scrollbar-track {
  border-radius: 10px;
}

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
  position: relative;
  left: 8px;
}

::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: rgba(85, 85, 85, 0.3);
}

// запрет на ресайз textarea
body textarea {
  resize: none;
}

a {
  text-decoration: none;
}

button,
input,
textarea,
a {
  outline: none;
}

ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

@media (max-width: 768px) {
  ::-webkit-scrollbar {
    width: 0;
  }
}

// Classes

#root {
  max-width: 1920px;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  overflow-y: auto;
}
`
}

const colorsStylesTemplate = () => {
  return `/*
\tbase - основной цвет фона или текста
\tfaint - второстепенный текст или фон
\taccent - корпоративный цвет
\tcomplement - дополнительный accent
\tdanger - ошибки
\twarning - не критические ошибки
\tsuccess - успех
*/

:root {

  // ---------------------------
  // Colors
  // ---------------------------
  
  --base-000: #FFFFFF;
  --base-100: #F7F9FC;
  --base-200: #E4E9F2;
  --base-300: #C5CEE0;
  --base-400: #8F9BB3;
  --base-500: #5D6A87;
  --base-600: #2E3A59;
  --base-700: #222B45;
  --base-800: #192038;
  --base-900: #151A30;
  --base-1000: #000000;

  --accent-100: #F2F6FF;
  --accent-200: #D9E4FF;
  --accent-300: #A6C0FF;
  --accent-400: #5987FF;
  --accent-500: #3369FF;
  --accent-600: #274FDB;
  --accent-700: #1A3AB8;
  --accent-800: #102894;
  --accent-900: #091C7A;

  --complement-100: #FFF2FA;
  --complement-200: #FFD9EF;
  --complement-300: #FFA6DA;
  --complement-400: #FF59BA;
  --complement-500: #E42896;
  --complement-600: #CA0075;
  --complement-700: #AF0467;
  --complement-800: #95075A;
  --complement-900: #7A094B;

  --faint-100: rgba(93, 106, 135, 0.08);
  --faint-200: rgba(93, 106, 135, 0.16);
  --faint-300: rgba(93, 106, 135, 0.24);
  --faint-400: rgba(93, 106, 135, 0.32);
  --faint-500: rgba(93, 106, 135, 0.4);
  --faint-600: rgba(93, 106, 135, 0.48);
  --faint-900: #02020380;

  --success-100: #F0FFF5;
  --success-200: #CCFCE3;
  --success-300: #8CFAC7;
  --success-400: #2CE59B;
  --success-500: #00D68F;
  --success-600: #00B887;
  --success-700: #00997A;
  --success-800: #007D6C;
  --success-900: #004A45;

  --warning-100: #FFFDF2;
  --warning-200: #FFF1C2;
  --warning-300: #FFE59E;
  --warning-400: #FFC94D;
  --warning-500: #FFAA00;
  --warning-600: #DB8B00;
  --warning-700: #B86E00;
  --warning-800: #945400;
  --warning-900: #703C00;

  --danger-100: #FFF2F2;
  --danger-200: #FFD6D9;
  --danger-300: #FFA8B4;
  --danger-400: #FF708D;
  --danger-500: #FF3D71;
  --danger-600: #DB2C66;
  --danger-700: #B81D5B;
  --danger-800: #94124E;
  --danger-900: #700940;

  // ---------------------------
  // Shadows
  // ---------------------------

  --shadow-strong: 0 15px 30px rgba(0, 2, 82, 0.15);
  --shadow-weak: 0 2px 4px rgba(0, 2, 82, 0.2);

  --basic-shadow-long: 0px 2px 16px rgba(25, 59, 104, 0.1), 0px 8px 32px rgba(25, 59, 104, 0.15);
  --basic-shadow: 0px 0px 32px rgba(0, 40, 130, 0.25);
}
`;
}

const mixinsStylesTemplate = () => {
  return `
`;
}

const indexStylesTemplate = () => {
  return `@import "common";
@import "mixins";
@import "colors";
`;
}

module.exports = { commonStylesTemplate, colorsStylesTemplate, mixinsStylesTemplate, indexStylesTemplate };
