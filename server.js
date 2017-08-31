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
const Yelp = require('./services/yelpService')
const Traffic = require('./services/trafficService')
const Nutrition = require('./services/nutritionService');
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
    .message('^(hi|hello|hey)$', ['direct_mention', 'direct_message'], (msg, text) => {
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
        'Whats up? Make it quick :clock1:'
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
                .text('Please pick a cuisine :knife_fork_plate: :chicken: :hot_pepper: :cow2:')
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
                .text('Not Interested')
                .style('danger')
                .type('button')
                .value('shitecraic')
                .confirm()
                .title('Shite Craic?')
                .text('So you prefer to eat alone and miss the lunch time bants?')
                .okText('Yes')
                .dismissText('No')
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

      console.log('User selected $[selectedOption}')

        // add their response to state
      state.option = selectedOption
      var message = ''

      if (selectedOption === 'Mexican') {
        message = 'Oh wow, how exciting...'
      } else if (selectedOption === 'Italian') {
        message = 'Really? Thats a bit lame'
      } else if (selectedOption === 'Local') {
        message = 'God youre boring'
      } else if (selectedOption === 'Chinese') {
        message = 'Good choice'
      } else {
        message = 'Why did you even waste my time?'
      }

      msg
        .say(message)
        .say('It\'s your life.... so how rich are you feeling then?')
        .route('how_rich_are_you_feeling', state)
    })
    .route('how_rich_are_you_feeling', (msg, state) => {
      var text = (msg.body.event && msg.body.event.text) || ''

        // add their response to state
      state.status = text

      msg
        .say('Johnny big balls over here...')
        .say('Grand, do you care how far you\'re walking?')
        .route("how_far")
    })
    .route('how_far', (msg, state) => {
      var text = (msg.body.event && msg.body.event.text) || ''

        // add their response to state
      state.status = text

      msg
        .say('Good, you need the exercise :face_with_rolling_eyes: ')
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
      sleep.sleep(5)

      //var result = YelpService.getLocations();

      msg
        .say({
          text: 'Map :world_map:',
          attachments: [{
          text: "result",
          title: 'Map to your destination',
          image_url: 'https://thenextweb.com/wp-content/blogs.dir/1/files/2010/05/maps-500x390.jpg',
          title_link: 'https://beepboophq.com/',
          color: '#7CD197'
        }]
      })
      .route("how_far")

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
