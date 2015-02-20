/*globals L, Papa, cartodb: true */

$(function() {
  var colTemplate = _.template($('#col-template').html());

  var data = {};

  function digest(value, key) {
    if (!_.has(data, key)) {
      data[key] = {
        values: [],
        valueCount: {},
        types: {},
        nullCount: 0
      };
      data[key].types[typeof value] = 0;
    }

    if(!_.has(data[key].valueCount, value)) {
      data[key].valueCount[value] = 0;
    }

    data[key].values.push(value);
    data[key].valueCount[value] += 1;
    data[key].types[typeof value] += 1;
    if (value == null || value === '') {
      data[key].nullCount += 1;
    }
  }

  function process(row) {
    _.each(row, digest);
  }

  Papa.parse("./data.csv", {
    download: true,
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true,
    step: function(row) {
      if(row.errors.length > 0) {
        console.log("error", row);
      } else {
        process(row.data[0]);
      }
    },
    complete: function() {
      console.log("All done!", data);
      _.each(data, function(stats, key) {
        var h = colTemplate({
          name: key,
          stats: stats
        });
        $('#container').append(h);
      });
    }
  });


});
