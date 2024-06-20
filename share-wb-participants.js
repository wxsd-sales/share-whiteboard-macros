/********************************************************
* 
* Macro Author:  Victor Vazquez
*                Technical Solutions Architect
*                vvazquez@cisco.com
*                Cisco Systems
* 
* Version: 1-0-0
* Released: 20/06/24
* 
* This Webex Device macro allows users to share whiteboards
* via email simply by clicking on a button on the Navigator. 
*
* This specific version of this macro has been designed for 
* Companion mode use case. This macro should be installed and 
* enabled on the main Room Device. The macro then lets a user
* share a Whiteboard which may be open on the Companion Board
* from the main Room Devices Navigator.
*
* User can now select 
* 
* Full Readme and source code and license details available here:
* https://github.com/wxsd-sales/share-whiteboard-macro
* 
********************************************************/

import xapi from 'xapi';

let emailConfig = {
  destination: 'user@example.com', // Change this value to the email address you want the whiteboard to be sent to by default
  body: 'Here you have your white board', // Email body text of your choice, this is an example
  subject: 'New white board', // Email subject of your choice, this is an example
  attachmentFilename: 'myfile-companion-mode' // File name of your choice, this is an example
};

const config = {
  button: {
    name: 'Share Whiteboard',
    icon: 'Tv'
  },
  panelId: 'sharewb'
}

const remoteDeviceconfig = {
  deviceIP: 'X.X.X.X', // Change this value to the Cisco Board IP adddress
  userName: 'user', // Change this value to the Board user with Admin rights 
  password: 'password', // Board user witrh Admin rights password
};

const credentials = btoa(`${remoteDeviceconfig.userName}:${remoteDeviceconfig.password}`);

createPanel();
// listening for first button click
xapi.Event.UserInterface.Extensions.Panel.Clicked.on(async event => {
  if (event.PanelId != config.panelId) return
  createPanel(); // Reset the previous inputs when the panel is opened
});

// listening for Text input for 'Send to Custom Email Address Option'
xapi.Event.UserInterface.Message.TextInput.Response.on(processInput)

// listening for clicks on main the page
xapi.Event.UserInterface.Extensions.Widget.Action.on(async event => {
  if (!event.WidgetId.startsWith(config.panelId)) return
  if (event.Type != 'pressed') return

  const [_panelId, command] = event.WidgetId.split('-')
  console.log('widget pressed:', command);
  switch (command) {
    case 'sendToDefaultEmail':
      sendWhiteBoardUrl(emailConfig.destination);
      break;
    case 'sendToCustomEmail':
      console.log('Getting the email address');
      await xapi.Command.UserInterface.Message.TextInput.Display(
      {
        Duration: 300,
        FeedbackId: 'text-input-box',
        InputText: emailConfig.destination,
        InputType: 'SingleLine',
        KeyboardState: 'Open',
        SubmitText: 'Send',
        Text: 'Type the email address you want to share the whiteboard with',
        Title: 'Sending Whiteboard'
      })
      /* wait for Customer answer in another function */
      .catch(error => console.log('Error getting email address', error));
      break;
    case 'selectParticpants':

      // Create the Participant Panel
      const participants = await getParticipants();
      createPanel(participants);
      break;
    case 'participant':
      const uuid = event.WidgetId.replace(config.panelId + '-participant-', '')
      toggleParticipantButton(uuid)
      break;
    case 'shareToParticipantsButton':
      const selected = await getSelectedParticipants();
      console.log('number of selected:', selected.length)
      if (selected.length == 0) {
        alert({ title: 'Warning', message: 'You need to select at least one participant' });
        return
      }

      const data = await getParticipants();
      const selectedPartipants = data.filter(participant => selected.includes(participant.SparkUserId))
      console.log('selected participants', selectedPartipants)
      const emails = await getParticipantsEmail(selectedPartipants)
      console.log('Sharing Whiteboard to the following emails', emails)
      // pending build emails
      sendWhiteBoardUrl(emails)
      break;
  }

});

function processInput(event) { 
  if (event.FeedbackId !== 'text-input-box') return;
  console.log('email address from customer input:', event.Text);
  sendWhiteBoardUrl(event.Text); // Instruct Board to send URL
}

