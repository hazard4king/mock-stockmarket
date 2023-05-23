import re

from rest_framework import serializers

from .models import Users, Stock


def is_valid_password(password):
    if len(password) < 8 or len(password) > 20:
        raise serializers.ValidationError(
            "Invalid password. Length must be atleast 8 characters and atmost 20 characters")
    pattern = "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
    if not re.match(pattern, password):
        raise serializers.ValidationError(
            "Invalid password. Password must contain atleast one uppercase, one lowercase, one digit and one special character")


def is_valid_username(username):
    if len(username) < 3 or len(username) > 20:
        raise serializers.ValidationError("Invalid username")


class UserRegistrationSerializer(serializers.ModelSerializer):
    username = serializers.CharField(max_length=20, validators=[is_valid_username])
    password = serializers.CharField(max_length=20, validators=[is_valid_password])
    confirm_password = serializers.CharField(max_length=20)

    class Meta:
        model = Users
        fields = ("username", "password", "confirm_password")


class UserLoginSerializer(serializers.ModelSerializer):
    username = serializers.CharField(max_length=20)
    password = serializers.CharField(max_length=20)

    class Meta:
        model = Users
        fields = ("username", "password")


class UserStockCRUDSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=20)
    stock_name = serializers.CharField(max_length=50, required=False)
    stock_refresh = serializers.BooleanField(required=False)
