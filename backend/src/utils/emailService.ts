import { request } from 'http'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
})

export const sendApprovalEmail = async (userEmail: string, request: any) => {
  const mailOptions =
    request.status === 'APPROVED'
      ? {
          from: process.env.EMAIL_USER,
          to: `${userEmail}, ${request.approvedBy.email}`,
          subject: 'Vacation Request Approved',
          html: `
      <h1>Request Approved</h1>
      <p>Your vacation from ${request.fromDate} to  ${request.toDate}  request has been approved
      by  ${request.approvedBy.email} 
      .</p>
    `
        }
      : {
          from: process.env.EMAIL_USER,
          to: userEmail,
          subject: 'Vacation Request Denied',
          html: `
      <h1>Request Denied</h1>
      <p>Your vacation from ${request.fromDate} to  ${request.toDate}  request has been 
        rejected by  ${request.approvedBy.email}
      .</p>
    `
        }

  try {
    await transporter.sendMail(mailOptions)
  } catch (error) {
    console.error('Error sending email:', error)
  }
}

export const sendLoginNotification = async (userEmail: string, logoutEmail: boolean = false) => {
  const mailOptions =
    logoutEmail === false
      ? {
          from: process.env.EMAIL_USER,
          to: userEmail,
          subject: 'New Login Detected',
          html: `
      <h1>New Login Alert</h1>
      <p>A new login was detected for your account.</p>
      <p>If this wasn't you, please contact support immediately.</p>
    `
        }
      : {
          from: process.env.EMAIL_USER,
          to: userEmail,
          subject: 'Logout successful',
          html: `
      <h1>Logout Alert</h1>
      <p>Your account was successfully logged out.</p>
      
    `
        }

  try {
    await transporter.sendMail(mailOptions)
  } catch (error) {
    console.error('Error sending email:', error)
  }
}
