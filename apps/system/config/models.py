from django.db import models
from django.utils.translation import gettext_lazy as _


# Create your models here.
class Config(models.Model):
    titles = {
        ('symbol', 'Symbol'),
        ('data', 'Data'),
    }
    title = models.CharField(_('Title'), max_length=200, choices=titles)
    type = models.CharField(_('Type'), max_length=200, blank=True, null=True)
    value = models.CharField(_('Value'), max_length=200)
    status = models.BooleanField(_('Status'), default=True)
    created_at = models.DateTimeField(_('created_at'), auto_now_add=True)

    def __str__(self):
        return self.title

    class Meta:
        db_table = 'configs'
        verbose_name_plural = 'Config'
