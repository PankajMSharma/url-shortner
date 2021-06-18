# url-shortner
Url Shortner Using Node.Js

# Author
Pankaj Sharma

# ASSUMPTIONS
-   Original url would be less than 2048 characters as most leading search engine allow upto this limit only.
-   Short Url could be from 6 characters to 10 characters

# SYSTEM REQUIREMENTS
-   Node (v10.15.3)
-   NPM (6.4.1)
-   MySQL (5.7.19)
 
# Setup And Deployment (For Windows)
-   Open Git shell
-   RUN `git clone https://github.com/PankajMSharma/url-shortner.git`
-   RUN `cd ./url-shortner`
-   Update Database config details in .env file
-   In CMD, RUN `mysqldump -u -p "~\url-shortner\backend\dump.sql" < url_shortner_db`
-   RUN `npm i`
-   RUN `npm run serve` to deploy
-   On Browser visit `http://localhost:4201` (This URL could be different for different config in .ENV file)
-   Note: If BACKEND_URL or BACKEND_PORT is changed in .ENV File, you also need to change CONSTS in ~/views/index.pug

# TO RUN TEST CASES
-   RUN `npm run serve` to deploy
-   RUN `npm run test` to run test cases

# How to test backend requests
-   Install Visual Studio Code (VSCode)
-   Install `REST Client` from extensions
-   Open "request.rest" file in VSCode
-   To test any request in that file click on "send request" link