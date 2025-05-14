(async () => {
  // Getting job ID
  const url = window.location.href;

  const postingDate = relativeTimeToISO(
    document
      .querySelector("[data-testid='job-details-published-date']")
      .textContent.trim()
  );

  // Getting location
  const location = document
    .querySelector("[data-testid='job-fact-location']")
    .textContent.trim();

  // Find the job title
  const title = document
    .querySelector("[data-testid='job-details-title'] > h1")
    .textContent.trim();

  const jobDescription = document
    .querySelectorAll("[data-testid='expandable-content']")[0]
    .textContent.trim();

  // Find company name
  const companyName = document
    .querySelector("[data-testid='job-details-company-info-name']")
    .textContent.trim();

  const data = {
    url,
    title,
    jobDescription,
    companyName,
    postingDate,
    location,
    platform: "Xing",
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

function relativeTimeToISO(relativeTime) {
  const now = new Date();

  const match = relativeTime.match(
    /(\d+)\s*(minute|minutes|hour|hours|day|days|week|weeks|month|months|year|years)\s+ago/
  );

  if (match) {
    const value = parseInt(match[1], 10);
    const unit = match[2].toLowerCase();

    if (unit.startsWith("minute")) {
      now.setMinutes(now.getMinutes() - value);
    } else if (unit.startsWith("hour")) {
      now.setHours(now.getHours() - value);
    } else if (unit.startsWith("day")) {
      now.setDate(now.getDate() - value);
    } else if (unit.startsWith("week")) {
      now.setDate(now.getDate() - value * 7);
    } else if (unit.startsWith("month")) {
      now.setMonth(now.getMonth() - value);
    } else if (unit.startsWith("year")) {
      now.setFullYear(now.getFullYear() - value);
    } else {
      return undefined; // Unsupported format
    }

    return now.toISOString();
  }

  return undefined; // Invalid input
}
