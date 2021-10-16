/**
 * jspsych-bouba-kiki
 * Van Huy Pham
 *
 * plugin for playing an audio file and getting a keyboard response. Also add in some animation before and after the response.
 *
 *
 **/

 jsPsych.plugins["bouba-kiki"] = (function () {

    var plugin = {};
  
    jsPsych.pluginAPI.registerPreload('bouba-kiki', 'stimulus', 'audio');
  
    plugin.info = {
      name: 'bouba-kiki',
      description: '',
      parameters: {
        upsound: {
          type: jsPsych.plugins.parameterType.AUDIO,
          pretty_name: 'Upsound',
          default: undefined,
          description: 'The signal to be played.'
        },
        stimulus: {
          type: jsPsych.plugins.parameterType.AUDIO,
          pretty_name: 'Stimulus',
          default: undefined,
          description: 'The audio to be played.'
        },
        choices: {
          type: jsPsych.plugins.parameterType.KEY,
          pretty_name: 'Choices',
          array: true,
          default: jsPsych.ALL_KEYS,
          description: 'The keys the subject is allowed to press to respond to the stimulus.'
        },
        image: {
          type: jsPsych.plugins.parameterType.STRING,
          pretty_name: 'Image',
          default: undefined,
          array: true,
          description: 'The images to be displayed.'
        },
        prompt: {
          type: jsPsych.plugins.parameterType.STRING,
          pretty_name: 'Prompt',
          default: null,
          description: 'Any content here will be displayed below the stimulus.'
        },
        trial_duration: {
          type: jsPsych.plugins.parameterType.INT,
          pretty_name: 'Trial duration',
          default: 30000,
          description: 'The maximum duration to wait for a response.'
        },
        response_ends_trial: {
          type: jsPsych.plugins.parameterType.BOOL,
          pretty_name: 'Response ends trial',
          default: true,
          description: 'If true, the trial will end when user makes a response.'
        },
        trial_ends_after_audio: {
          type: jsPsych.plugins.parameterType.BOOL,
          pretty_name: 'Trial ends after audio',
          default: false,
          description: 'If true, then the trial will end as soon as the audio file finishes playing.'
        },
        response_allowed_while_playing: {
          type: jsPsych.plugins.parameterType.BOOL,
          pretty_name: 'Response allowed while playing',
          default: true,
          description: 'If true, then responses are allowed while the audio is playing. ' +
            'If false, then the audio must finish playing before a response is accepted.'
        }
      }
    };
  
    plugin.trial = function (display_element, trial) {
  
      // setup stimulus
      var context = jsPsych.pluginAPI.audioContext();
     // var context2 = jsPsych.pluginAPI.audioContext();
      var upsound;
      var audio;
      
  
      // store response
      var response = {
        rt: null,
        key: null
      };
  
      // record webaudio context start time
      var startTime;

        jsPsych.pluginAPI.getAudioBuffer(trial.upsound)
        .then(function (buffer) {
            if (context !== null) {
            upsound = context.createBufferSource();
            upsound.buffer = buffer;
            upsound.connect(context.destination);
            //startTime = context.currentTime;
            //upsound.start(startTime);
            //upsound.start();
          } else {
            upsound = buffer;
            upsound.currentTime = 0;
            //upsound.play();
          }
         //Play upsound
        //upsound.play();
        })
        .catch(function (err) {
          console.error(`Failed to load audio file "${trial.upsound}". Try checking the file path. We recommend using the preload plugin to load audio files.`);
          console.error(err);
        });
        
       
        // load main sound file
       jsPsych.pluginAPI.getAudioBuffer(trial.stimulus)
        .then(function (buffer) {
          if (context !== null) {
            audio = context.createBufferSource();
            audio.buffer = buffer;
            audio.connect(context.destination);
          } else {
            audio = buffer;
            audio.currentTime = 0;
          }
          setupTrial();
        }).catch(function (err) {
          console.error(`Failed to load audio file "${trial.stimulus}". Try checking the file path. We recommend using the preload plugin to load audio files.`);
          console.error(err);
        });
        
  
      function setupTrial() {
      
        // show images
        
        if (trial.image !== null) {
          //display_element.innerHTML = trial.prompt;
          display_element.innerHTML = `
    
        <div class='flex-container'>
        
        <div class= 'loom-in'> 
        <img src='`+ trial.image[0] + `' style='width:100%; height:100%'>
        </div>
        
        
        <div style='font-size:50px;width: 100px; height: 50px;'>+</div>
        
        <div class= 'loom-in'>
        <img src='`+ trial.image[1] + `' style='width:100%; height:100%'>
        </div>
        
        </div>
        
        `;
        }
  
          if (context !== null) {
              //startTime = context.currentTime;
              upsound.start();
            } else {
              upsound.play();
            }

        

        // set up end event if trial needs it
        if (trial.trial_ends_after_audio) {
          audio.addEventListener('ended', end_trial);
        }

        // end trial if time limit is set
        if (trial.trial_duration !== null) {
          jsPsych.pluginAPI.setTimeout(function () {
            end_trial();
          }, trial.trial_duration);
        }

        // wait 2s and start the stimulus audio
        jsPsych.pluginAPI.setTimeout(function () {
          if (context !== null) {
            startTime = context.currentTime;
            audio.start(startTime);
          } else {
            audio.play();
          }

          // start keyboard listener when trial starts or sound ends
          if (trial.response_allowed_while_playing) {
            setup_keyboard_listener();
          } else if (!trial.trial_ends_after_audio) {
            audio.addEventListener('ended', setup_keyboard_listener);
          }

        },2000);
        
      }
  
  
      // function to end trial when it is time
      function end_trial() {
  
        // kill any remaining setTimeout handlers
        jsPsych.pluginAPI.clearAllTimeouts();
  
        // stop the audio file if it is playing
        // remove end event listeners if they exist
        if (context !== null) {
          audio.stop();
        } else {
          audio.pause();
        }
  
        audio.removeEventListener('ended', end_trial);
        audio.removeEventListener('ended', setup_keyboard_listener);
  
  
        // kill keyboard listeners
        jsPsych.pluginAPI.cancelAllKeyboardResponses();
  
        // gather the data to store for the trial
        if (context !== null && response.rt !== null) {
          response.rt = Math.round(response.rt * 1000);
        }
        var trial_data = {
          rt: response.rt,
          stimulus: trial.stimulus,
          response: response.key
        };
        
  
        // clear the display
        if (response.key =='z'){
          display_element.innerHTML = `
            <div class='flex-container'>
            
            <div class= 'spin-loom-out'> 
            <img src='`+ trial.image[0] + `' style='width:100%; height:100%'>
            </div>
            
            
            <div style='font-size:50px;width: 100px; height: 50px;'>+</div>
            
            <div class='static-image-loom-out'>
            <img src='`+ trial.image[1] + `' style='width:100%; height:100%'>
            </div>
            
            </div>
          `;  
        } else if ( response.key =='m'){
          display_element.innerHTML = `

          <div class='flex-container'>
          
          <div class='static-image-loom-out'> 
          <img src='`+ trial.image[0] + `' style='width:100%; height:100%'>
          </div>
          
          
          <div style='font-size:50px;width: 100px; height: 50px;'>+</div>
          
          <div class= 'spin-loom-out'>
          <img src='`+ trial.image[1] + `' style='width:100%; height:100%'>
          </div>      
          </div>
        
        `;
        }
        
        else{
          display_element.innerHTML = `
   
            <div class='flex-container'>
              <div class='loom-out'> 
                <img src='`+ trial.image[0] + `' style='width:100%; height:100%'>
              </div>  
              
              
              <div style='font-size:50px;width: 100px; height: 50px;'>+</div>
              
              <div class= 'loom-out'>
                <img src='`+ trial.image[1] + `' style='width:100%; height:100%'>
              </div>  
            </div>
   
        `;
        }


        // delay 3s before moving on to the next trial. Meanwhile, the animation runs.
        jsPsych.pluginAPI.setTimeout(function () {
          jsPsych.finishTrial(trial_data);
        },2500);

        
      }
  
      // function to handle responses by the subject
      function after_response(info) {
  
        // only record the first response
        if (response.key == null) {
          response = info;
        }
  
        if (trial.response_ends_trial) {
          end_trial();
        }
      };
  
      function setup_keyboard_listener() {
        // start the response listener
        if (context !== null) {
          jsPsych.pluginAPI.getKeyboardResponse({
            callback_function: after_response,
            valid_responses: trial.choices,
            rt_method: 'audio',
            persist: false,
            allow_held_key: false,
            audio_context: context,
            audio_context_start_time: startTime
          });
        } else {
          jsPsych.pluginAPI.getKeyboardResponse({
            callback_function: after_response,
            valid_responses: trial.choices,
            rt_method: 'performance',
            persist: false,
            allow_held_key: false
          });
        }
      }
    };
  
    return plugin;
  })();
  
