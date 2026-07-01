from django.core.mail import send_mail

from django.conf import settings


# ===================================
# BOOKING EMAIL
# ===================================

def send_booking_email(

    to_email,

    customer_name,

    booking_status

):

    subject = f"Yatra Booking {booking_status}"

    message = f"""

Hello {customer_name},

Your booking status is now:

{booking_status}

Thank you for choosing Yatra Luxury Travel.

Regards,
Yatra Team

"""

    send_mail(

        subject,

        message,

        settings.EMAIL_HOST_USER,

        [to_email],

        fail_silently=False,

    )


# ===================================
# SUPPORT REPLY EMAIL
# ===================================

def send_support_reply_email(

    to_email,

    customer_name,

    reply

):

    subject = "Yatra Support Reply"

    message = f"""

Hello {customer_name},

Our support team replied:

{reply}

Thank you for contacting Yatra.

Regards,
Yatra Support Team

"""

    send_mail(

        subject,

        message,

        settings.EMAIL_HOST_USER,

        [to_email],

        fail_silently=False,

    )