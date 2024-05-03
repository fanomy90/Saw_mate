from django.db import models

SHAPE_CHOICES = (
    ("1", "Sphere"),
    ("2", "Box"),
    ("3", "Cylinder"),
)
# Create your models here.
class Shape(models.Model):
    type = models.CharField(max_length=1, choices=SHAPE_CHOICES)
    color = models.CharField(max_length=7, help_text='hex')

    def __str__(self):
        return str(self.id)