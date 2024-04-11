# Share White Board (Companion Mode)

Cisco Webex Board offers the possibility to share whiteboards by sending them via email or saving them into Webex spaces. To do this, users need to be standing in front of the board and perform several clicks on the screen. This Webex Device macro allows users to share whiteboards via email simply by clicking on a button on the navigator. It has been designed for Companion mode, but it could be easily used in other situations.

## Overview

The macro is designed to run on the main Video device in the room. It automatically creates a share button, which will be visible only in the call controls. This is because the API used to share the whiteboard (_xapi.Command.Whiteboard.Email.Send_) is only available when a whiteboard is shared during a call/meeting.





REMOVE BELOW

The macro automatically downloads a custom image from a configured URL upon startup. It then saves a UI Extension button to the Webex Devices using the downloaded image as the icon. Next, it subcribes to button clicks and text input events. When a user taps on the custom button, the macro opens a text input prompt and when the user enters their dial string information, the macro will match it against an array of regular expressions. The expressions are able to append the dial string, prefix the dial string or leave it unmodified. Once matched, the macro will place a call using the final dial string.

Here is an example of the regular expressions and how they can modify the user entered dial string.
```js
const patterns = [
  { regex: '^([0-9]{8})$', action: 'append', number: '@webex.com' }, // Matches 8 digits -> <dialled> + '@webex.com'
  { regex: '^(.*)@(.*)$', action: 'continue' }, //Matches *@* URI -> Ignores URIs, allows to continue
  { regex: '^(.*)$', action: 'append', number: '@company.webex.com' } // Matches everything else -> <dialled> + '@company.webex.com'
]
```


### Flow Diagram

![image](https://user-images.githubusercontent.com/21026209/235311057-1dec9885-67b1-469e-a844-b963a8479c73.png)

## Setup

### Prerequisites & Dependencies:

- RoomOS/CE 9.15 or above Webex Device
- Web admin access to the device to upload the macro
- A web hosted image icon to download (example provided in the macro config)
- Network connectivity for the device to download the image icon (i.e. No firewall restrictions)

### Installation Steps:

1. Download the ``custom-dial-macro.js`` file and upload it to your Webex Room devices macro editor via the web interface.
2. Configure the macro by changing the initial values, there are comments explaining each one.
3. Enable the macro on the editor.


## Validated Hardware:

* Room Kit Pro
* Desk Pro
* Room Kit

This macro should work on other Webex Devices but has not been validated at this time.

## Demo

*For more demos & PoCs like this, check out our [Webex Labs site](https://collabtoolbox.cisco.com/webex-labs).

## License

All contents are licensed under the MIT license. Please see [license](LICENSE) for details.


## Disclaimer

Everything included is for demo and Proof of Concept purposes only. Use of the site is solely at your own risk. This site may contain links to third party content, which we do not warrant, endorse, or assume liability for. These demos are for Cisco Webex use cases, but are not Official Cisco Webex Branded demos.


## Questions

Please contact the WXSD team at [wxsd@external.cisco.com](mailto:wxsd@external.cisco.com?subject=custom-dial-macro) for questions. Or, if you're a Cisco internal employee, reach out to us on the Webex App via our bot (globalexpert@webex.bot). In the "Engagement Type" field, choose the "API/SDK Proof of Concept Integration Development" option to make sure you reach our team. 
