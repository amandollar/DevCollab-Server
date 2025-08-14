# DevCollab Server API Documentation

This document provides comprehensive API documentation for the DevCollab server, including all endpoints, request/response formats, and usage examples.

## 📋 Table of Contents

- [Authentication](#authentication)
- [Users](#users)
- [Projects](#projects)
- [Tasks](#tasks)
- [Collaboration](#collaboration)
- [Comments](#comments)
- [Notifications](#notifications)
- [Chat](#chat)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)

## 🔐 Authentication

All protected endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### User Registration

**Endpoint:** `POST /v1/api/auth/register`

**Description:** Register a new user account with email verification

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Optional:** Profile image can be uploaded using `multipart/form-data`

**Response (201):**
```json
{
  "message": "Account created successfully! Please check your email to verify your account.",
  "user": {
    "name": "John Doe",
    "image": "https://res.cloudinary.com/cloud-name/image/upload/v123/avatar.jpg",
    "email": "john@example.com"
  },
  "requiresVerification": true
}
```

**Notes:**
- Password must be at least 6 characters
- Email must be unique
- Profile image is optional (will generate avatar if not provided)
- Verification email is sent automatically
- Image upload supported via multipart/form-data

### User Login

**Endpoint:** `POST /v1/api/auth/login`

**Description:** Authenticate user and receive JWT token

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response (200):**
```json
{
  "user": {
    "name": "John Doe",
    "email": "john@example.com",
    "image": "https://res.cloudinary.com/cloud-name/image/upload/v123/avatar.jpg"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `404`: User not found
- `400`: Invalid credentials
- `403`: Email not verified

### Email Verification

**Endpoint:** `GET /v1/api/auth/verify/:token`

**Description:** Verify user email with verification token

**Response (200):**
```json
{
  "message": "Email verified successfully! Welcome to DevCollab!",
  "user": {
    "name": "John Doe",
    "email": "john@example.com",
    "image": "https://res.cloudinary.com/cloud-name/image/upload/v123/avatar.jpg"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Resend Verification Email

**Endpoint:** `POST /v1/api/auth/resend-verification`

**Description:** Resend verification email for unverified accounts

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response (200):**
```json
{
  "message": "Verification email sent successfully! Please check your inbox."
}
```

## 👥 Users

### Get Current User Profile

**Endpoint:** `GET /v1/api/auth/profile`

**Description:** Get authenticated user's profile information

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "message": "User profile retrieved successfully",
  "user": {
    "id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "name": "John Doe",
    "email": "john@example.com",
    "image": "https://res.cloudinary.com/cloud-name/image/upload/v123/avatar.jpg",
    "isVerified": true,
    "createdAt": "2023-09-01T10:00:00.000Z",
    "updatedAt": "2023-09-01T10:00:00.000Z"
  }
}
```

### Get User by ID

**Endpoint:** `GET /v1/api/auth/:id`

**Description:** Get user profile by ID

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "message": "User retrieved successfully",
  "user": {
    "id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "name": "John Doe",
    "email": "john@example.com",
    "image": "https://res.cloudinary.com/cloud-name/image/upload/v123/avatar.jpg",
    "isVerified": true,
    "createdAt": "2023-09-01T10:00:00.000Z",
    "updatedAt": "2023-09-01T10:00:00.000Z"
  }
}
```

### Update User Profile

**Endpoint:** `PUT /v1/api/auth/:id`

**Description:** Update user profile information

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "John Smith",
  "email": "johnsmith@example.com"
}
```

**Optional:** Profile image can be updated using `multipart/form-data`

**Response (200):**
```json
{
  "message": "User updated successfully",
  "user": {
    "id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "name": "John Smith",
    "email": "johnsmith@example.com",
    "image": "https://res.cloudinary.com/cloud-name/image/upload/v123/new-avatar.jpg",
    "isVerified": true,
    "updatedAt": "2023-09-01T11:00:00.000Z"
  }
}
```

### Delete User Account

**Endpoint:** `DELETE /v1/api/auth/:id`

**Description:** Delete user account (cascades to related data)

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "message": "User deleted successfully"
}
```

**Note:** This will cascade delete all user's projects, tasks, comments, and notifications

## 🚀 Projects

### Create Project

**Endpoint:** `POST /v1/api/project`

**Description:** Create a new project

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "E-commerce Platform",
  "description": "A modern e-commerce platform built with React and Node.js"
}
```

**Response (201):**
```json
{
  "message": "Project created successfully",
  "project": {
    "id": "64f1a2b3c4d5e6f7g8h9i0j2",
    "title": "E-commerce Platform",
    "description": "A modern e-commerce platform built with React and Node.js",
    "owner": "64f1a2b3c4d5e6f7g8h9i0j1",
    "collaborators": [],
    "createdAt": "2023-09-01T10:00:00.000Z",
    "updatedAt": "2023-09-01T10:00:00.000Z"
  }
}
```

### Get User Projects

**Endpoint:** `GET /v1/api/project`

**Description:** Get all projects owned by or collaborated on by the user

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "message": "Projects retrieved successfully",
  "projects": [
    {
      "id": "64f1a2b3c4d5e6f7g8h9i0j2",
      "title": "E-commerce Platform",
      "description": "A modern e-commerce platform built with React and Node.js",
      "owner": {
        "id": "64f1a2b3c4d5e6f7g8h9i0j1",
        "name": "John Doe",
        "email": "john@example.com",
        "image": "https://res.cloudinary.com/cloud-name/image/upload/v123/avatar.jpg"
      },
      "collaborators": [],
      "createdAt": "2023-09-01T10:00:00.000Z",
      "updatedAt": "2023-09-01T10:00:00.000Z"
    }
  ]
}
```

### Get Project by ID

**Endpoint:** `GET /v1/api/project/:id`

**Description:** Get detailed project information

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "message": "Project retrieved successfully",
  "project": {
    "id": "64f1a2b3c4d5e6f7g8h9i0j2",
    "title": "E-commerce Platform",
    "description": "A modern e-commerce platform built with React and Node.js",
    "owner": {
      "id": "64f1a2b3c4d5e6f7g8h9i0j1",
      "name": "John Doe",
      "email": "john@example.com",
      "image": "https://res.cloudinary.com/cloud-name/image/upload/v123/avatar.jpg"
    },
    "collaborators": [],
    "createdAt": "2023-09-01T10:00:00.000Z",
    "updatedAt": "2023-09-01T10:00:00.000Z"
  }
}
```

### Update Project

**Endpoint:** `PUT /v1/api/project/:id`

**Description:** Update project information (owner only)

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "Advanced E-commerce Platform",
  "description": "A modern e-commerce platform with advanced features built with React and Node.js"
}
```

**Response (200):**
```json
{
  "message": "Project updated successfully",
  "project": {
    "id": "64f1a2b3c4d5e6f7g8h9i0j2",
    "title": "Advanced E-commerce Platform",
    "description": "A modern e-commerce platform with advanced features built with React and Node.js",
    "owner": "64f1a2b3c4d5e6f7g8h9i0j1",
    "collaborators": [],
    "updatedAt": "2023-09-01T11:00:00.000Z"
  }
}
```

### Delete Project

**Endpoint:** `DELETE /v1/api/project/:id`

**Description:** Delete project (owner only, cascades to related data)

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "message": "Project deleted successfully"
}
```

**Note:** This will cascade delete all project tasks, comments, chat messages, and collaboration requests

### Add Collaborator

**Endpoint:** `POST /v1/api/project/:id/collaborators`

**Description:** Add a user as a project collaborator

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "userId": "64f1a2b3c4d5e6f7g8h9i0j3"
}
```

**Response (200):**
```json
{
  "message": "Collaborator added successfully",
  "project": {
    "id": "64f1a2b3c4d5e6f7g8h9i0j2",
    "collaborators": ["64f1a2b3c4d5e6f7g8h9i0j3"]
  }
}
```

### Remove Collaborator

**Endpoint:** `DELETE /v1/api/project/:id/collaborators/:userId`

**Description:** Remove a user from project collaborators

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "message": "Collaborator removed successfully"
}
```

## 📋 Tasks

### Create Task

**Endpoint:** `POST /v1/api/task`

**Description:** Create a new task in a project

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "Implement User Authentication",
  "description": "Create login and registration system with JWT",
  "project": "64f1a2b3c4d5e6f7g8h9i0j2",
  "dueDate": "2023-09-15T00:00:00.000Z",
  "priority": "high",
  "assignees": ["64f1a2b3c4d5e6f7g8h9i0j1"]
}
```

**Priority Options:** `low`, `medium`, `high`

**Response (201):**
```json
{
  "message": "Task created successfully",
  "task": {
    "id": "64f1a2b3c4d5e6f7g8h9i0j4",
    "title": "Implement User Authentication",
    "description": "Create login and registration system with JWT",
    "project": "64f1a2b3c4d5e6f7g8h9i0j2",
    "createdBy": "64f1a2b3c4d5e6f7g8h9i0j1",
    "dueDate": "2023-09-15T00:00:00.000Z",
    "priority": "high",
    "assignees": ["64f1a2b3c4d5e6f7g8h9i0j1"],
    "comments": [],
    "createdAt": "2023-09-01T10:00:00.000Z",
    "updatedAt": "2023-09-01T10:00:00.000Z"
  }
}
```

### Get Project Tasks

**Endpoint:** `GET /v1/api/task/project/:projectId`

**Description:** Get all tasks for a specific project

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "message": "Tasks retrieved successfully",
  "tasks": [
    {
      "id": "64f1a2b3c4d5e6f7g8h9i0j4",
      "title": "Implement User Authentication",
      "description": "Create login and registration system with JWT",
      "project": "64f1a2b3c4d5e6f7g8h9i0j2",
      "createdBy": {
        "id": "64f1a2b3c4d5e6f7g8h9i0j1",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "dueDate": "2023-09-15T00:00:00.000Z",
      "priority": "high",
      "assignees": [
        {
          "id": "64f1a2b3c4d5e6f7g8h9i0j1",
          "name": "John Doe",
          "email": "john@example.com"
        }
      ],
      "comments": [],
      "createdAt": "2023-09-01T10:00:00.000Z",
      "updatedAt": "2023-09-01T10:00:00.000Z"
    }
  ]
}
```

### Get Task by ID

**Endpoint:** `GET /v1/api/task/:id`

**Description:** Get detailed task information

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "message": "Task retrieved successfully",
  "task": {
    "id": "64f1a2b3c4d5e6f7g8h9i0j4",
    "title": "Implement User Authentication",
    "description": "Create login and registration system with JWT",
    "project": {
      "id": "64f1a2b3c4d5e6f7g8h9i0j2",
      "title": "E-commerce Platform"
    },
    "createdBy": {
      "id": "64f1a2b3c4d5e6f7g8h9i0j1",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "dueDate": "2023-09-15T00:00:00.000Z",
    "priority": "high",
    "assignees": [
      {
        "id": "64f1a2b3c4d5e6f7g8h9i0j1",
        "name": "John Doe",
        "email": "john@example.com"
      }
    ],
    "comments": [],
    "createdAt": "2023-09-01T10:00:00.000Z",
    "updatedAt": "2023-09-01T10:00:00.000Z"
  }
}
```

### Update Task

**Endpoint:** `PUT /v1/api/task/:id`

**Description:** Update task information

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "Implement User Authentication System",
  "description": "Create comprehensive login and registration system with JWT and email verification",
  "priority": "medium",
  "dueDate": "2023-09-20T00:00:00.000Z"
}
```

**Response (200):**
```json
{
  "message": "Task updated successfully",
  "task": {
    "id": "64f1a2b3c4d5e6f7g8h9i0j4",
    "title": "Implement User Authentication System",
    "description": "Create comprehensive login and registration system with JWT and email verification",
    "priority": "medium",
    "dueDate": "2023-09-20T00:00:00.000Z",
    "updatedAt": "2023-09-01T11:00:00.000Z"
  }
}
```

### Delete Task

**Endpoint:** `DELETE /v1/api/task/:id`

**Description:** Delete a task

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "message": "Task deleted successfully"
}
```

### Assign Task

**Endpoint:** `POST /v1/api/task/:id/assign`

**Description:** Assign or reassign task to users

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "assignees": ["64f1a2b3c4d5e6f7g8h9i0j1", "64f1a2b3c4d5e6f7g8h9i0j3"]
}
```

**Response (200):**
```json
{
  "message": "Task assigned successfully",
  "task": {
    "id": "64f1a2b3c4d5e6f7g8h9i0j4",
    "assignees": ["64f1a2b3c4d5e6f7g8h9i0j1", "64f1a2b3c4d5e6f7g8h9i0j3"]
  }
}
```

## 🤝 Collaboration

### Send Collaboration Request

**Endpoint:** `POST /v1/api/collaboration/request`

**Description:** Send a collaboration request to join a project

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "project": "64f1a2b3c4d5e6f7g8h9i0j2",
  "message": "I'd like to contribute to this project. I have experience with React and Node.js."
}
```

**Response (201):**
```json
{
  "message": "Collaboration request sent successfully",
  "request": {
    "id": "64f1a2b3c4d5e6f7g8h9i0j5",
    "project": "64f1a2b3c4d5e6f7g8h9i0j2",
    "requester": "64f1a2b3c4d5e6f7g8h9i0j3",
    "status": "pending",
    "message": "I'd like to contribute to this project. I have experience with React and Node.js.",
    "createdAt": "2023-09-01T10:00:00.000Z"
  }
}
```

### Get Received Requests

**Endpoint:** `GET /v1/api/collaboration/received`

**Description:** Get collaboration requests received by the user

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "message": "Collaboration requests retrieved successfully",
  "requests": [
    {
      "id": "64f1a2b3c4d5e6f7g8h9i0j5",
      "project": {
        "id": "64f1a2b3c4d5e6f7g8h9i0j2",
        "title": "E-commerce Platform"
      },
      "requester": {
        "id": "64f1a2b3c4d5e6f7g8h9i0j3",
        "name": "Jane Smith",
        "email": "jane@example.com"
      },
      "status": "pending",
      "message": "I'd like to contribute to this project. I have experience with React and Node.js.",
      "createdAt": "2023-09-01T10:00:00.000Z"
    }
  ]
}
```

### Get Sent Requests

**Endpoint:** `GET /v1/api/collaboration/sent`

**Description:** Get collaboration requests sent by the user

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "message": "Collaboration requests retrieved successfully",
  "requests": [
    {
      "id": "64f1a2b3c4d5e6f7g8h9i0j6",
      "project": {
        "id": "64f1a2b3c4d5e6f7g8h9i0j7",
        "title": "Mobile App"
      },
      "status": "accepted",
      "message": "I'm interested in contributing to this mobile app project.",
      "createdAt": "2023-09-01T09:00:00.000Z"
    }
  ]
}
```

### Respond to Request

**Endpoint:** `PUT /v1/api/collaboration/:id/respond`

**Description:** Accept or reject a collaboration request

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "status": "accepted"
}
```

**Status Options:** `accepted`, `rejected`

**Response (200):**
```json
{
  "message": "Collaboration request accepted successfully",
  "request": {
    "id": "64f1a2b3c4d5e6f7g8h9i0j5",
    "status": "accepted",
    "updatedAt": "2023-09-01T11:00:00.000Z"
  }
}
```

## 💬 Comments

### Add Comment

**Endpoint:** `POST /v1/api/comment`

**Description:** Add a comment to a task

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "task": "64f1a2b3c4d5e6f7g8h9i0j4",
  "content": "I've started working on the authentication system. The JWT implementation is complete."
}
```

