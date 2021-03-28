# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.db import models

# Create your models here.
class UploadFile(models.Model):
    file = models.FileField(upload_to='upload/')

class Items(models.Model):
    link           = models.TextField(null=True)
    title          = models.TextField(null=True)
    image          = models.TextField(null=True)
    category1_id   = models.IntegerField(null=True)
    category2_id   = models.IntegerField(null=True)
    category3_id   = models.IntegerField(null=True)
    category4_id   = models.IntegerField(null=True)
    category1_name = models.TextField(null=True)
    category2_name = models.TextField(null=True)
    category3_name = models.TextField(null=True)
    category4_name = models.TextField(null=True)
    brand          = models.TextField(null=True)
    price          = models.TextField(null=True)
    likes          = models.IntegerField(null=True)
    description    = models.TextField(null=True)
    keyword1       = models.TextField(null=True)
    keyword2       = models.TextField(null=True)
    keyword3       = models.TextField(null=True)
    keyword4       = models.TextField(null=True)
    keyword5       = models.TextField(null=True)
    keyword6       = models.TextField(null=True)
    item_id        = models.IntegerField(primary_key=True)

    def __unicode__(self):
        return self.item_id
    class Meta:
        db_table = 'items'

