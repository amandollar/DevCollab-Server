"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUser = exports.deleteUserById = exports.updateUserById = exports.getUserById = exports.login = exports.resendVerificationEmail = exports.verifyEmail = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const emailService_1 = require("../utils/emailService");
const genereateAvatar_1 = __importDefault(require("../utils/genereateAvatar"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    const image = req.file ? req.file.path : (0, genereateAvatar_1.default)(email);
    try {
        const existingUser = yield User_1.default.findOne({ email });
        if (existingUser)
            return res.status(400).json({ message: "Email already exists" });
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const verificationToken = (0, emailService_1.generateVerificationToken)();
        const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
        const newUser = yield User_1.default.create({
            name,
            image,
            email,
            password: hashedPassword,
            verificationToken,
            verificationExpires,
        });
        // Send verification email
        const emailSent = yield (0, emailService_1.sendVerificationEmail)(email, name, verificationToken);
        if (!emailSent) {
            // If email fails to send, still create user but inform about email issue
            return res.status(201).json({
                message: "Account created successfully! Please check your email for verification. If you don't receive the email, please contact support.",
                user: { name: newUser.name, image: newUser.image, email: newUser.email },
                requiresVerification: true,
            });
        }
        res.status(201).json({
            message: "Account created successfully! Please check your email to verify your account.",
            user: { name: newUser.name, image: newUser.image, email: newUser.email },
            requiresVerification: true,
        });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.register = register;
const verifyEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Verification request received for token:", req.params.token);
    const { token } = req.params;
    console.log("Verification attempt for token:", token);
    try {
        const user = yield User_1.default.findOne({
            verificationToken: token,
            verificationExpires: { $gt: new Date() },
        });
        console.log("User found:", user ? "Yes" : "No");
        if (user) {
            console.log("User verification status:", user.isVerified);
            console.log("Token expires:", user.verificationExpires);
        }
        if (!user) {
            return res.status(400).json({
                message: "Invalid or expired verification token. Please request a new verification email.",
            });
        }
        // Check if user is already verified
        if (user.isVerified) {
            return res.status(400).json({
                message: "Email is already verified. You can now log in to your account.",
            });
        }
        // Update user as verified
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationExpires = undefined;
        yield user.save();
        // Send welcome email
        yield (0, emailService_1.sendWelcomeEmail)(user.email, user.name);
        // Generate JWT token
        const jwtToken = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.status(200).json({
            message: "Email verified successfully! Welcome to DevCollab!",
            user: { name: user.name, email: user.email, image: user.image },
            token: jwtToken,
        });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.verifyEmail = verifyEmail;
const resendVerificationEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        const user = yield User_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.isVerified) {
            return res.status(400).json({ message: "Email is already verified" });
        }
        // Generate new verification token
        const verificationToken = (0, emailService_1.generateVerificationToken)();
        const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
        user.verificationToken = verificationToken;
        user.verificationExpires = verificationExpires;
        yield user.save();
        // Send new verification email
        const emailSent = yield (0, emailService_1.sendVerificationEmail)(email, user.name, verificationToken);
        if (!emailSent) {
            return res
                .status(500)
                .json({
                message: "Failed to send verification email. Please try again later.",
            });
        }
        res
            .status(200)
            .json({
            message: "Verification email sent successfully! Please check your inbox.",
        });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.resendVerificationEmail = resendVerificationEmail;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield User_1.default.findOne({ email });
        if (!user)
            return res.status(404).json({ message: "User not found" });
        // Check if user has a password (for local auth users)
        if (!user.password) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const isMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({ message: "Invalid credentials" });
        // Check if email is verified
        if (!user.isVerified) {
            return res.status(403).json({
                message: "Please verify your email address before logging in. Check your inbox for the verification email.",
                requiresVerification: true,
            });
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        res
            .status(200)
            .json({ user: { name: user.name, email: user.email, image: user.image }, token });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.login = login;
// Get user by ID
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const user = yield User_1.default.findById(id).select("-password -verificationToken -verificationExpires");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
            message: "User retrieved successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                image: user.image,
                isVerified: user.isVerified,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
        });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.getUserById = getUserById;
// Update user by ID
const updateUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { id } = req.params;
    const { name, email, password } = req.body;
    try {
        const user = yield User_1.default.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Check if user is trying to update their own account or is admin
        if (((_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id) === null || _b === void 0 ? void 0 : _b.toString()) !== id) {
            return res
                .status(403)
                .json({ message: "You can only update your own account" });
        }
        // Check if email is being changed and if it's already taken
        if (email && email !== user.email) {
            const existingUser = yield User_1.default.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: "Email already exists" });
            }
        }
        // Update fields
        if (name)
            user.name = name;
        if (email)
            user.email = email;
        if (req.file)
            user.image = req.file.path; // Update image if provided
        if (password) {
            user.password = yield bcrypt_1.default.hash(password, 10);
        }
        yield user.save();
        res.status(200).json({
            message: "User updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                image: user.image,
                isVerified: user.isVerified,
                updatedAt: user.updatedAt,
            },
        });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.updateUserById = updateUserById;
// Delete user by ID
const deleteUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { id } = req.params;
    try {
        const user = yield User_1.default.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Check if user is trying to delete their own account or is admin
        if (((_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id) === null || _b === void 0 ? void 0 : _b.toString()) !== id) {
            return res
                .status(403)
                .json({ message: "You can only delete your own account" });
        }
        yield User_1.default.findByIdAndDelete(id);
        res.status(200).json({
            message: "User deleted successfully",
        });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.deleteUserById = deleteUserById;
// Get current user profile
const getCurrentUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a._id)) {
            return res.status(401).json({ message: "Authentication required" });
        }
        const user = yield User_1.default.findById(req.user._id).select("-password -verificationToken -verificationExpires");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
            message: "User profile retrieved successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                image: user.image,
                isVerified: user.isVerified,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
        });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.getCurrentUser = getCurrentUser;
