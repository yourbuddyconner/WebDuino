Meteor.startup( function(){
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
	if(Projects.find().count() === 0){

		var admin = Meteor.users.findOne({username: "admin"});
		var newSensor = {
			name: "My Potentiometer",
			type: "Potentiometer" 
		}
		var newProject = {
			name: "My First Project",
			owner: admin._id,
			sensors: [
				{
					name: "My Potentiometer",
					type: "Potentiometer" 
				},
				{
					name: "My Accelerometer",
					type: "Accelerometer"
				}
			]
		}
		console.log(newProject);
		var projectId = Projects.insert(newProject);
	}
	if(Readings.find().count() === 0){
		var newReading1 = {
			owner: admin._id,
			parentProject: projectId,
			sensorName: newProject.sensors[0].name,
			timestamp: 0,
			data: 0
		};
		var newReading2 = {
			owner: admin._id,
			parentProject: projectId,
			sensorName: newProject.sensors[1].name,
			timestamp: 0,
			data: 1
		};
		function getRandomInt(min, max) {
  			return Math.floor(Math.random() * (max - min + 1)) + min;
		}
		for(var i=0; i<30; i++){
			newReading1.data = getRandomInt(1, 100);
			newReading2.data = newReading2.data+2;
			newReading1.timestamp = new Date();
			newReading2.timestamp = new Date();
			Readings.insert(newReading1);
			Readings.insert(newReading2);
		}
	console.log("Database Seeded! Do your worst.")
	}
});