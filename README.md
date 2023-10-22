# MySocialApp

MySocialApp is a social media platform that allows users to connect, share, and interact with each other. This application is built using Next.js for the frontend, Express for the backend, Firebase Storage for file storage, and MongoDB as the database.

![MySocialApp Screenshot](./screenshot.png)

## Features

- **User Authentication:** Secure user registration and login functionality.
- **Profile Management:** Users can update their profiles and avatars.
- **Posts:** Users can create, edit, and delete posts.
- **Comments:** Users can comment on posts.
- **Image Upload:** Upload and store images using Firebase Storage.
- **Real-Time Updates:** Real-time updates using WebSocket for likes, comments, and posts.
- **Follow System:** Users can follow and be followed by other users.
- **Notifications:** Get notifications for new followers and likes.
- **Search:** Search for users and posts.
- **Responsive Design:** A mobile-friendly and responsive user interface.

## Technologies Used

- **Frontend:** Next.js, React, Tailwind CSS.
- **Backend:** Express.js, WebSocket for real-time updates.
- **Database:** MongoDB for storing user data and posts.
- **Storage:** Firebase Storage for image uploads.
- **Authentication:** Firebase Authentication for user sign-up and login.

## Getting Started

Follow these steps to get the project up and running on your local machine:

1. **Clone the repository:**

    ```bash
    git clone [https://github.com/yourusername/mysocialapp.git](https://github.com/Richino/social_app.git)
    cd mysocialapp
    ```

2. **Install dependencies:**

    ```bash
    cd frontend
    npm install
    cd ../backend
    npm install
    ```

3. **Set up Firebase:**

    - Create a Firebase project and obtain your Firebase configuration.
    - Set the Firebase configuration in `backend/config/firebaseConfig.js`.

4. **Set up MongoDB:**

    - Make sure you have MongoDB installed and running.
    - Set the MongoDB connection URI in `backend/config/db.js`.

5. **Start the development servers:**

    ```bash
    cd frontend
    npm run dev
    cd ../backend
    npm start
    ```

6. **Visit the app:**

    Open your web browser and go to `http://localhost:3000` to see the app in action.

## Deployment

To deploy this application to a production environment, follow the deployment guides for Next.js and Express.js. Additionally, make sure to secure your environment variables and database connections.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Special thanks to the open-source community for their valuable contributions.
- Inspired by various social media platforms.

Feel free to customize and expand this README to suit your specific project and provide additional information as needed.
