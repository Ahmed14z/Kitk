# AI-Driven Student Skill Development Platform

Welcome to the GitHub repository for the back end of our AI-Driven Student Skill Development Platform! In this README, I'll walk you through how I handled the back end of this project, which aims to provide a supportive and engaging environment for students interested in advancing their practical skills, particularly in the field of artificial intelligence.
Demo Link : [here]( http://ahmed14z.pythonanywhere.com/register.html)
## Project Overview

This project was developed as part of the lablab.me hackathon, a fast-paced 48-hour event that challenges participants to create innovative solutions for education. As such, this project is designed as a simple Minimum Viable Product (MVP) aimed at showcasing the core functionalities of the envisioned platform. The platform is designed to facilitate student engagement in clubs focused on artificial intelligence and related technologies, backed by universities. By registering on the platform, students gain access to a wealth of resources and opportunities. The core features and benefits of the platform include:

- **Club Membership**: Students can easily join AI-focused clubs supported by universities.
- **Resource Access**: Registered students can access a wide range of AI-related resources.
- **Project Ideas**: The platform offers carefully curated AI-aligned project ideas for students to work on.
- **Flexible Tracks**: Each club can have multiple branches, allowing students to choose specific tracks such as web development.
- **AI-Generated Tutorials**: Club administrators can request AI-generated tutorials and roadmaps for publication, utilizing the ChatGPT API.
- **Quiz Generation**: Quizzes related to tutorials and concepts are automatically generated by leveraging the ChatGPT API.
- **Project Management**: The platform aids in scheduling and managing project deadlines to instill discipline and time management skills.

## Back End Implementation

Given the time constraints of the 48-hour hackathon, the back end of this platform was developed using Flask, a lightweight and versatile Python web framework. Flask allows for quick development and easy integration with various components. The back end primarily focuses on managing user interactions, database operations, and the core functionalities of the platform.

### Technologies Used:

- **Flask**: Chosen for its simplicity and flexibility in building the web application's back end.
- **MySQL**: Used as the database management system to store user data, project details, and other relevant information.

### Front End Technologies:

- **HTML, CSS, and JavaScript**: The front end of the platform is built using simple HTML for structuring content, CSS for styling, and JavaScript for enhancing user interactions. This approach ensures a lightweight and responsive user interface.

### AI Integration:

We've integrated the ChatGPT API to enhance the platform's capabilities:

- **AI-Generated Tutorials and Roadmaps**: Using the ChatGPT API, club administrators can request AI-generated tutorials and roadmaps, which are then automatically published for students to benefit from.
- **Automated Quiz Generation**: The ChatGPT API is utilized to automatically generate quizzes based on tutorials and concepts, providing interactive learning experiences for students.

## How to Contribute

Contributions to this project are highly encouraged, but please note that due to the hackathon's limited timeframe, the focus has been on creating a functional MVP. Here's how you can get started:

1. **Fork the Repository**: Click the "Fork" button on the top right of this repository to create your copy.
2. **Clone Your Fork**: Clone the repository to your local machine using `git clone`.
3. **Set Up the Development Environment**: Install the required dependencies by running `pip install -r requirements.txt`.
4. **Make Your Changes**: Create a new branch for your feature/fix using `git checkout -b feature-name`.
5. **Testing**: Thoroughly test your changes to ensure they work as expected.
6. **Commit and Push**: Commit your changes and push them to your fork using `git commit` and `git push`.
7. **Create a Pull Request**: Submit a pull request from your branch to the `main` branch of this repository.

Feel free to reach out if you have any questions or need guidance on contributing.

Let's work together to create an exceptional platform for students to enhance their AI skills practically, even within the constraints of this 48-hour hackathon! 🚀
