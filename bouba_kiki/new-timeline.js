
function new_timeline() {
  var timeline = [];

  var PracArray = [];
  var imageArr = ["PracImgs/1.png","PracImgs/2.png","PracImgs/3.png","PracImgs/4.png","PracImgs/5.png","PracImgs/6.png","PracImgs/7.png","PracImgs/8.png"];
  var soundArr = ["PracSounds/1.wav","PracSounds/2.wav","PracSounds/3.wav","PracSounds/4.wav","PracSounds/5.wav","PracSounds/6.wav","PracSounds/7.wav","PracSounds/8.wav"];
  
  var NumArr = [0,1,2,3,4,5,6,7];
  
  var leftButton = "z";
  var rightButton = "m";
  
  for (let i = 0; i < 4; i++){
      var EightNums = jsPsych.randomization.sampleWithoutReplacement(NumArr, 8);
      for (let j = 0; j < 4; j++){
          num1 = EightNums[j*2]
          num2 = EightNums[j*2+1]
  
          //If it is less than 3 long just add randomly
        if (PracArray.length < 3){
          if (Math.random() > 0.5){
            PracArray.push({ stimulus: soundArr[num1], imageLeft:imageArr[num1], imageRight:imageArr[num2], correct_response:leftButton})
          }
          else{
            PracArray.push({ stimulus: soundArr[num1], imageLeft:imageArr[num2], imageRight:imageArr[num1], correct_response:rightButton})
          }
        }
        //If there are 3 or more entries already make sure the last 3 are not the same.
        else{

          //Get an array of the last 3 values
          lastThree = PracArray.slice(-3);
          lastThreeCorrect = [];
          for (var k=0;k<3;k++){
            lastThreeCorrect.push(lastThree[k].correct_response)
          }

          //Now check if they are all the same
          all_equal = lastThreeCorrect.every( v => v === lastThreeCorrect[0] )

          //If they are all the same and right make the next one left 
          if(all_equal && lastThreeCorrect[0] == rightButton){
            PracArray.push({ stimulus: soundArr[num1], imageLeft:imageArr[num1], imageRight:imageArr[num2], correct_response:leftButton})
          }
          //If they are all the same and left make the next one right 
          else if(all_equal && lastThreeCorrect[0] == leftButton){
            PracArray.push({ stimulus: soundArr[num1], imageLeft:imageArr[num2], imageRight:imageArr[num1], correct_response:rightButton})
          }
          //Otherwise select randomly
          else{
            if (Math.random() > 0.5){
              PracArray.push({ stimulus: soundArr[num1], imageLeft:imageArr[num1], imageRight:imageArr[num2], correct_response:leftButton})
            }
            else{
              PracArray.push({ stimulus: soundArr[num1], imageLeft:imageArr[num2], imageRight:imageArr[num1], correct_response:rightButton})
            }
          }
        }
      }
  }
  console.log(PracArray)
  
  // manually preload these files, since not on standard jspsych preload
  var audio = ['sound/up2.wav'];
    
  var preload = {
      type: 'preload',
      auto_preload: true,  // automatic preload of stimulus files
      audio: audio,  // manual preload of other files
      images: ["PracImgs/1.png","PracImgs/2.png","PracImgs/3.png","PracImgs/4.png","PracImgs/5.png","PracImgs/6.png","PracImgs/7.png","PracImgs/8.png"]
    };
  
  /* create timeline */
  
  var hello = {
  type: "html-button-response",
  stimulus: '<div style="max-width:600px;"><p>Please make sure you are sitting so that your eyes are about 16 inches away from your computer screen.</p>',
  choices: ['Continue'],
};
timeline.push(hello);

  var hello2 = {
  type: "html-button-response",
  stimulus: '<div style="max-width:600px;"><p>Using headphones are reccomended for this experiment. Put the volume at a comfortable volume, about 40-50%.</p>',
  choices: ['Continue'],
};
timeline.push(hello2);

  var hello3 = {
  type: "html-button-response",
  stimulus: '<div style="max-width:600px;"><p>You will hear TWO sounds. The first is to alert you that the trial is beginning. The second is the TARGET sound. PAY ATTENTION TO THE SECOND SOUND IN EACH TRIAL.</p>',
  choices: ['Continue'],
};
timeline.push(hello3);

  var hello4 = {
  type: "html-button-response",
  stimulus: '<div style="max-width:600px;"><p>You will see 2 images on the screen. When you hear the TARGET SOUND, pick which image best matches the sound. <p> First let’s practice with animal shapes and sounds. Pick the key on the same side as the matching animal. </p>Which animal made the sound? <p>Use the Z button to pick the left animal and the M button to pick the right animal.</p>',
  choices: ['Continue'],
};
timeline.push(hello4);

  var hello5 = {
  type: "html-button-response",
  stimulus: '<div style="max-width:600px;"><p>Ready to begin? Press Continue to begin the practice trials.</p>',
  choices: ['Continue'],
};
timeline.push(hello5);
  
//  var position_setup = {
//    type: "html-keyboard-response",
//    stimulus: "Please make sure you are sitting so that your eyes are about 16 inches away from your computer //screen. Press any key to continue."
//  };
  

  
  var stimulus = [{
      stimulus: 'PracSounds/1.wav',imageLeft:'PracImgs/1.png',imageRight:"PracImgs/2.png"
  }]
  
  var w = window.innerWidth;
    var h = window.innerHeight;
  
  var Practrial = {
      type: 'bouba-kiki',
      upsound: 'sound/up2.wav',
  
      stimulus: jsPsych.timelineVariable('stimulus'),
      image:[jsPsych.timelineVariable('imageLeft'),jsPsych.timelineVariable('imageRight')],
      data: {
        width: w,
        height: h,
        left_image: [jsPsych.timelineVariable('imageLeft')],
        right_image: [jsPsych.timelineVariable('imageRight')],
        correct_response: jsPsych.timelineVariable('correct_response'),
      },
      on_finish: function(data){
          data.correct = jsPsych.pluginAPI.compareKeys(data.response, data.correct_response)
          console.log(data.correct_response);
      }
    };
  //after running the first 4 trials, run this conditional trial that checks if they've gotten 4 in a row correct yet
    var Pracif_trial = {
      timeline: [Practrial],
      conditional_function: function(){
          // get the data from the previous trial,
          // and check which key was pressed
          var count = jsPsych.data.get().last(4).filter({correct: true}).count();
          console.log(count);
          if(count >= 4){
              return false;
          } else {
              return true;
          }
      }
  }
  
  
    var Prac_test_procedure = {
      timeline: [Practrial],
      timeline_variables: PracArray.slice(0,4)
      //timeline_variables: PracArray.slice(0,4),
    };
  
    var Prac_if_test_procedure = {
      timeline: [Pracif_trial],
      timeline_variables: PracArray.slice(4),
    };
  
    var screen_size = {
      type: 'html-button-response',
      stimulus: '<p style="color: red; font-size: 20px"> Width: ' + w +' Height: ' + h  +'</p>',
      choices: ['Continue'],
    };
  

  
    timeline.push(preload);
    //timeline.push(position_setup);
   
    
    timeline.push(Prac_test_procedure);
    timeline.push(Prac_if_test_procedure);


//begin experiment trials

  var instruction = {
    type: 'html-button-response',
    stimulus: '<div style="max-width:600px;"><p>Instruction:</p> <p>Great job, you have finished the practice trials! Now for the experiment. <p> You will now see 2 abstract objects and hear an abstract sound. You need to pick the object that best matches the sound.Press the key on the same side as the matching shape. </p> <p>Press Z for shapes on the left and M for shapes on the right. </p> <p>If you take too long, the trial will end and you will start the next trial. Press "esc" to leave the study at any time. </p></div>',
    choices: ['Continue'],
   on_start: function() {
        // set progress bar to 0 at the start of experiment
       jsPsych.setProgressBar(0);
   }
  };
  
  
  var stimuli_arrays = 
  [
  
    [
      { stimulus: 'sound/baba_rep.wav',imageLeft:'img/bouba_7_L_white.png',imageRight:"img/kiki_7_L_white.png"},
      { stimulus: 'sound/teetee.wav',imageRight:'img/bouba_3_L_white.png',imageLeft:"img/kiki_3_L_white.png"},
      { stimulus: 'sound/teetee.wav',imageLeft:'img/bouba_7_S_white.png',imageRight:"img/kiki_7_S_white.png"},
      { stimulus: 'sound/gaga_rep.wav',imageRight:'img/bouba_7_L_white.png',imageLeft:"img/kiki_7_L_white.png"},
  
      { stimulus: 'sound/gaga_rep.wav',imageLeft:'img/bouba_3_S_white.png',imageRight:"img/kiki_3_S_white.png"},
      { stimulus: 'sound/keekee.wav',imageLeft:'img/bouba_3_L_white.png',imageRight:"img/kiki_3_L_white.png"},
      { stimulus: 'sound/baba_rep.wav',imageRight:'img/bouba_3_L_white.png',imageLeft:"img/kiki_3_L_white.png"},
      { stimulus: 'sound/keekee.wav',imageRight:'img/bouba_3_S_white.png',imageLeft:"img/kiki_3_S_white.png"},
  
      { stimulus: 'sound/gaga_rep.wav',imageLeft:'img/bouba_3_L_white.png',imageRight:"img/kiki_3_L_white.png"},
      { stimulus: 'sound/teetee.wav',imageLeft:'img/bouba_3_S_white.png',imageRight:"img/kiki_3_S_white.png"},
      { stimulus: 'sound/baba_rep.wav',imageLeft:'img/bouba_3_S_white.png',imageRight:"img/kiki_3_S_white.png"},
      { stimulus: 'sound/keekee.wav',imageRight:'img/bouba_7_S_white.png',imageLeft:"img/kiki_7_S_white.png"},
  
      { stimulus: 'sound/teetee.wav',imageRight:'img/bouba_7_L_white.png',imageLeft:"img/kiki_7_L_white.png"},
      { stimulus: 'sound/keekee.wav',imageLeft:'img/bouba_7_L_white.png',imageRight:"img/kiki_7_L_white.png"},
      { stimulus: 'sound/gaga_rep.wav',imageRight:'img/bouba_7_S_white.png',imageLeft:"img/kiki_7_S_white.png"},
      { stimulus: 'sound/baba_rep.wav',imageRight:'img/bouba_7_S_white.png',imageLeft:"img/kiki_7_S_white.png"},
  
  
      { stimulus: 'sound/baba_rep.wav',imageRight:'img/bouba_7_L_white.png',imageLeft:"img/kiki_7_L_white.png"},
      { stimulus: 'sound/teetee.wav',imageLeft:'img/bouba_3_L_white.png',imageRight:"img/kiki_3_L_white.png"},
      { stimulus: 'sound/teetee.wav',imageRight:'img/bouba_7_S_white.png',imageLeft:"img/kiki_7_S_white.png"},
      { stimulus: 'sound/gaga_rep.wav',imageLeft:'img/bouba_7_L_white.png',imageRight:"img/kiki_7_L_white.png"},
  
      { stimulus: 'sound/gaga_rep.wav',imageRight:'img/bouba_3_S_white.png',imageLeft:"img/kiki_3_S_white.png"},
      { stimulus: 'sound/keekee.wav',imageRight:'img/bouba_3_L_white.png',imageLeft:"img/kiki_3_L_white.png"},
      { stimulus: 'sound/baba_rep.wav',imageLeft:'img/bouba_3_L_white.png',imageRight:"img/kiki_3_L_white.png"},
      { stimulus: 'sound/keekee.wav',imageLeft:'img/bouba_3_S_white.png',imageRight:"img/kiki_3_S_white.png"},
  
      { stimulus: 'sound/gaga_rep.wav',imageRight:'img/bouba_3_L_white.png',imageLeft:"img/kiki_3_L_white.png"},
      { stimulus: 'sound/teetee.wav',imageRight:'img/bouba_3_S_white.png',imageLeft:"img/kiki_3_S_white.png"},
      { stimulus: 'sound/baba_rep.wav',imageRight:'img/bouba_3_S_white.png',imageLeft:"img/kiki_3_S_white.png"},
      { stimulus: 'sound/keekee.wav',imageLeft:'img/bouba_7_S_white.png',imageRight:"img/kiki_7_S_white.png"},
  
      { stimulus: 'sound/teetee.wav',imageLeft:'img/bouba_7_L_white.png',imageRight:"img/kiki_7_L_white.png"},
      { stimulus: 'sound/keekee.wav',imageRight:'img/bouba_7_L_white.png',imageLeft:"img/kiki_7_L_white.png"},
      { stimulus: 'sound/gaga_rep.wav',imageLeft:'img/bouba_7_S_white.png',imageRight:"img/kiki_7_S_white.png"},
      { stimulus: 'sound/baba_rep.wav',imageLeft:'img/bouba_7_S_white.png',imageRight:"img/kiki_7_S_white.png"},
    ],
    
    
    [
      { stimulus: 'sound/baba_rep.wav',imageLeft:'img/bouba_3_S_white.png',imageRight:"img/kiki_3_S_white.png"},
      { stimulus: 'sound/teetee.wav',imageRight:'img/bouba_7_L_white.png',imageLeft:"img/kiki_7_L_white.png"},
      { stimulus: 'sound/gaga_rep.wav',imageRight:'img/bouba_3_S_white.png',imageLeft:"img/kiki_3_S_white.png"},
      { stimulus: 'sound/teetee.wav',imageLeft:'img/bouba_7_S_white.png',imageRight:"img/kiki_7_S_white.png"},
  
      { stimulus: 'sound/keekee.wav',imageLeft:'img/bouba_7_L_white.png',imageRight:"img/kiki_7_L_white.png"},
      { stimulus: 'sound/gaga_rep.wav',imageRight:'img/bouba_3_L_white.png',imageLeft:"img/kiki_3_L_white.png"},
      { stimulus: 'sound/gaga_rep.wav',imageLeft:'img/bouba_7_S_white.png',imageRight:"img/kiki_7_S_white.png"},
      { stimulus: 'sound/keekee.wav',imageRight:'img/bouba_3_S_white.png',imageLeft:"img/kiki_3_S_white.png"},
  
      { stimulus: 'sound/gaga_rep.wav',imageLeft:'img/bouba_7_L_white.png',imageRight:"img/kiki_7_L_white.png"},
      { stimulus: 'sound/baba_rep.wav',imageRight:'img/bouba_3_L_white.png',imageLeft:"img/kiki_3_L_white.png"},
      { stimulus: 'sound/keekee.wav',imageRight:'img/bouba_7_S_white.png',imageLeft:"img/kiki_7_S_white.png"},
      { stimulus: 'sound/baba_rep.wav',imageRight:'img/bouba_7_S_white.png',imageLeft:"img/kiki_7_S_white.png"},
  
      { stimulus: 'sound/teetee.wav',imageLeft:'img/bouba_3_L_white.png',imageRight:"img/kiki_3_L_white.png"},
      { stimulus: 'sound/teetee.wav',imageRight:'img/bouba_3_S_white.png',imageLeft:"img/kiki_3_S_white.png"},
      { stimulus: 'sound/keekee.wav',imageLeft:'img/bouba_3_L_white.png',imageRight:"img/kiki_3_L_white.png"},
      { stimulus: 'sound/baba_rep.wav',imageLeft:'img/bouba_7_L_white.png',imageRight:"img/kiki_7_L_white.png"},
  
  
  
      { stimulus: 'sound/baba_rep.wav',imageRight:'img/bouba_3_S_white.png',imageLeft:"img/kiki_3_S_white.png"},
      { stimulus: 'sound/teetee.wav',imageLeft:'img/bouba_7_L_white.png',imageRight:"img/kiki_7_L_white.png"},
      { stimulus: 'sound/gaga_rep.wav',imageLeft:'img/bouba_3_S_white.png',imageRight:"img/kiki_3_S_white.png"},
      { stimulus: 'sound/teetee.wav',imageRight:'img/bouba_7_S_white.png',imageLeft:"img/kiki_7_S_white.png"},
  
      { stimulus: 'sound/keekee.wav',imageRight:'img/bouba_7_L_white.png',imageLeft:"img/kiki_7_L_white.png"},
      { stimulus: 'sound/gaga_rep.wav',imageLeft:'img/bouba_3_L_white.png',imageRight:"img/kiki_3_L_white.png"},
      { stimulus: 'sound/gaga_rep.wav',imageRight:'img/bouba_7_S_white.png',imageLeft:"img/kiki_7_S_white.png"},
      { stimulus: 'sound/keekee.wav',imageLeft:'img/bouba_3_S_white.png',imageRight:"img/kiki_3_S_white.png"},
  
      { stimulus: 'sound/gaga_rep.wav',imageRight:'img/bouba_7_L_white.png',imageLeft:"img/kiki_7_L_white.png"},
      { stimulus: 'sound/baba_rep.wav',imageLeft:'img/bouba_3_L_white.png',imageRight:"img/kiki_3_L_white.png"},
      { stimulus: 'sound/keekee.wav',imageLeft:'img/bouba_7_S_white.png',imageRight:"img/kiki_7_S_white.png"},
      { stimulus: 'sound/baba_rep.wav',imageLeft:'img/bouba_7_S_white.png',imageRight:"img/kiki_7_S_white.png"},
  
      { stimulus: 'sound/teetee.wav',imageRight:'img/bouba_3_L_white.png',imageLeft:"img/kiki_3_L_white.png"},
      { stimulus: 'sound/teetee.wav',imageLeft:'img/bouba_3_S_white.png',imageRight:"img/kiki_3_S_white.png"},
      { stimulus: 'sound/keekee.wav',imageRight:'img/bouba_3_L_white.png',imageLeft:"img/kiki_3_L_white.png"},
      { stimulus: 'sound/baba_rep.wav',imageRight:'img/bouba_7_L_white.png',imageLeft:"img/kiki_7_L_white.png"},
    ]
    
  ];
  
  
  // Pick a random array inside the stimuli_arrays
  
  var selected_array = stimuli_arrays[Math.floor(Math.random() * stimuli_arrays.length)];
  

  var n_trials = 32;

  var trial = {
    type: 'bouba-kiki',
    upsound: 'sound/up2.wav',

    stimulus: jsPsych.timelineVariable('stimulus'),
    image:[jsPsych.timelineVariable('imageLeft'),jsPsych.timelineVariable('imageRight')],
    data: {
      width: w,
      height: h,
      left_image: [jsPsych.timelineVariable('imageLeft')],
      right_image: [jsPsych.timelineVariable('imageRight')],
      
    },
    on_finish: function(data) {
        // at the end of each trial, update the progress bar
        // based on the current value and the proportion to update for each trial
        if (data.response != null && data.response !== undefined) {
          //only update on accepted left/right responses
          if (jsPsych.pluginAPI.compareKeys(data.response,leftButton) || jsPsych.pluginAPI.compareKeys(data.response, rightButton)) {
              var curr_progress_bar_value = jsPsych.getProgressBarCompleted();
              jsPsych.setProgressBar(curr_progress_bar_value + (1/n_trials));
          }
          // End experiment if escape pressed and save the progress 
          if(jsPsych.pluginAPI.compareKeys(data.response,"Escape")){
            jsPsych.endExperiment('The experiment was ended by pressing "escape".');
          }
        }
    }
  };

  var loop_time = 1;

  var test_procedure = {
    timeline: [trial],
    timeline_variables: selected_array,
    loop_function: function (data) {
      var response_array = data.values();
      
      
      // Loop backward from the end. If the response is a valid one, 
      //splice out of the looped selected_array
     
      for (let i = response_array.length - 1; i >= 0; i--) {
        if ((response_array[i].response == leftButton) || (response_array[i].response == rightButton)) {
          selected_array.splice(i, 1);
        }
      }
      

      // If the selected_array contains non_empty, execute the loop to resume wrong-key trial(s)
      if (loop_time == 1) {
        for (let i = 0; i < selected_array.length; i++) {
          if (selected_array[i]) {
            loop_time++;
            return true;
          }
        }
      } 
      return false;
    }
  };

  timeline.push(instruction,test_procedure);


  return timeline;
}



 function myFunction() {
  var w = window.innerWidth;
  var h = window.innerHeight;
  alert(w + ' ' + h);
}




