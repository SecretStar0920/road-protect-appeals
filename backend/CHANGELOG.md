# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.6.0](https://bitbucket.org/entrostat/road-protect-appeals-server/compare/v1.5.2...v1.6.0) (2019-12-23)


### Features

* **appeal:** added the cc to the user and bcc to our admin email ([0321e97](https://bitbucket.org/entrostat/road-protect-appeals-server/commit/0321e976f41dce8e7f0eb0521e24456478157ce6))

### [1.5.2](https://bitbucket.org/entrostat/road-protect-appeals-server/compare/v1.5.1...v1.5.2) (2019-12-23)


### Bug Fixes

* **appeal:** changed the temp path to be absolute ([4aae47f](https://bitbucket.org/entrostat/road-protect-appeals-server/commit/4aae47f72d813fcf6c53249d3962ff26037e3d98))

### [1.5.1](https://bitbucket.org/entrostat/road-protect-appeals-server/compare/v1.5.0...v1.5.1) (2019-12-20)


### Bug Fixes

* **appeal:** added the filename and removed the log ([32010fd](https://bitbucket.org/entrostat/road-protect-appeals-server/commit/32010fdb6fa2a9286afd760174e4974894c6f86b))

## [1.5.0](https://bitbucket.org/entrostat/road-protect-appeals-server/compare/v1.4.1...v1.5.0) (2019-12-20)


### Features

* **appeal:** added user details to the email ([b0812fe](https://bitbucket.org/entrostat/road-protect-appeals-server/commit/b0812feb6a8d6d497bf47e41f551a5ed56d3d270))

### [1.4.1](https://bitbucket.org/entrostat/road-protect-appeals-server/compare/v1.4.0...v1.4.1) (2019-12-20)


### Bug Fixes

* **payments:** added logs for loading templates ([19227e9](https://bitbucket.org/entrostat/road-protect-appeals-server/commit/19227e9373a68e0f9e33f685ff0ed62dc975751a))

## [1.4.0](https://bitbucket.org/entrostat/road-protect-appeals-server/compare/v1.3.2...v1.4.0) (2019-12-20)


### Features

* **handlebars:** added Handlebars to the system and compiled the payment responses. ([7bde80f](https://bitbucket.org/entrostat/road-protect-appeals-server/commit/7bde80ff087caff41ae7d112ce745d6a527536aa)), closes [#5](https://bitbucket.org/entrostat/road-protect-appeals-server/issues/5)

### [1.3.2](https://bitbucket.org/entrostat/road-protect-appeals-server/compare/v1.3.1...v1.3.2) (2019-12-17)


### Bug Fixes

* **appeal:** added text to the courthouse email ([fa59dac](https://bitbucket.org/entrostat/road-protect-appeals-server/commit/fa59dac5ee4cedb9aff9d6a69cc06cf338e7e5bc))
* **build:** added ts-node and tsconfig to run using Typescript ([b269899](https://bitbucket.org/entrostat/road-protect-appeals-server/commit/b269899a454d98140aba340c4256583f7a0913ba))
* **build:** added tsconfig options ([709c7dc](https://bitbucket.org/entrostat/road-protect-appeals-server/commit/709c7dc18d639ffc7b0b5ac92b512ae63c1bbd6e))
* **build:** added tsconfig-paths for registering our internal paths ([e31d186](https://bitbucket.org/entrostat/road-protect-appeals-server/commit/e31d1866a5e3bb352df1adf4e3fa3b01caad6436))
* **otp:** return the existing customer if we cannot create one ([b1da5d2](https://bitbucket.org/entrostat/road-protect-appeals-server/commit/b1da5d279a44a4c948f4f5d7e8e527b228b804f0))
* **payments:** fix payments replacement ([5ba4513](https://bitbucket.org/entrostat/road-protect-appeals-server/commit/5ba45137a40a5140f587bbdac73c510d3a205d55))
* **payments:** moved back to the original payment page ([b6ac908](https://bitbucket.org/entrostat/road-protect-appeals-server/commit/b6ac908572113b433746d98b5a54bdd23d06e1b9))
* **payments:** replace the payment error data with the cgUid ([f703179](https://bitbucket.org/entrostat/road-protect-appeals-server/commit/f7031799687ea03dbf9d5ae8c101413312d5656d))
* **payments:** running a pseudo handlebars replacement ([e96f1ef](https://bitbucket.org/entrostat/road-protect-appeals-server/commit/e96f1ef0e93c1e3fecea957a720f860bb24fb6fc))
* **payments:** the post message function was not running correctly ([2eb654a](https://bitbucket.org/entrostat/road-protect-appeals-server/commit/2eb654ac8829eb2acb136a0b812300d09dc88fda))

### [1.3.1](https://bitbucket.org/entrostat/road-protect-appeals-server/compare/v1.3.0...v1.3.1) (2019-12-16)


### Bug Fixes

* **devops:** modified the production dockerfile ([e33ef99](https://bitbucket.org/entrostat/road-protect-appeals-server/commit/e33ef997af814629e6e61ad0af09cbd0d8b1b0b8))

## [1.3.0](https://bitbucket.org/entrostat/road-protect-appeals-server/compare/v1.2.1...v1.3.0) (2019-12-16)


### Features

* **logging:** added logging to all of the services and controllers ([e45dbbc](https://bitbucket.org/entrostat/road-protect-appeals-server/commit/e45dbbc9c7b4111773f716717130e8cbe7013cfd)), closes [#4](https://bitbucket.org/entrostat/road-protect-appeals-server/issues/4)


### Bug Fixes

* **devops:** fixed the port from 3000 to 3001 ([e84ad61](https://bitbucket.org/entrostat/road-protect-appeals-server/commit/e84ad61bf3fff50ff1a1412fe29aa1d29427369f))
* **logging:** removed the request logging for now ([7179959](https://bitbucket.org/entrostat/road-protect-appeals-server/commit/7179959092a68ad73f0192bfe7b71066a8bb7550))

### [1.2.1](https://bitbucket.org/entrostat/road-protect-appeals-server/compare/v1.2.0...v1.2.1) (2019-12-16)


### Bug Fixes

* **build:** added debug flags so that we can see output from each command ([b6968c5](https://bitbucket.org/entrostat/road-protect-appeals-server/commit/b6968c548bd1b8c9d307f3a170148623b813b592))
* **build:** fixed the data copy command ([7bc61db](https://bitbucket.org/entrostat/road-protect-appeals-server/commit/7bc61db26d12b657fba57fff1dae214423dc67f2))

## [1.2.0](https://bitbucket.org/entrostat/road-protect-appeals-server/compare/v1.1.0...v1.2.0) (2019-12-16)


### Features

* **devops:** added devops to the project for local development ([a5286f8](https://bitbucket.org/entrostat/road-protect-appeals-server/commit/a5286f82fda573504dbb3d3ed0916370caadf33b)), closes [#3](https://bitbucket.org/entrostat/road-protect-appeals-server/issues/3)
* **env:** added better environment management ([9fafb1c](https://bitbucket.org/entrostat/road-protect-appeals-server/commit/9fafb1cc402868b0a7b625c778e827d326ac8b6a)), closes [#2](https://bitbucket.org/entrostat/road-protect-appeals-server/issues/2)
* **logging:** added a logger to the system ([cc8d6d0](https://bitbucket.org/entrostat/road-protect-appeals-server/commit/cc8d6d0598033c46073fff79eb6dddcf8f782bf4))

## 1.1.0 (2019-12-16)


### Features

* **semver:** added standard versioning ([3e64420](https://bitbucket.org/entrostat/road-protect-appeals-server/commit/3e6442065fc3b07bd7e67d97927336c13ab02f36))


### Bug Fixes

* **formatting:** ran prettier over all files ([8a99c9e](https://bitbucket.org/entrostat/road-protect-appeals-server/commit/8a99c9eb071a9756fbda853629ea99839f1036be))
