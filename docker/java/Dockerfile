FROM itzg/minecraft-server:multiarch

LABEL maintainer "NN708"

RUN apt-get update && \
  apt-get install -y nodejs npm && \
  npm install -g mcrepeater

ENTRYPOINT [ "mcrepeater" ]