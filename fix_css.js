const fs = require('fs');
const filePath = 'c:/Users/User/Desktop/marketPulse/frontend/src/App.css';
let content = fs.readFileSync(filePath, 'utf8');

// The file has a corrupted string at the end.
// We'll find the last standard valid block: ".privacy-accept.is-accepted svg {"
const searchStr = ".privacy-accept.is-accepted svg {\r\n  animation: checkmarkPop 0.4s ease forwards;\r\n}";
let searchStrUnix = ".privacy-accept.is-accepted svg {\n  animation: checkmarkPop 0.4s ease forwards;\n}";

let validEndIndex = content.lastIndexOf(searchStr);
if (validEndIndex === -1) {
    validEndIndex = content.lastIndexOf(searchStrUnix);
}

if (validEndIndex !== -1) {
    // Slice off everything after the valid block
    let newContent = content.slice(0, validEndIndex + searchStr.length);
    if (validEndIndex === -1 && content.lastIndexOf(searchStrUnix) !== -1) {
        newContent = content.slice(0, content.lastIndexOf(searchStrUnix) + searchStrUnix.length);
    }

    // Append our new stuff
    const cssToAppend = `

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
    fs.writeFileSync(filePath, newContent + cssToAppend, 'utf8');
    console.log("SUCCESS");
} else {
    console.log("Could not find the target string to truncate.");
}
