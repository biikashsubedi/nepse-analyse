from django.forms import ModelForm
from .models import ApiKey


class ApiKeyForm(ModelForm):
    class Meta:
        model = ApiKey
        fields = [
            'title',
            'key',
            'status'
        ]
