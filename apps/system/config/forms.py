from django import forms
from django.forms import ModelForm
from .models import Config


class ConfigForm(ModelForm):
    titles = (
        ('symbol', 'Symbol'),
        ('data', 'Data'),
        ('fundamental', 'Fundamental'),
    )
    title = forms.CharField(label='Title',
                            widget=forms.Select(choices=titles,
                                                attrs={'class': "form-control", 'placeholder': 'Select Title'}))

    class Meta:
        model = Config
        fields = [
            'title',
            'type',
            'value',
            'status',
        ]
