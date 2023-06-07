ARG PYTHON_IMAGE_REPO=python
FROM ${PYTHON_IMAGE_REPO}:3.9.16-bullseye
RUN curl -sL https://deb.nodesource.com/setup_18.x | sed "s/exec_cmd 'apt-get update'/exec_cmd 'apt-get --allow-releaseinfo-change update'/" | bash -
RUN echo "deb https://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list
RUN curl https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add
RUN apt-get -qq --allow-releaseinfo-change update \
        && apt-get install -y \
        apt-utils \
        less \
        nvi \
        postgresql-client-11 \
        nodejs \
        libssl-dev \
        tree \
        yarn

# Create working directory
ENV APP_HOME /app
ENV API_ENVIRONMENT dev

RUN mkdir -p $APP_HOME
WORKDIR $APP_HOME

ARG APP_UID=1000
ARG APP_GID=1000

RUN groupadd -g ${APP_GID} app
RUN useradd -u ${APP_UID} -g ${APP_GID} -d $APP_HOME app
RUN echo $(python3 -m site --user-base)

# set environment variables
ENV PATH $APP_HOME/.local/bin:${PATH}
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV ENVIRONMENT dev
ENV TESTING 0

#COPY requirements* $APP_HOME
RUN echo "fs.inotify.max_user_watches=524288" >> /etc/sysctl.conf

USER app:app


EXPOSE 8000

