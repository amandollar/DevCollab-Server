import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";
import {
  sendVerificationEmail,
  sendWelcomeEmail,
  generateVerificationToken,
} from "../utils/emailService";
import generateAvatar from "../utils/genereateAvatar";

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const image = req.file ? req.file.path : generateAvatar(email);
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = generateVerificationToken();
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const newUser = await User.create({
      name,
      image,
      email,
      password: hashedPassword,
      verificationToken,
      verificationExpires,
    });

    // Send verification email
    const emailSent = await sendVerificationEmail(
      email,
      name,
      verificationToken
    );

    if (!emailSent) {
      // If email fails to send, still create user but inform about email issue
      return res.status(201).json({
        message:
          "Account created successfully! Please check your email for verification. If you don't receive the email, please contact support.",
        user: { name: newUser.name,image:newUser.image,email:newUser.email},
        requiresVerification: true,
      });
    }

    res.status(201).json({
      message:
        "Account created successfully! Please check your email to verify your account.",
      user: { name: newUser.name,image:newUser.image,email:newUser.email},
      requiresVerification: true,
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  console.log("Verification request received for token:", req.params.token);

  const { token } = req.params;

  console.log("Verification attempt for token:", token);

  try {
    const user = await User.findOne({
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
        message:
          "Invalid or expired verification token. Please request a new verification email.",
      });
    }

    // Check if user is already verified
    if (user.isVerified) {
      return res.status(400).json({
        message:
          "Email is already verified. You can now log in to your account.",
      });
    }

    // Update user as verified
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationExpires = undefined;
    await user.save();

    // Send welcome email
    await sendWelcomeEmail(user.email, user.name);

    // Generate JWT token
    const jwtToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Email verified successfully! Welcome to DevCollab!",
      user: { name: user.name, email: user.email, image: user.image },
      token: jwtToken,
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const resendVerificationEmail = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Email is already verified" });
    }

    // Generate new verification token
    const verificationToken = generateVerificationToken();
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    user.verificationToken = verificationToken;
    user.verificationExpires = verificationExpires;
    await user.save();

    // Send new verification email
    const emailSent = await sendVerificationEmail(
      email,
      user.name,
      verificationToken
    );

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
        message:
          "Verification email sent successfully! Please check your inbox.",
      });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if user has a password (for local auth users)
    if (!user.password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // Check if email is verified
    if (!user.isVerified) {
      return res.status(403).json({
        message:
          "Please verify your email address before logging in. Check your inbox for the verification email.",
        requiresVerification: true,
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: "7d",
    });

    res
      .status(200)
      .json({ user: { name: user.name, email: user.email, image: user.image }, token });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Get user by ID
export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).select(
      "-password -verificationToken -verificationExpires"
    );

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
        createdAt: (user as any).createdAt,
        updatedAt: (user as any).updatedAt,
      },
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Update user by ID
export const updateUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user is trying to update their own account or is admin
    if ((req.user as any)?._id?.toString() !== id) {
      return res
        .status(403)
        .json({ message: "You can only update your own account" });
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }
    }

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (req.file) user.image = req.file.path; // Update image if provided
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    res.status(200).json({
      message: "User updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
        isVerified: user.isVerified,
        updatedAt: (user as any).updatedAt,
      },
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};


// Delete user by ID
export const deleteUserById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user is trying to delete their own account or is admin
    if ((req.user as any)?._id?.toString() !== id) {
      return res
        .status(403)
        .json({ message: "You can only delete your own account" });
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Get current user profile
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    if (!(req.user as any)?._id) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const user = await User.findById((req.user as any)._id).select(
      "-password -verificationToken -verificationExpires"
    );

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
        createdAt: (user as any).createdAt,
        updatedAt: (user as any).updatedAt,
      },
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

