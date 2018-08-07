FROM ubuntu:bionic

RUN apt-get update
RUN apt-get install -y curl software-properties-common gnupg

# Primes lastest stable google chrome install
RUN curl -fsSL https://dl.google.com/linux/linux_signing_key.pub | apt-key add -
RUN add-apt-repository -y "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main"
# Primes node install
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -

# Install browsers and node
RUN apt-get update
RUN apt-get install -y google-chrome-stable nodejs default-jdk firefox
RUN npm install -g yarn

COPY ./entrypoint.sh /usr/local/bin/entrypoint
RUN chmod +x /usr/local/bin/entrypoint

RUN useradd --create-home -s /bin/sh node
USER node
RUN mkdir /home/node/application
WORKDIR /home/node/application
VOLUME /home/node/application

ENTRYPOINT ["/usr/local/bin/entrypoint"]