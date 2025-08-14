# DevCollab API Server 🚀

A robust Node.js/Express.js backend API for a developer collaboration platform, built with TypeScript, MongoDB, and modern development practices.

## 🌟 Features

### 🔐 Authentication & User Management
- **User Registration & Login**: Secure user authentication with JWT tokens
- **Email Verification**: Email-based account verification system
- **Password Management**: Secure password hashing with bcrypt
- **Profile Management**: User profile CRUD operations with avatar support
- **Session Management**: JWT-based session handling

### 📁 Project Management
- **Project CRUD**: Create, read, update, and delete projects
- **Collaboration System**: Add/remove project collaborators
- **Project Ownership**: Secure project access control
- **Activity Tracking**: Project activity logging (prepared for future use)

### 📋 Task Management
- **Task CRUD**: Comprehensive task management system
- **Priority Levels**: Low, medium, high priority support
- **Assignment System**: Assign tasks to team members
- **Due Date Tracking**: Task deadline management
- **Status Management**: Track task completion status

### 💬 Communication & Collaboration
- **Real-time Chat**: Project-based chat system
- **Comment System**: Task and project commenting
- **Collaboration Requests**: Send and manage collaboration invitations
- **Notification System**: User notifications for various events

### 🗣️ Community Features
- **Discussion Forums**: Topic-based discussion system
- **Pre-defined Topics**: Default topics for common developer subjects
- **Community Engagement**: Public discussion participation

### 🛠️ Technical Features
- **TypeScript**: Full TypeScript support with strict type checking
- **MongoDB Integration**: Mongoose ODM with MongoDB
- **File Upload**: Cloudinary integration for image storage
- **Email Services**: Nodemailer-based email functionality
- **Input Validation**: Zod schema validation
- **Middleware System**: Authentication and validation middleware
- **Error Handling**: Comprehensive error handling and logging

## 🏗️ Architecture

### Project Structure
```
dev-server/
├── src/
│   ├── app/                 # Express app configuration
│   ├── controllers/         # Business logic controllers
│   ├── middleware/          # Custom middleware functions
│   ├── models/              # MongoDB/Mongoose models
│   ├── routes/              # API route definitions
│   ├── schemas/             # Zod validation schemas
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # Utility functions
│   ├── app.ts              # Express app setup
│   └── server.ts           # Server entry point
├── tests/                   # Test suite (Jest + Supertest)
├── dist/                    # Compiled JavaScript output
├── package.json             # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
└── README.md               # This file
```

### Technology Stack
- **Runtime**: Node.js
- **Framework**: Express.js 5.x
- **Language**: TypeScript 5.x
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Zod schema validation
- **File Storage**: Cloudinary
- **Email**: Nodemailer
- **Testing**: Jest + Supertest
- **Development**: Nodemon + ts-node-dev

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB instance (local or cloud)
- Cloudinary account (for file uploads)
- Gmail account (for email services)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd devcollab/dev-server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp env.example .env
   ```
   
   Fill in your environment variables:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/devcollab
   JWT_SECRET=your-super-secret-jwt-key
   EMAIL_USER=your-gmail@gmail.com
   EMAIL_APP_PASSWORD=your-gmail-app-password
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

4. **Database Setup**
   - Ensure MongoDB is running
   - The application will automatically create collections

5. **Start Development Server**
   ```bash
   npm run dev
   ```

### Available Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm test` - Run test suite
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate test coverage report

## 📚 API Documentation

### Base URL
```
http://localhost:5000/v1/api
```

### Authentication
All protected routes require a valid JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Endpoints

#### 🔐 Authentication (`/auth`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | User registration | No |
| POST | `/login` | User login | No |
| GET | `/verify-email/:token` | Email verification | No |
| POST | `/resend-verification` | Resend verification email | No |
| GET | `/profile` | Get current user profile | Yes |
| GET | `/users/:id` | Get user by ID | Yes |
| PUT | `/users/:id` | Update user profile | Yes |
| DELETE | `/users/:id` | Delete user account | Yes |

