from django.urls import path
from .views import StockCRUD, Register, Login

urlpatterns = [
    path("register", Register.as_view(), name="register"), # Allows user to sign up into the app.
    path("login", Login.as_view(), name="login"), # Allows user to login into the app.
    path("stock/", StockCRUD.as_view(), name="stock"), # Allows user to add or remove stocks from their portfolio and fetch latest stock data.
]
