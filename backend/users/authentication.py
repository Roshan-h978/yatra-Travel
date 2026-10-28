from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend
from django.db.models import Q


class EmailOrUsernameModelBackend(ModelBackend):

    def authenticate(
        self,
        request,
        username=None,
        password=None,
        **kwargs
    ):

        if username is None or password is None:

            return None

        User = get_user_model()

        # =========================
        # FIND BY EMAIL OR USERNAME
        # =========================

        candidates = list(User.objects.filter(
            Q(email__iexact=username) | Q(username__iexact=username)
        ).order_by('id'))

        if not candidates:

            # Run the hasher anyway so response time doesn't reveal unknown accounts.
            User().set_password(password)

            return None

        # =========================
        # PASSWORD CHECK
        # =========================
        # One identifier can match two accounts (one by email, one by username):
        # accept whichever one the password belongs to.

        for user in candidates:

            if user.check_password(password) and self.user_can_authenticate(user):

                return user

        return None
