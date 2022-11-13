# fragments

A project that aims to support data fragments and the metadata associated with them. Kind of a one stop for all your miscallaneous storage needs.

Up to now this server offers a few endpoints to save fragments and fragment data in an "in memory database" which is wiped clean upon restarting the server.

The endpoints currently up and functional are:

Our generic health route : The base route of the server is a generic health get returning some author and version information.

GET routes:

`/v1/fragments` : This returns an array of fragments associated with the user that is signed in. It returns an empty array if there is no fragments associated with the user.

`/fragments?expand=1` : Returns an expanded array of fragments, showing all of the metadata associated with the fragment ids belonging to the user.

`/v1/fragments/:id` : returns a fragments data based upon its id.

`/v1/fragments/:id.ext` : attempts to convert the fragment data associated with id based on `.ext`. So far this only really works with markdown content-type conversion.

POST route:

`/v1/fragments` : Post a fragment, consisting of meta data such as content-type along with the actual data to be persisted.

Supported Content-Types: So far this project supports _text/plain_ _text/markdown_ _text/html_ _application/json_

# Future Plans

Future plans include adding more conversion support to the existing content-types, adding more content-types that will be supported such as images, rounding out CRUD with delete and put routing and finally connecting the project to an actual database backend.

# Inital Setup

npm run start to start up Server  
npm run dev to start nodemon @ debug level for now  
npm run debug to listen for debugging client, used in Launch config  
npm run lint checks ecma standards

# Tools

This project is written using _eslint_ and _prettier_ for concerns of formatting. It is using _AWS cognito_ for authorization and token handling, _pino_ for logging, _jest_ and _supertest_ for testing and _nodemon_ for continuously running the application locally while developing.
