<div align="center">
<picture>
         <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/jaxcksn/jaxcksn/main/files/ttu_cs_dark.png">
        <img alt="Texas Tech Computer Science - Whitacre College of Engineering" src="https://raw.githubusercontent.com/jaxcksn/jaxcksn/main/files/ttu_cs_light.png" width="34%" align="right">
</picture>
</div>

# CS3365 - MBS

<div align='center'>

![Frontend](https://flat.badgen.net/static/Frontend/React/blue)
![Backend](https://flat.badgen.net/static/Backend/Flask/blue)
![Database](https://flat.badgen.net/static/Database/MySQL/blue)

![Build](https://flat.badgen.net/github/checks/jaxcksn/cs3365-mbs/main/build-frontend?label=Build)
![CD](https://flat.badgen.net/github/checks/jaxcksn/cs3365-mbs/main/build-and-deploy?label=CD)

Monorepo for the Team 12's CS3365 Group Project to create a movie booking system.

</div>

## Table of Contents

1. [Quick Start Guide](#quick-start-guide)
   1. [Software Requirements](#software-requirements)
      - [Required](#required)
      - [Optional](#optional)
   2. [Local Development](#local-development)
      - [Cloning](#cloning-the-repo)
      - [Database](#starting-the-database)
      - [Backend](#starting-the-backend)
      - [Frontend](#starting-the-frontend)
2. [Contributing](#contributing)
   1. [Branching](#branching)
   2. [Pull Requests](#pull-requests)
   3. [Code Reivew](#code-review)
   4. [Continuous Deployment](#cd)

## Quick Start Guide

### Software Requirements

You will need the following installed and accessible via the CLI:

#### Required:

- [Git](https://git-scm.com/downloads)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [NodeJS LTS v20](https://nodejs.org/en)
- [Python v11 or Higher](https://www.python.org/downloads/)

#### Optional:

- [MySQL Client](https://dev.mysql.com/downloads/mysql/)
- [React Dev Tools](https://chromewebstore.google.com/detail/react-developer-tools)

### Local Development

#### Cloning the Repo

First, start by cloning this repo into a directory you can easily get to with your terminal.

```bash
git clone https://github.com/jaxcksn/CS3365-MBS.git`
```

then, navigate inside this directory once it's finished cloning:

```bash
cd CS3365-MBS
```

#### Starting the Database

We use Docker compose for this:

```bash
cd dev-compose
docker compose up -d
```

#### Starting the Backend:

First, install the backend requirements (you only have to do this once):

```bash
cd backend
pip install --no-cache-dir -r requirements.txt
```

Once that is finished, we can start the service:

```bash
python app.py
```

#### Starting the Frontend:

First, install the requirements for the frontend (you only have to do this once):

```bash
cd frontend
npm install
```

Once that is finished (it may take a minute), you can start the frontend:

```bash
npm run dev
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
