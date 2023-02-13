FROM postgres:15.1-alpine

RUN mkdir /logs

RUN chown postgres:postgres /logs

CMD ["postgres", "-c", "logging_collector=on", "-c", "log_directory=/logs", "-c", "log_statement=all"]
