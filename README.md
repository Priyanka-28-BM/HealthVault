# 📂🔒 HealthVault  

## 📌 Overview  
HealthVault is a secure and efficient medical record management platform designed to provide quick access to health data while maintaining encrypted privacy. 
By integrating an AI-powered chatbot, it enhances user experience by offering smart recommendations on home remedies and health-related queries. 
This platform is tailored for individuals, caregivers, and healthcare professionals who need seamless access to medical records, ensuring better self-care and informed decision-making. 

## ✨ Features  
- ⚡ **Quick & Simple** – Fast access to your health data anywhere.  
- 📂 **Easy Records Access** – Manage all your medical history in one place.  
- 🤖 **AI-Chatbot** – Get smart recommendations on home remedies & health-related queries.  
- 🔒 **Secure Data** – Your medical records are encrypted and safe.
- 👤 **Role-Based Access Control (RBAC)** – Supports Patient, Doctor, and Admin roles with role-specific dashboards.
  

## 🛠️ Tech Stack  
- **Frontend:** React.js with Vite
- **Backend:** Node.js   
- **AI/ML:** LLama3-8b with Groq AI 
- **Database:** Supabase

##HealthVault/
├── client/                        # Frontend (React + Vite)
│   ├── src/
│   │   ├── Pages/
│   │   │   ├── AuthRedirect.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   └── UpdatePassword.jsx
│   │   ├── components/
│   │   │   ├── dashboards/
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   ├── DoctorDashboard.jsx
│   │   │   │   └── PatientDashboard.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── LandingPage.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Logout.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Navbar2.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── ResetPassword.jsx
│   │   │   ├── Signup.jsx
│   │   │   └── medicalfiles.jsx
│   │   ├── config/
│   │   ├── context/
│   │   │   └── UserContext.jsx
│   │   ├── images/
│   │   │   ├── avatar.jpg
│   │   │   ├── background.jpg
│   │   │   ├── hospital icon.jpg
│   │   │   └── login-page.jpg
│   │   ├── App.jsx
│   │   ├── index.css
│   │   ├── main.jsx
│   │   └── supabaseClient.js
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
├── server/                        # Backend (Node.js)
│   ├── routes/
│   │   ├── auth.js
│   │   └── chatbot.js
│   ├── index.js
│   ├── package.json
│   ├── package-lock.json
│   └── .gitignore
│
├── LICENSE
├── README.md


## 🚀 Installation  
### Prerequisites  
- Install [Node.js](https://nodejs.org/) 
- Clone the repository:  
  ```bash
  git clone https://github.com/Priyanka-28-BM/HealthVault.git
  cd HealthVault
  ```
- Backend Setup:
  ```
  cd server
  npm install
  nodemon index.js
  ```
- Frontend Setup:
  ```
  cd client
  npm install
  npm run dev
  ```

## 🧠 Role-Based Access Control (RBAC) Setup
### During signup, users can select their role: Patient, Doctor, or Admin.

  The selected role is stored in Supabase's profiles table and linked to their user ID.

  Upon login, the app fetches the user's role and redirects them to their role-specific dashboard:

  /patient-dashboard

  /doctor-dashboard

  /admin-dashboard

🎯 This ensures that only authorized roles can access their respective sections.

### Setting up LLaMA 3 with Groq for AI Chatbot

1. **Set up environment variables** (Add your API key from Groq)
   ```bash
   export GROQ_API_KEY="your_api_key_here"
   ```
2. **Run the chatbot server**
   ```
   // Make a request to the Groq API for generating a chatbot response
        const response = await axios.post(
            "https://api.groq.com", // Groq API endpoint
            {
                model: "model_name",
                messages: [{ role: "user", content: message }],
            },
            {
                headers: { Authorization: `Bearer ${GROQ_API_KEY}` },
            }
        );
   ```
  
## 🚀 Usage
1. Run the backend server using the setup instructions above.
2. Start the frontend and access the platform via your browser.
3. Sign up or log in to securely manage your medical records.
4. Interact with the AI chatbot for health recommendations.

## 🤝 Contribution
Contributions are welcome! Feel free to fork the repository and submit a pull request with improvements or new features.

## 📜 License
This project is licensed under the [MIT License](LICENSE).

## 📬 Contact
For any queries or suggestions, feel free to reach out!

---
