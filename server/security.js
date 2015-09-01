Security.permit(['insert', 'update', 'remove']).collections([
Meteor.users
]).never().apply();