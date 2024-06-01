# UpTask (Node + Express + Typescript) Backend

This is a backend project for the UpTask application, built using Node, Express, and TypeScript.

## Description

UpTask is a task management application that allows users to create, update, and delete tasks. It provides a user-friendly interface and a seamless user experience.

## Features

- User authentication: Users can create an account, log in, and log out.
- Task management: Users can create, update, and delete tasks.
- Task filtering: Users can filter tasks based on different criteria, such as status and more to come.

## Technologies Used

- Node: A JavaScript runtime built on Chrome's V8 JavaScript engine.
- Express: A fast, unopinionated, minimalist web framework for Node.js.
- TypeScript: A statically typed superset of JavaScript that compiles to plain JavaScript.

## Getting Started

To get started with the UpTask frontend project, follow these steps:

1. Clone the repository: `git clone https://github.com/igancuhz/upTask_server.git`
2. Install the dependencies: `npm install`
3. Set up the database: Install and configure MongoDB for the UpTask application. You can use a local installation or a cloud-based service like MongoDB Atlas.
4. Configure the environment variables: Create a `.env` file in the root directory of the project and add the necessary environment variables. For example:

```
DB_CONNECTION_STRING=YOUR_MONGODB_CONNECTION_STRING
```

Replace `YOUR_MONGODB_CONNECTION_STRING` with the connection string provided by MongoDB Atlas.

5. Start the backend server: Use the following command to start the backend server:

```
npm start
```

6. Test the backend API: Open your web browser or a tool like Postman and access the backend API at `http://localhost:3000`. You should see a welcome message or a list of available API endpoints.

7. Integrate with the frontend: Follow the instructions in the frontend project's README.md file to integrate the backend API with the frontend application.

## Resources

- [Course Link](https://www.udemy.com/share/101Wpi3@I5QCMruhuoa7EjaFZPeaKb9ZEojK3-rNxgkVfvseEm6VffxliQMDUV2Y64yxP4a_WQ==/)
- [GitHub Repository](https://github.com/igancuhz/upTask_server)

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.
