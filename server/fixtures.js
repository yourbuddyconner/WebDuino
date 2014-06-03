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
		Projects.insert(newProject);
		console.log("Database Seeded! Do your worst.")
	}
});