PlayersList = new Mongo.Collection('players');

if (Meteor.isServer) {
  Meteor.publish("thePlayers", function() {
    var currentId = this.userId;
    return PlayersList.find({
      createdBy: currentId
    });
  });
}

if (Meteor.isClient) {
  Meteor.subscribe("thePlayers");

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
      var thisRow = this._id;
      Session.set("selectedPlayer", thisRow);
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
    },
    'click .removeplayer': function() {
      var selectedPlayer = Session.get("selectedPlayer");
      if (confirm("Confirm to delete the player.") === true) {
        PlayersList.remove(selectedPlayer);
      }
    }
  });

  Template.addPlayerForm.events({
    'submit form': function(event) {
      event.preventDefault();
      var playername = event.target.playername.value;
      var initscore = Number(event.target.initscore.value);
      var currentId = Meteor.userId();
      PlayersList.insert({
        name: playername,
        score: initscore,
        createdBy: currentId
      });
      event.target.playername.value = "";
      event.target.initscore.value = "";
    }
  })
}