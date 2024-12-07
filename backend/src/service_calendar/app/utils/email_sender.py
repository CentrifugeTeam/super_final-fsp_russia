import asyncio
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import ssl
from dataclasses import dataclass


@dataclass
class Message:
    title: str
    url_for_button: str
    text: str

    text_on_button: str


class SMTPMessage:

    def __init__(self, sender: str, host: str, port: int, password: str):
        self.password = password
        self.port = port
        self.host = host
        self.sender = sender

    def render_message(self, receiver: str, message: Message) -> MIMEMultipart:
        plain_text = \
            f"""{message.title} 
            # {message.text}
        """

        html_text = \
            f"""
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html style="width: 100%; height:100%">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Template</title>
</head>




<body bgcolor="#f4f4f4" style="
    margin: auto;

  max-width:720px;">
  <div>
    <table width="100%" bgcolor="#00000" cellpadding="0" cellspacing="0" border="0" style="position:relative">
      <tr>
        <td>
          <div class="box" style="background-color:#061ab1; overflow: hidden;height: 50px;position: relative;">
          </div>
          
          
        </td>
      </tr>
    </table>
  </div>
  <div>
    <!-- Main Content -->
    <table bgcolor="#FFFFFF" style="margin:auto; width: 100%; margin-top:0%; padding-bottom:20px;" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td>
          <div>
            <table style="text-align: left; padding: 10px;" cellpadding="0" cellspacing="0" border="0" align="center">
              <!-- Main Text -->
              <tr>
                <td style="text-align: center;">
                  <h2 style="font-size: 20px; font-weight: bold; margin: 0;">{message.title}</h2>
                </td>
              </tr>
          </table></div>
          <div>
            <table style="padding: 10px;" cellpadding="0" cellspacing="0" border="0" align="center">

              <tr>
                <td>
                  <a style="text-decoration: none;color: white;" target="_blank" href="{message.url_for_button}" >
                    <div style=" cursor: pointer;  border-radius:30px; border:none ; background-color: #FFD700; color: black; padding: 25px 80px; ">
                      {message.text_on_button}
                    </div>
                  </a>

                </td>
              </tr>
            </table>


          </div>
        </td>
      </tr>
    </table>

  </div>

  <div>
    <!-- Footer -->
    <table bgcolor="#061AB1" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td>

        <div>

            <table cellpadding="0" cellspacing="0" border="0" align="right" width="100%">
              <tr>
                <td>
                  <div style="padding-top: 20px; padding-right:30px; text-align: right;">
                    <a target="_blank" href="https://centrifugo.tech/profile/edit" style="text-decoration:none; color:white;">
                      Личный кабинет 
                    </a>
                    <a target="_blank" href="https://centrifugo.tech/calendar/" style="text-decoration:none; color:white;">
                      Календарь мероприятий
                    </a>
                
                  </div>
                </td>
              </tr>

            </table>

          </div>


          
        </td>
      </tr>

        </table>
      </div>


      
    </td>
  </tr>
  </table>

  </div>

</body>

</html>

            """

        message = MIMEMultipart('alternative')
        message['From'] = self.sender
        message['To'] = receiver
        message['Subject'] = 'Уведомление от сервиса спортивных мероприятий!'
        # Add HTML/plain-text parts to MIMEMultipart message
        # The email client will try to render the last part first
        for text in [MIMEText(plain_text, 'plain'), MIMEText(html_text, 'html')]:
            message.attach(text)

        return message

    def send_email(self, receiver: str, message: Message):
        ctx = ssl.create_default_context()
        msg = self.render_message(receiver, message)
        with smtplib.SMTP_SSL(self.host, self.port, context=ctx) as server:
            server.login(self.sender, self.password)
            return server.sendmail(self.sender, receiver, msg.as_string())

    async def asend_email(self, receiver: str, message: Message):
        return await asyncio.to_thread(self.send_email, receiver, message)
