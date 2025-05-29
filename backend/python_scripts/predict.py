# File: predict.py

# Database connection configuration - UPDATED with Supabase credentials
DB_HOST = "aws-0-ap-southeast-1.pooler.supabase.com"
DB_NAME = "postgres"
DB_USER = "postgres.wlyxfclosnehsidoaawg"
DB_PASS = "senproB3tim12"
DB_PORT = "6543"

import psycopg2
import psycopg2.extras
import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout

def get_products_from_historical_stocks():
    """Get list of unique product names (and IDs if available) from public.stocks table."""
    conn = None
    products = []
    try:
        conn = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASS, host=DB_HOST, port=DB_PORT)
        with conn.cursor(cursor_factory=psycopg2.extras.DictCursor) as cur:
            cur.execute("""
                SELECT DISTINCT product_name, MIN(product_id) as product_id
                FROM public.stocks  -- SQL comment inside triple quotes is fine
                GROUP BY product_name
                ORDER BY product_name;
            """)
            products = [{'name': row['product_name'], 'id': row['product_id']} for row in cur.fetchall()]
    except psycopg2.Error as e:
        print(f"Database error in get_products_from_historical_stocks: {e}")
    finally:
        if conn:
            conn.close()
    return products

def get_historical_stock_data_for_product_by_name(product_name):
    """Fetch historical stock data for a specific product using its name from public.stocks."""
    conn = None
    historical_data = []
    try:
        conn = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASS, host=DB_HOST, port=DB_PORT)
        with conn.cursor(cursor_factory=psycopg2.extras.DictCursor) as cur:
            sql_query = "SELECT date, recorded_stock FROM public.stocks WHERE product_name = %s ORDER BY date;"
            # The comment is now a Python comment on a separate line or after the statement
            # -- Query uses explicit public schema
            cur.execute(sql_query, (product_name,))
            historical_data = cur.fetchall()
    except psycopg2.Error as e:
        print(f"Database error in get_historical_stock_data_for_product_by_name for {product_name}: {e}")
    finally:
        if conn:
            conn.close()
    return historical_data

def prepare_data_for_product(historical_stock_data):
    if not historical_stock_data or len(historical_stock_data) < 4:
        # print(f"Not enough data for training. Received {len(historical_stock_data)} records.") # Less verbose
        return None, None, None, None
    dates = [row['date'] for row in historical_stock_data]
    stock_values = [row['recorded_stock'] for row in historical_stock_data]
    df = pd.DataFrame({'Date': dates, 'Stock': stock_values})
    df['Date'] = pd.to_datetime(df['Date']).dt.date
    df['Stock'] = pd.to_numeric(df['Stock'], errors='coerce')
    df.dropna(subset=['Stock'], inplace=True)
    if df.empty or len(df) < 4:
        # print(f"Not enough valid numeric stock data after cleaning. Found {len(df)} records.") # Less verbose
        return None, None, None, None
    df0 = df["Stock"].astype(float).values.reshape(-1, 1)
    scaler = StandardScaler()
    df1 = scaler.fit_transform(df0)
    return df, df1, scaler, df['Date'].tolist()


def create_training_sequences(df1, n_past=3, n_future=1):
    trainX, trainY = [], []
    if len(df1) < n_past + n_future:
        return np.array(trainX), np.array(trainY)
    for i in range(n_past, len(df1) - n_future + 1):
        trainX.append(df1[i - n_past:i, 0:df1.shape[1]])
        trainY.append(df1[i + n_future - 1:i + n_future, 0])
    return np.array(trainX), np.array(trainY)

def build_and_train_model(trainX, trainY, epochs=10, batch_size=1):
    if trainX.shape[0] == 0:
        raise ValueError("trainX is empty, cannot build or train model.")
    if trainX.shape[1] == 0 or trainX.shape[2] == 0:
        raise ValueError(f"trainX has a zero dimension: {trainX.shape}. Check n_past or data features.")
    model = Sequential()
    model.add(LSTM(64, activation='relu', input_shape=(trainX.shape[1], trainX.shape[2]), return_sequences=True))
    model.add(LSTM(32, activation='relu', return_sequences=False))
    model.add(Dropout(0.2))
    model.add(Dense(trainY.shape[1]))
    model.compile(optimizer='adam', loss='mse')
    print(f"Starting model training for {trainX.shape[0]} samples...")
    history = model.fit(trainX, trainY, epochs=epochs, batch_size=batch_size, validation_split=0.1, verbose=0)
    print("Model training completed.")
    return model

def make_predictions(model, last_sequence_scaled, scaler, last_original_date, n_days_for_prediction=5, n_features=1):
    if last_sequence_scaled.shape[0] == 0 or last_sequence_scaled.shape[1] == 0:
        raise ValueError(f"last_sequence_scaled has a zero dimension: {last_sequence_scaled.shape}")
    last_original_date_dt = pd.to_datetime(last_original_date)
    predict_period_dates = pd.date_range(
        start=last_original_date_dt + pd.Timedelta(days=1), periods=n_days_for_prediction, freq='D'
    ).date
    current_sequence_for_prediction = last_sequence_scaled.reshape(1, last_sequence_scaled.shape[0], last_sequence_scaled.shape[1])
    predictions_scaled = []
    for _ in range(n_days_for_prediction):
        next_pred_scaled = model.predict(current_sequence_for_prediction, verbose=0)
        predictions_scaled.append(next_pred_scaled[0, 0])
        new_element_to_add = next_pred_scaled.reshape(1, 1, next_pred_scaled.shape[1])
        current_sequence_for_prediction = np.append(current_sequence_for_prediction[:, 1:, :], new_element_to_add, axis=1)
    predictions_scaled_np = np.array(predictions_scaled).reshape(-1, 1)
    y_pred_future_unscaled = scaler.inverse_transform(predictions_scaled_np)
    y_pred_future_rounded = np.round(y_pred_future_unscaled[:,0]).astype(int)
    return predict_period_dates, y_pred_future_rounded


