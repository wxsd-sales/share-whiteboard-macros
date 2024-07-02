# Share Whiteboard Macro
Cisco Webex Board, and Desk series, offer the possibility to share whiteboards by sending them via email or saving them into Webex spaces. To do this, users need to be standing in front of the board and perform several clicks on the screen. This Webex Device macro allows users to share whiteboards via email simply by clicking on a button on the navigator/touch screen. This is especially useful in Companion mode environments, where the Navigator is connected to the main video device.

## Overview

### Features

- Send Whiteboard from your Navigator:

  Use your Navigator to send Whiteboards that are open on your paired Board or Desk Series Devices

  <img width="1300" alt="image" src="https://github.com/wxsd-sales/share-whiteboard-macro/assets/22101144/03a6edac-27dc-44f9-99c9-cf9fefe63e30">

- Send Whiteboard in Companion Mode

  Similar the above feature, we can also send Whiteboards opened on a Companion Board Device from the main Room Series Device and its Navigator

<img width="1300" alt="image" src="https://github.com/wxsd-sales/share-whiteboard-macro/assets/22101144/9750a351-35cd-4b6e-97f6-6d19055f02a9">

- Send Whiteboard from your touch screen

Send your Desk/Board Whiteboards with a simple click

<img width="1300" alt="image" src="https://github.com/wxsd-sales/share-whiteboard/assets/22101144/28d73258-2a3f-41ed-a8cc-498b876b915b">

### Using the macro
The macro automatically creates a share button, which will be visible only in the call controls. This is because the API used to share the whiteboard (_xapi.Command.Whiteboard.Email.Send_) is only available when a whiteboard is shared during a call/meeting.

The device will send a warning message if the button to share the whiteboard is pressed before the whiteboard is shared:

<img width="1300" alt="image" src="https://github.com/wxsd-sales/share-whiteboard-macro/assets/22101144/5353d5b1-621a-401a-9b6a-3a6756b22190">

Another message indicating that the macro is checking if there is any shared Whiteboard in the Webex board (only for Companion mode):

<img width="1300" alt="image" src="https://github.com/wxsd-sales/share-whiteboard-macro/assets/22101144/4ddfd004-89a5-4199-b399-0061bc69f289">

and, finally, one message confirming that the whiteboard was sent:

<img width="1300" alt="image" src="https://github.com/wxsd-sales/share-whiteboard-macro/assets/22101144/627101ac-f8d1-434a-bd02-c91d65c3fd8e">


## Setup
### Prerequisites & Dependencies:
- RoomOS/CE Webex Device running RoomOS 11.14 version or above
- Web admin access to the device to upload and run the macro
- Local Admin account for the Companion Board ( Required to make xAPI calls from main room device )
- Network (LAN) connectivity between Main Room Device and Companion Board device
- Board SMTP configuration is needed (see https://help.webex.com/en-us/article/nkgc99h/Configure-the-SMTP-settings-of-Cisco-Board-and-Desk-series)

### Installation Steps:

For Companion mode, the macro is designed to run on the main video device in the room:
1. Download the `share-whiteboard-companion.js` file and upload it to the main video device macro editor via the web interface
2. Configure the macro by changing the initial values, there are comments explaining each one.
3. Enable the macro on the editor.

For standalone Boards, and Desks:
1. Download the `share-whiteboard-standalone.js` file and upload it to your Webex Room devices macro editor via the web interface
2. Configure the macro by changing the initial values, there are comments explaining each one
3. Enable the macro on the editor

## Validated Hardware:
- Room Series & Navigator with Board Series in Companion mode
- Board Series & Navigator
- Desk Series & Navigator

## New version: selecting participants
### Overview
A new version of this macro is ready, with a new option allowing the user to send the Whiteboard to selected meeting participants

<img width="1300" alt="image" src="https://github.com/wxsd-sales/share-whiteboard-macro/assets/22101144/fcb5a5ec-62d1-4d62-8526-6e16626e00a7">


<img width="1300" alt="image" src="https://github.com/wxsd-sales/share-whiteboard-macro/assets/22101144/ba131f76-0dd8-4aaf-a258-5bb9b2c13185">

Only participants in the same organization will be shown

### Installation Steps:

1. Download the `share-wb-participants-companion.js` file for Companion mode (or the `share-wb-participants-standalone.js` for standalone devices ), and upload it to the main video device macro editor via the web interface
2. Configure the macro by changing the initial values, there are comments explaining each one.
3. Enable the macro on the editor.

## Demo
*For more demos & PoCs like this, check out our [Webex Labs site](https://collabtoolbox.cisco.com/webex-labs).

## License
All contents are licensed under the MIT license. Please see [license](LICENSE) for details.

## Disclaimer
Everything included is for demo and Proof of Concept purposes only. Use of the site is solely at your own risk. This site may contain links to third party content, which we do not warrant, endorse, or assume liability for. These demos are for Cisco Webex use cases, but are not Official Cisco Webex Branded demos.

## Questions
Please contact the WXSD team at [wxsd@external.cisco.com](mailto:wxsd@external.cisco.com?subject=custom-dial-macro) for questions. Or, if you're a Cisco internal employee, reach out to us on the Webex App via our bot (globalexpert@webex.bot). In the "Engagement Type" field, choose the "API/SDK Proof of Concept Integration Development" option to make sure you reach our team. 
