# aws-iot-button-twilio-find-my-phone
Use AWS IoT button and Twilio to call my phone.

This is another demonstration of the AWS IoT button: by long-pressing the button, it will ring your phone. 

**Step 1:** Register a free-trial account with [Twilio](https://www.twilio.com/). Twilio provides APIs that allow you to make a call, send a SMS, etc. A phone call, in this case not answered, will still cost $0.015. Not sure how much money is loaded with the free-trial account. 

Note that you will need to [register](https://www.twilio.com/console/phone-numbers/incoming) an incoming phone number, which Twilio will provide for free. 

**Step 2:** Follow the [instructions](https://aws.amazon.com/iotbutton/) to register the button with AWS IoT.

**Step 3:** Create a Lambda function with trigger being the registered IoT button.

**Step 4:** Test! Long-press the button and you should receive a phone call from the number you registered. 
