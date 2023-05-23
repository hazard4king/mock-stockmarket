from djongo import models


class Users(models.Model):
    name = models.CharField(max_length=100, primary_key=True)
    stocks = models.JSONField()


class Stock(models.Model):
    stock_name = models.CharField(max_length=100, primary_key=True)
    stock_symbol = models.CharField(max_length=100, unique=True)
    stock_image = models.CharField(max_length=500, null=True)
    stock_delta = models.FloatField(default=0.0, null=True)
    stock_diff = models.FloatField(default=0.0, null=True)
    price = models.FloatField()
