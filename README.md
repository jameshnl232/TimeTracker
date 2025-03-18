![image](https://github.com/user-attachments/assets/6f97c9f3-9ee0-42f7-a87e-b4be97f09066)



### 1. **Project Overview**

This project is a full-stack application designed for managing working time, vacation requests, absence requests, and manual working time requests. It provides functionalities for two types of users: **Normal User** and **Admin User**, including email notifications and request approval workflows.

---

### 2. **Key Features**

- **User Authentication**: Users log in via Google authentication or email credentials
- **Timer Management**:
    - Start and pause working timers.
    - Dashboard overview
- **Request Management**:
    - Vacation requests.
    - Absence requests (sick leave, child illness, etc.).
    - Manual working time requests.
- **Approval Workflow**:
    - Managers approve or reject requests.
    - Email notifications are sent to both requester and approver upon approval/rejection.
- **Notifications**:
    - Login/logout success notifications.
    - Status updates for requests.

---

### 3. **Tech Stack**

### **Frontend**:

- **Next.js**: For server-rendered React components.
- **TailwindCSS**: For UI styling.
- **Shadcn:** for UI
- **Redux Toolkit**: For state management.
- **Redux Persist**: To persist Redux state across sessions.
- **Firebase:** authentication
- **Prettier:** formatting

### **Backend**:

- **Node.js**: Server-side runtime.
- **Express**: Framework for API routing.
- **Mongoose**: For database interaction with MongoDB.
- **Bcrypt**: To hash user passwords.
- **Jsonwebtoken**: For authentication tokens.

### **Email Notifications**:

- **Nodemailer**: For sending email notifications.

### **Development Tools**:

- **Typescript**: For type safety.
- **Eslint** & **Prettier**: For linting and formatting.
- **Nodemon**: For live-reloading during development.

---

### 4. **System Architecture**

### **Frontend**:

- **Pages**:
    - `/login`: Google login page.
    - `/signup`:  Sign up
    - `/dashboard`: Displays user-specific timers and request management features.
        - `/dashboard/vacations`: Dashboard for managers to view and approve/reject vacation requests
            - `/dashboard/vacations/request`: Create vacation request
        - `/dashboard/absences`: Dashboard for managers to view and approve/reject absences requests
            - `/dashboard/absences/request`: Create absences request
        - `/dashboard/manual-time`: Dashboard for managers to view and approve/reject manual time requests
            - `/dashboard/manual-time/request`: Create manual time request
- **State Management**:
    - **Redux Toolkit**: Central store to manage user data, timers, and requests.
    - **Persist**: Saves state for seamless reload experience.
- **Google Authentication**
    - **Firebase:** integrate user authentication with Gmails

### **Backend**:

- **APIs**:
    - **Vacation Routes**:
        
        
        | **Method** | **Endpoint** | **Description** | **Auth Required** |
        | --- | --- | --- | --- |
        | POST | /api/requests/create | Create new vacation request | Yes |
        | GET | /api/requests/my-requests | Get user's vacation requests | Yes |
        | GET | /api/requests/all | Get all vacation requests | Yes (Admin) |
        | PUT | /api/requests/approve/:requestId | Approve vacation request | Yes (Admin) |
        | PUT | /api/requests/reject/:requestId | Reject vacation request | Yes (Admin) |
    - **Absence Routes**:
        
        
        | **Method** | **Endpoint** | **Description** | **Auth Required** |
        | --- | --- | --- | --- |
        | POST | /api/absences/create | Create new absence request | Yes |
        | GET | /api/absences/my-requests | Get user's absence requests | Yes |
        | GET | /api/absences/all | Get all absence requests | Yes (Admin) |
        | PUT | /api/absences/approve/:requestId | Approve absence request | Yes (Admin) |
        | PUT | /api/absences/reject/:requestId | Reject absence request | Yes (Admin) |
    - **Manual Time Routes**:
        
        
        | **Method** | **Endpoint** | **Description** | **Auth Required** |
        | --- | --- | --- | --- |
        | POST | /api/manual-time/create | Create manual time entry | Yes |
        | GET | /api/manual-time/my-requests | Get user's manual time entries | Yes |
        | GET | /api/manual-time/all | Get all manual time entries | Yes (Admin) |
        | PUT | /api/manual-time/approve/:requestId | Approve manual time entry | Yes (Admin) |
        | PUT | /api/manual-time/reject/:requestId | Reject manual time entry | Yes (Admin) |
    - **Timer Routes**:
        
        
        | **Method** | **Endpoint** | **Description** | **Auth Required** |
        | --- | --- | --- | --- |
        | GET | /api/time | Get user's current timer | Yes |
        | PUT | /api/time/update | Update timer status | Yes |
    - **Authentication Routes**:
        
        
        | **Method** | **Endpoint** | **Description** | **Auth Required** |
        | --- | --- | --- | --- |
        | POST | /api/auth/signup | Register new user | No |
        | POST | /api/auth/login | Login with credentials | No |
        | POST | /api/auth/google | Login with Google | No |
        | POST | /api/auth/logout | Logout user | Yes |

---

### 5. **Database Schema**

### **User Collection**:

| Field | Type | Description |
| --- | --- | --- |
| `id` | String | Unique user identifier. |
| password | String | User's full name. |
| `email` | String | User's email address. |
| `role` | Enum | user or admin. |

### **Vacation Requests Collection**:

Additional Request Fields:

| Field | Type | Description |
| --- | --- | --- |
| `user` | ObjectId | Reference to User collection |
| `fromDate` | Date | Start date of request |
| `toDate` | Date | End date of request |
| `comment` | String | Optional comment (max 500 chars) |
| `status` | Enum | PENDING, APPROVED, or REJECTED |
| `approvedBy` | ObjectId | Reference to approving user |
| `approvalDate` | Date | Date of approval/rejection |
| `timestamps` | Boolean | Adds createdAt and updatedAt |

### Time Records Collection:

| **Field Name** | **Type** | **Description** | **Constraints** |
| --- | --- | --- | --- |
| `userId` | `ObjectId` | Reference to associated user | Required |
| `workingTime` | `Number` | Total working time in minutes | Default: 0 |
| `breakTime` | `Number` | Total break time in minutes | Default: 0 |
| `createdAt` | `Date` | Creation timestamp | Auto-generated |
| `updatedAt` | `Date` | Last update timestamp | Auto-generated |

### Manual Time Records Collection:

| **Field Name** | **Type** | **Description** | **Constraints** |
| --- | --- | --- | --- |
| `user` | `ObjectId` | Reference to User collection | Required |
| `date` | `Date` | Date of manual time entry | Required |
| `startTime` | `String` | Start time of work | Required |
| `endTime` | `String` | End time of work | Required |
| `pause` | `Number` | Pause duration in minutes | Default: 0 |
| `comment` | `String` | Optional comment | Max 500 chars |
| `status` | `String` | Request status | PENDING/APPROVED/REJECTED |
| `approvedBy` | `ObjectId` | Reference to approving user | Optional |
| `approvalDate` | `Date` | Date of approval/rejection | Optional |
| `timestamps` | `Boolean` | Adds createdAt and updatedAt | Auto-generated |

### Absence Requests Collection:

| **Field Name** | **Type** | **Description** | **Constraints** |
| --- | --- | --- | --- |
| `user` | `ObjectId` | Reference to User collection | Required |
| `substitute` | `String` | Substitute person name | Optional |
| `type` | `String` | Type of absence | Enum: Sick, Homeoffice, Child sick, Other |
| `fromDate` | `Date` | Start date of absence | Required |
| `toDate` | `Date` | End date of absence | Required |
| `comment` | `String` | Optional comment | Max 500 chars |
| `status` | `String` | Request status | PENDING/APPROVED/REJECTED |
| `approvedBy` | `ObjectId` | Reference to approving user | Optional |
| `approvalDate` | `Date` | Date of approval/rejection | Optional |
| `timestamps` | `Boolean` | Adds createdAt and updatedAt | Auto-generated |

### 6. Setup guide

### Prerequisites:

- Node.js (>= 18)
- MongoDB
- Google OAuth credentials (client ID and secret)
- nextjs 15
- react 19

### Installation:

1. **Clone the Repository**:
    
    ```bash
    
    git clone <repository-url>
    cd <repository-folder>
    
    ```
    
2. **Install Dependencies**:
    
    ```bash
    cd frontend
    npm install
    
    cd backend 
    npm install
    ```
    
3. **Set Up Environment Variables**:
Create a `.env` file in the each folder with the following keys:
    
    ```
    *frontend
    
    NEXT_GOOGLE_CLIENT_ID=
    NEXT_GOOGLE_CLIENT_SECRET=
    NEXT_PUBLIC_ROOT_URL=http://localhost:5000
    NEXT_PUBLIC_REACT_APP_FIREBASE_API_KEY=
    
    *https://www.youtube.com/watch?v=lQftwBTCejE: video tutorial to setup google_client_id and secret
    ```
    
    ```
    *backend
    
    MONGODB_URI= 
    JWT_SECRET=belzir
    PORT=5000
    EMAIL_USER= your_email
    EMAIL_PASSWORD= google_app_password
    
    ```
    
4. **Start the Application**:
    - **Frontend**:
        
        ```bash
        cd frontend
        npm run dev
        
        ```
        
    - **Backend**:
        
        ```bash
        cd backend
        npm run dev
        
        ```
        

### 6. Current issue

- Timer could be improved

### 7. Notes

- To create admin user, set it manually in mongodb for development purpose only.
