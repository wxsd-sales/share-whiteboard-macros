/********************************************************
* 
* Macro Author:  Victor Vazquez
*                Technical Solutions Architect
*                vvazquez@cisco.com
*                Cisco Systems
* 
* Version: 1-0-0
* Released: 12/04/24
* 
* This Webex Device macro allows users to share whiteboards
* via email simply by clicking on a button on the Navigator. 
*
* This specific version of the macro works for Webex Board
* and desk series, with or without a Navigator
* 
* Full Readme and source code and license details available here:
* https://github.com/wxsd-sales/share-whiteboard-macro
* 
********************************************************/

import xapi from 'xapi';

/*********************************************************
 * Configure the settings below
**********************************************************/

const emailConfig = {
  destination: 'user@example.com', // Change this value to the email address you want the whiteboard to be sent to
  body: 'Here you have your white board', // Email body text of your choice, this is an example
  subject: 'New white board', // Email subject of your choice, this is an example
  attachmentFilename: 'myfile-standalone-mode.pdf' // File name of your choice, this is an example
};
const buttonConfig = {
  name: 'Send whiteboard',
  icon: 'Tv',
  panelId: 'share-wb'
};

/*********************************************************
 * Main functions and event subscriptions
 **********************************************************/

// Set HTTP Client Config and listen for Panel Clicks
xapi.Config.HttpClient.Mode.set('On');
xapi.Config.HttpClient.AllowInsecureHTTPS.set('True');
xapi.Event.UserInterface.Extensions.Panel.Clicked.on(shareWhiteBoard);

// Create UI Extension Panel
createPanel();

/*********************************************************
 * Instructs the device to send the Whitebard to configured
 * email destination
 **********************************************************/
function sendWhiteBoardUrl(url) {
  xapi.Command.Whiteboard.Email.Send({
    BoardUrls: url,
    Body: emailConfig.body,
    Recipients: emailConfig.destination,
    Subject: emailConfig.subject,
    AttachmentFilenames: emailConfig.attachmentFilename })
    .then(() => {
      alert({ message: `Whiteboard has been sent to ${emailConfig.destination}` })
    })
    .catch(error => alert({title:'Error Sending Whiteboard', message: error.message}))

}

/*********************************************************
 * Listen for Panel Click Events and check Whiteboard xStatus
 * of Companion Device before attempting to send the Whiteboard
 **********************************************************/
async function shareWhiteBoard(event) {
  if (event.PanelId != buttonConfig.panelId) return;
  
  console.log(`Button ${buttonConfig.panelId} clicked`);
  console.log('Checking Companion Board WhiteBoard status')
  
  const boardUrl = await xapi.Status.Conference.Presentation.Whiteboard.BoardUrl.get()
  
  if(!boardUrl){
     alert({ title: 'Warning', message: 'You need to share a whiteboard before it can be sent' });
     return
  }

  console.log('Whiteboard Url:', boardUrl);
  alert({ message: 'Sending White Board' });
  sendWhiteBoardUrl(boardUrl); // Instruct Board to send URL
}

/**
 * Alert Function for Logging & Displaying Notification on Device
 * @property {object}  args               - Alert details
 * @property {string}  args.message       - Message Text
 * @property {string}  args.title         - Alert Title
 * @property {number}  args.duration      - Alert Duration
 */
function alert(args) {

  if (!args.hasOwnProperty('message')) {
    console.error('message is required to display alert')
    return
  }

  let duration = 5;
  if(args.hasOwnProperty('duration')){
    duration = args.duration;
  }

  console.log('Displaying Alert:', args)
  if (args.hasOwnProperty('title')) {
    switch (args.title.toLowerCase()) {
      case 'warning':
        xapi.Command.UserInterface.Message.Alert.Display({ Duration: 10, Text: args.message, Title: args.title });
        break;
      default:
        xapi.Command.UserInterface.Message.Prompt.Display({ Duration: duration, Text: args.message, Title: args.title });
    }
  } else {
    xapi.Command.UserInterface.Message.Prompt.Display({ Duration: duration, Text: args.message, Title: 'Sharing Whiteboard Macro' })
  }
}

/*********************************************************
 * Create the UI Extension Panel and Save it to the Device
 **********************************************************/
async function createPanel() {
  const panelId = buttonConfig.panelId;

  let order = "";
  const orderNum = await panelOrder(panelId);
  if (orderNum != -1) order = `<Order>${orderNum}</Order>`;

  const panel = `
    <Extensions>
      <Panel>
        ${order}
        <Origin>local</Origin>
        <Location>CallControls</Location>
        <Icon>${buttonConfig.icon}</Icon>
        <Name>${buttonConfig.name}</Name>
        <ActivityType>Custom</ActivityType>
      </Panel>
    </Extensions>`
  xapi.Command.UserInterface.Extensions.Panel.Save(
    { PanelId: panelId },
    panel
  )
    .catch(e => console.log('Error saving panel: ' + e.message))
}

/*********************************************************
 * Gets the current Panel Order if existing Macro panel is present
 * to preserve the order in relation to other custom UI Extensions
 **********************************************************/
async function panelOrder(panelId) {
  const list = await xapi.Command.UserInterface.Extensions.List({
    ActivityType: "Custom",
  });
  if (!list.hasOwnProperty("Extensions")) return -1;
  if (!list.Extensions.hasOwnProperty("Panel")) return -1;
  if (list.Extensions.Panel.length == 0) return -1;
  for (let i = 0; i < list.Extensions.Panel.length; i++) {
    if (list.Extensions.Panel[i].PanelId == panelId)
      return list.Extensions.Panel[i].Order;
  }
  return -1;
}
