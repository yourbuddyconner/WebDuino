# README

### TODO
- ~~Implement DB Schema with [Collection2](https://github.com/aldeed/meteor-collection2) package~~
- ~~Build new templates for displaying user's projects, the one we have now is sufficiently broken~~
- ~~Setup [autoform](https://atmospherejs.com/package/autoform) package for inseting new projects and sensors~~
- Implement progress bars for loading with [iron-router-progress](https://atmospherejs.com/package/iron-router-progress)

#### UI Stuff
- ~~Make each sensor in a project clickable, on click a chart will show up and display readings where the image placeholder is~~
- ~~Only display one project at a time, similar to iOS lists~~
- ~~Make sure we can display multiple projects at once if the user has more than one~~
- ~~Add an "Add Project" and "Add Sensor" button and prompt, each should probably be a Bootstrap modal that pops over~~
- Code up the logic to update a project with a new sensor, it's not as easy as I thought apparently...
- Code the badge next to "Sensors" so it updates with the number of sensors with new readings
- Add in chart options so you can modify the current chart on-the-fly (change scale, move left and right, show more or less points, etc.

#### API Access Points
- Implement [http://github.differential.io/reststop2/](RESTstop2) for our API access point as opposed to iron-router

#### Home Page
- ~~Redesign the home template, it looks like shit and should do something.~~

##### Extra Credit 
- Add [animate.css](http://daneden.github.io/animate.css/) for cool animations when doing things. 
- Move the login template to its own page, replace it with a button