PlayersList = new Mongo.Collection('players');

if (Meteor.isClient) {
  Template.leaderboard.helpers({
    player: function() {
      return PlayersList.find();
    },
    selectedClass: function() {
      var selectedPlayer = Session.get("selectedPlayer");
      var thisRow = this._id;
      if (selectedPlayer === thisRow) {
        return "selected"
      }
    }
  });

  Template.leaderboard.events({
    'click .player': function(event) {
      Session.set("selectedPlayer", this._id);
    }
  })
}