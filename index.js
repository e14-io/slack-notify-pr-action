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
        text: `*<${event.pull_request._links.html.href}|Pull request ${action} #${event.number}>*`,
      },
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
      text: {
        type: 'mrkdwn',
        text: `*${event.pull_request.title}*`,
      }
    },
    (
      event.pull_request.body
        ? {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: event.pull_request.body,
            }
          }
        : {
            type: 'context',
            elements: [
              {
                type: 'plain_text',
                text: 'No description provided.',
              }
            ]
          }
    ),
    {
			type: 'divider',
		},
    {
      type: 'section',
      fields: [
        {
          type: 'mrkdwn',
          text: `<${event.pull_request._links.html.href}/commits|Commits>`,
        },
        {
          type: 'mrkdwn',
          text: `<${event.pull_request._links.html.href}/files|Files changed>`,
        },
        {
          type: 'mrkdwn',
          text: `${event.pull_request.commits}`,
        },
        {
          type: 'mrkdwn',
          text: `${event.pull_request.changed_files}`,
        },
      ],
    },

  ],
};

core.debug(payload);

axios.post(webhookUrl, payload)
  .catch(error => {
    core.error(error.message);
  });
