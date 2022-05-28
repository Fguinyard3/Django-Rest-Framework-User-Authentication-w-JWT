# Use an official Python runtime as a parent image
FROM python:3.9.0
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
WORKDIR /code
USER root
COPY docker-entrypoint.sh /code/
COPY requirements.txt /code/
RUN pip install --upgrade pip
RUN pip install -r requirements.txt
COPY . /code/
RUN chmod -R 777 ./docker-entrypoint.sh
ENTRYPOINT ["./docker-entrypoint.sh"]

