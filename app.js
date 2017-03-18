var triggers = [];
var targets = [];
var effect = '';

$('#parse').click(function(){
   triggers = [];
   targets = [];
   var text = $('#chat').val();
   var trigger = $('#trigger').val();
   effect = $('#effect').val();
   var target = $('#target').val();
   console.log(trigger);
   console.log(text);
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
   $('#results li').remove();
   $.each(targets, function(i, v){
      modIndex = i + triggers.length;
      var index = modIndex % triggers.length;
      console.log(index);
      $('#results').append('<li>' + triggers[index] + ' ' + effect + ' ' + targets[i] + '</li>');
   });
   
   var encoded = btoa($('#results').html());
   $('#link a').remove();
   $('#link').append('<a href="./awman.html?data=' + encoded + '">copy this link url</a>')
   
});