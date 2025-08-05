# Job Listing Application
- Job Listing Application is a full-stack web app where users can browse job openings, view details, and manage listings with ease.
- Built with the MERN stack + Vite + TypeScript for a lightning-fast, developer-friendly experience.
- The backend uses MongoDB to store and manage all job-related data efficiently.

## Backend Setup
### Move into the backend folder:
```bash
cd backend
```

### Install dependencies:
```bash
npm install
```
### Create a `.env` file in the root of the backend and add the following:
```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

### Start the backend server:
```bash
npm start
```

You should see:
```
Server is running on PORT 5000
Connected to MongoDB
```

## Frontend Setup
### Move into the frontend folder:
```bash
cd frontend/project
```
### Install frontend dependencies:
``` bash
npm install
```
### In the frontend .env file (or wherever you're storing your API base URL), replace the default URL with your backend URL:
``` bash
VITE_API_BASE_URL=http://localhost:5000
```
### Start the dev server:
``` bash
npm run dev
```

## Open your browser and visit:
``` plaintext
http://localhost:5173
```