<div align="center">
<picture>
         <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/jaxcksn/jaxcksn/main/files/ttu_cs_dark.png">
        <img alt="Texas Tech Computer Science - Whitacre College of Engineering" src="https://raw.githubusercontent.com/jaxcksn/jaxcksn/main/files/ttu_cs_light.png" width="34%" align="right">
</picture>
</div>

# CS3365 - MBS

<div align='center'>

![Frontend](https://flat.badgen.net/static/Frontend/React/blue)
![Backend](https://flat.badgen.net/static/Backend/FastAPI/cyan)
![Database](https://flat.badgen.net/static/Database/MySQL/orange)

![Build](https://flat.badgen.net/github/checks/jaxcksn/CS3365-MBS/main/Test%20Frontend%20Build?label=Test&cache=3600)
![CD](https://flat.badgen.net/github/checks/jaxcksn/CS3365-MBS/main/Build%20for%20Staging%20Environment?label=CD&cache=3600)

Monorepo for Team 12's CS3365 Group Project to create a movie booking system.

</div>

## Table of Contents

1. [Software Requirements](#software-requirements)
   - [Required](#required)
   - [Optional](#optional)
2. [Installing](#installing)
   - [Cloning](#cloning-the-repo)
   - [Backend](#installing-the-backend)
   - [Frontend](#installing-the-frontend)
3. [Running the App](#running-the-app)
   - [Easy Way](#the-easy-way-with-debug)
   - [Hard Way](#the-hard-way-no-debug)
4. [Contributing](#contributing)
   1. [Branching](#branching)
   2. [Pull Requests](#pull-requests)
   3. [Code Review](#code-review)
   4. [Continuous Deployment](#cd)

## Software Requirements

You will need the following installed and accessible via the CLI:

### Required:

- [Git](https://git-scm.com/downloads)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [NodeJS LTS v20](https://nodejs.org/en)
- [Python v11 or Higher](https://www.python.org/downloads/)
- [VSCode](https://code.visualstudio.com/)

### Optional:

- [MySQL Client](https://dev.mysql.com/downloads/mysql/)
- [React Dev Tools](https://chromewebstore.google.com/detail/react-developer-tools)

## Installing

### Cloning the Repo

First, start by cloning this repo into a directory you can easily get to with your terminal.

```bash
git clone https://github.com/jaxcksn/CS3365-MBS.git
```

then, navigate inside this directory once it's finished cloning:

```bash
cd CS3365-MBS
```

### Installing the Backend:

Run the following commands to start the backend (you only have to do this once):

```bash
cd ..
cd backend
pip install --no-cache-dir -r requirements.txt
```

Note: The port must be 5050 to properly connect with the frontend.

### Installing the Frontend:

First, install the requirements for the frontend (you only have to do this once):

```bash
cd ..
cd frontend
npm install
```

## Running the App

If you don't have these options in your VSCode, trying running `git pull` in the root directory (on the main branch).

### The Easy Way (with Debug)

There are launch configurations built into VSCode to help you run the services faster:

First, open VSCode in the root folder:

![Step 1](/docs/photos/step1.png)

Then, press <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>`</kbd> to open the integrated terminal (you can also do View > Terminal), and run the following commands:

```bash
cd dev-compose
docker compose up -d
cd ..
```

After this is finished, open up the Run and Debug symbol by clicking on the icon on the left activity bar:

![Step 2](/docs/photos/step2.png)

From the dropdown at the top of the panel that pops out, select "Launch Backend" and click the green run button or press <kbd>F5</kbd>:

![Step 3](/docs/photos/step3.png)

Once that finishes launching, select "Launch Frontend" from that same dropdown and press the green run button or press <kbd>F5</kbd>:

![Step 4](/docs/photos/step4.png)

This should launch the frontend in a new chrome window connected to the debugger, where you can login to the program:

![Step 5](/docs/photos/step5.png)

Whenever you are done developing, you can stop the processes by going back into the "Run & Debug" tab, opening the "Call Stack" section and clicking the red stop symbol that appear after you hover over the name, you can also just press <kbd>Shift</kbd> + <kbd>F5</kbd> twice to stop them:

![Step 6](/docs/photos/step6.png)

### The Hard Way (No Debug)

First, start the database by running the following (from the repo root directory):

```bash
cd dev-compose
docker compose up -d
cd ..
```

Once that is finished, we can start the backend service:

```bash
cd backend
fastapi dev server/main.py --port 5050
```

Now, leaving the backend terminal open, open a new terminal window and navigate to the repo root directory. Then run the following commands:

```bash
cd frontend
npm run dev
```

Then, in your browser go to the following url: [http://localhost:5173/](http://localhost:5173/)

Whenever you're done with developement, just press <kbd>Ctrl</kbd> + <kbd>C</kbd> in the terminals to stop the processes, and run the following to stop the database:

```bash
cd dev-compose
docker compose down
```

## Contributing

### Branching

To contribute, first create a branch off the _main branch_. The name of your branch should match with your Jira task number. For example, if you are creating a branch for task **MBS-22** you would name the branch `MBS-22-new-feature`

```bash
git checkout branch -b mbs-<task_number>-<some_description> main
```

As you make changes, you will do so in your branch and commit to the branch.

### Pull Requests

Once you think your branch is ready to be merged back into the _main_ branch, you'll want to open up a pull request (PR) for the branch.

**Important**: To make sure your PR properly links with Jira, the first word of the PR title must be the issue tag i.e. MBS-XX.

When you create a PR, GitHub will automatically start reviewing your code for vulnerabilities & will make sure it builds/lints. You can see the status of the checks in the PR. After checks are complete, message one of the other contributers for a review.

### Code Review

All code must be reviewed by another dev through GitHub, once your changes have been approved, and all conversations resolved on the PR, it will let you press the merge button.

While you are waiting for a code review, you can move your Jira task over to the 'Code Review' lane.

### CD

After you press the merge button, your feature goes live! In a few minutes, a build will trigger automatically and upload to the [testing environment.](https://mbs.jaxcksn.dev)