**Response (201):**
```json
{
  "message": "Comment added successfully",
  "comment": {
    "id": "64f1a2b3c4d5e6f7g8h9i0j8",
    "task": "64f1a2b3c4d5e6f7g8h9i0j4",
    "user": {
      "id": "64f1a2b3c4d5e6f7g8h9i0j1",
      "name": "John Doe",
      "image": "https://res.cloudinary.com/cloud-name/image/upload/v123/avatar.jpg"
    },
    "content": "I've started working on the authentication system. The JWT implementation is complete.",
    "createdAt": "2023-09-01T10:00:00.000Z"
  }
}
```

### Get Task Comments

**Endpoint:** `GET /v1/api/comment/task/:taskId`

**Description:** Get all comments for a specific task

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "message": "Comments retrieved successfully",
  "comments": [
    {
      "id": "64f1a2b3c4d5e6f7g8h9i0j8",
      "task": "64f1a2b3c4d5e6f7g8h9i0j4",
      "user": {
        "id": "64f1a2b3c4d5e6f7g8h9i0j1",
        "name": "John Doe",
        "image": "https://res.cloudinary.com/cloud-name/image/upload/v123/avatar.jpg"
      },
      "content": "I've started working on the authentication system. The JWT implementation is complete.",
      "createdAt": "2023-09-01T10:00:00.000Z"
    }
  ]
}
```

### Update Comment

**Endpoint:** `PUT /v1/api/comment/:id`

**Description:** Update a comment (author only)

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "content": "I've completed the JWT implementation and started working on email verification."
}
```

