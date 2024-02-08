// chars
const specials = "!#$%&()*+-.:<=>?[]_{}";
const numbers = "0123456789";
const alpha = "ABCDEFGHIJKLMNOQRSTUVWXYZabcdefghijklmnoqrstuvwxyz";
const vowels = "aeiouy";
const consonants = "bcdfghjklmnqrstvwxz";
const domains = [".com", ".net", ".me", ".org", ".ca"];

// chars arrays
const specialsArray = specials.split("");
const numbersArray = numbers.split("");
const alphaArray = alpha.split("");
const vowelsArray = vowels.split("");
const consonantsArray = consonants.split("");

// Shuffle function
function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}

export const generatePassword = (numberOfChars = 16) => {
  const password = [];
  const numOfSpecials = Math.floor(Math.random() * 3) + 1; // 1 to 3
  const numOfNumbers = Math.floor(Math.random() * 4) + 1; // 1 to 4
  const numOfAlpha = numberOfChars - (numOfSpecials + numOfNumbers);
  for (let i = 0; i < numOfSpecials; i++) {
    password.push(specialsArray[Math.floor(Math.random() * specialsArray.length)]);
  }
  for (let i = 0; i < numOfNumbers; i++) {
    password.push(numbersArray[Math.floor(Math.random() * numbersArray.length)]);
  }
  for (let i = 0; i < numOfAlpha; i++) {
    password.push(alphaArray[Math.floor(Math.random() * alphaArray.length)]);
  }
  shuffle(password);
  return password.join("");
};

export const generateName = (numberOfChars = Math.floor(Math.random() * 6) + 4) => {
  const name = [];
  for (let i = 0; i < numberOfChars; i++) {
    if (Math.random() > 0.5) {
      name.push(vowelsArray[Math.floor(Math.random() * vowelsArray.length)]);
    } else {
      name.push(consonantsArray[Math.floor(Math.random() * consonantsArray.length)]);
    }
  }
  return name.join("");
};

export const generateEmail = () => {
  const email = [];
  email.push(generateName());
  email.push(".");
  email.push(generateName());
  email.push("@");
  email.push(generateName());
  email.push(domains[Math.floor(Math.random() * domains.length)]);
  return email.join("");
};