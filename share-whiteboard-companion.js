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
  destination: 'vvazquez@cisco.com',
  body: 'Here you have your white board',
  subject: 'New white board'
};
const buttonConfig = {
  name: 'Send White Board',
  icon: 'Tv',
  panelId: 'share-wb'
};

const remoteDeviceconfig = {
  deviceIP: '192.168.100.150',
  userName: 'victor',
  password: 'cisco,123',
};



