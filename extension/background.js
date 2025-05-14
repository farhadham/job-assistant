chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "postJobData") {
    fetch("http://localhost:3007/api/job-posting/extension", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message.data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          // Handle error response from server
          sendResponse({ success: false, error: data.error });
        } else {
          sendResponse({ success: true, data });
        }
      })
      .catch((error) => {
        console.error("Error sending data to API:", error);
        sendResponse({ success: false, error: error.message });
      });

    // Return true to indicate that sendResponse will be called asynchronously
    return true;
  }

  if (message.action === "showError" || message.action === "showSuccess") {
    // Forward these messages to the popup if it's open
    chrome.runtime.sendMessage(message);
    return true;
  }
});
