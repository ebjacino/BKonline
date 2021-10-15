library(tidyverse)
library(shiny)
library(htmltools)
library(psychTestR)



jspsych_dir <- "jspsych-6.3.0"
css_dir <- "css"

head <- tags$head(
  includeScript(file.path(jspsych_dir, "jspsych.js")),
  includeScript(file.path(jspsych_dir, "plugins/bouba-kiki.js")),
  includeScript(file.path(jspsych_dir, "plugins/jspsych-html-keyboard-response.js")),
  includeScript(file.path(jspsych_dir, "plugins/jspsych-survey-html-form.js")),
  includeScript(file.path(jspsych_dir, "plugins/jspsych-html-button-response.js")),
  includeScript(file.path(jspsych_dir, "plugins/jspsych-image-keyboard-response.js")),
  includeScript(file.path(jspsych_dir, "plugins/jspsych-audio-keyboard-response.js")),
  includeScript(file.path(jspsych_dir, "plugins/jspsych-audio-button-response.js")),
  includeScript(file.path(jspsych_dir, "plugins/jspsych-preload.js")),
  tags$link(rel = "stylesheet", type = "text/css", href = "css/style.css"),
  tags$link(rel = "stylesheet", type = "text/css", href = "css/jspsych.css")
)

ui <- tags$div(
  head, 
  includeScript("new-timeline.js"),
  includeScript("run-jspsych.js"),
  tags$div(id = "js_psych")
)

main_pages <- page(
  ui = ui,
  label = "Main page",
  get_answer = function(input, ...) input$jspsych_results,
  validate = function(answer, ...) nchar(answer) > 0L,
  save_answer = TRUE
)

elts <- join(
  
  reactive_page(function(state, ...) {
    p_id <- psychTestR::get_url_params(state)$p_id
    if (is.null(p_id)){
      get_p_id(
        prompt = "Please enter your participant ID.",
        placeholder = "e.g. 10492817",
        button_text = "Continue",
        width = "300px",
        validate = function(answer, ...) {
          if (answer == "")
            "Participant ID cannot be blank."
          else if (!(str_detect(answer,"^[a-zA-Z]{2}[0-9]{3}$")))
            "The ID must be 2 letters followed by 3 numbers."
          else TRUE
        }
      )
    }
    else {
      one_button_page(
        div(p("Hello, welcome participant ID:", p_id))
      )
    }
  }
  ),
  
  main_pages,
  
  elt_save_results_to_disk(complete = TRUE),
  
  final_page("Thank you for participating. Please close this window. Goodbye!")
  
)


# Run test 
test <- make_test(
  elts = elts,
  opt = test_options(
    title = "Welcome",
    admin_password = "kiki_bouba!",
    display = display_options(content_background_colour = "white",full_screen = FALSE),
    session_timeout_min = 0.1,
    clean_sessions_interval_min = 0.1,
    auto_p_id = FALSE,
    enable_resume_session = TRUE,
    allow_any_p_id_url = TRUE,
  ))