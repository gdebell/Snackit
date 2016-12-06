function sum(num1, num2, callback) {
  const total = num1 + num2;
  if (isNaN(total)) {
    const error = 'Something went wrong!';
    callback(error);
  } else {
    callback(null, total);
  }
}

function sendMessage() {
  console.log('Inside the send message function!!');
  // Load the twilio module
  var twilio = require('twilio');
  // Create a new REST API client to make authenticated requests against the
  // twilio back end
  var client = new twilio.RestClient('AC98cf9c80cd5fa0cc9af34ab23c832d20', '4502d73ddf59b93f08d83fdddc081020');

  client.sms.messages.create({
      to:'+7209873456',
      from:'12014742256',
      body:'ahoy hoy! Testing Twilio and node.js'
  }, function(error, message) {
      if (!error) {
          console.log('Success! The SID for this SMS message is:');
          console.log(message.sid);

          console.log('Message sent on:');
          console.log(message.dateCreated);
      } else {
          console.log('Oops! There was an error.');
      }
  })
}

module.exports = {
  sum,
  sendMessage
};