**Response (200):**
```json
{
  "message": "Comment updated successfully",
  "comment": {
    "id": "64f1a2b3c4d5e6f7g8h9i0j8",
    "content": "I've completed the JWT implementation and started working on email verification.",
    "updatedAt": "2023-09-01T11:00:00.000Z"
  }
}
```

### Delete Comment

**Endpoint:** `DELETE /v1/api/comment/:id`

**Description:** Delete a comment (author only)

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "message": "Comment deleted successfully"
}
```

## 🔔 Notifications

### Get User Notifications

**Endpoint:** `GET /v1/api/notification`

**Description:** Get all notifications for the authenticated user

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "message": "Notifications retrieved successfully",
  "notifications": [
    {
      "id": "64f1a2b3c4d5e6f7g8h9i0j9",
      "user": "64f1a2b3c4d5e6f7g8h9i0j1",
      "type": "task_assigned",
      "title": "Task Assigned",
      "message": "You have been assigned to 'Implement User Authentication'",
      "relatedId": "64f1a2b3c4d5e6f7g8h9i0j4",
      "isRead": false,
      "createdAt": "2023-09-01T10:00:00.000Z"
    }
  ]
}
```

### Mark Notification as Read

**Endpoint:** `PUT /v1/api/notification/:id/read`

**Description:** Mark a notification as read

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "message": "Notification marked as read",
  "notification": {
    "id": "64f1a2b3c4d5e6f7g8h9i0j9",
    "isRead": true,
    "updatedAt": "2023-09-01T11:00:00.000Z"
  }
}
```

### Delete Notification

**Endpoint:** `DELETE /v1/api/notification/:id`

**Description:** Delete a notification

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "message": "Notification deleted successfully"
}
```

