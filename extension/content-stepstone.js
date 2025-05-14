(async () => {
  // Getting job ID
  const url = window.location.href.split("?")[0];

  const postingDate = relativeTimeToISO(
    document
      .querySelector('svg[data-genesis-element="CalendarIcon"]')
      ?.parentElement?.parentElement?.querySelector(
        ':scope > *:not(:has(svg[data-genesis-element="CalendarIcon"])) span'
      )
      ?.textContent.trim()
  );

  // Getting location
  const location = document
    .querySelectorAll('svg[data-genesis-element="MapMarkerIcon"]')[1]
    ?.parentElement?.parentElement?.querySelector(
      ':scope > *:not(:has(svg[data-genesis-element="MapMarkerIcon"])) span'
    )
    ?.textContent.trim();

  // Find the job title
  const title = document
    .querySelector("span[data-at='header-job-title']")
    .textContent.trim();

  const jobDescription = document
    .querySelector("[data-at='job-ad-content']")
    .textContent.trim();

  // Find company name
  const companyName = document
    .querySelectorAll('svg[data-genesis-element="BriefcaseIcon"]')[0]
    ?.parentElement?.parentElement?.querySelector(
      ':scope > *:not(:has(svg[data-genesis-element="BriefcaseIcon"])) span'
    )
    ?.textContent.trim();

  const data = {
    url,
    title,
    jobDescription,
    companyName,
    postingDate,
    location,
    platform: "Stepstone",
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