def insert_forecast_to_db(product_name, product_id_to_store, forecast_dates, predictions):
    conn = None
    try:
        conn = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASS, host=DB_HOST, port=DB_PORT)
        with conn.cursor() as cur:
            cur.execute("DELETE FROM public.forecast WHERE product_name = %s;", (product_name,))
            for i, (forecast_date_obj, predicted_value) in enumerate(zip(forecast_dates, predictions)):
                # SQL query string
                sql_insert_query = """
                    INSERT INTO public.forecast (product_id, product_name, forecast_date, predicted_stock, days_ahead)
                    VALUES (%s, %s, %s, %s, %s);
                    """
                # Parameters tuple
                params = (product_id_to_store, product_name, forecast_date_obj, int(predicted_value), i + 1)
                cur.execute(sql_insert_query, params)
                # Python comment for clarity, if needed
                # -- Inserts into public.forecast
            conn.commit()
            print(f"Inserted/Updated {len(predictions)} forecast records for Product Name: '{product_name}'")
    except psycopg2.Error as e:
        print(f"Database error in insert_forecast_to_db for {product_name}: {e}")
        if conn:
            conn.rollback()
    finally:
        if conn:
            conn.close()

def predict_for_product(product_info, n_past=3):
    product_name = product_info['name']
    product_id_to_store = product_info.get('id')
    print(f"\n--- Processing Product Name: {product_name} (ID: {product_id_to_store if product_id_to_store else 'N/A'}) ---")
    historical_stock_data = get_historical_stock_data_for_product_by_name(product_name)
    if len(historical_stock_data) < n_past + 1 :
        print(f"Not enough historical stock data for '{product_name}'. Need at least {n_past + 1}, got {len(historical_stock_data)}.")
        return False
    df, df1_scaled, scaler, original_dates_from_df = prepare_data_for_product(historical_stock_data)
    if df is None or df1_scaled is None:
        print(f"Data preparation failed or resulted in insufficient data for '{product_name}'.")
        return False
    if len(df1_scaled) < n_past + 1:
        print(f"Not enough valid scaled data points ({len(df1_scaled)}) for '{product_name}' with n_past={n_past}.")
        return False
    trainX, trainY = create_training_sequences(df1_scaled, n_past=n_past)
    if len(trainX) == 0:
        print(f"Could not create training sequences for '{product_name}' (trainX is empty).")
        return False
    print(f"Training model for '{product_name}'...")
    try:
        model = build_and_train_model(trainX, trainY)
    except Exception as e:
        print(f"Error building/training model for '{product_name}': {e}")
        return False
    if len(df1_scaled) < n_past:
        print(f"Not enough data in df1_scaled ({len(df1_scaled)}) to form last_sequence for '{product_name}'.")
        return False
    last_sequence_scaled = df1_scaled[-n_past:]
    last_original_date = original_dates_from_df[-1]
    print(f"Making predictions based on data up to {last_original_date} for '{product_name}'.")
    try:
        forecast_dates, predictions = make_predictions(model, last_sequence_scaled, scaler, last_original_date)
    except Exception as e:
        print(f"Error during prediction for '{product_name}': {e}")
        return False
    forecast_df = pd.DataFrame({
        'Product_ID': [product_id_to_store] * len(forecast_dates),
        'Product_Name': [product_name] * len(forecast_dates),
        'Date': forecast_dates,
        'Predicted_Stock': predictions,
        'Days_Ahead': range(1, len(predictions) + 1)
    })
    print(f"\nForecast for Product Name '{product_name}':")
    print(forecast_df)
    insert_forecast_to_db(product_name, product_id_to_store, forecast_dates, predictions)
    return True

def main_forecast_all_products():
    print("\n=== Multi-Product Stock Forecasting (Using Product Names as Identifier) ===")
    products_from_db = get_products_from_historical_stocks()
    if not products_from_db:
        print("No products found in public.stocks table to process.")
        return
    print(f"Found {len(products_from_db)} unique product names in historical stocks data: {[p['name'] for p in products_from_db]}")
    successful_predictions = 0
    for product_info in products_from_db:
        try:
            success = predict_for_product(product_info, n_past=3)
            if success:
                successful_predictions += 1
        except Exception as e:
            print(f"!!! UNHANDLED CRITICAL Error processing product name '{product_info['name']}': {e}")
            import traceback
            traceback.print_exc()
    print(f"\n=== Forecasting Summary ===")
    print(f"Successfully generated forecasts for {successful_predictions} out of {len(products_from_db)} product names.")
    conn = None
    try:
        conn = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASS, host=DB_HOST, port=DB_PORT)
        with conn.cursor(cursor_factory=psycopg2.extras.DictCursor) as cur:
            cur.execute("""
                SELECT product_id, product_name, forecast_date, predicted_stock, days_ahead
                FROM public.forecast
                ORDER BY product_name, forecast_date, days_ahead;
            """)
            all_forecasts = cur.fetchall()
            print(f"\nAll forecasts in database ({len(all_forecasts)} records):")
            for record in all_forecasts:
                print(f"Product: {record['product_name']} (ID: {record['product_id'] if record['product_id'] else 'N/A'}), Date: {record['forecast_date']}, Predicted Stock: {record['predicted_stock']}, Day: {record['days_ahead']}")
    except psycopg2.Error as e:
        print(f"Database error while fetching all forecasts: {e}")
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    print("Starting Python forecasting script (predict.py)...")
    main_forecast_all_products()
    print("Python forecasting script (predict.py) finished.")