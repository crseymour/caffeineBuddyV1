from django import forms
from . import models

class CreateItems(forms.ModelForm):
    class Meta:
        model = models.IntakeItems
        fields = ['divString']