async function getParticipants() {
  const results = await xapi.Command.Conference.ParticipantList.Search()
  const self = results.Participant.find(participant => participant.ParticipantId == results.ParticipantSelf)
  const peopleInMyOrg = results.Participant.filter(participant => participant.Type == 'User' && participant.OrgId == self.OrgId)
  console.log('Number of people in my org found:', peopleInMyOrg.length);
  console.log('People in my org found', peopleInMyOrg);
  return peopleInMyOrg;
}

async function toggleParticipantButton(uuid) {
  const panelId = config.panelId;
  const widgetId = panelId + '-participant-' + uuid;
  const widgetState = await getWidgetState(widgetId)
  if (widgetState != 'active') {
    xapi.Command.UserInterface.Extensions.Widget.SetValue({ Value: 'active', WidgetId: widgetId });
  } else {
    xapi.Command.UserInterface.Extensions.Widget.UnsetValue({ WidgetId: widgetId });
  }
}

async function getWidgetState(widgetId) {
  const widgets = await xapi.Status.UserInterface.Extensions.Widget.get();
  const widget = widgets.find(widget => widget.WidgetId == widgetId)
  return widget.Value
}

async function getSelectedParticipants() {
  const widgetIdStart = config.panelId + '-participant-';
  const widgets = await xapi.Status.UserInterface.Extensions.Widget.get();
  console.log(widgets)
  const filtered = widgets.filter(widget => widget.WidgetId.startsWith(widgetIdStart) && widget.Value == 'active')
  if (!filtered) return
  return filtered.map(widget => widget.WidgetId.replace(widgetIdStart, ''))
}

async function getParticipantEmail(name, uuid) {
  const result = await xapi.Command.Phonebook.Search({ PhonebookType: 'Corporate', SearchString: name });

  const contacts = result?.Contact;
  // console.log ('contacts', contacts);
  if (!contacts) return
  const person = contacts.find(contact => contact.ContactId == uuid)
  console.log('person', person);
  return person?.Email
}

async function getParticipantsEmail(participants) {
  let emails = [];
  for (let i = 0; i < participants.length; i++) {
    console.log('Searching for name:', participants[i].DisplayName, ' uuid:', participants[i].SparkUserId)
    const result = await getParticipantEmail(participants[i].DisplayName, participants[i].SparkUserId)
    emails.push(result)
  }
  console.log ('Number of emails:', emails.length)
  if (emails.length > 20) {
    console.log ('More than 20 emails');
    return
  }
  return emails
}

async function getBoardUrl() {
  let boardUrl = '';
  alert({ message: 'Checking for visible whiteboards on Companion Board', duration: 5 });
  // Get Board URL from the WB
  await xapi.Command.HttpClient.Get({
    AllowInsecureHTTPS: 'True',
    Header: ['Authorization: Basic ' + credentials],
    Url: `https://${remoteDeviceconfig.deviceIP}/getxml?location=/Status/Conference/Presentation/WhiteBoard`
  })
    .then(response => {
      boardUrl = response.Body.split("<BoardUrl>")[1].split("</BoardUrl>")[0];
      console.log('Board Url read in WB', boardUrl);
      return (boardUrl);
    })
    .catch(error => {
      console.log('Error getting Board URL;', error);
    })
}

/*********************************************************
 * Instructs the Companion Device to send the Whitebard
 * to configured email destination
 **********************************************************/

async function sendWhiteBoardUrl(destination) {
  let boardUrl = '';
  alert({ message: 'Checking for visible whiteboards on Companion Board', duration: 5 });
  // Get Board URL from the WB
  await xapi.Command.HttpClient.Get({
    AllowInsecureHTTPS: 'True',
    Header: ['Authorization: Basic ' + credentials],
    Url: `https://${remoteDeviceconfig.deviceIP}/getxml?location=/Status/Conference/Presentation/WhiteBoard`
  })
    .then(response => {
      boardUrl = response.Body.split("<BoardUrl>")[1].split("</BoardUrl>")[0];
      console.log('Board Url read in WB', boardUrl);

      if (!boardUrl) {
        alert({ title: 'Warning', message: 'You need to share a whiteboard before it can be sent' });
        return
      }
      const xml = ` <Command>
                  <Whiteboard>
                    <Email>
                      <Send>
                        <Subject>${emailConfig.subject}</Subject>
                        <Body>${emailConfig.body}</Body>
                        <Recipients>${destination}</Recipients>
                        <BoardUrls>${boardUrl}</BoardUrls>
                        <AttachmentFilenames>${emailConfig.attachmentFilename}.pdf</AttachmentFilenames>
                      </Send>
                    </Email>
                  </Whiteboard>
                </Command>`;
      xapi.Command.HttpClient.Post({
        AllowInsecureHTTPS: 'True',
        Header: ['Authorization: Basic ' + credentials],
        Url: `https://${remoteDeviceconfig.deviceIP}/putxml`
      }, xml)
        .catch(error => console.log('Error sending whiteboard', error))
        .then(reponse => {
          console.log('putxml response status code:', reponse.StatusCode);
          alert({ message: `Whiteboard has been sent to ${destination}` });
        })
    })
    .catch(error => {
      console.log('Error getting Board URL;', error);
    })

}


