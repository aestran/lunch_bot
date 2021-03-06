'use strict'

const express = require('express')
const Slapp = require('slapp')
const ConvoStore = require('slapp-convo-beepboop')
const Context = require('slapp-context-beepboop')
const smb = require('slack-message-builder')
var exec = require('child_process').exec;

// use `PORT` env var on Beep Boop - default to 3000 locally
var port = process.env.PORT || 3000

const Weather = require('./services/weatherService')
var LocationFuntion = require('./services/zomatoService.js');
var WeatherFunction = require('./services/weatherService').getMockWeather;
const TrafficFunction = require('./services/trafficService').getMockStaticImageUrl;
const NutritionFunction = require('./services/nutritionService').getMockNutritionInfo;
const util = require('util')
const sleep = require('sleep');


var slapp = Slapp({
  // Beep Boop sets the SLACK_VERIFY_TOKEN env var
  verify_token: process.env.SLACK_VERIFY_TOKEN,
  convo_store: ConvoStore(),
  context: Context()
})

var HELP_TEXT = `
I will respond to the following messages:
\`help\` - to see this message.
\`lunchpoll\` - to start a lunch poll.

I will also monitor your conversations and if I think you're getting hungry I'll start a poll!
`

//* ********************************************
// Setup different handlers for messages
//* ********************************************

// Catch-all for any other responses not handled above
slapp.message('.*(lunch).*', ['ambient'], (msg) => {
  // respond only 40% of the time
  if (Math.random() < 0.4) {
    msg.say('Did somebody say lunch? :wave:')
      .route('how_are_you')
  }
})

// slapp.message('.*(hungry).*', ['ambient'], (msg) => {
//     // respond only 40% of the time
//   if (Math.random() < 0.4) {
//     msg.say('Did somebody say lunch? :wave:')
//     .route('how_are_you')
//   }
// })

