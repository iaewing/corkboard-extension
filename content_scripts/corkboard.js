(() => {
  /**
   * Check and set a global guard variable.
   * If this content script is injected into the same page again,
   * it will do nothing next time.
   */
  if (window.hasRun) {
    return;
  }
  window.hasRun = true;

  // function saveLink(url) {
  // fetch("localhost/api/1/bookmarks", {
  //   method: "POST",
  //   body: JSON.stringify({
  //     userId: 1,
  //     title: "Fix my bugs",
  //     url: url
  //   }),
  //   headers: {
  //     "Content-type": "application/json; charset=UTF-8"
  //   }
  // });

  // }

  /**
   * Listen for messages from the background script..
   */
  browser.runtime.onMessage.addListener((message) => {
    if (message.command === "saveLink") {
      saveLink(message.url);
    }
  });
})();