// This function creates the hidden main panel
async function createPanel(people) {

  console.log('Creating Panel')
  const button = config.button;
  const panelId = config.panelId;
  const mainPage = (people) ? createParticipantsPage(people) : createMainPage();
  const order = await panelOrder(panelId);

  const panel = `
    <Extensions>
      <Panel>
        <Location>CallControls</Location>
        <Icon>${button.icon}</Icon>
        <Color>${button.color}</Color>
        <Name>${button.name}</Name>
        ${order}
        <ActivityType>Custom</ActivityType>
        ${mainPage}
      </Panel>
    </Extensions> `;

  await xapi.Command.UserInterface.Extensions.Panel.Save({ PanelId: panelId }, panel)
    .catch(error => console.log(`Unable to save panel [${panelId}]- `, error.message))
}

function createMainPage() {
  const panelId = config.panelId;
  return `
    <Page>
    <Name>Share Whiteboard</Name>
      <Row>
        <Name>Send to: Default@example.com</Name>
        <Widget>
          <WidgetId>${panelId}-sendToDefaultEmail</WidgetId>
          <Name>Send to Default Email: ${emailConfig.destination}</Name>
          <Type>Button</Type>
          <Options>size=4</Options>
        </Widget>
      </Row>
      <Row>
        <Name>Send To: Meeting Participants</Name>
        <Widget>
          <WidgetId>${panelId}-sendToCustomEmail</WidgetId>
          <Name>Send to Custom Email Address</Name>
          <Type>Button</Type>
          <Options>size=4</Options>
        </Widget>
      </Row>
      <Row>
        <Name>Row</Name>
        <Widget>
          <WidgetId>${panelId}-selectParticpants</WidgetId>
          <Name>Send to Selected Participants</Name>
          <Type>Button</Type>
          <Options>size=4</Options>
        </Widget>
      </Row>
      <Options>hideRowNames=1</Options>
    </Page>`
}

function createParticipantsPage(people) {
  const rows = people.map(person => {
    return `<Row><Widget>
                <WidgetId>${config.panelId}-participant-${person.SparkUserId}</WidgetId>
                <Name>${replaceSpecialCharacters(person.DisplayName)}</Name>
                <Type>Button</Type>
                <Options>size=3</Options>
            </Widget></Row>`
  }).join('')

  const sendRow =
    `<Row>
      <Widget>
        <WidgetId>${config.panelId}-shareToParticipantsText</WidgetId>
        <Name>Click to send to the selected participants:</Name>
        <Type>Text</Type>
        <Options>size=3;fontSize=small;align=center</Options>
      </Widget>
      <Widget>
          <WidgetId>${config.panelId}-shareToParticipantsButton</WidgetId>
          <Name>Send</Name>
          <Type>Button</Type>
          <Options>size=1</Options>
        </Widget>
    </Row>`

  return `<Page><Name>Select Participant</Name>${rows}${sendRow}<Options>hideRowNames=1</Options></Page>`
}

/*********************************************************
 * Gets the current Panel Order if exiting Macro panel is present
 * to preserve the order in relation to other custom UI Extensions
 **********************************************************/
async function panelOrder(panelId) {
  const list = await xapi.Command.UserInterface.Extensions.List({ ActivityType: "Custom" });
  const panels = list?.Extensions?.Panel
  if (!panels) return ''
  const existingPanel = panels.find(panel => panel.PanelId == panelId)
  if (!existingPanel) return ''
  return `<Order>${existingPanel.Order}</Order>`
}

function replaceSpecialCharacters(text) {
  return text
    .replaceAll(/&/g, "&amp;")
    .replaceAll(/</g, "&lt;")
    .replaceAll(/>/g, "&gt;")
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
  if (args.hasOwnProperty('duration')) {
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
