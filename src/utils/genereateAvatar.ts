
const generateAvatar = (email: string): string => {
  // Simple avatar generation logic based on email hash
  const hash = require('crypto').createHash('md5').update(email).digest('hex');
  return `https://www.gravatar.com/avatar/${hash}?d=identicon`;
};

export default generateAvatar;