# Road Protect Appeals

A monorepo for the Road Protect Appeals system so that client and server code bases are merged into a single repo.

#### Requirements
In order to get up and running, there are a couple of prerequisites you'll need. 

* We use [blackbox](https://github.com/StackExchange/blackbox) to manage env. Make sure you have this installed. You can follow installation instructions [here](https://github.com/Kerren-Entrostat/blackbox-testing).
* We currently use docker-compose for dev. The existing docker-compose has been setup on a Linux system. Some issues may occur if run in a Windows environment so please contact Emily if that's the case.
* Make sure you have linting enabled on your preferred IDE. I strongly recommend Webstorm for this project.

#### Getting Started

1. Clone the repo

2. Follow the [instructions](https://github.com/StackExchange/blackbox#step-1-you-create-a-gpg-key-pair-on-a-secure-machine-and-add-to-public-keychain) to add yourself as an admin to the keyring

3. Request another admin (emily@entrostat.com) to [complete](https://github.com/StackExchange/blackbox#step-2-someone-else-adds-you-to-the-system) the process

4. Now that you're all set up admin wise, decrypt all env files locally by running: ```blackbox_decrypt_all_files```
	
5. Exec into devops/docker-compose/dev and run `docker-compose up --build`

7. If everything runs ok, you should be able to ping:
	
* localhost:3000 for the frontend
* localhost:3000/api/health for the **NestJS** backend

#### Development
We use Git Flow and Feature branching for development. 
This means that no code is committed directly onto the `master` or `develop` branches. Instead, a branch is made with the following structure: {branch-type}/{issue-key}/{issue-description} (all in lowercase).

* The branch type can either be **feature** or **hotfix**
* The issue key corresponds to the key on Yodiz 
* The issue description is a brief title for the branch

With larger features, a root feature branch is made which all subfeatures are merged into.

We also use semantic versioning so that an up to date changelog can be kept. For development, this just means that any merges into `develop` or `master` must be titled with:

* feat(feature-name): description
**OR** 
* fix(fix-name): description