// ==UserScript==
// @name         JOL+ Experimental
// @namespace    https://github.com/ieksobeh
// @version      1.0.8
// @description  Various JOL improvements for noobs like myself
// @author       shmug / ieksobeh
// @match	 https://deckserver.net/jol/*
// @match	 https://www.deckserver.net/jol/*
// @run-at       document-idle
// @grant        GM_addStyle
// @downloadURL https://raw.githubusercontent.com/ieksobeh/jolplus/refs/heads/main/script_exp.js
// @updateURL https://raw.githubusercontent.com/ieksobeh/jolplus/refs/heads/main/script_exp.js
// ==/UserScript==

/* jshint esversion: 6 */

/* Written for https://tampermonkey.net */
/* https://raw.githubusercontent.com/ieksobeh/jolplus/refs/heads/main/script.js */

GM_addStyle("details {font-size: .875rem;margin-left: 5px;}");
GM_addStyle("pre {font-family: monospace;}");
GM_addStyle("#preview {height: 250px}");
GM_addStyle("#preview img {height: 250px; object-fit: contain;}");
GM_addStyle("#popup { position: fixed; top: 0; right: 0;}");
GM_addStyle("#popup img { width: 250px; }");

(function(window) {
  "use strict";

  document.body.innerHTML += "<div id='popup' />";

  /*
   * Example command tech
   */
  unsafeWindow.populateCommand = el => {
    const command = document.getElementById("command");
    command.value = el.selectedOptions[0].innerText;
    command.focus();
  };

  const drawOptions = () => {
    return `
      <div class="form-group form-row mb-1">
<details>
<summary tabindex="-1">Help</summary>
<pre>
pool     [PLAYER] [+|-]AMOUNT
blood    [PLAYER] [REGION CARD] [+|-]AMOUNT
capacity [PLAYER] [REGION] CARD [+|-]amount
discard  CARD|random [ draw]
draw     [crypt] [NUM]
edge     [PLAYER] [burn]
label    [PLAYER] [REGION] CARD [text here]
move     [SRCPLAYER] [SRCREGION] CARD [→ PLAYER] [→ REGION] [→ CARD]
order    index1 index2 index3 index4 index5
play     [vamp] CARD [PLAYER] [REGION] [CARD] [draw]
random   [NUMBER]
show     [REGION] amount [[PLAYER]|all]
shuffle  [PLAYER] [REGION] [num]
transfer [REGION] VAMP [+|-]AMOUNT
lock     [PLAYER] [REGION] CARD
unlock   [PLAYER] [REGION] [CARD]
votes    [PLAYER] [REGION CARD] [+|-]AMOUNT</pre>
</details>
      </div>`;
  };

  /*
   * Card preview tech
   */
  document.getElementById("loaded").innerHTML += "<div id='preview' />";
  const preview = document.getElementById("preview");

  const commands = document.querySelector(
    "#playerCommands .form-group:nth-child(2)"
  );

  commands.insertAdjacentHTML("afterend", drawOptions());

  const drawCards = () => {
    document
      .getElementById("playerHand")
      .querySelectorAll(".card-name")
      .forEach(card => {
        appendCard(cleanCard(card.innerText));
      });
  };

  const clearOusted = () => {
    document
      .getElementById("state")
      .querySelectorAll(".col-sm")
      .forEach(pState => {
        if(pState.innerHTML.includes("pool-ousted")) { pState.style="visibility:collapse;"};
        /* if(pState.innerHTML.includes("pool-ousted")) { pState.style="opacity:0.25;"}; */
      });
  };

  const clearPreview = () => {
    preview.innerHTML = "";
  };

  const cleanCard = name => {
    return name.toLowerCase().replace(/\W/g, "");
  };

  const appendCard = name => {
    preview.innerHTML += `<a href='https://vdb.im/library?q=%7B%22text%22%3A%5B%7B%22value%22%3A%22${name}%22%2C%22logic%22%3A%22and%22%7D%5D%7D'><img src='https://vdb.im/images/cards/en-EN/${name}.jpg'></a>`;
  };

  // Select the node that will be observed for mutations
  const playerHand = document.getElementById("playerHand");
  const playerState = document.getElementById("state");

  new MutationObserver((mutationsList, observer) => {
    let pState;

    for (const mutation of mutationsList) {
      if (mutation.type === "childList") {
        clearOusted();
      }
    }
  }).observe(playerState, {
    attributes: true,
    childList: true,
    subtree: true
  });

  new MutationObserver((mutationsList, observer) => {
    let cards;

    for (const mutation of mutationsList) {
      if (mutation.type === "childList") {
        clearPreview();
        drawCards();
      }
    }
  }).observe(playerHand, {
    attributes: true,
    childList: true,
    subtree: true
  });
})(window);
