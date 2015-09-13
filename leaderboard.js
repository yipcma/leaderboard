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
    autoValue: function() {
      return this.userId;
    },
    autoform: {
      omit: true
    }
  },
  order: {
    type: Number,
    label: "Sorting",
    optional: true,
    autoform: {
      omit: true
    },
    autoValue: function() {
      if (this.isInsert) {
        var lastSortIndex = PlayersList.find({}, {
          sort: {
            order: -1
          },
          limit: 1
        });

        if (lastSortIndex.count() > 0) {
          return lastSortIndex.fetch()[0].order + 1;
        }

        return 1;
      }
      else {
        return this.value;
      }
    }
  }
}));

if (Meteor.isServer) {
  Sortable.collections = ["players"];

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
      PlayersList.remove({
        _id: selectedPlayer,
        createdBy: currentId
      });
    }
  });
}

if (Meteor.isClient) {
  Meteor.startup(function() {
    AutoForm.setDefaultTemplate("semanticUI");
  });

  Meteor.subscribe("thePlayers");

  Template.player.helpers({
    selectedClass: function() {
      var selectedPlayer = Session.get("selectedPlayer");
      var thisRow = this._id;
      if (selectedPlayer === thisRow) {
        return "selected";
      }
    }
  });

  Template.leaderboard.helpers({
    selectedPlayer: function() {
      var selectedPlayer = Session.get("selectedPlayer");
      return PlayersList.findOne(selectedPlayer);
    },
    playersList: function() {
      return PlayersList.find({}, {
        sort: {
          order: 1
        }
      });
    },
    playersListOptions: {
      group: {
        name: 'playerDefinition',
        put: true
      },
      // event handler for reordering attributes
      onSort: function(event) {
        console.log('Item %s went from #%d to #%d',
          event.data.name, event.oldIndex, event.newIndex
        );
      }
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