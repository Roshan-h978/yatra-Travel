from django.db import models


class SupportMessage(models.Model):

    STATUS_CHOICES = [

        ('Pending','Pending'),

        ('Replied','Replied'),

        ('Closed','Closed'),

    ]

    customer_name = models.CharField(
        max_length=200
    )

    email = models.EmailField()

    subject = models.CharField(
        max_length=255
    )

    message = models.TextField()

    admin_reply = models.TextField(
        blank=True,
        null=True
    )

    status = models.CharField(

        max_length=100,

        choices=STATUS_CHOICES,

        default='Pending'

    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):

        return self.customer_name