
const API_URL = "http://localhost/api/bookmarks";

/**
* Listen for clicks on the buttons, and send the appropriate message to
* the content script in the page.
*/
function listenForClicks() {
    document.addEventListener("click", (e) => {
        function saveLink(tabs) {
            browser.tabs.query({ active: true, currentWindow: true }).then(function (tabs) {
                const currentURL = tabs[0].url;
                const title = document.getElementById("title").value;
                const tags = document.getElementById("tags").value;

                console.log(currentURL);
                // browser.tabs.sendMessage(tabs[0].id, {
                //     command: "saveLink",
                //     url: currentURL,
                // });
                window.fetch(API_URL, {
                    method: "POST",
                    body: JSON.stringify({
                        user_id: 1,
                        title: title,
                        tags: tags,
                        url: currentURL
                    }),
                    headers: {
                        "Content-type": "application/json; charset=UTF-8"
                    }
                }).then(function (response) {
                    console.log(response);
                });
            });
        }


        /**
        * Remove the page-hiding CSS from the active tab,
        * send a "reset" message to the content script in the active tab.
        */
        function reset(tabs) {
            browser.tabs.removeCSS({ code: hidePage }).then(() => {
                browser.tabs.sendMessage(tabs[0].id, {
                    command: "reset",
                });
            });
        }

        /**
        * Just log the error to the console.
        */
        function reportError(error) {
            console.error(`Could not save this web page: ${error}`);
        }

        /**
        * Get the active tab,
        * then call "saveLink()" or "reset()" as appropriate.
        */
        if (e.target.tagName !== "BUTTON" || !e.target.closest("#popup-content")) {
            // Ignore when click is not on a button within <div id="popup-content">.
            return;
        }
        if (e.target.type === "reset") {
            browser.tabs
                .query({ active: true, currentWindow: true })
                .then(reset)
                .catch(reportError);
        } else {
            browser.tabs
                .query({ active: true, currentWindow: true })
                .then(saveLink)
                .catch(reportError);
        }
    });
}

/**
* There was an error executing the script.
* Display the popup's error message, and hide the normal UI.
*/
function reportExecuteScriptError(error) {
    document.querySelector("#popup-content").classList.add("hidden");
    document.querySelector("#error-content").classList.remove("hidden");
    console.error(`Failed to execute content script: ${error.message}`);
}

/**
* When the popup loads, inject a content script into the active tab,
* and add a click handler.
* If we couldn't inject the script, handle the error.
*/
browser.tabs
    .executeScript({ file: "/content_scripts/corkboard.js" })
    .then(listenForClicks)
    .catch(reportExecuteScriptError);
