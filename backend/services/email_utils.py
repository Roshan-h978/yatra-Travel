import logging

from django.core.mail import send_mail
from django.conf import settings


logger = logging.getLogger(__name__)


# ===================================
# SAFE SEND
# ===================================
# Email problems are logged instead of failing the request,
# because the database change has already been saved.

def _send(subject, message, to_email):

    try:

        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [to_email],
            fail_silently=False,
        )

    except Exception:

        logger.exception("Failed to send email to %s", to_email)


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

    _send(subject, message, to_email)


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

    _send(subject, message, to_email)
