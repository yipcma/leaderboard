Security.permit(['insert', 'update', 'remove']).collections([
Meteor.users
]).never().apply();
PlayersList.permit(['insert', 'update', 'remove']).ifLoggedIn().apply();