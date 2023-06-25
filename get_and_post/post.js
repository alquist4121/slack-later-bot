function createReminderMessageBlocks(user, permaLink) {
    const message = `<@${user}>, did you complete <${permaLink}|this>?`;
    return JSON.stringify(
      [
        {
          "type": "header",
          "text": {
            "type": "plain_text",
            "text": "Reminder"
          }
        },
        {
          "type": "section",
          "fields": [
            {
              "type": "mrkdwn",
              "text": message
            }
          ]
        }
      ]
    )
  }
  
  function setReminder(channel, postAt, reminderMessageBlocks) {
    /** 
     * https://api.slack.com/methods/chat.scheduleMessage
     * Bot tokens: chat:write
     */
    let scheduledMessageId;
    const url = "https://slack.com/api/chat.scheduleMessage";
    const slackAppToken = PropertiesService.getScriptProperties().getProperty('SLACK_BOT_USER_TOKEN');
    const options = {
      "method": "post",
      "contentType": "application/x-www-form-urlencoded",
      "payload": {
        "token": slackAppToken,
        "channel": channel,
        "post_at": postAt.toString(),
        "text": "reminder_message",
        "blocks": reminderMessageBlocks
      }
    };
  
    try {
      const response = UrlFetchApp.fetch(url, options);
      const json = JSON.parse(response);
      scheduledMessageId = json.scheduled_message_id;
      sheet.appendRow([new Date(), response]);
    }
    catch (ex) {
      console.log(ex);
      sheet.appendRow([new Date(), ex]);
    }
  
    return scheduledMessageId;
  }
  
  function createImmediateMessageBlocks(reaction, user, permaLink, remindDateStr, scheduledMessageId) {
    const message = `<@${user}> reacted :${reaction}:\nI will remind you <${permaLink}|this> on ${remindDateStr}.`;
    return JSON.stringify(
      [
        {
          "type": "header",
          "text": {
            "type": "plain_text",
            "text": "Reaction Detected"
          }
        },
        {
          "type": "section",
          "fields": [
            {
              "type": "mrkdwn",
              "text": message
            }
          ]
        },
        {
          "type": "actions",
          "elements": [
            {
              "type": "button",
              "text": {
                "type": "plain_text",
                "text": "Mark as Completed",
                "emoji": true
              },
              "style": "primary",
              "action_id": "delete_reminder",
              "value": scheduledMessageId
            }
          ]
        }
      ]
    )
  }
  
  function postMessage(channel, postMessageBlocks) {
    /** 
     * https://api.slack.com/methods/chat.postMessage
     * Bot tokens: chat:write
     */
    const url = "https://slack.com/api/chat.postMessage";
    const slackAppToken = PropertiesService.getScriptProperties().getProperty('SLACK_BOT_USER_TOKEN');
    const options = {
      "method": "post",
      "contentType": "application/x-www-form-urlencoded",
      "payload": {
        "token": slackAppToken,
        "channel": channel,
        "blocks": postMessageBlocks
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
  