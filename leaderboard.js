PlayersList.attachSchema(new SimpleSchema({
  name: {
    type: String,
    label: "Name",
    max: 200
  },
  score: {
    type: Number,
    label: "Score",
    min: 0
  },
  createdBy: {
    type: String,
    autoValue: function(){return this.userId},
    autoform: {omit: true}
  }
}));

if (Meteor.isServer) {
  Meteor.publish("thePlayers", function() {
    var currentId = this.userId;
    return PlayersList.find({
      createdBy: currentId
    });
  });

  Meteor.methods({
    update: function(selectedPlayer, increment) {
      PlayersList.update(selectedPlayer, {
        $inc: {
          score: increment
        }
      });
    },
    remove: function(selectedPlayer) {
      var currentId = Meteor.userId();
      PlayersList.remove({_id: selectedPlayer, createdBy: currentId});
    }
  })
}

if (Meteor.isClient) {
  Meteor.startup(function() {
  AutoForm.setDefaultTemplate("semanticUI");
});

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
      Meteor.call("update", selectedPlayer, 5);
    },
    'click .decrement': function() {
      var selectedPlayer = Session.get("selectedPlayer");
      Meteor.call("update", selectedPlayer, -5);
    },
    'click .removeplayer': function() {
      var selectedPlayer = Session.get("selectedPlayer");
      if (confirm("Confirm to delete the player.") === true) {
        Meteor.call("remove", selectedPlayer);
      }
    }
  });
}