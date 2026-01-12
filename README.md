# User-service

Welcome to the User-servise!
This project developed with the help of framework Express, Node.js and postgreSQL database, it is a service for working with users.

## Running the App in Development Mode.

1. Navigate to the root directory of the project.
2. Open new terminal window.
3. Install User-service dependencies by running the following command:
   > npm install
4. Run App in the development mode with hot reload feature:
   > npm run dev
   > npm start (running the App in Production Mode)
5. After executing this command, the following messages should appear in the terminal:
   Server running on port 5000.
   The database was created successfully.
6. Server will be running at the 'http:/127.0.0.1:5000/'('http:/localhost:5000/')
7. The application is ready to work.

## Documentation

### The model in the postgreSQL dataDB

{
id: string;
temp: number;
humid: number;
created_at: string;
};

### App endpoints:

1. $/api/1hour- GET request to get an array of dataDB for the last hour.
2. $/api/6hours- GET request to get an array of dataDB for the last 6 hours.
3. $/api/24hours- GET request to get an array of dataDB for the last 24 hours.
4. $/api/:date- GET request to get an array of dataDB by date.
