NOTIFICATION_MESSAGE="*👉 \\#15 \\(main\\) \\- 🏁 DEPLOYMENT STARTED* \\> *WorkFlow: \\[Release and Publish\\]\\(https://github\\.com/pereira\\-tech\\-talks/pereiratechtalks\\.com/actions/runs/10183317618\\)* \\> *Repository:* [pereira\\-tech\\-talks/pereiratechtalks\\.com]\\(https://github\\.com/pereira\\-tech\\-talks/pereiratechtalks\\.com\\) \\> *User Actor:* xergioalex \\> *Pull request:* [\\#73]\\(https://github\\.com/pereira\\-tech\\-talks/pereiratechtalks\\.com/pull/73\\) \\> *Pull request size label:* 🟢 Size \\- XS \\> *Pull request title:* \\> ```🚩 Feature deploy workflows``` \\> *Pull request body content:* \\> ```\\- Debugging issues with markdown format to send channel notifications\\.```"
JSON_DATA=$(jq -n \
  --arg text "$NOTIFICATION_MESSAGE" \
  --arg chat_id "-1002113126821" \
  --arg message_thread_id "2" \
  '{
    chat_id: $chat_id | tonumber,
    text: $text,
    message_thread_id: $message_thread_id | tonumber,
    parse_mode: "MarkdownV2",
    disable_web_page_preview: true
  }')
echo $JSON_DATA
curl --location "https://api.telegram.org/bot7209775151:AAHJNfL2VqSZypZtpfyr794CzRxQW2kHzW0/sendMessage" \
  --header 'Content-Type: application/json' \
  --data "$JSON_DATA"