#### 📁 Projects (`/project`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get user's projects | Yes |
| GET | `/:projectId` | Get project by ID | Yes |
| POST | `/create` | Create new project | Yes |
| PUT | `/update/:projectId` | Update project | Yes |
| DELETE | `/:projectId` | Delete project | Yes |
| DELETE | `/:projectId/:collaboratorId` | Remove collaborator | Yes |

#### 📋 Tasks (`/task`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get user's tasks | Yes |
| GET | `/:taskId` | Get task by ID | Yes |
| POST | `/create` | Create new task | Yes |
| PUT | `/update/:taskId` | Update task | Yes |
| DELETE | `/:taskId` | Delete task | Yes |

#### 💬 Comments (`/comment`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/:commentId` | Get comment by ID | Yes |
| POST | `/create` | Create new comment | Yes |
| PUT | `/update/:commentId` | Update comment | Yes |
| DELETE | `/:commentId` | Delete comment | Yes |

#### 🗣️ Discussions (`/discussion`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get all discussions | No |
| GET | `/:discussionId` | Get discussion by ID | No |
| POST | `/create` | Create new discussion | Yes |
| PUT | `/update/:discussionId` | Update discussion | Yes |
| DELETE | `/:discussionId` | Delete discussion | Yes |
| POST | `/:discussionId/topic` | Add new topic | Yes |
| POST | `/:discussionId/discussion` | Add discussion text | Yes |

#### 🔔 Notifications (`/notification`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get user notifications | Yes |
| PUT | `/:notificationId/read` | Mark as read | Yes |
| DELETE | `/:notificationId` | Delete notification | Yes |

#### 💭 Chat (`/chat`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/send` | Send message | Yes |
| GET | `/conversation/:userId` | Get conversation | Yes |
| GET | `/conversations` | Get all conversations | Yes |

#### 🤝 Collaboration (`/collaboration`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/request` | Send collaboration request | Yes |
| GET | `/requests` | Get collaboration requests | Yes |
| PUT | `/accept/:requestId` | Accept request | Yes |
| PUT | `/reject/:requestId` | Reject request | Yes |

## 🗄️ Data Models

### User Model
```typescript
interface IUser {
  name: string;
  image?: string;
  email: string;
  password: string;
  isVerified: boolean;
  verificationToken?: string;
  verificationExpires?: Date;
  projects?: ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Project Model
```typescript
interface IProject {
  title: string;
  description: string;
  owner: ObjectId;
  collaborators: ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Task Model
```typescript
interface ITask {
  title: string;
  description: string;
  assignees?: ObjectId[];
  project: ObjectId;
  createdBy: ObjectId;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high';
  comments: ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Discussion Model
```typescript
interface IDiscussion {
  name: string;
  description: string;
  topics: string[];
  discussion: string[];
  createdAt: Date;
  updatedAt: Date;
}
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt password encryption
- **Input Validation**: Zod schema validation for all inputs
- **CORS Protection**: Configurable CORS settings
- **Rate Limiting**: Built-in Express rate limiting
- **SQL Injection Protection**: MongoDB with parameterized queries
- **XSS Protection**: Input sanitization and validation

## 🧪 Testing

The project includes a comprehensive test suite:

- **Unit Tests**: Individual function testing
- **Integration Tests**: API endpoint testing
- **Test Coverage**: Jest coverage reporting
- **Test Utilities**: Helper functions for test data creation
- **Database Testing**: Isolated test database environment

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Variables for Production
- Set `NODE_ENV=production`
- Use strong JWT secrets
- Configure production MongoDB URI
- Set up production email services
- Configure production Cloudinary settings

### Docker Support
The project can be containerized using Docker:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📝 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting guide
- Review the API documentation

## 🔮 Future Enhancements

- [ ] Real-time WebSocket support
- [ ] Advanced search and filtering
- [ ] File sharing system
- [ ] Project templates
- [ ] Advanced analytics
- [ ] Mobile app support
- [ ] Third-party integrations
- [ ] Advanced permission system

---

**DevCollab** - Empowering developers to collaborate effectively! 🚀
