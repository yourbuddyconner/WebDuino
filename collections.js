Projects = new Meteor.Collection("projects");
Sensors = new Meteor.Collection("sensors");
Readings = new Meteor.Collection("readings");

// THE LINE BELOW SHOULD BE COMMENTED OUT!
SimpleSchema.debug = true;

Schemas = {};

Schemas.project = new SimpleSchema({
  name: {
    type: String,
    label: "Name",
    autoValue: function(){
      if(this.isUpdate){
        console.log(this.value);
      }
    }
  },
  owner: {
    type: String,
    label: "Owner",
    autoValue: function() {
      if (this.value){
        //console.log("The owner is set to " + this.value)
        return this.value
      }
      else{
        return this.userId
      }
    }
  }
// This was the first way I tried to handle sensors in the DB,
// not ready to count it out yet though. 
//
// sensors: {
//   type: [Object],
//   minCount: 0,
//   autoValue: function(){
//     if(this.isInsert && !this.value){
//       return [];
//     }
//     if(this.isUpdate){
//       console.log(this);
//     }
//   }
// },
// "sensors.$.name": {
//   type: String
// },
// "sensors.$.type": {
//   type: String
// }
});
Schemas.sensor = new SimpleSchema({
  parentProject: {
    type: String
  },
  name: {
    type: String
  },
  type: {
    type: String
  },
  owner: {
    type: String,
    label: "Owner",
    autoValue: function() {
      if (this.value){
        //console.log("The owner is set to " + this.value)
        return this.value
      }
      else{
        return this.userId
      }
    }
  }
});
Schemas.reading = new SimpleSchema({
  // _id: {
  //   type: String,
  //   label: "_id"
  // },
  owner: {
    type: String
  },
  parentSensor: {
    type: String,
    label: "ID of the sensor this reading belongs to"
  },
// sensorName: {
//   type: String,
//   label: "Name of the parent sensor in project.sensors"
// },
  timestamp: {
    type: Date,
    label: "when this reading was saved to the database"
  },
  data: {
    type: Number,
    label: "value passed from the Arduino"
  }
});

Projects.attachSchema(Schemas.project);
Sensors.attachSchema(Schemas.sensor);
Readings.attachSchema(Schemas.reading);
