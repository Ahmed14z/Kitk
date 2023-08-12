FROM python:3.6-slim-buster

WORKDIR /app

COPY requirments.txt ./

RUN pip install -r requirments.txt

COPY . .



EXPOSE 8000


CMD ["flask","run", "--host=0.0.0.0","--port=8000"]

