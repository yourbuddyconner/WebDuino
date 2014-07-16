// Publish the user's projects, sensors, and readings to them 
Meteor.publish("projects", function(){
  return Projects.find({owner: this.userId});
});
Meteor.publish("sensors", function(){
  return Sensors.find({owner: this.userId});
});
Meteor.publish("readings", function(){
  return Readings.find({owner: this.userId});
});

Meteor.methods({
  // expects an object with a name field
  insertProject: function(doc){
    Schemas.project.clean(doc);     //clean the object coming from autoform
    check(doc, Schemas.project);    //check it against the schema
    if (this.userId){               //if there is a user logged in
      var newProject = {
        name: doc.name,
        owner: this.userId
      }
      console.log("The new project object: ")
      console.log(newProject);
      Projects.insert(newProject);
      return true;
    }
    return false;
  }
});

/* 
  This is the access point where connected devices to send information to be recorded. It expects 
  a sensor ID in the form of a URL and requires no authentication whatsoever (I might have to fix that 
  later).  

  Basically, the arduino will make an HTTP GET/POST request to /api/sensor_id with the data as a URL 
  parameter. Iron-Router parses out the id and then the 'action' function does the rest. 
*/

Router.map(function(){
  this.route('accessPoint',{
    path: '/api/:_id', // expects a (mongo) sensor ID
    where: 'server',
    action: function(){
      console.log("Incoming connection!!")
      var sensor = Sensors.findOne({_id: this.params._id}); //find the corresponding sensor
      console.log("It's for sensor: ", this.params._id)
      console.log("owner: ", sensor.owner)

      if(sensor){
        var newReading = {
          owner: sensor.owner,
          parentSensor: sensor._id,
          timestamp: new Date(),
          data: this.params.data
        };
        Readings.insert(newReading); 
        };//end if
      }
  });
});

