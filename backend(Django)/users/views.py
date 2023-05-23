from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Users, Stock
from django.contrib.auth.models import User, auth
from .helper import refresh_stock_data
from decouple import config
from .serializers import UserRegistrationSerializer, UserLoginSerializer, UserStockCRUDSerializer

API_KEY = config("API_KEY")


class Register(APIView):
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        username = serializer.validated_data.get("username")
        password = serializer.validated_data.get("password")
        confirm_password = serializer.validated_data.get("confirm_password")

        if password == confirm_password:

            if User.objects.filter(username=username).first():
                return Response(
                    {
                        "status": "FAILURE",
                        "sCode": status.HTTP_412_PRECONDITION_FAILED,
                        "data": "User already exists",
                    },
                    status=status.HTTP_412_PRECONDITION_FAILED,
                )
            else:
                user = User.objects.create_user(username=username, password=password)
                user.save()
                Users.objects.create(name=username, stocks=[])
                return Response(
                    {
                        "status": "SUCCESS",
                        "sCode": status.HTTP_200_OK,
                        "data": "User signup successful",
                    },
                    status=status.HTTP_200_OK,
                )

        else:
            return Response(
                {
                    "status": "FAILURE",
                    "sCode": status.HTTP_401_UNAUTHORIZED,
                    "data": "Incorrect password confirmation",
                },
                status=status.HTTP_401_UNAUTHORIZED,
            )

class Login(APIView):
    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        username = serializer.validated_data.get("username")
        password = serializer.validated_data.get("password")

        user = auth.authenticate(username=username, password=password)

        if user is not None:
            return Response(
                {
                    "status": "SUCCESS",
                    "sCode": status.HTTP_200_OK,
                    "data": "Successfully logged in",
                },
                status=status.HTTP_200_OK,
            )
        return Response(
            {
                "status": "FAILURE",
                "sCode": status.HTTP_401_UNAUTHORIZED,
                "data": "Invalid Username or Password",
            },
            status=status.HTTP_401_UNAUTHORIZED,
        )


class StockCRUD(APIView):
    def get(self, request):
        serializer = UserStockCRUDSerializer(data=request.GET)
        serializer.is_valid(raise_exception=True)

        username = serializer.validated_data.get("username")
        stock_refresh = serializer.validated_data.get("stock_refresh")

        if stock_refresh:
            refresh_stock_data()

        user = Users.objects.get(name=username)
        if not user:
            return Response(
                {
                    "status": "FAILURE",
                    "sCode": status.HTTP_404_NOT_FOUND,
                    "data": "User not found",
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        stocks = Stock.objects.filter(stock_name__in=user.stocks).all().values("stock_name", "stock_symbol",
                                                                               "stock_image", "price", "stock_delta","stock_diff")

        stocks_not_in_watchlist = Stock.objects.exclude(stock_name__in=user.stocks).all().values("stock_name",
                                                                                                 "stock_symbol",
                                                                                                 "stock_image")
        return Response(
            {
                "status": "SUCCESS",
                "sCode": status.HTTP_200_OK,
                "data": {
                    "stocks_in_watchlist": stocks,
                    "stocks_not_in_watchlist": stocks_not_in_watchlist,
                }
            },
            status=status.HTTP_200_OK,
        )

    def post(self, request):
        data = request.data

        username = data.get("username")
        stock_to_add = data.get("stock_name")

        user = Users.objects.filter(name=username).first()
        if not user:
            return Response(
                {
                    "status": "FAILURE",
                    "sCode": status.HTTP_404_NOT_FOUND,
                    "data": "User not found",
                },
                status=status.HTTP_404_NOT_FOUND,
            )
        if stock_to_add not in user.stocks:
            user.stocks.append(stock_to_add)
            user.save()
            new_stock_data = Stock.objects.filter(stock_name=stock_to_add).values("stock_name", "stock_symbol",
                                                                                  "stock_image", "price", "stock_delta","stock_diff")
            return Response(
                {
                    "status": "SUCCESS",
                    "sCode": status.HTTP_200_OK,
                    "data": new_stock_data,
                },
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {
                    "status": "SUCCESS",
                    "sCode": status.HTTP_409_CONFLICT,
                    "data": "Stock already exists",
                },
                status=status.HTTP_409_CONFLICT,
            )

    def patch(self, request):
        data = request.data

        username = data.get("username")
        stock_to_delete = data.get("stock_name")

        user = Users.objects.filter(name=username).first()
        if not user:
            return Response(
                {
                    "status": "FAILURE",
                    "sCode": status.HTTP_404_NOT_FOUND,
                    "data": "User not found",
                },
                status=status.HTTP_404_NOT_FOUND,
            )
        if stock_to_delete in user.stocks:
            # remove stock from user's stock list
            user.stocks.remove(stock_to_delete)
            user.save()
            return Response(
                {
                    "status": "SUCCESS",
                    "sCode": status.HTTP_200_OK,
                    "data": "Stock removed successfully",
                },
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                {
                    "status": "SUCCESS",
                    "sCode": status.HTTP_404_NOT_FOUND,
                    "data": "Stock doesn't exist in user collection",
                },
                status=status.HTTP_404_NOT_FOUND,
            )
