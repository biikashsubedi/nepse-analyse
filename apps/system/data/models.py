import time

from django.db import models
from django.utils.translation import gettext_lazy as _


class Symbol(models.Model):
    title = models.CharField(_("Title"), max_length=200, unique=True)
    symbol = models.CharField(_("Symbol"), max_length=200, blank=True, null=True)
    description = models.TextField(_("Description"), max_length=200, blank=True, null=True)
    exchange = models.CharField(_("Exchange"), max_length=200, blank=True, null=True)
    type = models.CharField(_("Type"), max_length=200, blank=True, null=True)
    status = models.BooleanField(_("Status"), default=True)
    created_at = models.DateTimeField(_('Created At'), auto_now=True)

    def __str__(self):
        return self.title

    class Meta:
        db_table = 'symbols'
        verbose_name_plural = 'Symbol'


class Data(models.Model):
    symbol = models.ForeignKey(Symbol, verbose_name=_('Symbol'), on_delete=models.CASCADE)
    timestamp = models.CharField(_("Time Stamp"), max_length=200)
    closing = models.CharField(_("Closing"), max_length=200, blank=True, null=True)
    opening = models.CharField(_("Hits"), max_length=200, blank=True, null=True)
    high = models.CharField(_("High"), max_length=200, blank=True, null=True)
    low = models.CharField(_("Low"), max_length=200, blank=True, null=True)
    volume = models.CharField(_("Volume"), max_length=200, blank=True, null=True)
    date_time = models.DateTimeField(_('Date Time'), auto_now_add=False)
    created_at = models.DateTimeField(_('Created At'), auto_now=True)

    def __str__(self):
        return self.timestamp

    class Meta:
        ordering = ('-id',)
        db_table = 'nepse_data'
        verbose_name_plural = 'Nepse Data'


def print_timestamp(timestamp):
    ...
    #specify format here
    return time.strftime("%Y-%m-%d %H:%M:%S")