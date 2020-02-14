const sgMail = require('@sendgrid/mail')
const EventType = require('../constants/EventType')
const User = require('../models/User')

const getEmailProfileView = (user, targetUser) => {
  return `Dear ${targetUser.firstName} ${targetUser.lastName}, <br/><br/>
    Your profile has been viewed by ${user.firstName} ${user.lastName}. <br/>
    <a href="http://localhost:3000">Log in</a> at Matcha if you are curious! <br/>
    We hope to see you soon! :-) <br/><br/>
    Kind regards, Matcha
  `
}

const getEmailReport = (targetUser) => {
  return `Dear ${targetUser.firstName} ${targetUser.lastName}, <br/><br/>
    Your profile has been reported as fake, if this is not the case, make sure to contact our helpdesk. <br/>
    We hope to see you soon! :-) <br/><br/>
    Kind regards, Matcha
  `
}

const getEmailConnect = (user, targetUser) => {
  return `Dear ${targetUser.firstName} ${targetUser.lastName}, <br/><br/>
    We are happy to let you know that, you have been connected by ${user.firstName} ${user.lastName}! <br/>
    <a href="http://localhost:3000">Log in</a> at Matcha if you are curious! <br/>
    We hope to see you soon! :-) <br/><br/>
    Kind regards, Matcha
  `
}

const getEmailDisconnect = (user, targetUser) => {
  return `Dear ${targetUser.firstName} ${targetUser.lastName}, <br/><br/>
    We are sad to let you know that, you have been disconnected by ${user.firstName} ${user.lastName}. <br/>
    We hope that you don't take this too personally.
    There are more fish at Matcha! :-) <br/><br/>
    Kind regards, Matcha
  `
}

const getEmailMatch = (user, targetUser) => {
  return `Dear ${targetUser.firstName} ${targetUser.lastName}, <br/><br/>
    We are super excited to let you know that, you have been matched by ${user.firstName} ${user.lastName}! <br/>
    <a href="http://localhost:3000">Log in</a> at Matcha to start chatting!<br/>
    We hope to see you soon! :-) <br/><br/>
    Kind regards, Matcha
  `
}

const getEmailUnmatch = (user, targetUser) => {
  return `Dear ${targetUser.firstName} ${targetUser.lastName}, <br/><br/>
    We are super sad to let you know that, you have been unmatched by ${user.firstName} ${user.lastName}. <br/>
    <a href="http://localhost:3000">Log in</a> at Matcha to see if there's anyone better for you! <br/>
    Don't get discouraged, we hope to see you soon! :-) <br/><br/>
    Kind regards, Matcha
  `
}

const getEmailBlock = (user, targetUser) => {
  return `Dear ${user.firstName} ${user.lastName}, <br/><br/>
    You blocked ${targetUser.firstName} ${targetUser.lastName}. <br/>
    If you want to come back from this decision you can unblock ${targetUser.firstName} ${targetUser.lastName} in your settings page <br/>
    We hope to see you soon! :-) <br/><br/>
    Kind regards, Matcha
  `
}

const getEmailUnblock = (user, targetUser) => {
  return `Dear ${user.firstName} ${user.lastName}, <br/><br/>
    You have unblocked ${targetUser.firstName} ${targetUser.lastName}. <br/>
    We hope to see you soon! :-) <br/><br/>
    Kind regards, Matcha
  `
}

const sendEmail = async (user, targetUserId, type) => {
  let subject
  let html
  let recipient

  const targetUser = await User.findOne({
    _id: targetUserId
  })
    .select([
      'firstName',
      'lastName',
      'email',
      'emailNotifications'
    ])

  if (type === EventType.EVENT_TYPE_PROFILE_VIEW) {
    subject = 'Matcha | someone viewed your profile!'
    recipient = targetUser.email

    html = getEmailProfileView(user, targetUser)
  } else if (type === EventType.EVENT_TYPE_REPORT) {
    subject = 'Matcha | someone reported your account as fake!'
    recipient = targetUser.email

    html = getEmailReport(targetUser)
  } else if (type === EventType.EVENT_TYPE_CONNECT) {
    subject = 'Matcha | someone connected you!'
    recipient = targetUser.email

    html = getEmailConnect(user, targetUser)
  } else if (type === EventType.EVENT_TYPE_DISCONNECT) {
    subject = 'Matcha | someone disconnected you!'
    recipient = targetUser.email

    html = getEmailDisconnect(user, targetUser)
  } else if (type === EventType.EVENT_TYPE_MATCH) {
    subject = 'Matcha | you have a new match!'
    recipient = targetUser.email

    html = getEmailMatch(user, targetUser)
  } else if (type === EventType.EVENT_TYPE_UNMATCH) {
    subject = 'Matcha | you have been unmatched!'
    recipient = targetUser.email

    html = getEmailUnmatch(user, targetUser)
  } else if (type === EventType.EVENT_TYPE_BLOCK) {
    subject = 'Matcha | you have blocked someone!'
    recipient = user.email

    html = getEmailBlock(user, targetUser)
  } else if (type === EventType.EVENT_TYPE_UNBLOCK) {
    subject = 'Matcha | you have unblocked someone!'
    recipient = user.email

    html = getEmailUnblock(user, targetUser)
  }

  const msg = {
    to: recipient,
    from: 'no-reply@matcha.com',
    subject,
    html
  }

  sgMail.send(msg)
}

module.exports = sendEmail
