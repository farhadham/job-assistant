(async () => {
  // Getting job ID
  const parts = window.location.href.split("/");
  const jobId = parts[parts.indexOf("view") + 1]; // Get the number after "view"
  const url = `https://linkedin.com/jobs/view/${jobId}`;

  // Getting Posting date in ISO format
  const postingDate = relativeTimeToISO(
    document
      .querySelector(
        "[class='t-black--light mt2 job-details-jobs-unified-top-card__tertiary-description-container']  > span > span:nth-child(3)"
      )
      .textContent.trim()
  );

  // Getting location
  const location = document
    .querySelector(
      "[class='t-black--light mt2 job-details-jobs-unified-top-card__tertiary-description-container']  >span > span:nth-child(1)"
    )
    .textContent.trim();

  // Find the job title
  const title = document.querySelector("h1").textContent.trim();

  const jobDescription = document
    .querySelector("#job-details > div.mt4 > p")
    .textContent.trim();

  const companyElement = document.querySelector(
    "[class='job-details-jobs-unified-top-card__company-name'] > a"
  );

  // Find company name
  const companyName = companyElement.textContent.trim();
  // Find company link
  const companyUrl = companyElement
    .getAttribute("href")
    .replace(/\/life\/?$/, "");

  const recruiterElement = document.querySelector(
    "div.hirer-card__hirer-information > a"
  );

  let recruiter;

  if (recruiterElement) {
    recruiter = recruiterElement.getAttribute("href") ?? undefined;
  }

  const data = {
    url,
    title,
    jobDescription,
    companyName,
    companyUrl,
    postingDate,
    recruiter,
    location,
    platform: "LinkedIn",
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

  // Remove "Reposted " prefix if it exists
  if (relativeTime.startsWith("Reposted ")) {
    relativeTime = relativeTime.slice("Reposted ".length);
  }

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
