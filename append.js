const fs = require('fs');
const css = `

input, select, textarea { font-size: 16px !important; }

/* GLOBAL BACK BUTTON OVERRIDES */
button[aria-label='Go back'],
button[aria-label='Back'],
.market-category-back,
.ledger-back,
.profile-back,
.language-back,
.forgot-pin-back {
  background-color: #052e16 !important;
  color: #ffffff !important;
  border-radius: 50% !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  border: none !important;
  box-shadow: 0 4px 12px rgba(5, 46, 22, 0.2) !important;
}

button[aria-label='Go back'] svg,
button[aria-label='Back'] svg,
.market-category-back svg,
.ledger-back svg,
.profile-back svg,
.language-back svg,
.forgot-pin-back svg {
  stroke-width: 3px !important;
  stroke-linecap: round !important;
  stroke-linejoin: round !important;
  fill: none !important;
  stroke: #ffffff !important;
  width: 26px !important;
  height: 26px !important;
}
`;

fs.appendFileSync('c:/Users/User/Desktop/marketPulse/frontend/src/App.css', css);
console.log("CSS appended.");
