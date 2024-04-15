# Share White Board (Companion Mode)
Cisco Webex Board offers the possibility to share whiteboards by sending them via email or saving them into Webex spaces. To do this, users need to be standing in front of the board and perform several clicks on the screen. This Webex Device macro allows users to share whiteboards via email simply by clicking on a button on the navigator/touch screen. It has been designed for Companion mode, but it could be easily used in other situations.

![image](https://github.com/wxsd-sales/share-whiteboard/assets/22101144/20b7fe0f-c1a0-4c4a-95b8-cc03ce569180)



## Overview
The macro is designed to run on the main Video device in the room. It automatically creates a share button, which will be visible only in the call controls. This is because the API used to share the whiteboard (_xapi.Command.Whiteboard.Email.Send_) is only available when a whiteboard is shared during a call/meeting.

The device will send a warning message if the button to share the whiteboard is pressed before the whiteboard is shared:
![image](https://github.com/wxsd-sales/share-whiteboard/assets/22101144/e17a09d6-e735-40d1-a217-015dff24a272)


and another message confirming that the whiteboard was sent
![image](https://github.com/wxsd-sales/share-whiteboard/assets/22101144/e6b74ba7-5f48-4b5b-bb05-7af4a14ccd59)



## Setup
### Prerequisites & Dependencies:
- RoomOS/CE Webex Device
- Web admin access to the device to upload and run the macro
- The device running the macro needs to have connectivity with the Board where the whiteboard is being shared
### Installation Steps:
1. Download the `share-whiteboard-companion.js` file and upload it to your Webex Room devices macro editor via the web interface.
2. Configure the macro by changing the initial values, there are comments explaining each one.
3. Enable the macro on the editor.
## Validated Hardware:

* Webex Board Pro
* Desk Pro

This macro should work on other Webex Devices but has not been validated at this time.

## Demo

*For more demos & PoCs like this, check out our [Webex Labs site](https://collabtoolbox.cisco.com/webex-labs).

## License

All contents are licensed under the MIT license. Please see [license](LICENSE) for details.


## Disclaimer

Everything included is for demo and Proof of Concept purposes only. Use of the site is solely at your own risk. This site may contain links to third party content, which we do not warrant, endorse, or assume liability for. These demos are for Cisco Webex use cases, but are not Official Cisco Webex Branded demos.


## Questions

Please contact the WXSD team at [wxsd@external.cisco.com](mailto:wxsd@external.cisco.com?subject=custom-dial-macro) for questions. Or, if you're a Cisco internal employee, reach out to us on the Webex App via our bot (globalexpert@webex.bot). In the "Engagement Type" field, choose the "API/SDK Proof of Concept Integration Development" option to make sure you reach our team. 
