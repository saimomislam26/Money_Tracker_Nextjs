const crypto = require('crypto');
const nodemailer = require('nodemailer');

module.exports.cryptoGeneration = () => {
    return crypto.randomBytes(32).toString('hex');
}

module.exports.sendVerificationMail = async(verificationLink,userMail)=>{
    
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT, 10),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
      });

      try{
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: userMail,
            subject: 'Email Verification',
            html: `<p>Click ${verificationLink} to verify your email.</p>`
          });
      }catch(err){
        console.log('Verification mail sending error',err);
        
        // res.status(500).send({ message: 'Verification mail sending error' });
      }
}

module.exports.sendPasswordResetEmail = async(resetLink,userMail)=>{
    
  const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
      }
    });

    try{
      await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: userMail,
          subject: 'Password Reset',
          html: `<p>Click ${resetLink} to reset password.</p>`
        });
    }catch(err){
      console.log('Verification mail sending error',err);
      
      // res.status(500).send({ message: 'Verification mail sending error' });
    }
}


