# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [2.4.0](https://github.com/entrostat/road-protect-appeals/compare/v2.3.1...v2.4.0) (2021-03-04)


### Features

* **blackbox-add-devs:** Added Marion and Emma to Blackbox ([4d69d1d](https://github.com/entrostat/road-protect-appeals/commit/4d69d1d95c2d691227b4f98ccee4b5843d310f12))
* **legal-paragraph:** Load legal paragraph from ZA backend rather than from the hard coded json file ([dc0b6ea](https://github.com/entrostat/road-protect-appeals/commit/dc0b6ea784d984d7eb83fc73c10474c8972b395a))
* **request-violations-list:** Get a list of violations through a request and allow for an infinitely deep question matrix ([f4d8df6](https://github.com/entrostat/road-protect-appeals/commit/f4d8df6ee33b8fc99bacf302f925dafec9e03aa0))


### Bug Fixes

* **appeal-date:** Fix appeal date selecting the wrong day by preventing the timezone shift from the datepicker component ([c00ec18](https://github.com/entrostat/road-protect-appeals/commit/c00ec1868b5251d4fa276e869987511440bb23a2))
* **error-modal-messages:** Added a check for object messages in the modal Merge branch 'fix/RPF-340/error-modal-messages' into develop ([23d4d30](https://github.com/entrostat/road-protect-appeals/commit/23d4d30583afd1717f6c3372f9b180182532bca8))
* **pdf-preview:** fixed the pdf preview button on the main page Merge branch 'fix/RPF-321/pdf-preview' into develop ([995d47c](https://github.com/entrostat/road-protect-appeals/commit/995d47c59f94d6d30b720ea7c24356ccb19cd270))
* **refactor-option-selection:** Refactored the frontend logic that handles selection and saving options ([9c7772a](https://github.com/entrostat/road-protect-appeals/commit/9c7772a8583e3ca5ba3910574695ede84105c992))
* **remove-code-filtering:** Remove filter which only allowed codes with text to be shown on the summary page ([41ee2f1](https://github.com/entrostat/road-protect-appeals/commit/41ee2f11efdce6cee42116632baf439aa016de06))
* **save-reason:** Refactor logic for saving reasons ([46e5207](https://github.com/entrostat/road-protect-appeals/commit/46e5207aca7b4f8143d8299042eb89be4b79c26a))
* **select-from-modal:** Refactored selection and submission of option in modal, and added ability to remove saved reason ([062227f](https://github.com/entrostat/road-protect-appeals/commit/062227f180fc3ede9a1a0bdcbc34e132d17651a6))
* **select-option:** Refactor logic for selection of reason options ([4ec26de](https://github.com/entrostat/road-protect-appeals/commit/4ec26de042bb36b90927b460e8fe8fc40b7214bb))
* **send-QA-code:** Send the correct questionCodes and AnswerCodes to the backend ([b7a0be2](https://github.com/entrostat/road-protect-appeals/commit/b7a0be257b3539d6e6d9209ec5587840d70c9d9c)), closes [#21](https://github.com/entrostat/road-protect-appeals/issues/21)
* **socket-notifications:** Added sockets to notify users once an appeal has been sent to the municipality Merge branch 'feature/RPF-330/add-sockets' into fix/RPF-322/update-new-transaction-status ([04b48ee](https://github.com/entrostat/road-protect-appeals/commit/04b48eec2a91d66daa8d42a0b5cf21ff73bd3bd0))
* **unselect-answer:** Added a check for a reason unselection Merge branch 'fix/RPF-338/double-select-answer' into develop ([4a8e447](https://github.com/entrostat/road-protect-appeals/commit/4a8e447ee8f3b0f589de2744261d60750ee75cfe))
* **user-logs:** Removed unnecessary error log that says unknown user id after a successful user log save ([d8d9ecd](https://github.com/entrostat/road-protect-appeals/commit/d8d9ecdf7dafbf95e6ae0e0f356bc89e48e6cc4b))
* **violation-address:** Differentiated violation location from users location ([b79e7d0](https://github.com/entrostat/road-protect-appeals/commit/b79e7d0280e91db4219a992e48641b13b0a1a4ac))

### [2.3.2](https://github.com/entrostat/road-protect-appeals/compare/v2.3.1...v2.3.2) (2021-02-18)

### [2.3.1](https://github.com/entrostat/road-protect-appeals/compare/v2.3.0...v2.3.1) (2020-11-19)


### Bug Fixes

* **credit-guard:** Updated terminal id ([707a1b1](https://github.com/entrostat/road-protect-appeals/commit/707a1b1bac997acf24e03fe2e88ffa2456592572)), closes [#32](https://github.com/entrostat/road-protect-appeals/issues/32)
* **credit-guard:** Updated terminal id again ([d60be7b](https://github.com/entrostat/road-protect-appeals/commit/d60be7b962d2aa9d9aad15d1cf3a402b0ce36dd4))

## [2.3.0](https://github.com/entrostat/road-protect-appeals/compare/v2.2.1...v2.3.0) (2020-10-12)


### Features

* **mixed:** GTM, payment fix, logger fixes, loading fixes which were previously on production but not merged to master ([3e02cc0](https://github.com/entrostat/road-protect-appeals/commit/3e02cc0d202397e70bc362f59f058d9af644aecb))
* **tracking:** added Google Tag Manager to the frontend ([58db7f4](https://github.com/entrostat/road-protect-appeals/commit/58db7f42ddda0a65fd7b9a56ada3865e49e2cdd7)), closes [#10](https://github.com/entrostat/road-protect-appeals/issues/10)
* **tracking:** added partner tracking to the system ([ede6ebb](https://github.com/entrostat/road-protect-appeals/commit/ede6ebb3a9919033257cc9c0a175b56bf6e6aae6)), closes [#11](https://github.com/entrostat/road-protect-appeals/issues/11)


### Bug Fixes

* **ui:** removed the 0 amount paid from the email ([cef78cf](https://github.com/entrostat/road-protect-appeals/commit/cef78cf402683f60628a6a08ce561fbb3bc509e6)), closes [#12](https://github.com/entrostat/road-protect-appeals/issues/12)

### [2.2.1](https://github.com/entrostat/road-protect-appeals/compare/v2.2.0...v2.2.1) (2020-10-09)

## [2.2.0](https://github.com/entrostat/road-protect-appeals/compare/v2.1.2...v2.2.0) (2020-08-28)

### Features

-   **logger:** added GCP logger to the system ([5fa6d10](https://github.com/entrostat/road-protect-appeals/commit/5fa6d105ede64ea092f18666e6937e64b7bd2836)), closes [#4](https://github.com/entrostat/road-protect-appeals/issues/4)

### Bug Fixes

-   **cleanup:** removed temporary pdfs ([b4a599f](https://github.com/entrostat/road-protect-appeals/commit/b4a599f1bdeae8d9d91f19ec1d464067dfdeb8c4))
-   **debug:** changed the debug namespace ([9e40085](https://github.com/entrostat/road-protect-appeals/commit/9e40085f09ab8d1b0764855dfcac8ba46912b646))
-   **devops:** added the staging kubernetes scripts ([f70f87a](https://github.com/entrostat/road-protect-appeals/commit/f70f87abb49c491b77af8c3549258f869ecaf70d))
-   **devops:** changed the label on the metabase deployment ([76a79a2](https://github.com/entrostat/road-protect-appeals/commit/76a79a2eae690e5f3dcc3c962f4c194e8ac8008a))
-   **logger:** compact logs to make them more readable on GCP ([8495259](https://github.com/entrostat/road-protect-appeals/commit/84952595a70dcd44eb9d9d0b8f514386dcf966ca)), closes [#9](https://github.com/entrostat/road-protect-appeals/issues/9)

### [2.1.2](https://github.com/entrostat/road-protect-appeals/compare/v2.1.1...v2.1.2) (2020-05-10)

### Bug Fixes

-   **appeal:** the tickets and users weren't joined to the appeal ([2a017e9](https://github.com/entrostat/road-protect-appeals/commit/2a017e966ab8335a691411a4f4e5e9f0b6136863))
-   **ticket:** fixed the error where the user was not being loaded on the ticket ([e063842](https://github.com/entrostat/road-protect-appeals/commit/e0638428d29cdea23bae7b8a27fa983cb83b5a78))

### [2.1.1](https://github.com/entrostat/road-protect-appeals/compare/v2.1.0...v2.1.1) (2020-05-10)

## [2.1.0](https://github.com/entrostat/road-protect-appeals/compare/v2.0.0...v2.1.0) (2020-05-10)

### Features

-   **metabase:** added Metabase to the system for generating reports ([13df627](https://github.com/entrostat/road-protect-appeals/commit/13df6277036a1fb17d0fd88c102fcae236c870b8))

## [2.0.0](https://github.com/entrostat/road-protect-appeals/compare/v1.9.1...v2.0.0) (2020-05-10)

### Features

-   **audit:** added the audit logs for coupons and credit card payments ([b9c76a4](https://github.com/entrostat/road-protect-appeals/commit/b9c76a46581e60eafc533536dc11f12e7aa371ea)), closes [#93](https://github.com/entrostat/road-protect-appeals/issues/93)
-   **audit:** added the logs for deleting a ticket and an appeal ([d3bdf64](https://github.com/entrostat/road-protect-appeals/commit/d3bdf6413fe2c3cb0598f18e844ed3147cca76f2)), closes [#94](https://github.com/entrostat/road-protect-appeals/issues/94)
-   **audit:** record successful or failed payments ([b1b028f](https://github.com/entrostat/road-protect-appeals/commit/b1b028f9f88a079b6e407fdbf6dea6a9580b11f9)), closes [#92](https://github.com/entrostat/road-protect-appeals/issues/92)
-   **audit:** updated the logs with editing appeals ([aea2b19](https://github.com/entrostat/road-protect-appeals/commit/aea2b19e34a0a463f759e3c069ed1c149059ddcf)), closes [#89](https://github.com/entrostat/road-protect-appeals/issues/89)
-   **auth:** Generate password ([9170a01](https://github.com/entrostat/road-protect-appeals/commit/9170a0128c1b0a602c546e64126676c03b07b466)), closes [#30](https://github.com/entrostat/road-protect-appeals/issues/30)
-   **blackbox-add-marion:** Added Marion to Blackbox ([37da2f5](https://github.com/entrostat/road-protect-appeals/commit/37da2f565161c646005f18502b9814b5ce5169c1)), closes [#91](https://github.com/entrostat/road-protect-appeals/issues/91)
-   **coupons:** Activate coupon ([b9f377d](https://github.com/entrostat/road-protect-appeals/commit/b9f377def80db0832a42f5d4753d214c7f2995ee))
-   **coupons:** Auth handling ([3942045](https://github.com/entrostat/road-protect-appeals/commit/3942045c58b4e333aa2447f9aa2cf06cc3dc44d0)), closes [#28](https://github.com/entrostat/road-protect-appeals/issues/28)
-   **coupons:** Bulk create coupons possible ([efcfd5d](https://github.com/entrostat/road-protect-appeals/commit/efcfd5d81ee5485a71c8cc1777525754d6cbccd9)), closes [#27](https://github.com/entrostat/road-protect-appeals/issues/27)
-   **coupons:** Choice between coupon and credit card payments available ([e46ac62](https://github.com/entrostat/road-protect-appeals/commit/e46ac62605c0e9f6bafcb4cf9bfca20a0bf0d921)), closes [#50](https://github.com/entrostat/road-protect-appeals/issues/50)
-   **coupons:** Coupon logs ([5bb29af](https://github.com/entrostat/road-protect-appeals/commit/5bb29af437180067c3adc4f0c8be8dbfac7ec8da)), closes [#23](https://github.com/entrostat/road-protect-appeals/issues/23)
-   **coupons:** Coupon usage logs ([f5069c6](https://github.com/entrostat/road-protect-appeals/commit/f5069c6cae2a95b0dde5faca3064652dfc76cfb5)), closes [#54](https://github.com/entrostat/road-protect-appeals/issues/54)
-   **coupons:** Create coupon ([4d5f4b1](https://github.com/entrostat/road-protect-appeals/commit/4d5f4b120d7536e0db622f9a7181fb3e063f73b6))
-   **coupons:** Deactivate coupon ([10cfd7b](https://github.com/entrostat/road-protect-appeals/commit/10cfd7b41a77841a6f28b4266e607bcc3bf93a83)), closes [#26](https://github.com/entrostat/road-protect-appeals/issues/26)
-   **coupons:** Error page ([3b17ed6](https://github.com/entrostat/road-protect-appeals/commit/3b17ed613273849d328a231d01fd9c748b6623d2)), closes [#53](https://github.com/entrostat/road-protect-appeals/issues/53)
-   **coupons:** Ticket status updates on entering valid coupon ([a3321de](https://github.com/entrostat/road-protect-appeals/commit/a3321defa82a0ef163f2f5188769fb3251058964)), closes [#55](https://github.com/entrostat/road-protect-appeals/issues/55)
-   **coupons:** Validate coupon ([8f3c780](https://github.com/entrostat/road-protect-appeals/commit/8f3c780678bdef95a12e292729fe839400ad042f)), closes [#52](https://github.com/entrostat/road-protect-appeals/issues/52)
-   **documents:** added the ability to add and edit documents (no delete yet) and added the ability to add and remove questions from an appeal. ([f6a70ed](https://github.com/entrostat/road-protect-appeals/commit/f6a70ed5eba30b7a8d1c1a4140fba1ce16df7d08)), closes [#83](https://github.com/entrostat/road-protect-appeals/issues/83)
-   **implement-user-logs:** Implemented the basic user logs Merged in feature/implement-user-logs (pull request [#78](https://github.com/entrostat/road-protect-appeals/issues/78)) ([67075ff](https://github.com/entrostat/road-protect-appeals/commit/67075ffd96800ba90b6f0df94239538247aa0ef0))
-   **implementing-ticket-entity:** Implemented the ticket entity Merged in feature/implementing-ticket-entity (pull request [#77](https://github.com/entrostat/road-protect-appeals/issues/77)) ([d99ae9f](https://github.com/entrostat/road-protect-appeals/commit/d99ae9f513c0a3a0a702b93f7f3f0a99eb3c6679))
-   **marion-credentials:** Added Marion to Blackbox Merged in feature/blackbox/credentials-for-marion (pull request [#90](https://github.com/entrostat/road-protect-appeals/issues/90)) ([ad68122](https://github.com/entrostat/road-protect-appeals/commit/ad68122fcc9f4a31274e33b374ff23ff2b7d1d59))
-   **payment-entities:** Added payment entities Merged in feature/payment-entities (pull request [#75](https://github.com/entrostat/road-protect-appeals/issues/75)) ([ead7f2c](https://github.com/entrostat/road-protect-appeals/commit/ead7f2ce30242964b282c91510c9acacc6d40fc4))
-   **payments:** added the ability to pay by coupon ([8b059b9](https://github.com/entrostat/road-protect-appeals/commit/8b059b9fde54de6cbcda70c6919ec59f3aabb106))
-   **payments:** Fixed existing payments ([268e4c5](https://github.com/entrostat/road-protect-appeals/commit/268e4c58ced74b91b4d77d079dc1411a34c436be)), closes [#59](https://github.com/entrostat/road-protect-appeals/issues/59)
-   **populate-municipalities-table:** Logic to seed municipalities from cities.csv and Infrasonic courthouses ([e16361e](https://github.com/entrostat/road-protect-appeals/commit/e16361ecf6dc800205b6d15affbdfdd48fdd5f2a)), closes [#74](https://github.com/entrostat/road-protect-appeals/issues/74)
-   **populate-vehicle-tables:** Created a seeder for the vehicle tables Merge branch 'feature/AR-148/populate-vehicle-tables' into develop ([70ec2a2](https://github.com/entrostat/road-protect-appeals/commit/70ec2a2ab14db584911ffdd7c8de21739ce87737))
-   **README:** README.md updated ([4e5bf19](https://github.com/entrostat/road-protect-appeals/commit/4e5bf19498469888360f73d1b1e2b0aa2018b840))
-   **seed-user-action-table:** Automatically seeds the user action table with basic actions ([4b6e0d1](https://github.com/entrostat/road-protect-appeals/commit/4b6e0d150340ccc49419e7d7aa500c4fd9c67fce)), closes [#76](https://github.com/entrostat/road-protect-appeals/issues/76)
-   **setup:** refactored the ticket and user modules and put them into a shared module. ([c1a2907](https://github.com/entrostat/road-protect-appeals/commit/c1a290746bcc259756b8e02d9daa8c5cbf8a7afc)), closes [#80](https://github.com/entrostat/road-protect-appeals/issues/80)
-   **ticket:** added a ticket history service ([04d5cf0](https://github.com/entrostat/road-protect-appeals/commit/04d5cf08cb5433ad7ae9dd1e3c48c379afcd37e0)), closes [#85](https://github.com/entrostat/road-protect-appeals/issues/85)
-   **ticket:** added the ability to delete tickets ([5b2ba35](https://github.com/entrostat/road-protect-appeals/commit/5b2ba3525f09a5712bb0de7f31bd151c85080b17)), closes [#88](https://github.com/entrostat/road-protect-appeals/issues/88)
-   **ticket:** added the functionality to edit tickets ([9d1d268](https://github.com/entrostat/road-protect-appeals/commit/9d1d268441f054a5845c3e34d55cac8d74a1ae96)), closes [#84](https://github.com/entrostat/road-protect-appeals/issues/84)
-   **ticket:** link the ticket to the municipality based on the courthouse id. ([d0095ab](https://github.com/entrostat/road-protect-appeals/commit/d0095ab112392942d837340d45f7731965dfd31f)), closes [#87](https://github.com/entrostat/road-protect-appeals/issues/87)
-   **ticket-tables:** Added a ticket, appeal and ticket history entities Merge branch 'develop' into feature/ticket-table ([1ed0105](https://github.com/entrostat/road-protect-appeals/commit/1ed0105d1ba1f3306372382830a5b0d217f19327))
-   **ticket-tables:** Added a ticket, appeal and ticket history entity Merge branch 'feature/ticket-table' into develop ([a4ff141](https://github.com/entrostat/road-protect-appeals/commit/a4ff1419b7110bb4659e59ab673a270bc8ced0bb))
-   **vehicle-tables:** Added a vehicle table Merge branch 'feature/vehicle-tables' into develop ([c139d6f](https://github.com/entrostat/road-protect-appeals/commit/c139d6faad672f7ef2e1db12d4a12aec419d623d))
-   **vehicles:** added the ability to create vehicles and link tickets to them ([bf95d8c](https://github.com/entrostat/road-protect-appeals/commit/bf95d8c982ab3a47deafd4f4b97dac33074585b6)), closes [#86](https://github.com/entrostat/road-protect-appeals/issues/86)

### Bug Fixes

-   **build:** added prettier to the main package.json file ([692c836](https://github.com/entrostat/road-protect-appeals/commit/692c8366836ede37f890a44e9507488d861bac7d))
-   **build:** added the prettier config file ([a0f4316](https://github.com/entrostat/road-protect-appeals/commit/a0f4316584fdf673d6d7e03c99fb02d20447a3af))
-   **build:** added the prettier config to the backend and frontend ([751df09](https://github.com/entrostat/road-protect-appeals/commit/751df0950f05c6961629567bbc98154b56f810ab))
-   **build:** changed license of project ([c146083](https://github.com/entrostat/road-protect-appeals/commit/c146083bce6bc531dca86390369a25816a74c34a))
-   **build:** formatted backend ([693c9fa](https://github.com/entrostat/road-protect-appeals/commit/693c9fa9c0aa7c54311d04a3e8bb34444d44ddfa))
-   **build:** formatted frontend ([935f0b3](https://github.com/entrostat/road-protect-appeals/commit/935f0b3d329328717abcd636dbe878b82baf7413))
-   **coupons:** Auth handling improved slightly ([e87fa9c](https://github.com/entrostat/road-protect-appeals/commit/e87fa9c6f03b7ea0893dac9a79ec06bcc390c740)), closes [#66](https://github.com/entrostat/road-protect-appeals/issues/66)
-   **db:** Added back corrected date transformer ([c6bca97](https://github.com/entrostat/road-protect-appeals/commit/c6bca97776f20e1a6b449c8e3108a3730bb0efa9))
-   **env:** Fix to process.env call for twilio auth token ([332cf73](https://github.com/entrostat/road-protect-appeals/commit/332cf73e3046b0de373289e0f34a4ad0c2744c0f))
-   **logger:** Removed global logger and updated cli ([45e7b25](https://github.com/entrostat/road-protect-appeals/commit/45e7b2591f62ffdbc54347c5ee1b43bb9a2cf7ab)), closes [#72](https://github.com/entrostat/road-protect-appeals/issues/72)

### [1.9.1](https://bitbucket.org/entrostat/road-protect-appeals/compare/v1.9.0...v1.9.1) (2020-03-22)

### Bug Fixes

-   **logger:** Added stderr logging ([ed03203](https://bitbucket.org/entrostat/road-protect-appeals/commit/ed0320312a769716140c131feacc31a2f958e9cb))

## [1.9.0](https://bitbucket.org/entrostat/road-protect-appeals/compare/v1.8.8...v1.9.0) (2020-03-22)

### Features

-   **additional-phone-number:** Added frontend for additional phone number ([42ae2ab](https://bitbucket.org/entrostat/road-protect-appeals/commit/42ae2abfd8ac718d7988731ff0fcb8b27e3ed188))
-   **refactor:** Consistent file names ([95fe0ec](https://bitbucket.org/entrostat/road-protect-appeals/commit/95fe0ec8eb6fcca9d70beb60d94e7d17a628078d)), closes [#48](https://bitbucket.org/entrostat/road-protect-appeals/issues/48)
-   **refactor:** Removed CORS ([1dc1d15](https://bitbucket.org/entrostat/road-protect-appeals/commit/1dc1d1553a88dec23a64123726ec8b27dccb82c7))

### Bug Fixes

-   **about-us:** Corrections to about us page ([0b8fb54](https://bitbucket.org/entrostat/road-protect-appeals/commit/0b8fb5427f32414b715090b0d9b0c5fcac9c2766)), closes [#63](https://bitbucket.org/entrostat/road-protect-appeals/issues/63)
-   **critical:** Required to ensure live works ([f65837b](https://bitbucket.org/entrostat/road-protect-appeals/commit/f65837b8a05c5928785e496a4b7e8212858bd587)), closes [#64](https://bitbucket.org/entrostat/road-protect-appeals/issues/64)
-   **translation:** Button switch ([e26b255](https://bitbucket.org/entrostat/road-protect-appeals/commit/e26b2552cccb6bd934a80b8d6f4d908cd40bcdf0)), closes [#61](https://bitbucket.org/entrostat/road-protect-appeals/issues/61)
-   **translation:** Upload id page wording ([17345dd](https://bitbucket.org/entrostat/road-protect-appeals/commit/17345dd859ea5859a35b2b901f3ab469893019df)), closes [#60](https://bitbucket.org/entrostat/road-protect-appeals/issues/60)

### [1.8.4](https://bitbucket.org/entrostat/road-protect-appeals/compare/v1.8.3...v1.8.4) (2020-03-05)

### Bug Fixes

-   **image-upload:** Image removal from other pics array corrected ([0feb6fc](https://bitbucket.org/entrostat/road-protect-appeals/commit/0feb6fc480c477c93d9b12f2012e0cd80ffff9f6)), closes [#46](https://bitbucket.org/entrostat/road-protect-appeals/issues/46)

### [1.8.3](https://bitbucket.org/entrostat/road-protect-appeals/compare/v1.8.2...v1.8.3) (2020-03-05)

### Features

-   **about-us:** About us page completed ([ab32a43](https://bitbucket.org/entrostat/road-protect-appeals/commit/ab32a43cc97dc01a159d862f455c9615fbb64ab0))
-   **refactor:** Refactored frontend directory structure ([2e2b75c](https://bitbucket.org/entrostat/road-protect-appeals/commit/2e2b75c35583a559d236e447881e18e8cf0a0ef4))
-   **ux-pricing-page:** Pricing page completed ([a7af6ff](https://bitbucket.org/entrostat/road-protect-appeals/commit/a7af6ffd8117ecd8ca34282ec5444107e457f242))

### Bug Fixes

-   **image-upload:** Multi-image upload working with integration ([d74ff96](https://bitbucket.org/entrostat/road-protect-appeals/commit/d74ff9657a6da45e42ce1fb681952fbe09267cc4)), closes [#45](https://bitbucket.org/entrostat/road-protect-appeals/issues/45)

### [1.8.8](https://bitbucket.org/entrostat/road-protect-appeals/compare/v1.8.7...v1.8.8) (2020-03-16)

### Bug Fixes

-   **critical:** Update ticket request was also failing ([9e7179c](https://bitbucket.org/entrostat/road-protect-appeals/commit/9e7179cee062ae1286557ff13306c060d218f7fb)), closes [#58](https://bitbucket.org/entrostat/road-protect-appeals/issues/58)
-   **CRITICAL:** Reverted to RP ZA LIVE ([0c875a9](https://bitbucket.org/entrostat/road-protect-appeals/commit/0c875a99944212ff2d326c4ada567eebc8af5f94)), closes [#57](https://bitbucket.org/entrostat/road-protect-appeals/issues/57)

### [1.8.7](https://bitbucket.org/entrostat/road-protect-appeals/compare/v1.8.6...v1.8.7) (2020-03-16)

### Bug Fixes

-   **CRITICAL:** REVERTED TO RP ZA QA ENVIRONMENT ([869514b](https://bitbucket.org/entrostat/road-protect-appeals/commit/869514ba276c8c49bb11816fcfeb771005e214c0))
-   **Log:** Need to be able to see logs for get auth token ([7892a07](https://bitbucket.org/entrostat/road-protect-appeals/commit/7892a07f4db6fe9602b5cb88024da1ed4cb8be8b))

### [1.8.6](https://bitbucket.org/entrostat/road-protect-appeals/compare/v1.8.5...v1.8.6) (2020-03-16)

### Bug Fixes

-   **prod:** Whitelist set to true to prevent unnecessary variables to prod ([4cd1a88](https://bitbucket.org/entrostat/road-protect-appeals/commit/4cd1a8896692d680bdf8463147e1f9167d1bbade)), closes [#56](https://bitbucket.org/entrostat/road-protect-appeals/issues/56)

### [1.8.5](https://bitbucket.org/entrostat/road-protect-appeals/compare/v1.8.2...v1.8.5) (2020-03-11)

### Bug Fixes

-   **env:** Update RP ZA url ([f5c4eee](https://bitbucket.org/entrostat/road-protect-appeals/commit/f5c4eee4a2de5b7467ec53a062bbc2098afd7f06))

### [1.8.4](https://bitbucket.org/entrostat/road-protect-appeals/compare/v1.8.2...v1.8.4) (2020-03-11)

### Bug Fixes

-   **image-upload:** Image removal from other pics array corrected ([0feb6fc](https://bitbucket.org/entrostat/road-protect-appeals/commit/0feb6fc480c477c93d9b12f2012e0cd80ffff9f6)), closes [#46](https://bitbucket.org/entrostat/road-protect-appeals/issues/46)
-   **env:** Update RP ZA url ([f5c4eee](https://bitbucket.org/entrostat/road-protect-appeals/commit/f5c4eee4a2de5b7467ec53a062bbc2098afd7f06))

### [1.8.3](https://bitbucket.org/entrostat/road-protect-appeals/compare/v1.8.2...v1.8.3) (2020-03-11)

### Features

-   **about-us:** About us page completed ([ab32a43](https://bitbucket.org/entrostat/road-protect-appeals/commit/ab32a43cc97dc01a159d862f455c9615fbb64ab0))
-   **ux-pricing-page:** Pricing page completed ([a7af6ff](https://bitbucket.org/entrostat/road-protect-appeals/commit/a7af6ffd8117ecd8ca34282ec5444107e457f242))

### Bug Fixes

-   **env:** Update RP ZA url ([f5c4eee](https://bitbucket.org/entrostat/road-protect-appeals/commit/f5c4eee4a2de5b7467ec53a062bbc2098afd7f06))
-   **image-upload:** Multi-image upload working with integration ([d74ff96](https://bitbucket.org/entrostat/road-protect-appeals/commit/d74ff9657a6da45e42ce1fb681952fbe09267cc4)), closes [#45](https://bitbucket.org/entrostat/road-protect-appeals/issues/45)

## [1.9.0-staging](https://bitbucket.org/entrostat/road-protect-appeals/compare/v1.8.1...v1.9.0-staging) (2020-03-02)

### Features

-   **refactor:** Refactored frontend directory structure ([2e2b75c](https://bitbucket.org/entrostat/road-protect-appeals/commit/2e2b75c35583a559d236e447881e18e8cf0a0ef4))

### [1.8.2](https://bitbucket.org/entrostat/road-protect-appeals/compare/v1.8.1...v1.8.2) (2020-03-05)

### Bug Fixes

-   **env:** Switched backend env to beta ([2c3ffdd](https://bitbucket.org/entrostat/road-protect-appeals/commit/2c3ffdd4e431525dc8eaf47b16f114987ed92f15))

### [1.8.1](https://bitbucket.org/entrostat/road-protect-appeals/compare/v1.8.0...v1.8.1) (2020-02-27)

## [1.8.0](https://bitbucket.org/entrostat/road-protect-appeals/compare/v1.7.0...v1.8.0) (2020-02-26)

### Features

-   **cli:** Added cli ([6914e54](https://bitbucket.org/entrostat/road-protect-appeals/commit/6914e54d6f9082c2b1ffec50e3c12f0a96ecb2e9)), closes [#29](https://bitbucket.org/entrostat/road-protect-appeals/issues/29)
-   **db:** Coupon entity ([05337c3](https://bitbucket.org/entrostat/road-protect-appeals/commit/05337c361d69c4fb69907c82cd7a09ddbca324bf))
-   **devops:** Migrate domains in yaml definitions ([1705278](https://bitbucket.org/entrostat/road-protect-appeals/commit/17052786322a7805bb8d82fb7349a96f42d31871))
-   **logger:** Added extended logger ([a5a7844](https://bitbucket.org/entrostat/road-protect-appeals/commit/a5a78448870baecb2a37a235803ae70a73766165))
-   **logging:** Cleaned up and added logs to improve flow ([1d98c2b](https://bitbucket.org/entrostat/road-protect-appeals/commit/1d98c2bc68e444c8931b64734d035bec23cdf8a8))
-   **prefix:** Added global route prefix ([2218de1](https://bitbucket.org/entrostat/road-protect-appeals/commit/2218de1cfeda794088efa899d0523857c094fadf))
-   **refactor:** Moved config into separate files ([9550143](https://bitbucket.org/entrostat/road-protect-appeals/commit/9550143d032f8f056d325767458bc441d5867280))
-   **ticket-status-logic:** Ticket status logic refactor to handle different ticket status ids on prod vs staging ([8d75cb5](https://bitbucket.org/entrostat/road-protect-appeals/commit/8d75cb5225b73c037462bbf59ebd14ccdb6895f8))
-   **ux:** Text field on last step edits ticket defence paragraphs ([8745d97](https://bitbucket.org/entrostat/road-protect-appeals/commit/8745d97e4efe4dcdce6f6e120558f9cecb2fbbb5)), closes [#34](https://bitbucket.org/entrostat/road-protect-appeals/issues/34)

### Bug Fixes

-   **appeal-sending:** Tested and ensured that an appeal can be sent even if logged out ([8447334](https://bitbucket.org/entrostat/road-protect-appeals/commit/84473340b70d3f138e2da8b8e6c77922e57568a3))
-   **auth:** User id find incorrect ([3d24854](https://bitbucket.org/entrostat/road-protect-appeals/commit/3d24854268e143189e34687db9f1f067635180ab)), closes [#33](https://bitbucket.org/entrostat/road-protect-appeals/issues/33)
-   **data:** Corrected municipality code data ([e2ba957](https://bitbucket.org/entrostat/road-protect-appeals/commit/e2ba95718a3e396ce045f8a93be008a13d6ee8b9))
-   **node-version:** Updated docker file node version to 12 ([6d40ade](https://bitbucket.org/entrostat/road-protect-appeals/commit/6d40ade6c25f91f03403f05523b6090dc2a6bc94)), closes [#32](https://bitbucket.org/entrostat/road-protect-appeals/issues/32)
-   **phone-number:** Correction to phone number on otp page & in email template ([13a6e5d](https://bitbucket.org/entrostat/road-protect-appeals/commit/13a6e5d668659143cca178f13d8667b0a172fe76))

## [1.7.0](https://bitbucket.org/entrostat/road-protect-appeals/compare/v1.0.1...v1.7.0) (2020-02-03)

### Features

-   **auth:** Ability to logout ([08e738e](https://bitbucket.org/entrostat/road-protect-appeals/commit/08e738e82db14a45de154df8db0d49746f0af8cb))
-   **contact-us-page:** Contact us page and email ([5106b8a](https://bitbucket.org/entrostat/road-protect-appeals/commit/5106b8a569e218924a113d47e35e4a40741fb774))
-   **navigation:** Appeal and main buttons route to appeals list when logged in ([b6895c1](https://bitbucket.org/entrostat/road-protect-appeals/commit/b6895c1d127db8ef5b7acb86114e70c8813dc9ef))
-   **navigation:** Refresh without logging out ([11a9c12](https://bitbucket.org/entrostat/road-protect-appeals/commit/11a9c12b407259a3d70ab9a6c5922944baa30dda))

### Bug Fixes

-   **devops:** Base url for backend must be /api ([7fda293](https://bitbucket.org/entrostat/road-protect-appeals/commit/7fda29312738c911f3d585912ed8b9e510071c70))
-   **image-upload:** Display error if file types other than images are selected ([7b4ab46](https://bitbucket.org/entrostat/road-protect-appeals/commit/7b4ab46663b127f23439276be2085aa544077723))
-   **infringement-details:** Car model is optional not mandatory ([8ba7a04](https://bitbucket.org/entrostat/road-protect-appeals/commit/8ba7a04d9b3b430545387e4ecf63eefc086f64df)), closes [#10](https://bitbucket.org/entrostat/road-protect-appeals/issues/10)

### [1.0.1](https://bitbucket.org/entrostat/road-protect-appeals/compare/v1.6.0...v1.0.1) (2020-01-21)

### Bug Fixes

-   **build:** added a production start script ([b78e54c](https://bitbucket.org/entrostat/road-protect-appeals/commit/b78e54cdc69559e7e2f11351fcda6bc746de61ab))
-   **build:** building prod ([c403566](https://bitbucket.org/entrostat/road-protect-appeals/commit/c4035668c3fc8f889828dabe8e414323ca50cda9))
-   **courthouse:** added the courthouse to the ticket ([95ac40f](https://bitbucket.org/entrostat/road-protect-appeals/commit/95ac40fb3c0576f9980e93c625de7ce94a581653))

## [1.0.0](https://bitbucket.org/entrostat/road-protect-appeals/compare/v1.1.0...v1.0.0) (2019-12-16)
