(async () => {
  // Getting job ID
  const jobUrl = new URL(window.location.href);
  const vjk = jobUrl.searchParams.get("vjk");
  const url = `https://indeed.com/viewjob?jk=${vjk}`;

  // Getting location
  const location = document.querySelector(
    "[data-testid='jobsearch-JobInfoHeader-companyLocation']"
  )
    ? document
        .querySelector(
          "[data-testid='jobsearch-JobInfoHeader-companyLocation']"
        )
        .textContent.trim()
    : document
        .querySelector("[data-testid='inlineHeader-companyLocation']")
        .textContent.trim();

  // Find the job title
  const title = document
    .querySelector("[data-testid='jobsearch-JobInfoHeader-title']")
    .textContent.trim();

  const jobDescription = document
    .querySelector("#jobDescriptionText")
    .textContent.trim();

  // Find company name
  const companyName = document
    .querySelector("[data-company-name='true']")
    .textContent.trim();

  const data = {
    url,
    title,
    jobDescription,
    companyName,
    location,
    platform: "Indeed",
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
