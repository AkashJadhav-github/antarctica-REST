## PROJECT EXECUTION SETUP
1) git clone the project from the repository online
2) Enter your MongoDB database connection string in config(folder) > config.js(file) > database_url(variable)
3) npm install (if failed to execute, try -> sudo npm install)
4) npm start


## DATABASE ARCHITECTURE
1) Mongodb is used to store, retrieve and manipulate the data.

2) Only one database is created, named as - 'antarctica-db'

3) This DB has one collection called as 'users' collection.
    This collection has all the user related data and all the operations are performed on this data.

4) Before you use the APIs query the following command in mongo database by entering/login/accessing the database. i.e.
    a) use antarctica-db
    b) db.users.createIndex({"first_name": "text", "last_name": "text", "employeeID": "text"})


## PROJECT ARCHITECTURE
Technology used - Node.js, Express.js, MongoDB

1) This project uses ES6 syntax of javascript.

2) All the routes are in "routes" folder inside "users.js" file. You can navigate to each function from there.

3) All the business logic is written in "services" folder inside the "usersService.js" file.

4) Middleware to authenticated and verify JWT token is written in "auth" folder inside "VerifyToken.js" file

5) All the constants/configuration strings are inside the config folder, such as database connection url, db name, some key secrets (not to be written in config file but to be placed in .env variable for security and privacy)


## API DOCUMENTATION
This project has following API endpoints

A Middleware authentication mechanism is established before all APIs execution (except while registering new user and login existing user) to check if the user who is requesting the resources is valid user or not. 
This can be found in 'auth' folder in VerifyToken.js file

1) Register/Create new user API
        This API is to create new user in database. Mandatory fields to enter are as follows - 
            first_name 
            last_name 
            email 
            password 
            employee_id 
            organization_name

    curl --location --request POST 'localhost:9000/users/register' \
    --header ': ' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "first_name": "Test",
        "last_name": "Anthony",
        "email": "akash@gmail.com",
        "password": "test@123",
        "employee_id": "ANTARCTICA01",
        "organization_name": "ANTARCTICA"
    }'


2) Login API for registered users
        This API is to check if the user is valid registered user or not and return an authentication token if the user is a valid registered user.
        
        Mandatory fields to enter are as follows - 
            email
            password

    curl --location --request POST 'localhost:9000/users/login' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "email": "akash@gmail.com",
        "password": "test@123"
    }'


3) Multiple APIs for search, sort and pagination of user data
        There are three APIs created under this category for serving above functionalities (such as search, sort and pagination) individually.

3-A) Search API
        This API is used to search the database based on its key/fields. We can query database on following keys -
            first_name
            last_name
            employee_id
        We just have to enter the text we want to search in 'search_param' and wait for the data to return from database.
        
        Required fields to process are as follows - 
            search_param

    curl --location --request GET 'localhost:9000/users/search?search_param=test' \
    --header 'x-access-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.A7fEQayrohoHIXUYKs9lXKUgUNusmbi1scvjFh3-Npc'


3-B) Get user sorted data
        This API is used to fetch the complete data in sorted form. We have to provide on which field do we want to sort and in what order (asc, desc). The sortable fields are first name, last name, employee id, email and organization name.
        It accepts one field/parameter/key at a time for sorting.
        
        Required fields to process are as follows - 
            sort_param [last_name or first_name or email or ...]
            sort_order [asc or desc]


    curl --location --request GET 'localhost:9000/users/sort?sort_param=last_name&sort_order=asc' \
    --header 'x-access-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.A7fEQayrohoHIXUYKs9lXKUgUNusmbi1scvjFh3-Npc'


3-C) Get user data in paginated form
        This API provides data in paginated form. Limit and Skip are the variable used to get the specific amount of data. Limit represents amount of data in one page, while skip represents the page number
        
        Required fields to process are as follows - 
            limit
            skip

    curl --location --request GET 'localhost:9000/users/paginatedusers?limit=1&skip=3' \
    --header 'x-access-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.A7fEQayrohoHIXUYKs9lXKUgUNusmbi1scvjFh3-Npc'


4) Single API for search, sort and pagination of user data
        This API is the combination of all the three APIs in 3 number i.e.(3-A, 3-B, 3-C) Here we pass all the parameters we want to query at same time. This kind of API is used on a page where we want multiple filters on a data (e.g. shopping website)
        
        Required fields to process are as follows - 
            search_param
            sort_param
            sort_order
            limit
            skip

    curl --location --request GET 'localhost:9000/users/userlist?search_param=test&sort_param=last_name&sort_order=asc&limit=2&skip=1' \
    --header 'x-access-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.A7fEQayrohoHIXUYKs9lXKUgUNusmbi1scvjFh3-Npc'

