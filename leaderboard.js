PlayersList = new Mongo.Collection('players');

if (Meteor.isClient) {
  Template.leaderboard.helpers({
    player: function() {
      return PlayersList.find({}, {
        sort: {
          score: -1,
          name: 1
        }
      });
    },
    selectedClass: function() {
      var selectedPlayer = Session.get("selectedPlayer");
      var thisRow = this._id;
      if (selectedPlayer === thisRow) {
        return "selected";
      }
    },
    selectedPlayer: function() {
      var selectedPlayer = Session.get("selectedPlayer");
      return PlayersList.findOne(selectedPlayer);
    }
  });

  Template.leaderboard.events({
    'click .player': function(event) {
      Session.set("selectedPlayer", this._id);
    },
    'click .increment': function() {
      var selectedPlayer = Session.get("selectedPlayer");
      PlayersList.update(selectedPlayer, {
        $inc: {
          score: 5
        }
      });
    },
    'click .decrement': function() {
      var selectedPlayer = Session.get("selectedPlayer");
      PlayersList.update(selectedPlayer, {
        $inc: {
          score: -5
        }
      });
    }
  })
}