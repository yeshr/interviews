// If reading it from a file system.
// var fs = require('fs');

// If retrieving over wire.
var https = require('https');

// NOTE: We could use a util lib like lodash or some other lib.
// Keeping the code non dependent on utils for now.
// Agument the Array.prototype
Array.prototype.concatAll = function() {
  var results = [];
  this.forEach(function(subArray) {
    subArray.forEach(function(item) {
      results.push(item);
    });
  });
  return results;
};

// NOTE: An alternate solution where we know the exact structure to query.
// Query creativeFamilyJSON.sizes and flatten all widgets if the path is known.
// var flattenWidgets = (shapes) => {
//   var widgets = [];
//   for (var shape in shapes) {
//     widgets.push(shapes[shape].background.widgets);
//     // Returns a list of widget lists
//     widgets.push(
//       shapes[shape].frames.
//         map(frame => frame.widgets).
//         concatAll()
//     );
//   }
//   return widgets.concatAll();
// };

// NOTE: Below functions are pure functions which helps us write predictable
// code and better testable code.

// NOTE: Following assumtions are be made from the give sample.
// 1. Widgets can we anywhere in the tree.
// 2. A widget may compose of other widgets.
// 3. Widget can be a single or list of widgets.
// 4. Widget can be an empty widget.
// 5. Preserve the widget structure.
// If the tree structure is unknown. Deep traverse the tree to find all the widgets.
var flattenWidgets = (collection, result) => {
  var prop;
  result = result || [];

  for(prop in collection) {
    if (prop === 'widgets') {
      // Preserving all the widgets even the empty ones.
      result[result.length] = Object.prototype.toString.call(collection[prop]) === '[object Array]' ? collection[prop] : [collection[prop]];
      result[result.length - 1].forEach(widget => {
        flattenWidgets(widget, result);
      });
    }
    else if (Object.prototype.toString.call(collection[prop]) === '[object Object]') {
      flattenWidgets(collection[prop], result);
    }
    else if (Object.prototype.toString.call(collection[prop]) === '[object Array]' && prop !== 'assets') {
      collection[prop].forEach(value => {
        flattenWidgets(value, result);
      });
    }
  }
  return result.concatAll();
};

// Query widgets list and map over corresponding asset.
var normalizeWidgets = function (widgets, assets) {
  return widgets.map(widget => {
    return Object.assign(
      {},
      assets.
        reduce((prevAsset, curAsset) => {
          return prevAsset.uuid !== widget['asset-uuid'] ?
            (curAsset.uuid === widget['asset-uuid'] ? curAsset : {}) : prevAsset;
        }),
      widget
    )
  });
};

// NOTE: Below we are reading entire json file into memory. This could lead to
// memory issue if the file is huge. We could potentially stream the input and
// perform transforms in chunks. I am not very familiary with streaming of JSON.
https.get(process.argv[2], (res) => {
  var tempStr = '';

  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    tempStr += chunk;
  });

  res.on('end', () => {
    var data = JSON.parse(tempStr.trim());
    process.stdout.write(
      JSON.stringify(
        normalizeWidgets(
          flattenWidgets(data.sizes),
          data.assets
        ), null, 4
      ), 'utf8'
    );
  });
})
.on('error', (err) => {
  process.stdout.write('Request failed to retrieve input JSON\n');
});
