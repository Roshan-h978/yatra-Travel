from django.contrib.auth.backends import ModelBackend

from django.contrib.auth.models import User


class EmailOrUsernameModelBackend(ModelBackend):

    def authenticate(

        self,

        request,

        username=None,

        password=None,

        **kwargs

    ):

        # =========================
        # EMPTY CHECK
        # =========================

        if username is None:

            return None

        user = None

        # =========================
        # FIND BY EMAIL
        # =========================

        try:

            user = User.objects.get(

                email=username

            )

        except User.DoesNotExist:

            pass

        # =========================
        # FIND BY USERNAME
        # =========================

        if not user:

            try:

                user = User.objects.get(

                    username=username

                )

            except User.DoesNotExist:

                return None

        # =========================
        # PASSWORD CHECK
        # =========================

        if user.check_password(password):

            return user

        return None