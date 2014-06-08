Projects = new Meteor.Collection("projects");
Readings = new Meteor.Collection("readings");

// THE LINE BELOW SHOULD BE COMMENTED OUT!
SimpleSchema.debug = true;

Schemas = {};

Schemas.project = new SimpleSchema({
  name: {
    type: String,
    label: "Name"
  },
  owner: { //<-- This gets inserted manually in Meteor.methods
    type: String,
    label: "Owner",
    autoValue: function() {
      if (this.value){
        console.log("The owner is set to " + this.value)
        return this.value
      }
      else{
        return this.userId
      }
    }
  },
  sensors: {
    type: [Object],
    minCount: 0,
    optional: true
  },
  "sensors.$.name": {
    type: String,
  },
  "sensors.$.type": {
    type: String
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
  parentProject: {
    type: String,
    label: "ID of the project this reading belongs to"
  },
  sensorName: {
    type: String,
    label: "Name of the parent sensor in project.sensors"
  },
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
Readings.attachSchema(Schemas.reading);