## 💭 Chat

### Send Message

**Endpoint:** `POST /v1/api/chat`

**Description:** Send a message in project chat

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "project": "64f1a2b3c4d5e6f7g8h9i0j2",
  "message": "Hello everyone! I'm excited to work on this project."
}
```

**Response (201):**
```json
{
  "message": "Message sent successfully",
  "chat": {
    "id": "64f1a2b3c4d5e6f7g8h9i0j10",
    "project": "64f1a2b3c4d5e6f7g8h9i0j2",
    "sender": {
      "id": "64f1a2b3c4d5e6f7g8h9i0j1",
      "name": "John Doe",
      "image": "https://res.cloudinary.com/cloud-name/image/upload/v123/avatar.jpg"
    },
    "message": "Hello everyone! I'm excited to work on this project.",
    "timestamp": "2023-09-01T10:00:00.000Z"
  }
}
```

### Get Project Chat History

**Endpoint:** `GET /v1/api/chat/project/:projectId`

**Description:** Get chat history for a specific project

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "message": "Chat history retrieved successfully",
  "messages": [
    {
      "id": "64f1a2b3c4d5e6f7g8h9i0j10",
      "project": "64f1a2b3c4d5e6f7g8h9i0j2",
      "sender": {
        "id": "64f1a2b3c4d5e6f7g8h9i0j1",
        "name": "John Doe",
        "image": "https://res.cloudinary.com/cloud-name/image/upload/v123/avatar.jpg"
      },
      "message": "Hello everyone! I'm excited to work on this project.",
      "timestamp": "2023-09-01T10:00:00.000Z"
    }
  ]
}
```

