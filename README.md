# Online Electronics Store

This project is the implementation for **SWE30003: Software Architectures and Design – Assignment 3 (Semester 1, 2025)** at **Swinburne University of Technology**.

It is a full-stack, object-oriented web application for an Online Electronics Store, built with a **Flask (Python)** backend and a **React (JavaScript)** frontend. **Tailwind CSS** is used for styling, and **JSON files** are used for simple file-based storage.

## 🔧 Features

The application supports four core business areas:

- 🛍️ Product Browsing
- 🛒 Cart Management
- 📦 Order Processing
- 👤 User Accounts

## 📁 Project Structure

```
online-electronics-store/
├── backend/               # Flask backend
│   ├── app/               # Application logic (models, routes, utils, storage)
│   ├── tests/             # Backend tests
│   ├── requirements.txt   # Python dependencies
│   ├── run.py             # Flask entry point
│   └── .env               # Backend environment variables
├── frontend/              # React frontend
│   ├── public/            # Static files
│   ├── src/               # React components, pages, and API calls
│   ├── package.json       # Node dependencies
│   ├── tailwind.config.js # Tailwind CSS configuration
│   └── .env               # Frontend environment variables
├── docs/                  # Documentation (diagrams, report)
├── .gitignore             # Git ignore file
├── README.md              # This file
└── LICENSE                # Project license
```

## ✅ Prerequisites

Ensure the following tools are installed:

- Python 3.8 or higher
- Node.js 18 or higher
- Git
- A code editor (e.g., VS Code)

Check installation by running:

```
python --version
node --version
npm --version
git --version
```

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/online-electronics-store.git
cd online-electronics-store
```

### 2. Set Up the Backend (Flask)

```bash
cd backend
python -m venv venv
```

Activate virtual environment:

- **Windows:**

  ```bash
  venv\Scripts\activate
  ```

- **macOS/Linux:**
  ```bash
  source venv/bin/activate
  ```

Install dependencies:

```bash
pip install flask flask-cors python-dotenv
pip freeze > requirements.txt
```

Set environment variable:

```bash
echo "FLASK_ENV=development" > .env
```

Run the backend server:

```bash
python run.py
```

Visit `http://localhost:5000/api/products` to confirm the server is working.

### 3. Set Up the Frontend (React)

```bash
cd ../frontend
npm install
```

Install Tailwind CSS (if not already installed):

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Set frontend environment variable:

```bash
echo "REACT_APP_API_URL=http://localhost:5000" > .env
```

Run the React development server:

```bash
npm start
```

Visit `http://localhost:3000` to view the app.

### 4. Run the Full Application

Open **two terminal tabs**:

**Terminal 1 (Backend):**

```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
python run.py
```

**Terminal 2 (Frontend):**

```bash
cd frontend
npm start
```

Access the application at: `http://localhost:3000`

## 🛠️ Development Notes

- **Coding Standards**

  - Backend: [PEP 8](https://peps.python.org/pep-0008/)
  - Frontend: [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)

- **Storage**

  - JSON file: `backend/app/storage/data.json`
  - Optional upgrade: SQLite

- **Testing**
  - Tests are in `backend/tests/`
  - Run tests with: `pytest`
  - Install pytest: `pip install pytest`

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
