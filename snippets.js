slapp.action('cuisinechoice_callback', 'choice', (msg, value) => {
  msg.respond(smb(msg.body.original_message)
          .attachments.get(-1) // get the last attachment
            .text(`:white_check_mark: got it`) // add some confirmation text
          .end()
        .json())
})

// response to the user typing "help"
slapp.message('help', ['mention', 'direct_message'], (msg) => {
    msg.say(HELP_TEXT)
})

slapp.message('weather', ['mention', 'direct_message'], (msg) => {
    msg.say(weather.get())
})

slapp.message('yelp', ['mention', 'direct_message'], (msg) => {
    var service = new YelpService();
    var options = service.getCuisineOptions();

    var message = smb()
        .text("Please pick a cuisine :knife_fork_plate: :chicken: :hot_pepper: :cow2:")
        .attachment()
        .text("Choose a cuisine!")
        .fallback("You are unable to choose a game")
        .callbackId("cuisinechoice_callback")
        .color("#3AA3E3")
        .button()
        .name("choice")
        .text("Italian :flag-it:")
        .type("button")
        .value("Italian")
        .end()
        .button()
        .name("choice")
        .text("Mexican :flag-me:")
        .type("button")
        .value("Mexican")
        .end()
        .button()
        .name("choice")
        .text("Chinese :flag-cn:")
        .type("button")
        .value("Chinese")
        .end()
        .button()
        .name("choice")
        .text("Local :flag-ie: :flag-gb:")
        .type("button")
        .value("Local")
        .end()
        .button()
        .name("choice")
        .text("Not Interested")
        .style("danger")
        .type("button")
        .value("shitecraic")
        .confirm()
        .title("Shite Craic?")
        .text("So you prefer to eat alone and miss the lunch time bants?")
        .okText("Yes")
        .dismissText("No")
        .end()
        .end()
        .end()
        .json()

    msg.say(message)
})

var choiceArray = new Array();
var choiceCount = 0;

// slapp.action('cuisinechoice_callback', 'choice', (msg, value) => {
//         var username = msg.body.user.name

//         msg
//             .say(`Ok got your choice, how rich are you feeling?`)
//             // sends next event from user to this route, passing along state
//             .route('how_rich', { msg })
//     })
//     .route('how_rich', (msg) => {
//         var text = (msg.body.event && msg.body.event.text) || ''

//         // add their response to state
//         state.status = text

//         msg.say([
//                 "Very rich! :smile:",
//                 'Kinda busy, how can I help? :confused: ',
//                 'Whats up? Make it quick :clock1:',
//             ])
//             .route('how_rich', state)
// })

// choiceArray[value] = choiceArray[value]++;
// choiceCount++;

// if(choiceCount == 4){
//     msg.respond('Voting has closed! Would you like to see more filters?').route('handleMoreFilters');
// } else {

// msg.respond(smb(msg.body.original_message)
//           .attachments.get(-1) // get the last attachment
//             .text(`:white_check_mark: got it`) // add some confirmation text
//           .end()
//         .json()).route


slapp.route('handleMoreFilters', (msg) => {
    if (msg.body.event.text.indexOf('Yes') > -1 || msg.body.event.text.indexOf('yes') > -1) {
        var message = smb()
            .text("Ok people! Voting is open :knife_fork_plate: :chicken: :hot_pepper: :cow2:")
            .attachment()
            .text("Choose a price point!")
            .fallback("You are unable to choose a game")
            .callbackId("pricepoint_callback")
            .color("#3AA3E3")
            .button()
            .name("priceChoice")
            .text("Cheap :flag-it:")
            .type("button")
            .value("Italian")
            .end()
            .button()
            .name("priceChoice")
            .text("Dear :flag-me:")
            .type("button")
            .value("Mexican")
            .end()
            .end()
            .json()

        msg.say(message)
    } else {
        msg.say('No thanks');
    }
})

slapp.message('Voting has closed!', (msg) => {
    msg.say('sweet dreams :crescent_moon: ')
})