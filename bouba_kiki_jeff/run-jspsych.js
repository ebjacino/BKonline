function run_jspsych() {
  jsPsych.init({
    timeline: new_timeline(),
    show_progress_bar:true,
    auto_update_progress_bar: false,
    
    display_element: 'js_psych',
    on_finish: function() {
      var csv_data = jsPsych.data.get().csv(); 
      Shiny.onInputChange("jspsych_results", csv_data);
      next_page();

      
    },
    
    on_close: function() {
          var csv_data = jsPsych.data.get().csv(); 
          Shiny.onInputChange("jspsych_results", csv_data);
          
          Shiny.onInputChange("next_page", performance.now());
          
          //next_page();
    }
  });
}


run_jspsych();