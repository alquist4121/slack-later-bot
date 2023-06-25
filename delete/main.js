/**
 * https://api.slack.com/apps/A05D8EV7LFP/interactive-messages
 * https://api.slack.com/reference/interaction-payloads/block-actions
 */

const ss = SpreadsheetApp.getActiveSpreadsheet();
const sheet = ss.getSheetByName('later');

function doPost(e) {
  const laterNotificationChannel = '#z_later_notification';

  try {
    /**
     * https://etauthenonprogrammercoder.tumblr.com/post/185966783317/gasslack-appblock-kit-builder
     * var json         = JSON.parse(e.parameter.payload);
     * var actionsValue = json.actions[0].value;
     */
    const json = JSON.parse(e.parameter.payload);

    for (const action of json.actions) {
      if (action.action_id == "delete_reminder") {
        _deleteReminder(laterNotificationChannel, action.value);
        break;
      }
    }
  }
  catch (ex) {
    console.log(ex);
    sheet.appendRow([new Date(), ex]);
  }
}

function _deleteReminder(channel, scheduledMessageId) {
  /** 
   * https://api.slack.com/methods/chat.deleteScheduledMessage
   * Bot tokens: chat:write
   */
  const url = "https://slack.com/api/chat.deleteScheduledMessage";
  const slackAppToken = PropertiesService.getScriptProperties().getProperty('SLACK_BOT_USER_TOKEN');
  const options = {
    "method": "post",
    "contentType": "application/x-www-form-urlencoded",
    "payload": {
      "token": slackAppToken,
      "channel": channel,
      "scheduled_message_id": scheduledMessageId
    }
  };

  try {
    const response = UrlFetchApp.fetch(url, options);
    sheet.appendRow([new Date(), response]);
  }
  catch (ex) {
    console.log(ex);
    sheet.appendRow([new Date(), ex]);
  }
}