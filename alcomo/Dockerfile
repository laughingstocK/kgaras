FROM alpine:latest

WORKDIR /usr/src/app
RUN mkdir out
RUN chmod 777 ./out

RUN mkdir data
RUN chmod 777 ./data

WORKDIR /usr/src/app/alcomo
COPY . .

RUN apk add --update --no-cache openssh
RUN apk --no-cache add openjdk11
RUN apk add --update --no-cache apache-ant
RUN apk --no-cache add zip

# Set the JAVA_HOME environment variable
ENV JAVA_HOME=/usr/lib/jvm/java-11-openjdk

# Add Java binaries to the PATH environment variable
ENV PATH=$PATH:$JAVA_HOME/bin

RUN adduser -h /usr/src/app/alcomo -s /bin/sh -D rob
RUN echo -n 'rob:rob' | chpasswd

COPY id_rsa.pub id_rsa.pub
RUN mkdir /usr/src/app/alcomo/.ssh
RUN touch /usr/src/app/alcomo/.ssh/authorized_keys
RUN cat id_rsa.pub >> /usr/src/app/alcomo/.ssh/authorized_keys

RUN chmod -R 777 ./*

RUN ant
RUN cp src/ExampleXYZ.java dist

COPY entrypoint.sh /
ENTRYPOINT ["/entrypoint.sh"]

EXPOSE 23
