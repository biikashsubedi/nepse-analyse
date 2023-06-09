from django.db import models
from django.contrib.auth.models import PermissionsMixin
from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager
from django.utils.translation import gettext_lazy as _
from PIL import Image
from django.dispatch import receiver
from django.db.models.signals import post_save


class UserManager(BaseUserManager):
    use_in_migration = True

    def _create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError('Email is Required !')
        if not password:
            raise ValueError('Password is Required !')

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password, **extra_fields):
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_staff', True)
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('super user must be true')
        return self._create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    first_name = models.CharField(_('first name'), max_length=50, blank=False)
    last_name = models.CharField(_('last name'), max_length=50, blank=False)
    email = models.EmailField(_('email address'), unique=True)
    mobile_number = models.CharField(_('mobile number'), unique=True, max_length=20)
    is_active = models.BooleanField(_('is active'), default=True)
    is_staff = models.BooleanField(_('is staff'), default=False)
    is_student = models.BooleanField(_('is student'), default=False)
    image = models.ImageField(_('image'), default='default/image.png', upload_to='user')
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)

    objects = UserManager()
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    class Meta:
        db_table = 'users'
        verbose_name_plural = 'user'

    def __str__(self):
        return self.first_name + ' ' + self.last_name


@receiver(models.signals.post_save, sender=User)
def post_save_user_signal(sender, instance, created, **kwargs):
    if created:
        instance.save()