// "Conversation" flow that tracks state - kicks off when user says hi, hello or hey
slapp
  .message('^(hi|hello|hey|Yoyo)$', ['direct_mention', 'direct_message'], (msg, text) => {

    msg
      .say(`${text}, how are you?`)
      // sends next event from user to this route, passing along state
      .route('how_are_you', {
        greeting: text
      })
  })
  .route('how_are_you', (msg, state) => {
    var text = (msg.body.event && msg.body.event.text) || ''

    // add their response to state
    state.status = text

    msg.say([
        'Can I help you with something? :smile:',
        'Kinda busy, how can I help? :confused: ',
        'Whats up? Make it quick :clock1:',
        'Ummm... you messaged me your clown :unicorn_face:'
      ])
      .route('can_i_help', state)
  })
  .route('can_i_help', (msg, state) => {
    var text = (msg.body.event && msg.body.event.text) || ''

    // add their response to state
    state.color = text

    if (!text.includes('food')) {
      msg.say('...')
        .route('how_are_you')
    } else {
      var message = smb()
        .text('Please pick a cuisine :knife_fork_plate::chicken::apple::cow2:')
        .attachment()
        .text('Choose a cuisine!')
        .fallback('You are unable to choose a game')
        .callbackId('cuisinechoice_callback')
        .color('#3AA3E3')
        .button()
        .name('choice')
        .text('Italian :flag-it:')
        .type('button')
        .value('Italian')
        .end()
        .button()
        .name('choice')
        .text('Mexican :flag-me:')
        .type('button')
        .value('Mexican')
        .end()
        .button()
        .name('choice')
        .text('Chinese :flag-cn:')
        .type('button')
        .value('Chinese')
        .end()
        .button()
        .name('choice')
        .text('Local :flag-ie: :flag-gb:')
        .type('button')
        .value('Local')
        .end()
        .button()
        .name('choice')
        .text('Microwave Meal')
        .style('danger')
        .type('button')
        .value('shitecraic')
        .confirm()
        .title('Shite Craic')
        .text('You know Belfast doesn’t have a microwave? #ridic')
        .okText('Not Cool')
        .dismissText('Justice for Belfast')
        .end()
        .end()
        .end()
        .json()

      msg
        .say('Oh you want lunch! Please get to the point more quickly next time...')
        .say(message)
        .route('option_selected', state)
    }
  })
  .route('option_selected', (msg, state) => {
    var text = (msg.body.event && msg.body.event.text) || ''

    var selectedOption = msg.body.actions[0].value

    // add their response to state
    state.option = selectedOption
    var message = ''

    if (selectedOption === 'Mexican') {
      message = 'What did a Mexican throw his wife off a cliff?Tequilla :tropical_drink:'
    } else if (selectedOption === 'Italian') {
      message = 'What do you call a fake noodle? An impasta :spaghetti:'
    } else if (selectedOption === 'Local') {
      message = 'What do you call cheese that isn’t yours? Nacho cheese '
    } else if (selectedOption === 'Chinese') {
      message = 'You wok my world'
    } else {
      message = 'Why did you even waste my time?'
    }

    msg
      .say(message)

    var message = smb()
      .text('They say money can’t buy you happiness, but I’ve got a receipt from the off-license telling a whole different story')
      .attachment()
      .text('How rich are you feeling')
      .fallback('You are unable to choose a game')
      .callbackId('riches_choice_callback')
      .color('#3AA3E3')
      .button()
      .name('riches_choice')
      .text('Loaded :money_mouth_face: ')
      .type('button')
      .value('loaded')
      .end()
      .button()
      .name('riches_choice')
      .text('Poor :money_with_wings:')
      .type('button')
      .value('poor')
      .end()
      .button()
      .name('riches_choice')
      .text('None of your business')
      .style('danger')
      .type('button')
      .value('none_selected')
      .confirm()
      .title('Dance monkey?')
      .text('What do you think I am?')
      .okText('Yes')
      .dismissText('No')
      .end()
      .end()
      .end()
      .json()

    msg
      .say(message)
      .route('how_rich_are_you_feeling_answer', state)


  })
  .route('how_rich_are_you_feeling_answer', (msg, state) => {
    var text = (msg.body.event && msg.body.event.text) || ''

    var selectedOption = msg.body.actions[0].value

    // add their response to state
    state.option = selectedOption
    var message = ''

    if (selectedOption === 'loaded') {
      message = 'Ohhhh, hey big spender! :moneybag: \n https://media.giphy.com/media/DTywu7YYjWCVW/giphy.gif'
    } else if (selectedOption === 'poor') {
      message = 'No problem… misery guts \n https://media.giphy.com/media/uRngiZzOKPKkE/giphy.gif'
    } else if (selectedOption === 'none_selected') {
      message = 'Sorry I asked :face_with_rolling_eyes'
    } else {
      message = 'Why did you even waste my time?'
    }

    var question = smb()
      .text('Now remember, [LINDA TO INSERT FUNNY ANOCDOTE ABOUT HEALTH HERE]')
      .attachment()
      .text('How far do you want to walk?')
      .fallback('You are unable to choose a game')
      .callbackId('distance_choice_callback')
      .color('#3AA3E3')
      .button()
      .name('distance_choice')
      .text('Mega Lazy :hankey:')
      .type('button')
      .value('lazy')
      .end()
      .button()
      .name('distance_choice')
      .text('Short stroll :sleuth_or_spy:')
      .type('button')
      .value('stroll')
      .end()
      .button()
      .name('distance_choice')
      .text('Adventure mode :runner:')
      .type('button')
      .value('adventure')
      .end()
      .button()
      .name('distance_choice')
      .text('Joke Me :black_joker:')
      .style('danger')
      .type('button')
      .value('joke')
      .confirm()
      .title('Dance monkey?')
      .text('What do you think I am?')
      .okText('Yes')
      .dismissText('No')
      .end()
      .end()
      .end()
      .json()

    msg
      .say(message)
      .say(question)
      .route('how_far', state)

  })
  .route('how_far', (msg, state) => {
    var text = (msg.body.event && msg.body.event.text) || ''

    var selectedDistance = msg.body.actions[0].value

    // add their response to state
    state.selectedDistance = selectedDistance
    var message = ''

    if (selectedDistance === 'joke') {
      message = '[Add banter for joke selection]'
    } else if (selectedDistance === 'adventure') {
      message = 'Wow… fill in your timesheet before you leave :face_with_rolling_eyes: '
    } else if (selectedDistance === 'stroll') {
      message = 'Ok, I get it...'
    } else if (selectedDistance === 'lazy') {
      message = 'If you’re so lazy, why don’t you order a Deliveroo?'
    } else {
      message = 'Why did you even waste my time?'
    }

    msg
      .say(message)
      .say('Ok, let me see what i can find here, one second...')
      .route("waiting_for_directions")
  })
  .route('waiting_for_directions', (msg, state) => {
    var text = (msg.body.event && msg.body.event.text) || ''

    // add their response to state
    state.status = text

    msg
      .say(':rage:')
      .say('I said one second ffs.........')

    // main.js
    LocationFuntion.requestLocations(function(err, result) {
      if (err) return console.error(err);
      console.log("Result: " + result);

      result.forEach(function(value) {
        console.log(value);
        msg
          .say({
            text: 'Result',
            attachments: [{
              text: value.name,
              title: value.address,
              image_url: value.image,
              color: '#7CD197',
              callback_id: "location_selected_callback",
              actions: [{
                "name": "final_choice",
                "text": "Choose Me!",
                "type": "button",
                "value": value.name
              }]
            }]
          })
          .route("location_selected")
      });

    });
  })
  .route('location_selected', (msg, state) => {
     var selectedOption = msg.body.actions[0].value

    // add their response to state
    state.status = selectedOption

    msg.say('I\'ve heard '+selectedOption+' is shite, you\'ll enjoy it')
       .say('Anything else I can help with?')
      .route('want_weather', state)

  })
   .route('want_weather', (msg, state) => {

     var text = (msg.body.event && msg.body.event.text) || ''

    // add their response to state
    state.color = text

    if (!text.includes('weather')) {
      msg.say('...')
        .route('dont_want_weather')
    } else {
      msg.say('Ok, just so happens I\'ve got a weather module here...')
         .say('LINK TO WEATHER')
        .route('can_i_help', state)
    }

  })
  .route('dont_want_weather', (msg, state) => {

     var text = (msg.body.event && msg.body.event.text) || ''

    // add their response to state
    state.color = text

    if (!text.includes('weather')) {
      msg.say('...')
        .say('You\'re starting to piss me off...' )
        .route('want_weather')
    } else {
      msg.say('FFS you said you didn\'t want anything else?! Goodbye :wave:')
        //.route('can_i_help', state)
    }

  })

// demonstrate returning an attachment...
slapp.message('attachment', ['mention', 'direct_message'], (msg) => {
  msg.say({
    text: 'Check out this amazing attachment! :confetti_ball: ',
    attachments: [{
      text: 'Slapp is a robust open source library that sits on top of the Slack APIs',
      title: 'Slapp Library - Open Source',
      image_url: 'https://storage.googleapis.com/beepboophq/_assets/bot-1.22f6fb.png',
      title_link: 'https://beepboophq.com/',
      color: '#7CD197'
    }]
  })
})

// attach Slapp to express server
var server = slapp.attachToExpress(express())

// start http server
server.listen(port, (err) => {
  if (err) {
    return console.error(err)
  }

  console.log(`Listening on port ${port}`)
})