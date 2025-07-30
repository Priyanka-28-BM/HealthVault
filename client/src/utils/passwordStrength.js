// client/src/utils/passwordStrength.js

const commonPasswords = [
  "123456", "password", "123456789", "12345678", "12345",
  "111111", "1234567", "sunshine", "qwerty", "iloveyou",
  "princess", "admin", "welcome", "666666", "abc123",
];

export function checkPasswordStrength(password) {
  let score = 0;
  const suggestions = [];

  if (!password) {
    return { score: 0, strength: "Empty", color: "gray", suggestions: ["Enter a password"] };
  }

  if (password.length >= 12) {
    score += 3;
  } else if (password.length >= 8) {
    score += 2;
    suggestions.push("Use 12 or more characters for stronger password.");
  } else {
    suggestions.push("Password should be at least 8 characters.");
  }

  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    suggestions.push("Add lowercase letters.");
  }

  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    suggestions.push("Add uppercase letters.");
  }

  if (/\d/.test(password)) {
    score += 1;
  } else {
    suggestions.push("Include numbers.");
  }

  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 2;
  } else {
    suggestions.push("Add special characters (e.g., !, @, #).");
  }

  // Check for common passwords
  if (commonPasswords.includes(password.toLowerCase())) {
    return {
      score: 0,
      strength: "Very Weak",
      color: "red",
      suggestions: ["This password is too common. Choose a more unique one."],
    };
  }

  // Check for repetitive or sequential characters (like 'aaa', '1234', 'abcd')
  if (/(.)\1{2,}/.test(password)) {
    suggestions.push("Avoid repeated characters.");
    score = Math.max(0, score - 2);
  }
  if (/(012|123|234|345|456|567|678|789|abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/i.test(password)) {
    suggestions.push("Avoid sequential characters.");
    score = Math.max(0, score - 2);
  }

  // Clamp score between 0 and 10
  score = Math.min(Math.max(score, 0), 10);

  // Define strength levels
  let strength = "";
  let color = "";

  if (score >= 8) {
    strength = "Very Strong";
    color = "green";
  } else if (score >= 6) {
    strength = "Strong";
    color = "limegreen";
  } else if (score >= 4) {
    strength = "Medium";
    color = "orange";
  } else if (score >= 2) {
    strength = "Weak";
    color = "orangered";
  } else {
    strength = "Very Weak";
    color = "red";
  }

  return { score, strength, color, suggestions };
}
