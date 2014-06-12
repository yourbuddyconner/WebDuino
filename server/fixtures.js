/* 
	Seed the DB with an administrative user and some projects/sensors/readings
	to play and debug with. This file is meant to run completely at the first 
	run, if there's errors, reset the DB ("meteor reset") and restart Meteor. 
*/

Meteor.startup( function(){
	// If there are no users
	if(Meteor.users.find().count() === 0){
		Accounts.createUser({
			username: "admin",
			email: "conner@nau.edu",
			password: "yoloswag",
			profile: {
	            first_name: 'Conner',
	            last_name: 'Swann',
	            company: 'BearSpark',
	        }
		});
		console.log("Default user created succussfully!")
	}
	// If there are no projects 
	if(Projects.find().count() === 0){
		// Find the admin user we just made
		var admin = Meteor.users.findOne({username: "admin"});
		var newProject = {
			name: "My First Project",
			owner: admin._id,
			// sensors: [
			// 	{
			// 		name: "My Potentiometer",
			// 		type: "Potentiometer" 
			// 	},
			// 	{
			// 		name: "My Accelerometer",
			// 		type: "Accelerometer"
			// 	}
			// ]
		}
		console.log("Here's the project: ", newProject);
		var projectId = Projects.insert(newProject);
	}
	if (Sensors.find().count() === 0){
		parent = Projects.findOne({_id: projectId});
		var newSensor = {
			parentProject: parent._id,
			name: "My Potentiometer",
			type: "Potentiometer",
			owner: admin._id
		}
		var newSensor1 = {
			parentProject: parent._id,
			name: "Humidity Sensor",
			type: "Humidity",
			owner: admin._id 
		}
		var sensorOne = Sensors.insert(newSensor);
		var sensorTwo = Sensors.insert(newSensor1);
		console.log("Added the Sensors!")
}
	if(Readings.find().count() === 0){
		sensorOne = Sensors.findOne({_id: sensorOne});
		sensorTwo = Sensors.findOne({_id: sensorTwo});
		console.log("Sensor One: ", sensorOne);
		console.log("Sensor Two: ", sensorTwo);

		var newReading1 = {
			owner: admin._id,
			parentSensor: sensorOne._id,
			//sensorName: newProject.sensors[0].name,
			timestamp: 0,
			data: 0
		};
		var newReading2 = {
			owner: admin._id,
			parentSensor: sensorTwo._id,
			//sensorName: newProject.sensors[1].name,
			timestamp: 0,
			data: 1
		};
		function getRandomInt(min, max) {
  			return Math.floor(Math.random() * (max - min + 1)) + min;
		}
		for(var i=0; i<30; i++){
			Meteor.setTimeout(function(){
				newReading1.data = getRandomInt(1, 100);
				newReading2.data = newReading2.data*2;
				newReading1.timestamp = new Date();
				newReading2.timestamp = new Date();
				Readings.insert(newReading1);
				Readings.insert(newReading2);
			}, 1000*i)
		}
	console.log("Readings Seeded.")
	console.log("All Done! Do your worst.")
	}
});