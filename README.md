# MLFQ Visualization

[[Paper]](https://ieeexplore.ieee.org/document/8117201/)

An interactive visualization tool for teaching operating systems students the Multilevel feeback queue scheduling algorithm


# Build instructions

## Prerequisites
- Nodejs 7.x.x or higher (https://nodejs.org/en/download/current/)
- npm (should come with node)
- webpack: `npm install -g webpack` (version doesn't matter) (sudo or admin privledges required)
- Windows or Linux (should work on OSX, but we haven't tested)

Install dependencies by running  

```
$ npm install
```

in the mlfq-viz directory

## Bundling script, css, and html

To create a build, run the following command in the mlfq-viz folder:

```
webpack
```

This will bundle and transpile resources outputing them in the dist folder. To allow webpack to watch source files and continuously rebuild each time a change is made, add a `-w` flag after the webpack command: `webpack -w`  

## Running a simple webserver and testing

mlfq-viz does not rely on any backend logic, however it is handy to have an HTTP server running to serve files in the dist folder.  

Running `node mlfq-viz` (or `node .` if inside the repo folder) or `npm start` will create a webserver  

The webserver binds to the port specified by the PORT environment variable.  

Environment variables can also by specified by creating a .env file in the mlfq-viz directory:

- create a file called .env 
- in the file specify a port like this PORT=3000


In your browser, navigate to `http://localhost:3000` to run the application (or http://127.0.0.1:3000)
