(async () => {
  // Getting job ID
  const jobUrl = new URL(window.location.href);
  const url = jobUrl.origin + jobUrl.pathname;

  const postingDate = new Date(
    document
      .querySelector("[color='text.subtle']")
      .textContent.trim()
      .replace(/^Posted on /, "")
  ).toISOString();

  // Getting location
  const location = document
    .querySelectorAll("[class='sc-beqWaB bpXRKw']")[2]
    .textContent.trim();

  // Find the job title
  const title = document.querySelector("h2").textContent.trim();

  const jobDescription = document
    .querySelector("[data-testid='careerPage']")
    .textContent.trim();

  // Find company name
  const companyName = document
    .querySelectorAll("[class='sc-beqWaB bpXRKw']")[0]
    .textContent.trim();

  const data = {
    url,
    title,
    jobDescription,
    companyName,
    postingDate,
    location,
    platform: "Imagine jobs",
  };

  // Send data to local API
  chrome.runtime.sendMessage(
    {
      action: "postJobData",
      data,
    },
    (response) => {
      if (response) {
        if (!response.success && response.error) {
          // Show error message in the popup
          chrome.runtime.sendMessage({
            action: "showError",
            error: response.error,
          });
        } else {
          // Show success message
          chrome.runtime.sendMessage({
            action: "showSuccess",
            message: "Job data saved successfully!",
          });
        }
      }
    }
  );
})();
