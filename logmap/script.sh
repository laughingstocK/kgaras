# docker-compose up logmap -d

docker stop logmap
docker rm logmap
docker rmi logmap
docker rmi -f logmap
docker build -t logmap .
docker run -p 0.0.0.0:22:22 --name logmap -d logmap

# ssh -p 22 rob@localhost ls /usr/src/app/logmap-matcher