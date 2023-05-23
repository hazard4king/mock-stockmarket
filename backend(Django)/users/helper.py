import requests
from users.models import Stock
import threading
from decouple import config

API_KEY = config("API_KEY")
BASE_URL = config("BASE_URL")

def fetch_stock_data(stock):
    try:
        symbol = stock.stock_symbol

        params = {
            'function': 'TIME_SERIES_INTRADAY',
            'symbol': symbol,
            'interval': '1min',
            'apikey': API_KEY
        }

        response = requests.get(BASE_URL, params=params)
        data = response.json()

        latest_price = data.get("Time Series (1min)")
        if latest_price:
            latest_price = list(latest_price.values())[0]["4. close"]
            open_price = list(latest_price.values())[0]["1. open"]
            stock.stock_diff = float(open_price) - float(latest_price)
            stock.stock_delta = (float(stock.stock_diff) / float(open_price)) * 100

            # Update stock price
            stock.price = latest_price
            stock.save()
        else:
            print("Error in fetching stock data for {}".format(stock.stock_name), data)
    except Exception as e:
        print("Error in fetching stock data for {}: {}".format(stock.stock_name, e))


def refresh_stock_data():
    # Get the stock list
    stock_list = Stock.objects.all()

    # Creating and start threads for each stock
    threads = []
    for stock in stock_list:
        thread = threading.Thread(target=fetch_stock_data, args=(stock,))
        thread.start()
        threads.append(thread)

    # Wait for all threads to complete
    for thread in threads:
        thread.join()
