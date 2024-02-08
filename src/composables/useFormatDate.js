const datePartsToObject = (dateParts) => {
  const object = new Object;
  for (const item of dateParts) {
    if (item.type === "literal") continue;
    Object.assign(object, { [item.type]: item.value });
  }
  return object;
};

const dayChecker = (x) => {
  if (x > 3 && x < 21) return "ᵗʰ";
  switch (x % 10) {
    case 1: return "ˢᵗ";
    case 2: return "ⁿᵈ";
    case 3: return "ʳᵈ";
    default: return "ᵗʰ";
  }
};

const ampm = (x) => {
  if (x.dayPeriod === "p.m.") { return "PM"; }
  if (x.dayPeriod === "a.m.") { return "AM"; }
};

export const formatDate = (date) => {
  let dateObject;
  let dateString;
  let options;
  try {
    date = new Date(date);
    options = {
      year: "numeric", month: "short", day: "numeric",
      hour: "numeric", minute: "numeric", second: "numeric",
      weekday: "short",
      hour12: true,
      timeZone: "America/Toronto",
      timeZoneName: "short",
    };
    dateObject = datePartsToObject(new Intl.DateTimeFormat("en-CA", options).formatToParts(date));
    dateString = `${dateObject.weekday} ${dateObject.month} ${dateObject.day}${dayChecker(dateObject.day)} ${dateObject.year} ${dateObject.hour}:${dateObject.minute} ${ampm(dateObject)}`;

  } catch (e) {
    return "Invalid Date";
  }
  return dateString;
};