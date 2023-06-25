function getChatPermalink(channel, ts) {
    /** 
     * https://api.slack.com/methods/chat.getPermalink
     * No scope required
     */
    let permaLink;
    const url = "https://slack.com/api/chat.getPermalink";
    const slackAppToken = PropertiesService.getScriptProperties().getProperty('SLACK_USER_TOKEN');
    const options = {
      "method": "get",
      "contentType": "application/x-www-form-urlencoded",
      "payload": {
        "token": slackAppToken,
        "channel": channel,
        "message_ts": ts
      }
    };
    try {
      const response = UrlFetchApp.fetch(url, options);
      const json = JSON.parse(response);

      permaLink = json.permalink;
      sheet.appendRow([new Date(), response]);
    }
    catch (ex) {
      console.log(ex);
      sheet.appendRow([ex]);
    }
  
    return permaLink;
  }
  
  function evaluateReaction(reaction) {
    let remindDate;
    const regex = /^later-(.*)/;
    if (regex.test(reaction)) {
      const timeStr = reaction.match(regex)[1]; // ['later-sunday', 'sunday']
      remindDate = _convTimeStrToDate(timeStr);
    }
    return remindDate;
  }
  
  function _convTimeStrToDate(timeStr) {
    let time = new Date();
    const date = time.getDate();	// 日
    const hour = time.getHours();	// 時
    const minute = time.getMinutes();	// 分

    switch (timeStr) {
      case '1hour':
        time.setHours(hour + 1);
        break;
      case '2hour':
        time.setHours(hour + 2);
        break;
      case '3hour':
        time.setHours(hour + 3);
        break;
      case '1min':
        time.setMinutes(minute + 1);
        break;
      case '5min':
        time.setMinutes(minute + 5);
        break;
      case '15min':
        time.setMinutes(minute + 15);
        break;
      case '30min':
        time.setMinutes(minute + 30);
        break;
      case 'am-7':
        time.setHours(7);
        if (7 <= hour) { time.setDate(date + 1); }
        break;
      case 'pm-3':
        time.setHours(15);
        if (15 <= hour) { time.setDate(date + 1); }
        break;
      case 'pm-6':
        time.setHours(18);
        if (18 <= hour) { time.setDate(date + 1); }
        break;
      case 'pm-9':
        time.setHours(21);
        if (21 <= hour) { time.setDate(date + 1); }
        break;
      case 'noon':
        time.setHours(12);
        if (12 <= hour) { time.setDate(date + 1); }
        break;
      case 'midnight':
        time.setDate(date + 1);
        time.setHours(0);
        break;
      case 'sunday':
        for (let i = 1; i < 8; i++) {
          time.setDate(date + i);
          if (time.getDay() == 0) { break; }
        }
        break;
      case 'monday':
        for (let i = 1; i < 8; i++) {
          time.setDate(date + i);
          if (time.getDay() == 1) { break; }
        }
        break;
      case 'tuesday':
        for (let i = 1; i < 8; i++) {
          time.setDate(date + i);
          if (time.getDay() == 2) { break; }
        }
        break;
      case 'wednesday':
        for (let i = 1; i < 8; i++) {
          time.setDate(date + i);
          if (time.getDay() == 3) { break; }
        }
        break;
      case 'thursday':
        for (let i = 1; i < 8; i++) {
          time.setDate(date + i);
          if (time.getDay() == 4) { break; }
        }
        break;
      case 'friday':
        for (let i = 1; i < 8; i++) {
          time.setDate(date + i);
          if (time.getDay() == 5) { break; }
        }
        break;
      case 'saturday':
        for (let i = 1; i < 8; i++) {
          time.setDate(date + i);
          if (time.getDay() == 6) { break; }
        }
        break;
      case 'tomorrow':
        time.setDate(date + 1);
        break;
      default:
        time = null;
    }
    return time
  }