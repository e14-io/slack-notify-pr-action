# Slack Notify PR

This action posts a notification on Slack each time a pull request is opened or reopened.

## Usage

```yml
- uses: e14-io/slack-notify-pr-action@v0.1.2
  with:
    webhook-url: ${{ secrets.SLACK_WEBHOOK }}
```
