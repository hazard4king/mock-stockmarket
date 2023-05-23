<div align="center">
    <h1><code>Mock StockMarket Dashboard</code></h1>
    <h4>A stock monitoring platform where a user can login and monitor stock information.</h4>
</div>

## Features

👉 User can login and view latest data for stocks such as Google, META, Tesla etc

👉 User can add and remove stocks from his watchlist.

👉 The dashboard can handle multiple users concurrently, each one having individual stocks on his watchlist.

![Screenshot of the preference page with this extension enabled](.github/images/screenshot.png)

## Tech Stack used
- For the backend, Django is used. Django is a powerful, high-level Python Web framework that encourages rapid development and clean, pragmatic design. It's easy to use and gives you the speed and power of Python with many additional built-in features to help build web applications and APIs
- MongoDB has been used to store the data. MongoDB is a general purpose, document-based, distributed database built for modern application developers and for the cloud era.
- For the frontend, React.js is used. React is a JavaScript library for building user interfaces. It is maintained by Facebook and a community of individual developers and companies

## Some additional comments
- I used a NoSQL database like MongoDB because it is a better fit for this application. The data is not structured and is not relational. It is also easier to scale MongoDB than a SQL database.
- In earlier projects, I have always used PostgreSQL or MySQL as databases coupled with Flask/ Django. I felt this project was a good opportunity to learn coupling of MongoDB with Django.
- I am a firm believer that more code is not always better. I have tried to keep the code as simple and minimal as possible while also keeping the code as modular.

## Setup

Instructions for setting up the backend :

1. Setup a virtual environment using `python3 -m venv venv`

2. Activate the virtual environment using `source venv/bin/activate`

3. Install the dependencies using `pip install -r requirements.txt`

4. Run the server using `python3 manage.py runserver`

5. The server will be running on `http://localhost:8000/`

Instructions for setting up the frontend(React.js) :

1. Install npm using `sudo apt install npm`

2. Install the dependencies using `npm install`

3. Run the server using `npm start`

4. The website will be running on `http://localhost:3000/`


## Constraints

1. The free tier of the alphavantage API only allows 5 API calls per minute and 500 per day.
I have therefore restricted the number of stocks that can be added to the watchlist to 5 and am updating the stock data every 60 seconds.
Although this restricts user choice, I feel it is a better tradeoff by fetching accurate and less data as opposed to
more data that is not accurate.
2. I wasn't able to host the website because certain errors due to MongoDB. The time constraint prevented me from debugging the issue.