## Error Handling

### Standard Error Response Format

All error responses follow this format:

```json
{
  "message": "Error description",
  "error": "Error type (optional)",
  "details": "Additional details (optional)"
}
```


### Other Apis to be Added

```
Other Apis

```

### Common HTTP Status Codes

- **200**: Success
- **201**: Created
- **400**: Bad Request (validation errors, invalid input)
- **401**: Unauthorized (missing or invalid token)
- **403**: Forbidden (insufficient permissions, email not verified)
- **404**: Not Found (resource doesn't exist)
- **409**: Conflict (duplicate resource)
- **422**: Unprocessable Entity (validation failed)
- **500**: Internal Server Error

### Validation Error Example

**Response (400):**
```json
{
  "message": "Validation failed",
  "error": "ValidationError",
  "details": {
    "email": "Invalid email format",
    "password": "Password must be at least 6 characters"
  }
}
```

### Authentication Error Example

**Response (401):**
```json
{
  "message": "Access token required"
}
```

### Permission Error Example

**Response (403):**
```json
{
  "message": "You can only update your own account"
}
```

### Email Verification Error Example

**Response (403):**
```json
{
  "message": "Email verification required to access this resource",
  "requiresVerification": true
}
```

## 🚦 Rate Limiting

### Authentication Endpoints
- **Rate Limit**: 5 requests per 15 minutes per IP
- **Affected Endpoints**: `/auth/register`, `/auth/login`, `/auth/resend-verification`
- **Response**: `429 Too Many Requests`

### General API Endpoints
- **Rate Limit**: 100 requests per 15 minutes per IP
- **Affected Endpoints**: All other endpoints
- **Response**: `429 Too Many Requests`

### Rate Limit Response
```json
{
  "message": "Too many requests, please try again later",
  "retryAfter": "15 minutes"
}
```

## 📝 Notes

### File Upload
- **Supported Formats**: JPG, PNG, GIF
- **Maximum File Size**: 5MB
- **Storage**: Cloudinary cloud storage
- **Avatar Generation**: Automatic avatar creation from email if no image provided

### Real-time Features
- **Chat System**: Currently REST-based
- **Future Enhancement**: WebSocket implementation for real-time chat
- **Notifications**: Real-time notifications for various activities

### Pagination
- **Current Status**: No pagination implemented
- **Future Enhancement**: Add pagination for large datasets
- **Suggested Implementation**: Use `skip` and `limit` with cursor-based pagination

### Search & Filtering
- **Current Status**: Basic filtering available
- **Future Enhancement**: Full-text search with MongoDB Atlas Search
- **Suggested Implementation**: Elasticsearch or MongoDB Atlas Search

### Security Features
- **Password Hashing**: bcrypt with 10 salt rounds
- **JWT Security**: Secure token generation with expiration
- **Input Validation**: Zod schema validation for all inputs
- **CORS**: Configurable cross-origin resource sharing
- **Rate Limiting**: Protection against brute force attacks

### Performance Considerations
- **Database Indexing**: Proper MongoDB indexes for common queries
- **Connection Pooling**: Mongoose connection management
- **Caching**: Redis implementation for session/query caching
- **Compression**: gzip compression for responses
- **Load Balancing**: Horizontal scaling support

---

**Last Updated:** September 2023  
**Version:** 1.0.0  
**API Base URL:** `/v1/api`
