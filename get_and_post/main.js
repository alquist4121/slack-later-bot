/**
 * https://zenn.dev/barusu/articles/35cfe61d6e846f
 * https://api.slack.com/apps/A05D8EV7LFP/oauth?
 * https://app.slack.com/block-kit-builder
 * https://api.slack.com/apps/A05D8EV7LFP/event-subscriptions?
 * Event Name: reaction_added
 */

const ss = SpreadsheetApp.getActiveSpreadsheet();
const sheet = ss.getSheetByName('later');

function doPost(e) {
  /**
   * https://api.slack.com/events/reaction_added
   * Required scopes: reactions:read
   */
  let messageChannel;
  let messageTs;
  let reaction;
  let user;
  let permaLink;
  let remindDate;
  const laterNotificationChannel = '#z_later_notification';

  // Slack APIのURL認証
  try {
    const json = JSON.parse(e.postData.getDataAsString());
    if (json.type == "url_verification") { return ContentService.createTextOutput(json.challenge); }
  }
  catch (ex) {
    console.log(ex);
    sheet.appendRow([new Date(), ex]);
  }

  // reaction_added eventを受け取ってパース
  try {
    const json = JSON.parse(e.postData.getDataAsString());
    messageChannel = json.event.item.channel;
    messageTs = json.event.item.ts;
    reaction = json.event.reaction;
    user = json.event.user;
    permaLink = getChatPermalink(messageChannel, messageTs);
    remindDate = evaluateReaction(reaction);
  }
  catch (ex) {
    console.log(ex);
    sheet.appendRow([new Date(), ex]);
  }

  // later-prefix以外のreactionはremindDateがnull
  if (remindDate == null) { return };

  // #z_later_notificationにリマインド時刻での投稿を予約
  const reminderMessageBlocks = createReminderMessageBlocks(user, permaLink);
  const scheduledMessageId = setReminder(laterNotificationChannel, Math.ceil(remindDate.getTime() / 1000), reminderMessageBlocks);

  // #z_later_notificationに通知
  const immediateMessageBlocks = createImmediateMessageBlocks(reaction, user, permaLink, Utilities.formatDate(remindDate, 'JST', 'yyyy-MM-dd HH:mm:ss'), scheduledMessageId);
  postMessage(laterNotificationChannel, immediateMessageBlocks);
}


