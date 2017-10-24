# MLFQ Visualization

An interactive visualization tool for teaches operating systems students the Multilevel feeback queue scheduling algorithm


# Build instructions

to build cd into the mlfq-viz directory and type:

$ npm install

create a file called .env 
and in the file specify a port like this PORT=SOMENUMBER:

eg, PORT=4000



then to run a development server type:

$ npm run start



then type localhost:PORT to see it!


you can also run it by install webpack globaly:

$ npm install webpack -g



then while in the mlfq-vix running:

$ node server



Some of our images are set to load only when servering it in the build folder.
the arrows primarily.
