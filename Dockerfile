FROM python:3.4

COPY requirements.txt /app/requirements.txt
RUN pip install -r /app/requirements.txt

COPY . /app
WORKDIR /app

ENV PORT=5000
ENV FORECASTIO_API_KEY='your-key-here'

EXPOSE 5000

CMD gunicorn drippies:app -b 0.0.0.0:$PORT --access-logfile=- --error-logfile=- --log-file=- -w 2 -k eventlet
