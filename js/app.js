/*globals L, Papa, cartodb: true */

$(function() {
  var holder = document.getElementById('holder');
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

  //   Papa.parse("./dataclip.csv", {
  // document.querySelector("#file").onchange = function() {
  function load(files) {
    $('#results').empty();
    $('.loading').show();

    var file = files[0]; // document.getElementById('file').files[0];

    Papa.parse(file, {
      download: true,
      header: true,
      skipEmptyLines: true,
      // dynamicTyping: true,
      step: function(row) {
        if(row.errors.length > 0) {
          console.log("error", row);
        } else {
          process(row.data[0]);
        }
      },
      complete: function() {
        $('.loading').hide();
        console.log("2!", data);
        _.each(data, function(stats, key) {
          var h = colTemplate({
            name: key,
            stats: stats
          });
          $('#results').append(h);
        });
      }
    });
  }

  holder.ondragover = function () { this.className = 'hover'; return false; };
  holder.ondragend = function () { this.className = ''; return false; };
  holder.ondrop = function (e) {
    this.className = '';
    e.preventDefault();
    load(e.dataTransfer.files);
  };

});
