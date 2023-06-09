from django.db import models
from django.utils.translation import gettext_lazy as _


# Create your models here.
class Home(models.Model):
    model = models.CharField(_('Model Name'), max_length=200, editable=False)
    value = models.CharField(_('Today\'s Data'), max_length=200, editable=False)
    created = models.DateTimeField(_('created'), auto_now_add=True)

    def __str__(self):
        return self.model

    class Meta:
        db_table = 'homes'
        verbose_name_plural = 'Home'
