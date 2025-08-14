"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generateAvatar = (email) => {
    // Simple avatar generation logic based on email hash
    const hash = require('crypto').createHash('md5').update(email).digest('hex');
    return `https://www.gravatar.com/avatar/${hash}?d=identicon`;
};
exports.default = generateAvatar;
