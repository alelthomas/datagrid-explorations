import yfinance as yf
import json
from datetime import datetime, timedelta
import os
import numpy as np

# script to fetch stock data from Yahoo Finance. I am pulling historical data for a month to simulate minute changes (but they are daily)
# we may be able to think of a better approach but this was the way I could think of to get them for free, so it's good for now

# the info used for the Trend row is using 2 months to simulate predictions

SYMBOLS = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'NVDA', 'TSLA', 'NFLX', 'CSCO', 'INTC', 'ORCL', 'IBM', 'SAP', 'ELF', 'HPQ', 'AI', 'CRM', 'BA', 'UBER', 'BBY', 'VEEV']

def generate_prediction(historical_prices, days=30):
    """Generate a simple prediction based on historical data"""
    if len(historical_prices) < 2:
        return []
    
    returns = np.diff(historical_prices) / historical_prices[:-1]
    
    mean_return = np.mean(returns)
    std_return = np.std(returns)    
    
    last_price = historical_prices[-1]
    prediction = [last_price]
    
    for _ in range(days):
        daily_return = np.random.normal(mean_return, std_return)
        next_price = prediction[-1] * (1 + daily_return)
        prediction.append(next_price)
    
    return prediction

def fetch_stock_data():
    end_date = datetime.now()
    start_date = end_date - timedelta(days=60)
    
    stock_data = {}
    
    for symbol in SYMBOLS:
        try:
            stock = yf.Ticker(symbol)
            hist = stock.history(start=start_date, end=end_date, interval='1d')
            
            info = stock.info
            company_name = info.get('longName', symbol)
            
            current_price = hist['Close'].iloc[-1]
            previous_price = hist['Close'].iloc[-2]
            price_change = current_price - previous_price
            price_change_percent = (price_change / previous_price) * 100
            
            historical_prices = hist['Close'].tolist()
            
            prediction = generate_prediction(historical_prices)
            
            stock_data[symbol] = {
                'id': symbol,
                'symbol': symbol,
                'name': company_name,
                'price': current_price,
                'change': price_change,
                'changePercent': price_change_percent,
                'volume': int(hist['Volume'].iloc[-1]),
                'range52Week': {
                    'low': float(hist['Low'].min()),
                    'high': float(hist['High'].max())
                },
                'history': [
                    {
                        'date': date.strftime('%Y-%m-%d'),
                        'price': float(close)
                    }
                    for date, close in zip(hist.index, hist['Close'])
                ],
                'prediction': [
                    {
                        'date': (end_date + timedelta(days=i+1)).strftime('%Y-%m-%d'),
                        'price': float(price)
                    }
                    for i, price in enumerate(prediction)
                ]
            }
            
        except Exception as e:
            print(f"Error fetching data for {symbol}: {str(e)}")
            continue
    
    output_dir = os.path.join(os.path.dirname(__file__), '..', 'public', 'data')
    os.makedirs(output_dir, exist_ok=True)
    
    with open(os.path.join(output_dir, 'stock_data.json'), 'w') as f:
        json.dump(stock_data, f, indent=2)

if __name__ == '__main__':
    fetch_stock_data() 