// client/main.js

Meteor.subscribe("messages");
Meteor.subscribe("chatters");

// Help the template
Template.body.helpers({
	// Seems to be like RoR controller index action
	messages: function () {
		return Messages.find();
	}
});

// Handle some event
Template.body.events({
	// On submit event with class of new-message
	"submit .new-message": function (event) {
		// Event target = form element; assign text's value
		var text = event.target.text.value;
		Meteor.call("addMessage", text);
		event.target.text.value = "";

		// Prevent default form submit ...?
		return false;
	},
	"click #remote-signin-toggle": function (event) {
		// Second button to toggle signin/up dropdown
		if (!Meteor.userId()) {
			$('#login-dropdown-list.dropdown').toggleClass('open');
		}
		return false;
	}
});

Tracker.autorun(function (c) {
	if (Meteor.userId()) {
		var count = Messages.find().count();
		if (c.firstRun) {
			return
		}
		if (document.body && count) {
			var messages = document.body.getElementsByClassName('message');
			var len = messages.length;
			var lastMessage = messages[len-1];
			lastMessage.scrollIntoView();
		}
	};
})
Tracker.flush();

// The following two autoruns watch for user login/logout and
// make calls to modify active Chatters collection accordingly
Tracker.autorun(function (c) {
	if (Meteor.userId() && !Session.get("chatter")) {
		Session.set("chatter", Meteor.user()._id);
		Meteor.call("addChatter");
		c.stop();
	};
	console.log(Chatters.find().count());
})
Tracker.flush();

Tracker.autorun(function (c) {
	
	if (!Meteor.userId() && Session.get("chatter")) {
		Meteor.call("removeChatter", Session.get("chatter"));
		delete Session.keys["chatter"];
		// c.stop();
	};
	var chatterCount = Chatters.find().count();
	console.log(chatterCount);
})

Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
});

