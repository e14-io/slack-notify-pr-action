const core = require('@actions/core');
const github = require('@actions/github');
const axios = require('axios');

const event = github.context.payload;

if (!['pull_request', 'pull_request_target'].includes(github.context.eventName)) {
  core.info("Event type not handled. Skipping.");
  process.exit(0);
}

if (event.pull_request.draft) {
  core.info("This is a draft pull request. Skipping.");
  process.exit(0);
}

const actions = {
  opened: 'opened',
  ready_for_review: 'ready for review',
  reopened: 'reopened',
};
const action = actions[event.action];
const webhookUrl = core.getInput('webhook-url');

const payload = {
  text: `Pull Request ${action}`,
  blocks: [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `Pull request ${action} <${event.pull_request._links.html.href}|#${event.number}>.`,
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
        text: `*${event.pull_request.title}*\n${event.pull_request.body || ''}`,
      }
    },
  ],
};

core.debug(payload);

axios.post(webhookUrl, payload)
  .catch(error => {
    core.error(error.message);
  });
