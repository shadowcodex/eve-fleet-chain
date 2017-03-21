/* global btoa, atob, $, firebase, performance */

var database = firebase.database();

function generateUUID () { // Public Domain/MIT
    var d = new Date().getTime();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
        d += performance.now(); //use high-precision timer if available
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

var parse = function(text, trigger, effect, target){
   console.log(trigger);
   console.log(effect);
   console.log(target);
   var rows = "";
   var triggers = [];
   var targets = [];

   var textA = text.split('\n');
   console.log(textA);
   
   $.each(textA, function(i,v){
       var parts = v.split('>');
       if(i != textA.length - 1){
            if(trigger.toUpperCase() == parts[1].replace(' ', '').toUpperCase()){
               triggers.push(parts[0]);
            }
            if(target.toUpperCase() == parts[1].replace(' ', '').toUpperCase()){
               targets.push(parts[0]);
            }
       }
   });
   
   // shift target array
   targets.push(targets[0]);
   targets = targets.slice(1,targets.length);
   
   if(targets.length > triggers.length){
      $.each(targets, function(i, v){
         var modIndex = i + triggers.length;
         var index = modIndex % triggers.length;
         //console.log(index);
         rows += `<tr><td>` + triggers[index] + `</td><td>` + effect + `</td><td>` + targets[i] + `</td></tr>` + "\n";
      });   
   } else {
      $.each(triggers, function(i, v){
         var modIndex = i + targets.length;
         var index = modIndex % targets.length;
         //console.log(index);
         rows += `<tr><td>` + triggers[i] + `</td><td>` + effect + `</td><td>` + targets[index] + `</td></tr>` + "\n";
      });
   }
   
   return rows;
}

$('#parse').click(function(){
   
   var text = $('#chat').val();
   
   if($('#enable1').is(":checked")){
      $('#results1 tbody').remove();
      $('#results1').append('<tbody></tbody>');
      $('#results1 tbody').append(parse(text,$('#trigger1').val(),$('#effect1').val(),$('#target1').val()));
      $('#effect1title').text($('#effect1').val());
   }
   
   if($('#enable2').is(":checked")){
      $('#results2 tbody').remove();
      $('#results2').append('<tbody></tbody>');
      $('#results2 tbody').append(parse(text,$('#trigger2').val(),$('#effect2').val(),$('#target2').val()));
      $('#effect2title').text($('#effect2').val());
   }
   
   if($('#enable3').is(":checked")){
      $('#results3 tbody').remove();
      $('#results3').append('<tbody></tbody>');
      $('#results3 tbody').append(parse(text,$('#trigger3').val(),$('#effect3').val(),$('#target3').val()));
      $('#effect3title').text($('#effect3').val());
   }
   
   if($('#enable4').is(":checked")){
      $('#results4 tbody').remove();
      $('#results4').append('<tbody></tbody>');
      $('#results4 tbody').append(parse(text,$('#trigger4').val(),$('#effect4').val(),$('#target4').val()));
      $('#effect14title').text($('#effect4').val());
   }
   
   var encoded = btoa($('#resultsAll').html());
   var id = generateUUID();
   
   var url = `https://shadowcodex.github.io/eve-fleet-chain/index.html?id=` + id;
   
   firebase.database().ref('links/' + id).set({
      data: encoded,
      url: url
   });
   
   $('#Link a').remove();
   $('#Link').append(`<a href="./index.html?id=` + id + `">` + url + `</a>`);
});


var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

var updateResults = function(results){
   $('#resultsAll').remove();
   $('#resultsOuter').append('<div id="resultsAll">' + results + '</div>');
}

var updateURL = function(results){
   $('#Link a').remove();
   $('#Link').append(`<a href="` + results + `">` + results + `</a>`);
}

var data = getUrlParameter('id');

if(data != null){
   
   var newText = firebase.database().ref('links/' + data + '/data');
   newText.on('value', function(snapshot){
      updateResults(atob(snapshot.val()));
   });
   
   var newLink = firebase.database().ref('links/' + data + '/url');
   newLink.on('value', function(snapshot){
      updateURL(snapshot.val());
   });
}

