# Slack Notify PR

This action posts a notification on Slack whenever a pull request is opened or reopened or its status changes to "Ready for review".

## Usage

```yml
name: Slack Notification

on:
  pull_request_target:
    types:
      - opened
      - ready_for_review
      - reopened

jobs:
  notify:
    runs-on: ubuntu-latest
    steps:
      - uses: e14-io/slack-notify-pr-action@v0.2.0
        with:
          webhook-url: ${{ secrets.SLACK_WEBHOOK }}
```
