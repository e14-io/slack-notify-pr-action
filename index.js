const core = require('@actions/core');
const github = require('@actions/github');
const axios = require('axios');

const webhookUrl = core.getInput('webhook-url');

const event = github.context.payload;

const payload = {
  text: `Pull Request ${event.action}`,
  blocks: [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `Pull request ${event.action} <${event.pull_request._links.html.href}|#${event.number}>.`,
      },
      accessory: {
        type: 'button',
        text: {
          type: 'plain_text',
          text: 'View files',
          emoji: false,
        },
        value: 'view_files',
        url: `${event.pull_request._links.html.href}/files`,
        action_id: 'button-action',
      }
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*${event.pull_request.user.login }* wants to merge ${event.pull_request.commits} commits into ${'`'}${event.pull_request.base.ref}${'`'} from ${'`'}${event.pull_request.head.ref}${'`'}`,
      }
    },
    {
      type: 'section',
      fields: [
        {
          type: 'mrkdwn',
          text: `*Commits*\n${event.pull_request.commits}`,
        },
        {
          type: 'mrkdwn',
          text: `*Files changed*\n${event.pull_request.changed_files}`,
        },
      ],
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*${event.pull_request.title}*`,
      }
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: event.pull_request.body,
      }
    }
  ],
};

axios.post(webhookUrl, payload)
  .catch(error => {
    core.error(error.message);
  });
