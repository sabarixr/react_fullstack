from django.db import models

class Note(models.Model):
    text = models.TextField()
    deadline = models.CharField(max_length= 250)
