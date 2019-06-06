from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class IntakeItems(models.Model):
    divString = models.TextField(blank=True)
    author = models.ForeignKey(User, default=None, on_delete=models.PROTECT)

    def __str__(self):
        return self.divString
