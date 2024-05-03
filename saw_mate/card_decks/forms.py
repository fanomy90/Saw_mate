#форма не связанная с моделью
from django import forms
import re

class CreateCardsetForm(forms.Form):
    cardset_name = forms.CharField()
    #cardset_description = forms.CharField()
    cardset_status = forms.ChoiceField(
        choices=[
            ("0", False),
            ("1", True),
        ],)