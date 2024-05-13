# Share Whiteboasrd Macro
Cisco Webex Board, and Desk series, offer the possibility to share whiteboards by sending them via email or saving them into Webex spaces. To do this, users need to be standing in front of the board and perform several clicks on the screen. This Webex Device macro allows users to share whiteboards via email simply by clicking on a button on the navigator/touch screen. It has been designed for Companion mode, but it could be easily used in other situations.

<img width="1628" alt="image" src="https://github.com/wxsd-sales/share-whiteboard/assets/22101144/28d73258-2a3f-41ed-a8cc-498b876b915b">

## Overview
### Features
- Send Whiteboard from you Navigator:

Use your Navigator to send Whiteboards that are open on your paired Desk or Board Series Devices
- Send Whiteboard in Companion Mode

Similar the above feature, we can also send Whiteboards opened on a companion Board Device from the main Room Series Device and its Navigator

### Using the macro
The macro is designed to run on the main Video device in the room. It automatically creates a share button, which will be visible only in the call controls. This is because the API used to share the whiteboard (_xapi.Command.Whiteboard.Email.Send_) is only available when a whiteboard is shared during a call/meeting.

The device will send a warning message if the button to share the whiteboard is pressed before the whiteboard is shared:

<img width="1590" alt="image" src="https://github.com/wxsd-sales/share-whiteboard/assets/22101144/f8fd1767-daea-4da5-9dc9-d34386024c2b">

and another message confirming that the whiteboard was sent
<img width="1609" alt="image" src="https://github.com/wxsd-sales/share-whiteboard/assets/22101144/6ce59940-cd9a-4baf-80c1-9892f13b1b39">

## Setup
### Prerequisites & Dependencies:
- RoomOS/CE Webex Device running RoomOS 11.14 version or above
- Web admin access to the device to upload and run the macro
- Local Admin account for the Companion Board ( Required to make xAPI calls from main room device )
- Network (LAN) connectivity between Main Room Device and Companion Board device
- Board SMTP configuration is needed (see https://help.webex.com/en-us/article/nkgc99h/Configure-the-SMTP-settings-of-Cisco-Board-and-Desk-series)
### Installation Steps:
1. Download the `share-whiteboard-companion.js` file and upload it to your Webex Room devices macro editor via the web interface.
2. Configure the macro by changing the initial values, there are comments explaining each one.
3. Enable the macro on the editor.
## Validated Hardware:
- Room Series & Navigator with Board Series in Companion mode
- Board Series & Navigator
- Desk Series & Navigator

## Demo
*For more demos & PoCs like this, check out our [Webex Labs site](https://collabtoolbox.cisco.com/webex-labs).

## License
All contents are licensed under the MIT license. Please see [license](LICENSE) for details.

## Disclaimer
Everything included is for demo and Proof of Concept purposes only. Use of the site is solely at your own risk. This site may contain links to third party content, which we do not warrant, endorse, or assume liability for. These demos are for Cisco Webex use cases, but are not Official Cisco Webex Branded demos.

## Questions
Please contact the WXSD team at [wxsd@external.cisco.com](mailto:wxsd@external.cisco.com?subject=custom-dial-macro) for questions. Or, if you're a Cisco internal employee, reach out to us on the Webex App via our bot (globalexpert@webex.bot). In the "Engagement Type" field, choose the "API/SDK Proof of Concept Integration Development" option to make sure you reach our team. 
