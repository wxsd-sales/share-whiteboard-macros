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
 * This Webex Device macro llows users to share whiteboards via email simply by clicking on a button on the navigator. It has been designed for Companion mode, but it could be easily used in other situations.
 * 
 * Full Readme and source code and license details available here:
 * https://github.com/wxsd-sales/share-whiteboard
 * 
 ********************************************************/

import xapi from 'xapi';

const emailConfig = {
  destination: 'user@example.com', // Change this value to the email address you want the whiteboard to be sent to
  body: 'Here you have your white board', // Email body text of your choice, this is an example
  subject: 'New white board' // Email suubject of your choice, this is an example
};
const buttonConfig = {
  name: 'Send whiteboard',
  icon: 'Tv',
  panelId: 'share-wb'
};

const remoteDeviceconfig = {
  deviceIP: 'X.X.X.X', // Change this value to the Cisco Board IP adddress
  userName: 'user', // Change this value to the Board user with Admin rights 
  password: 'password', // Board user witrh Admin rights password
};

const credentials = btoa(`${remoteDeviceconfig.userName}:${remoteDeviceconfig.password}`);

function createPanel() {
  const panel = `
    <Extensions>
      <Version>1.11</Version>
      <Panel>
        <Order>1</Order>
        <PanelId>wbButtonId</PanelId>
        <Origin>local</Origin>
        <Location>CallControls</Location>
        <Icon>${buttonConfig.icon}</Icon>
        <Name>${buttonConfig.name}</Name>
        <ActivityType>Custom</ActivityType>
      </Panel>
    </Extensions>`
  xapi.Command.UserInterface.Extensions.Panel.Save(
    { PanelId: buttonConfig.panelId },
    panel
  )
    .catch(e => console.log('Error saving panel: ' + e.message))
}

function alert(message) {
  xapi.Command.UserInterface.Message.Alert.Display({ Duration: 10, Text: message, Title: 'Warning' });
  console.log('Sending alert:', message);
}

function inform(message) {
  xapi.Command.UserInterface.Message.Prompt.Display({ Duration: 5, Text: message, Title: 'Sharing whiteboards' })
}

function sendWhiteBoardUrl(url) {
  const xml = ` <Command>
                  <Whiteboard>
                    <Email>
                      <Send>
                        <Subject>${emailConfig.subject}</Subject>
                        <Body>${emailConfig.body}</Body>
                        <Recipients>${emailConfig.destination}</Recipients>
                        <BoardUrls>${url}</BoardUrls>
                      </Send>
                    </Email>
                  </Whiteboard>
                </Command>`;
  xapi.Command.HttpClient.Post({
    AllowInsecureHTTPS: 'True',
    Header: ['Authorization: Basic ' + credentials],
    Url: `https://${remoteDeviceconfig.deviceIP}/putxml`
  }, xml)
    .catch(error => console.log(error))
    .then(reponse => {
      console.log('putxml response status code:', reponse.StatusCode);
      inform('Whiteboard has been sent');
    })
}

function shareWhiteBoard(event) {
  if (event.PanelId != buttonConfig.panelId) return;
  console.log(`Button ${buttonConfig.panelId} clicked`);

  // Get Board URL from the WB
  let boardUrl = '';
  xapi.Command.HttpClient.Get({
    AllowInsecureHTTPS: 'True',
    Header: ['Authorization: Basic ' + credentials],
    Url: `https://${remoteDeviceconfig.deviceIP}/getxml?location=/Status/Conference/Presentation/WhiteBoard`
  })
    .then(response => {
      boardUrl = response.Body.split("<BoardUrl>")[1].split("</BoardUrl>")[0];
      if (boardUrl == '') {
        alert('You need to share a whiteboard before it can be sent');
        return;
      }
      else {
        console.log('Board Url received from WB:', boardUrl);
        alert ('Sending White Board');
        sendWhiteBoardUrl(boardUrl); // Instruct Board to send URL
      }    
    })
    .catch(error => {
      console.log('Error getting Board URL;', error);
      console.log(boardUrl);
    })  
  }

xapi.Config.HttpClient.Mode.set('On');
xapi.Config.HttpClient.AllowInsecureHTTPS.set('True');

createPanel();
xapi.Event.UserInterface.Extensions.Panel.Clicked.on(shareWhiteBoard);

